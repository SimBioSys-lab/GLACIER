# Start with Python
FROM python:3.10-slim

# 1. Install Node.js v20 (Required for mcp-remote/undici support)
# We switched from setup_18.x to setup_20.x to fix "ReferenceError: File is not defined"
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# 2. Install the bridge tool globally
RUN npm install -g mcp-remote

WORKDIR /app
COPY . /app

# 3. Install Python deps
RUN pip install --no-cache-dir -r requirements.txt

# 4. Expose Port
EXPOSE 3000

# 5. Start command (Dynamic Port)
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:$PORT bot:flask_app"]
