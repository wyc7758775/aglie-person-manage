FROM mcr.microsoft.com/playwright:v1.49.0-jammy

WORKDIR /app

# 安装依赖
COPY package.json ./
RUN npm install

# 复制服务器代码
COPY server.js ./

# 创建截图目录
RUN mkdir -p /app/screenshots /app/reports /app/e2e

# 暴露端口
EXPOSE 3003

# 设置环境变量
ENV PORT=3003
ENV MCP_TRANSPORT=sse
ENV SCREENSHOT_DIR=/app/screenshots
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

CMD ["node", "server.js"]
