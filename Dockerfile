# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY public/ ./public/
COPY src/ ./src/

# Build the React app
RUN npm run build

# Stage 2: Production server
FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install server dependencies only
RUN npm ci --only=production

# Copy server code
COPY server/index.js ./index.js

# Copy built React app from builder stage
COPY --from=builder /app/build ./build

# Expose port (Cloud Run uses PORT env variable)
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Start the server
CMD ["node", "index.js"]
