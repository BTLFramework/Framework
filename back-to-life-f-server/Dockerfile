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

# Ensure exercises.json exists - use absolute path and better error handling
RUN node -e "const fs=require('fs');const path=require('path');let mod=null;let error=null;const absPath=path.resolve('/app/config/exerciseConfig.js');console.log('Trying to load:',absPath);console.log('File exists:',fs.existsSync(absPath));try{delete require.cache[absPath];mod=require(absPath);console.log('Loaded module:',typeof mod,'has exercises:',!!mod.exercises,'is array:',Array.isArray(mod.exercises))}catch(e){error=e.message;console.error('Load error:',e.message)}const list=(mod&&mod.exercises)||[];fs.mkdirSync('./dist/config',{recursive:true});fs.writeFileSync('./dist/config/exercises.json',JSON.stringify(list,null,2));console.log('✅ Wrote exercises.json with',list.length,'exercises');if(list.length===0&&error)console.error('⚠️ Empty because:',error)"

# Build timestamp for tracking
RUN date -Iseconds > dist/.buildstamp

# Copy emailTemplates.json to services directory for super robust path resolution
RUN mkdir -p dist/services
COPY src/config/emailTemplates.json dist/services/emailTemplates.json

# Start the server
CMD ["node", "dist/app.js"]
