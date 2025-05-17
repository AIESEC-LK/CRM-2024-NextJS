# --- Stage 1: Install dependencies and build the app ---
FROM node:18-alpine AS builder

# Set environment variables to avoid timeout issues
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
ENV NPM_CONFIG_FETCH_TIMEOUT=60000
ENV NPM_CONFIG_FETCH_RETRIES=5
ENV NPM_CONFIG_RETRY_MINTIMEOUT=20000
ENV NPM_CONFIG_RETRY_MAXTIMEOUT=120000

WORKDIR /app

# Copy package files and .npmrc first to leverage Docker cache and ensure proper config
COPY package*.json ./
COPY .npmrc ./

# Install dependencies with fallback for peer issues
RUN npm install --legacy-peer-deps

# Copy all other project files
COPY . .

# Build the app
RUN npm run build

# --- Stage 2: Run the app with a lightweight image ---
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port and start app
EXPOSE 3000

CMD ["npm", "start"]
