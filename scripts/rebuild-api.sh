#!/bin/bash

# Force rebuild of DocSpective API Docker image
# This script ensures a complete rebuild by removing all cached layers

set -e  # Exit on any error

echo "🔄 Stopping API container..."
docker compose down api

echo "🗑️  Removing existing API image..."
docker image rm docspective-api --force 2>/dev/null || echo "   (Image not found - continuing)"

echo "🔨 Building fresh API image..."
docker compose build api

echo "🚀 Starting API container..."
docker compose up api -d

echo "✅ API rebuild complete!"
echo "📚 Swagger UI available at: http://localhost:3001"