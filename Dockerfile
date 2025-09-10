# Simpler single-stage Dockerfile for Render
FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache wget unzip bash

# Copy and install frontend dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Download PocketBase
RUN mkdir -p /app/pocketbase && \
    cd /app/pocketbase && \
    wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip && \
    unzip pocketbase_0.22.0_linux_amd64.zip && \
    chmod +x pocketbase && \
    rm pocketbase_0.22.0_linux_amd64.zip

# Create startup script using printf (more reliable than heredoc)
RUN printf '#!/bin/bash\n\
echo "Starting PocketBase and React app..."\n\
\n\
# Start PocketBase in background\n\
cd /app/pocketbase\n\
./pocketbase serve --http=0.0.0.0:8090 --dir=/app/pb_data &\n\
\n\
# Wait for PocketBase to start\n\
sleep 3\n\
\n\
# Start frontend server\n\
PORT=${PORT:-3000}\n\
echo "Starting frontend on port $PORT"\n\
echo "Build directory contents:"\n\
ls -la /app/build/\n\
\n\
# Serve the built React app\n\
serve -s /app/build -l $PORT --no-clipboard --single\n' > /app/start.sh

RUN chmod +x /app/start.sh

# Create data directory
RUN mkdir -p /app/pb_data

# Expose port
EXPOSE 3000

CMD ["/app/start.sh"]