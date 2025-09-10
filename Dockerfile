# Multi-service Dockerfile for Render
FROM node:18-alpine as frontend-builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Final stage with both services
FROM alpine:latest

# Install required packages
RUN apk add --no-cache \
    nodejs \
    npm \
    wget \
    unzip \
    bash

# Install serve for frontend
RUN npm install -g serve

# Copy built frontend
COPY --from=frontend-builder /app/build /app/frontend

# Download and setup PocketBase
WORKDIR /app/backend
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip \
    && unzip pocketbase_0.22.0_linux_amd64.zip \
    && chmod +x pocketbase \
    && rm pocketbase_0.22.0_linux_amd64.zip

# Create startup script
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
echo "Starting services..."

# Start PocketBase in background
cd /app/backend
echo "Starting PocketBase on port 8090..."
./pocketbase serve --http=0.0.0.0:8090 --dir=/app/pb_data &

# Wait a moment for PocketBase to start
sleep 2

# Start frontend on port from environment (Render sets this)
cd /app
PORT=${PORT:-3000}
echo "Starting frontend on port $PORT..."
echo "Contents of /app:"
ls -la /app/
echo "Contents of /app/frontend:"
ls -la /app/frontend/

# Serve the React app from the frontend directory
serve -s /app/frontend -l $PORT --no-clipboard --verbose
EOF

RUN chmod +x /app/start.sh

# Create directory for PocketBase data
RUN mkdir -p /app/pb_data

# Expose port (Render uses PORT env var)
EXPOSE 3000

CMD ["/app/start.sh"]