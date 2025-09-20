FROM node:20-alpine

WORKDIR /api

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm install

# Copy source code and TypeScript config
COPY src/ ./src/
COPY tsconfig.json ./

# Build the TypeScript application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]