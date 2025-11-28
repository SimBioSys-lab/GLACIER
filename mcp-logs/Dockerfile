# Start with Python
FROM python:3.10-slim

# Install Node.js (Required for mcp-remote bridge)
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# Install the bridge tool globally
RUN npm install -g mcp-remote

WORKDIR /app
COPY . /app

# Install Python deps
RUN pip install --no-cache-dir -r requirements.txt

# Render will set the $PORT env var automatically
# We use 'sh -c' to expand the variable in the command string
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:$PORT bot:flask_app"]
