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

# Create startup script using echo commands
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'echo "Starting services..."' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start PocketBase in background' >> /app/start.sh && \
    echo 'cd /app/backend' >> /app/start.sh && \
    echo 'echo "Starting PocketBase on port 8090..."' >> /app/start.sh && \
    echo './pocketbase serve --http=0.0.0.0:8090 --dir=/app/pb_data &' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Wait a moment for PocketBase to start' >> /app/start.sh && \
    echo 'sleep 2' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start frontend' >> /app/start.sh && \
    echo 'cd /app' >> /app/start.sh && \
    echo 'PORT=${PORT:-3000}' >> /app/start.sh && \
    echo 'echo "Starting frontend on port $PORT..."' >> /app/start.sh && \
    echo 'echo "Contents of /app/frontend:"' >> /app/start.sh && \
    echo 'ls -la /app/frontend/' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Serve the React app' >> /app/start.sh && \
    echo 'serve -s /app/frontend -l $PORT --no-clipboard --single' >> /app/start.sh

RUN chmod +x /app/start.sh

# Create directory for PocketBase data
RUN mkdir -p /app/pb_data

# Expose port (Render uses PORT env var)
EXPOSE 3000

CMD ["/app/start.sh"]