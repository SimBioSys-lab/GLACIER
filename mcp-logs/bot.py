import os
import logging
import asyncio
import shutil
import json
import re
from dotenv import load_dotenv
from flask import Flask, request
from slack_bolt import App
from slack_bolt.adapter.flask import SlackRequestHandler
import google.generativeai as genai
from google.generativeai.types import FunctionDeclaration, Tool
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

load_dotenv()

# ---------------- CONFIGURATION ----------------
SLACK_BOT_TOKEN = os.environ.get("SLACK_BOT_TOKEN")
SIGNING_SECRET = os.environ.get("SIGNING_SECRET")
RENDER_API_KEY = os.environ.get("RENDER_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

DEFAULT_WORKSPACE_ID = "tea-d46ggm2li9vc73fe8a70"

# 🔍 SERVICES
SERVICES = {
    "frontend": "srv-d46jd3ili9vc73artus0",
    "backend": "srv-d4794ts9c44c73dnc8rg",
}

# 🧠 MEMORY STORE
# Stores conversation history: { "user_id": [ContentObject, ...] }
USER_SESSIONS = {} 
# -----------------------------------------------

app = App(token=SLACK_BOT_TOKEN, signing_secret=SIGNING_SECRET)
flask_app = Flask(__name__)
handler = SlackRequestHandler(app)
logging.basicConfig(level=logging.INFO)

genai.configure(api_key=GEMINI_API_KEY)

# --- 1. HEALTH CHECK ---
@flask_app.route("/", methods=["GET"])
@flask_app.route("/health", methods=["GET"])
def health_check():
    return "OK", 200

# --- 2. THE MUSCLE: MCP Connection ---
async def fetch_render_logs(query=None, target="both", limit=50):
    mcp_cmd = shutil.which("mcp-remote")
    if not mcp_cmd:
        mcp_cmd = os.path.join(os.getenv('APPDATA') or '.', 'npm', 'mcp-remote.cmd')

    if not mcp_cmd or (not os.path.exists(mcp_cmd) and not shutil.which("mcp-remote")):
        return "System Error: Could not find mcp-remote."

    server_params = StdioServerParameters(
        command=mcp_cmd,
        args=["https://mcp.render.com/mcp", "--header", f"Authorization: Bearer {RENDER_API_KEY}"],
        env=os.environ.copy()
    )

    resource_ids = []
    if target == "both":
        resource_ids = list(SERVICES.values())
    elif target in SERVICES:
        resource_ids = [SERVICES[target]]
    else:
        resource_ids = list(SERVICES.values())
    
    resource_ids = [rid for rid in resource_ids if "srv-" in rid]

    if not resource_ids:
        return "Configuration Error: No valid Service IDs found."

    tool_args = {"resource": resource_ids, "limit": limit}
    if query:
        tool_args["query"] = query

    print(f"💪 Fetching logs for {target} via mcp-remote")
    
    logs = []
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                await session.call_tool("select_workspace", arguments={"ownerID": DEFAULT_WORKSPACE_ID})
                result = await session.call_tool("list_logs", arguments=tool_args)
                
                for content in result.content:
                    if hasattr(content, 'text'):
                        logs.append(content.text)
    except Exception as e:
        return f"MCP Error: {str(e)}"

    if not logs:
        return f"No logs found for {target}."
        
    return "\n".join(logs)

# --- 3. THE BRAIN: Gemini Agent with Memory ---
def run_gemini_agent(user_query, user_id):
    
    # Define Tools
    get_logs_tool = FunctionDeclaration(
        name="get_render_logs",
        description="Fetch logs from Render. Can specify frontend, backend, or both.",
        parameters={
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "target": {"type": "string", "enum": ["frontend", "backend", "both"]},
                "limit": {"type": "integer"}
            }
        }
    )

    # System Prompt (Now separate from history)
    system_instruction = (
        "You are GLACIER, a DevOps bot. You monitor two services: 'Frontend' (Next.js) and 'Backend' (Python/Node). "
        "If the user asks about UI issues, check frontend. If API issues, check backend. "
        "Explain errors simply. Remember previous context from this conversation."
    )

    model = genai.GenerativeModel(
        model_name='gemini-2.5-pro',
        tools=[Tool(function_declarations=[get_logs_tool])],
        system_instruction=system_instruction
    )
    
    # --- MEMORY RETRIEVAL ---
    # Get past history for this user, or start empty list
    past_history = USER_SESSIONS.get(user_id, [])
    
    # Start chat with history
    chat = model.start_chat(history=past_history, enable_automatic_function_calling=False)

    # Send User Message
    response = chat.send_message(user_query)
    
    # Handle Tool Use
    if response.parts and response.parts[0].function_call:
        fc = response.parts[0].function_call
        if fc.name == "get_render_logs":
            query = fc.args.get("query")
            target = fc.args.get("target", "both")
            limit = int(fc.args.get("limit", 20))
            
            print(f"🧠 Gemini request: target='{target}', query='{query}'")
            log_data = asyncio.run(fetch_render_logs(query=query, target=target, limit=limit))
            log_data_safe = log_data[-10000:] 

            # Send tool result back to Gemini
            final_response = chat.send_message(
                [genai.protos.Part(function_response=genai.protos.FunctionResponse(name="get_render_logs", response={"result": log_data_safe}))]
            )
            
            # --- SAVE HISTORY ---
            USER_SESSIONS[user_id] = chat.history
            return final_response.text

    # --- SAVE HISTORY ---
    USER_SESSIONS[user_id] = chat.history
    return response.text

# --- 4. SLACK HANDLER ---
@app.event("app_mention")
def handle_mention(event, say):
    say(f"🧠 Thinking...")
    try:
        user_id = event["user"] # Use User ID as session key
        cleaned_text = re.sub(r"<@.*?>", "", event["text"]).strip()
        
        # Reset command
        if cleaned_text.lower() == "reset memory":
            USER_SESSIONS[user_id] = []
            say(f"🧹 Memory wiped for <@{user_id}>.")
            return

        ai_response = run_gemini_agent(cleaned_text, user_id)
        say(f"<@{user_id}> {ai_response}")
    except Exception as e:
        say(f"💥 Brain freeze: {str(e)}")
        print(f"Error: {e}")

@flask_app.route("/slack/events", methods=["POST"])
def slack_events():
    return handler.handle(request)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    flask_app.run(host='0.0.0.0', port=port)
