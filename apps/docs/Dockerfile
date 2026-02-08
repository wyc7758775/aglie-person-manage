# 产品设计文档站（VitePress），构建上下文 = 仓库根
ARG NODE_IMAGE=node:20-alpine

# 1) 安装依赖
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/docs/package.json ./apps/docs/
COPY packages/product-designs ./packages/product-designs
RUN pnpm install --frozen-lockfile

# 2) 构建 VitePress 静态站
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/docs/node_modules ./apps/docs/node_modules
COPY . .
RUN pnpm --filter docs build

# 3) Nginx 提供静态文件
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/docs/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
