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

# Copy config files - be explicit about which files to copy
COPY src/config/envValidation.js ./dist/config/
COPY src/config/recoveryPointsConfig.js ./dist/config/
COPY src/config/regionConfig.js ./dist/config/
COPY src/config/srsConfig.js ./dist/config/
COPY src/config/tdiQuestions.js ./dist/config/

# Start the server
CMD ["npm", "run", "start:railway:simple"]
