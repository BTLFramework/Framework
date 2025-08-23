#!/bin/bash

echo "🚀 Deploying CORS fixes to Railway..."
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the back-to-life-f-server directory"
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if logged into Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log into Railway first:"
    echo "   railway login"
    exit 1
fi

echo "✅ Railway CLI ready"
echo "📦 Building project..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for TypeScript errors."
    exit 1
fi

echo "✅ Build successful"
echo "🚂 Deploying to Railway..."

# Deploy to Railway
railway up

echo "🎉 Deployment complete!"
echo ""
echo "🔍 To check the deployment:"
echo "   railway status"
echo ""
echo "📊 To view logs:"
echo "   railway logs"
echo ""
echo "🌐 Your backend should now accept requests from:"
echo "   - https://dashboard-three-taupe-47.vercel.app"
echo "   - All other Vercel dashboard URLs"
echo "   - All local development URLs"
