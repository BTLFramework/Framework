#!/bin/bash

echo "🚀 Starting Back to Life Services..."
echo "=================================="

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Function to start service
start_service() {
    local service_name=$1
    local port=$2
    local directory=$3
    local command=$4
    
    echo ""
    echo "🔧 Starting $service_name on port $port..."
    
    if check_port $port; then
        cd "$directory" || { echo "❌ Failed to change to directory $directory"; return 1; }
        
        if [ "$command" = "npm run dev" ]; then
            npm run dev &
        elif [ "$command" = "npm start" ]; then
            npm start &
        else
            $command &
        fi
        
        echo "✅ $service_name started on port $port"
        sleep 2
    else
        echo "❌ Skipping $service_name - port $port is busy"
    fi
}

# Kill any existing processes on these ports
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*3001" 2>/dev/null || echo "No backend server running"
pkill -f "node.*3000" 2>/dev/null || echo "No patient portal running"
pkill -f "vite.*5173" 2>/dev/null || echo "No intake form running"
pkill -f "vite.*5175" 2>/dev/null || echo "No clinician portal running"

sleep 2

# Start services in order
echo ""
echo "📋 Starting services..."

# 1. Backend Server (3001)
start_service "Backend Server" 3001 "back-to-life-f-server" "npm run dev"

# 2. Patient Portal (3000)
start_service "Patient Portal" 3000 "patientportalupdate" "npm run dev"

# 3. Intake Form (5173)
start_service "Intake Form" 5173 "back-to-life-f" "npm run dev"

# 4. Clinician Portal (5175)
start_service "Clinician Portal" 5175 "back-to-life-f 3" "npm run dev"

echo ""
echo "🎉 All services started!"
echo ""
echo "📱 Service URLs:"
echo "   Backend API:     http://localhost:3001"
echo "   Patient Portal:  http://localhost:3000"
echo "   Intake Form:     http://localhost:5173"
echo "   Clinician Portal: http://localhost:5175"
echo ""
echo "🔍 Health Check:"
echo "   Backend:         http://localhost:3001/health"
echo ""
echo "💡 To stop all services: pkill -f 'node.*(3000|3001|5173|5175)'"
echo ""

# Wait for all services to start
sleep 5

# Test backend health
echo "🏥 Testing backend health..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

echo ""
echo "✨ Ready to go! All Back to Life services are running." 