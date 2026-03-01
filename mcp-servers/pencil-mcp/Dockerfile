FROM node:20-alpine

WORKDIR /app

# 安装依赖
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# 设置 Puppeteer 使用系统 Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 复制 package.json
COPY package.json ./
RUN npm install

# 复制源代码
COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
