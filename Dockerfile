# Use official Node.js image as the base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install; fi

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Production image, copy built assets from builder
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --prod; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
    else npm install --omit=dev; fi

# Copy built app and static files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
