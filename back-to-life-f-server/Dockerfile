FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy pre-built dist folder
COPY dist ./dist

# Copy config files
COPY src/config/*.js ./dist/config/

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "run", "start:railway:simple"]
