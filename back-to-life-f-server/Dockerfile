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

# --- prove which code made it into the image ---
# 1) Stamp the image with a build timestamp
RUN date -Iseconds > dist/.buildstamp

# 2) Print first ~120 lines of the compiled emailService.js to the BUILD LOGS
RUN echo "----- emailService.js (HEAD) -----" \
 && sed -n '1,120p' dist/services/emailService.js \
 && echo "----- /emailService.js (HEAD) -----"

# Copy emailTemplates.json to services directory for super robust path resolution
RUN mkdir -p dist/services
COPY src/config/emailTemplates.json dist/services/emailTemplates.json

# Start the server
CMD ["node", "dist/app.js"]
