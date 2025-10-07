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

# Ensure exercises.json exists even if build script isn't updated
RUN node -e "const fs=require('fs');let mod=null;try{mod=require('./config/exerciseConfig.js')}catch(e){try{mod=require('./config/exerciseConfig')}catch(e2){}}const list=(mod&&mod.exercises)||((mod&&mod.default&&mod.default.exercises)||[]);fs.mkdirSync('./dist/config',{recursive:true});fs.writeFileSync('./dist/config/exercises.json',JSON.stringify(list));console.log('Dockerfile emitted exercises.json count',Array.isArray(list)?list.length:0)"

# Build timestamp for tracking
RUN date -Iseconds > dist/.buildstamp

# Copy emailTemplates.json to services directory for super robust path resolution
RUN mkdir -p dist/services
COPY src/config/emailTemplates.json dist/services/emailTemplates.json

# Start the server
CMD ["node", "dist/app.js"]
