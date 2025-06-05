# --- Stage 1: Build the application ---
FROM node:18-alpine AS builder

# Set environment variables to avoid timeout issues
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
ENV NPM_CONFIG_FETCH_TIMEOUT=60000
ENV NPM_CONFIG_FETCH_RETRIES=5
ENV NPM_CONFIG_RETRY_MINTIMEOUT=20000
ENV NPM_CONFIG_RETRY_MAXTIMEOUT=120000

WORKDIR /app

# Copy package files and .npmrc first to leverage Docker cache
COPY package*.json ./
COPY .npmrc ./

# Install dependencies with a workaround for peer dependencies
RUN npm install --legacy-peer-deps && \
    npm install graphql  # Explicitly install graphql if not listed in package.json

# Copy the full source code
COPY . .

# Build the app
RUN npm run build

# --- Stage 2: Prepare lightweight production image ---
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose app port
EXPOSE 3000

# Default command
CMD ["npm", "start"]
