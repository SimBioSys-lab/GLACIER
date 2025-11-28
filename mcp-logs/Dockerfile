# 1. Use an official Python runtime as a parent image
FROM python:3.10-slim

# 2. Install Node.js and NPM (Required for mcp-remote)
# We update apt, install curl, then get Node.js setup source, then install
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# 3. Install the MCP Bridge Tool globally
RUN npm install -g mcp-remote

# 4. Set the working directory
WORKDIR /app

# 5. Copy project files
COPY . /app

# 6. Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 7. Expose the port (Render usually uses 10000, but we map it)
EXPOSE 3000

# 8. Start the bot using Gunicorn (Production Server)
# We bind to 0.0.0.0 to ensure external access
CMD ["gunicorn", "--bind", "0.0.0.0:3000", "bot:flask_app"]
