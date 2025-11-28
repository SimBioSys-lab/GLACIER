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
# Replace with your actual keys
SLACK_BOT_TOKEN = os.environ.get("SLACK_BOT_TOKEN")
SIGNING_SECRET = os.environ.get("SIGNING_SECRET")
RENDER_API_KEY = os.environ.get("RENDER_API_KEY")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
DEFAULT_WORKSPACE_ID = "tea-d46ggm2li9vc73fe8a70"

# 🔍 DEFINE YOUR SERVICES HERE
SERVICES = {
    "frontend": "srv-d46jd3ili9vc73artus0",
    "backend": "srv-d4794ts9c44c73dnc8rg",
}
# -----------------------------------------------

app = App(token=SLACK_BOT_TOKEN, signing_secret=SIGNING_SECRET)
flask_app = Flask(__name__)
handler = SlackRequestHandler(app)
logging.basicConfig(level=logging.INFO)

genai.configure(api_key=GEMINI_API_KEY)

# --- 1. THE MUSCLE: MCP Connection ---
async def fetch_render_logs(query=None, target="both", limit=50):
    """
    Fetches logs from one or multiple services via Render MCP.
    target: 'backend', 'frontend', or 'both'
    """
    # Robustly find the mcp-remote executable
    mcp_cmd = shutil.which("mcp-remote")
    if not mcp_cmd:
        mcp_cmd = os.path.join(os.getenv('APPDATA'), 'npm', 'mcp-remote.cmd')

    if not mcp_cmd or not os.path.exists(mcp_cmd):
        return "System Error: Could not find mcp-remote.cmd. Please run 'npm install -g mcp-remote'."

    server_params = StdioServerParameters(
        command=mcp_cmd,
        args=["https://mcp.render.com/mcp", "--header", f"Authorization: Bearer {RENDER_API_KEY}"],
        env=os.environ.copy()
    )

    # Determine which Service IDs to query based on 'target'
    resource_ids = []
    if target == "both":
        resource_ids = list(SERVICES.values())
    elif target in SERVICES:
        resource_ids = [SERVICES[target]]
    else:
        # Fallback to all if unknown target
        resource_ids = list(SERVICES.values())
    
    # Filter out empty IDs or placeholders to prevent API errors
    resource_ids = [rid for rid in resource_ids if "srv-" in rid]

    if not resource_ids:
        return "Configuration Error: No valid Service IDs found in SERVICES dictionary."

    # Prepare arguments for the list_logs tool
    tool_args = {
        "resource": resource_ids, # Render expects a list of IDs here
        "limit": limit,
    }
    if query:
        tool_args["query"] = query

    print(f"💪 Fetching logs for {target} (IDs: {resource_ids})")
    
    logs = []
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                # Explicitly select the workspace first
                await session.call_tool("select_workspace", arguments={"ownerID": DEFAULT_WORKSPACE_ID})
                
                # Fetch Logs
                result = await session.call_tool("list_logs", arguments=tool_args)
                
                for content in result.content:
                    if hasattr(content, 'text'):
                        logs.append(content.text)
    except Exception as e:
        return f"MCP Error: {str(e)}"

    if not logs:
        return f"No logs found for {target}."
        
    return "\n".join(logs)

# --- 2. THE BRAIN: Gemini Agent ---
def run_gemini_agent(user_query):
    """
    Orchestrates the conversation: User -> Gemini -> MCP Tool -> Gemini -> User
    """
    
    # A. Define the tool schema
    get_logs_tool = FunctionDeclaration(
        name="get_render_logs",
        description="Fetch logs from Render. Can specify frontend, backend, or both.",
        parameters={
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Specific error code, trace ID, or string to search for."
                },
                "target": {
                    "type": "string",
                    "enum": ["frontend", "backend", "both"],
                    "description": "Which service to check. Default to 'both' if unsure."
                },
                "limit": {
                    "type": "integer",
                    "description": "Number of lines. Default 20."
                }
            }
        }
    )

    model = genai.GenerativeModel(
        model_name='gemini-2.5-pro',
        tools=[Tool(function_declarations=[get_logs_tool])]
    )
    
    chat = model.start_chat(enable_automatic_function_calling=False)

    # B. System Prompt
    system_instruction = (
        "You are GLACIER, a DevOps bot. You monitor two services: 'Frontend' (Next.js) and 'Backend' (Python/Node). "
        "If the user asks about UI issues, check frontend. If API issues, check backend. "
        "If the logs contain errors, explain the root cause briefly."
    )
    
    full_prompt = f"{system_instruction}\nUser: {user_query}"
    response = chat.send_message(full_prompt)
    
    # C. Handle Response Safely
    if not response.parts:
        return "⚠️ Gemini returned an empty response."

    part = response.parts[0]
    
    # CHECK FOR FUNCTION CALL *BEFORE* TRYING TO READ TEXT
    # This prevents the "Could not convert part.function_call to text" error
    if part.function_call:
        fc = part.function_call
        if fc.name == "get_render_logs":
            query = fc.args.get("query")
            target = fc.args.get("target", "both")
            limit = int(fc.args.get("limit", 20))
            
            print(f"🧠 Gemini request: target='{target}', query='{query}'")
            
            # Run Tool (The Muscle)
            log_data = asyncio.run(fetch_render_logs(query=query, target=target, limit=limit))
            
            # Truncate to safe limits for the context window
            log_data_safe = log_data[-10000:] 

            # Send result back to Gemini for summary
            final_response = chat.send_message(
                [
                    genai.protos.Part(
                        function_response=genai.protos.FunctionResponse(
                            name="get_render_logs",
                            response={"result": log_data_safe}
                        )
                    )
                ]
            )
            return final_response.text
        else:
            return f"⚠️ Gemini tried to call unknown function: {fc.name}"

    # If NO function call, it's safe to return text
    return response.text

# --- 3. SLACK HANDLER ---
@app.event("app_mention")
def handle_mention(event, say):
    user_text = event["text"]
    user_id = event["user"]
    cleaned_text = re.sub(r"<@.*?>", "", user_text).strip()

    say(f"🧠 Thinking...")

    try:
        ai_response = run_gemini_agent(cleaned_text)
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
