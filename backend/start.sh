#!/bin/bash

# SmartPayMap Backend Startup Script (Production Version)
echo "Starting SmartPayMap Backend..."

# Start the server in production mode
echo "Starting FastAPI server..."
echo "Server will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo "Health Check: http://localhost:8000/health"
echo "================================"

# Start with production settings
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 