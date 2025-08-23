FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build the project
RUN npm run build:railway

# Config files are already copied during npm run build:railway

# Verify config files are present in final image
RUN echo "🔍 Final dist/config contents:" && ls -al dist/config

# Sanity check - confirm the compiled entrypoint is present
RUN echo "✅ Contents of dist/" && ls -al dist

# Start the server
# TEMPORARY DEBUG: Test with debug.ts first
CMD ["node", "dist/debug.js"]
