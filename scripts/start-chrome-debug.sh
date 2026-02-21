#!/bin/bash
# 启动带远程调试的 Chrome

# 先杀掉现有的 Chrome（可选，如果需要全新窗口）
# pkill -f "Google Chrome"

# 启动 Chrome 并开启远程调试端口
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-dev-profile \
  "http://localhost:3000" \
  &

echo "Chrome 已启动，远程调试端口: 9222"
echo "请在新启动的 Chrome 窗口中打开 http://localhost:3000"
