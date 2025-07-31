#!/bin/bash

echo "🚀 Starting Back to Life Complete System..."
echo "=========================================="

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    echo "🔧 Clearing port $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 1
}

# Clear all required ports
echo "🔧 Clearing required ports..."
kill_port 3000
kill_port 3001
kill_port 5173
kill_port 5175

# Wait for ports to clear
sleep 2

# Verify ports are available
echo "🔍 Verifying ports are available..."
check_port 3000 || exit 1
check_port 3001 || exit 1
check_port 5173 || exit 1
check_port 5175 || exit 1

echo ""
echo "📋 Starting services..."
echo "======================"

# Start Backend Server (Port 3001)
echo "🔧 Starting Backend Server on port 3001..."
cd "back-to-life-f-server"
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start Patient Portal (Port 3000)
echo "🔧 Starting Patient Portal on port 3000..."
cd "patientportalupdate"
if [ ! -d "node_modules" ]; then
    echo "📦 Installing patient portal dependencies..."
    npm install
fi
npm run dev > ../patient-portal.log 2>&1 &
PATIENT_PORTAL_PID=$!
cd ..

# Wait for patient portal to start
sleep 5

# Start Intake Form (Port 5173)
echo "🔧 Starting Intake Form on port 5173..."
cd "back-to-life-f"
if [ ! -d "node_modules" ]; then
    echo "📦 Installing intake form dependencies..."
    npm install
fi
npm run dev > ../intake-form.log 2>&1 &
INTAKE_FORM_PID=$!
cd ..

# Wait for intake form to start
sleep 5

# Start Clinician Portal (Port 5175)
echo "🔧 Starting Clinician Portal on port 5175..."
cd "back-to-life-f 3"
if [ ! -d "node_modules" ]; then
    echo "📦 Installing clinician portal dependencies..."
    npm install
fi
npm run dev > ../clinician-portal.log 2>&1 &
CLINICIAN_PORTAL_PID=$!
cd ..

# Wait for all services to start
sleep 10

echo ""
echo "✅ All services started successfully!"
echo "==================================="
echo ""
echo "🌐 Application URLs:"
echo "   📝 Intake Form:      http://localhost:5173"
echo "   👨‍⚕️ Clinician Portal: http://localhost:5175"
echo "   👤 Patient Portal:   http://localhost:3000"
echo "   🔧 Backend API:      http://localhost:3001"
echo ""
echo "📋 Log Files:"
echo "   Backend:         tail -f backend.log"
echo "   Patient Portal:  tail -f patient-portal.log"
echo "   Intake Form:     tail -f intake-form.log"
echo "   Clinician Portal: tail -f clinician-portal.log"
echo ""
echo "🛑 To stop all services: pkill -f 'npm run dev'"
echo ""

# Function to check if process is still running
check_process() {
    local pid=$1
    local name=$2
    if kill -0 $pid 2>/dev/null; then
        echo "✅ $name is running (PID: $pid)"
        return 0
    else
        echo "❌ $name has stopped"
        return 1
    fi
}

# Monitor all processes
echo "🔍 Service Status:"
check_process $BACKEND_PID "Backend Server"
check_process $PATIENT_PORTAL_PID "Patient Portal"
check_process $INTAKE_FORM_PID "Intake Form"
check_process $CLINICIAN_PORTAL_PID "Clinician Portal"

echo ""
echo "🎯 System is ready! All services are running on their designated ports."
echo "   You can now access all applications using the URLs above."
echo ""
echo "💡 Tips:"
echo "   - Keep this terminal open to monitor the services"
echo "   - Use Ctrl+C to stop all services"
echo "   - Check log files if you encounter any issues"
echo ""

# Keep the script running and monitor processes
while true; do
    sleep 30
    echo ""
    echo "🔍 Service Status Check:"
    check_process $BACKEND_PID "Backend Server"
    check_process $PATIENT_PORTAL_PID "Patient Portal"
    check_process $INTAKE_FORM_PID "Intake Form"
    check_process $CLINICIAN_PORTAL_PID "Clinician Portal"
    
    # If any service stops, break the loop
    if ! kill -0 $BACKEND_PID 2>/dev/null || \
       ! kill -0 $PATIENT_PORTAL_PID 2>/dev/null || \
       ! kill -0 $INTAKE_FORM_PID 2>/dev/null || \
       ! kill -0 $CLINICIAN_PORTAL_PID 2>/dev/null; then
        echo ""
        echo "❌ One or more services have stopped. Check the log files for details."
        break
    fi
done 