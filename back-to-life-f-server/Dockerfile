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
COPY config ./config

# Build the project
RUN npm run build:railway

# Build timestamp for tracking
RUN date -Iseconds > dist/.buildstamp

# Copy emailTemplates.json to services directory for super robust path resolution
RUN mkdir -p dist/services
COPY src/config/emailTemplates.json dist/services/emailTemplates.json

# Start the server
CMD ["node", "dist/app.js"]
