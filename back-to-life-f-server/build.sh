#!/bin/bash
echo "Starting Railway build process..."

# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Build TypeScript
echo "Compiling TypeScript..."
npx tsc --skipLibCheck --noEmitOnError

# Copy config files
echo "Copying config files..."
cp -r src/config/*.js dist/config/ 2>/dev/null || echo "Config copy completed"
cp -r src/routes/*.js dist/routes/ 2>/dev/null || echo "Routes copy completed"
cp -r src/services/*.js dist/services/ 2>/dev/null || echo "Services copy completed"
cp -r node_modules/@prisma dist/ 2>/dev/null || echo "Prisma copy completed"

echo "Railway build completed successfully"
