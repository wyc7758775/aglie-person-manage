# Monorepo: build context = 仓库根，构建 apps/web
ARG NODE_IMAGE=node:20-alpine

# 1) 安装依赖（workspace 根）
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# 2) 构建 Next.js（apps/web）
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web build

# 3) 生产运行（standalone 输出在 apps/web/.next/standalone）
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./public
ENV PORT=3000
EXPOSE 3000
USER node
WORKDIR /app
CMD ["node", "server.js"]
