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

# Copy config files
COPY src/config/*.js ./dist/config/

# Start the server
CMD ["npm", "run", "start:railway:simple"]
