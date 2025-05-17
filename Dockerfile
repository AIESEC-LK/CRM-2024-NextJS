# --- Stage 1: Install dependencies and build the app ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build
COPY . .


RUN npm run build

# --- Stage 2: Run the app with a lightweight image ---
FROM node:18-alpine AS runner

WORKDIR /app



# Copy only necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# If you use custom server (e.g., Express), copy it too
# COPY --from=builder /app/server.js ./server.js

EXPOSE 3000

CMD ["npm", "start"]