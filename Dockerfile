# Multi-service Dockerfile for Render
FROM node:18-alpine as frontend-builder

WORKDIR /app

# Build React app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Final stage with both services
FROM alpine:latest

# Install required packages
RUN apk add --no-cache \
    nodejs \
    npm \
    wget \
    unzip

# Install serve for frontend
RUN npm install -g serve

# Copy built frontend
COPY --from=frontend-builder /app/dist /app/frontend

# Download and setup PocketBase
WORKDIR /app/backend
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip \
    && unzip pocketbase_0.22.0_linux_amd64.zip \
    && chmod +x pocketbase \
    && rm pocketbase_0.22.0_linux_amd64.zip

# Create startup script
COPY <<EOF /app/start.sh
#!/bin/sh
# Start PocketBase in background
cd /app/backend
./pocketbase serve --http=0.0.0.0:8090 &

# Start frontend
cd /app
serve -s frontend -l 3000 -n
EOF

RUN chmod +x /app/start.sh

# Expose port (Render uses PORT env var)
EXPOSE 3000

CMD ["/app/start.sh"]