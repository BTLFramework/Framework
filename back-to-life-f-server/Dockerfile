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
# Unique build ID so we can spot the exact image at runtime
ARG BUILD_ID
RUN /bin/sh -c "echo \"BUILD_ID=${BUILD_ID:-$(date -Iseconds)}\" > dist/.buildstamp"

# Prove the compiled file that is inside THIS image
RUN echo '----- emailService.js HEAD (build) -----' \
 && sed -n '1,140p' dist/services/emailService.js \
 && echo '----- /emailService.js HEAD (build) -----'

# Copy emailTemplates.json to services directory for super robust path resolution
RUN mkdir -p dist/services
COPY src/config/emailTemplates.json dist/services/emailTemplates.json

# Start the server
CMD ["node", "dist/app.js"]
