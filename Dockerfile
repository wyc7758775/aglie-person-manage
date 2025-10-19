# Use default Dockerfile frontend (removed explicit syntax to avoid network fetch)

# Allow overriding base image via build arg (use mirrors if needed)
ARG NODE_IMAGE=node:20-alpine

# 1) Dependencies + build tools to compile native modules
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
# Enable corepack to use pnpm
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
# Install all deps (including dev deps needed for build)
RUN pnpm install --frozen-lockfile

# 2) Build the Next.js app
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# 3) Minimal production runtime using Next standalone output
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat
# Copy standalone server output and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Set and expose port
ENV PORT=3000
EXPOSE 3000
# Run as non-root user for security
USER node
CMD ["node", "server.js"]