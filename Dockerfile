# ------------------------------
#  Next.js 14 standalone image
# ------------------------------

# ---- builder stage ----
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first (cache friendly)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
COPY .env.local .env
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build       # outputs .next/standalone

# ---- production stage ----
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000
USER node

# Copy only runtime artefacts
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
