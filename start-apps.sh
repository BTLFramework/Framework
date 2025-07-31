#!/bin/bash

echo "🚀 Starting Back to Life App Environment..."

# Kill any processes using ports 3000 and 3001
echo "🔧 Clearing ports 3000 and 3001..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Wait a moment for ports to clear
sleep 2

# Start the backend server
echo "🔧 Starting backend server on port 3001..."
cd back-to-life-f-server && npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the Next.js patient portal
echo "🔧 Starting Next.js patient portal on port 3000..."
cd ../patientportalupdate && npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for both to start
sleep 5

echo ""
echo "✅ Environment started successfully!"
echo ""
echo "🌐 Patient Portal: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo ""
echo "📋 Logs:"
echo "   Frontend: tail -f frontend.log"
echo "   Backend:  tail -f backend.log"
echo ""
echo "🛑 To stop all servers: pkill -f 'npm run dev'"
echo ""

# Keep the script running and show status
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend server stopped"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "❌ Frontend server stopped"
        break
    fi
    sleep 10
done 