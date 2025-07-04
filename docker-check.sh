#!/bin/bash

echo "===== SmartPayMap Docker Setup Check ====="
echo

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed or not in PATH"
    echo "Please install Docker and try again"
    exit 1
else
    echo "✅ Docker is installed"
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not available"
    echo "Please make sure Docker Compose is installed"
    exit 1
else
    echo "✅ Docker Compose is installed"
fi

# Check if .env file exists
if [ ! -f "./backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found"
    echo "Creating example .env file..."
    if [ -f "./backend/example.env" ]; then
        cp ./backend/example.env ./backend/.env
        echo "✅ Created .env file from example.env. Please edit with your actual API keys."
    else
        echo "❌ example.env file not found. Please create backend/.env manually"
        echo "HF_API_KEY=your_huggingface_api_key" > ./backend/.env
        echo "OPENAI_API_KEY=your_openai_api_key" >> ./backend/.env
        echo "✅ Created basic .env file. Please edit with your actual API keys."
    fi
else
    echo "✅ .env file exists"
fi

# Ensure frontend/node_modules is not being mounted to Docker
if grep -q "\.\/frontend\/node_modules" docker-compose.yml; then
    echo "⚠️  Warning: frontend/node_modules is being mounted in docker-compose.yml"
    echo "This can cause issues with node modules compatibility"
fi

echo
echo "===== Building Docker Images ====="
docker compose build --no-cache

echo
echo "===== Starting Services ====="
docker compose up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 5

# Check if services are running
if docker compose ps | grep -q "Up"; then
    echo "✅ Services are running"
    
    # Check backend health
    echo "Checking backend health..."
    if curl -s http://localhost:8000/health | grep -q "ok"; then
        echo "✅ Backend health check passed"
    else
        echo "❌ Backend health check failed"
        echo "Logs from backend service:"
        docker compose logs backend --tail 50
    fi
    
    # Check frontend is serving content
    echo "Checking frontend service..."
    if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
        echo "✅ Frontend service is responding"
    else
        echo "❌ Frontend service check failed"
        echo "Logs from frontend service:"
        docker compose logs frontend --tail 50
    fi
else
    echo "❌ Services failed to start properly"
    docker compose ps
    docker compose logs
fi

echo
echo "===== Setup Complete ====="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo
echo "Run 'docker compose down' to stop services" 