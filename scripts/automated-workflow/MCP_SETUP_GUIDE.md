# MCP 集成设置指南

## 快速开始（推荐：方案 C - 混合架构）

### 1. 开发环境（stdio 模式）

最简单的方式，直接在开发机器上运行 MCP Servers：

```bash
# 安装 MCP Server 依赖
cd mcp-servers/pencil-mcp && npm install
cd ../chrome-devtools-mcp && npm install

# 返回项目根目录
cd ../..

# 运行工作流（自动启动 MCP Servers）
./scripts/automated-workflow/start-workflow.sh feature.md --with-ui
```

### 2. Docker 环境（sse 模式）

适合 CI/CD 或需要隔离的环境：

```bash
# 启动 MCP Services
docker-compose -f docker-compose.mcp.yml up -d

# 检查服务状态
docker-compose -f docker-compose.mcp.yml ps

# 运行工作流
./scripts/automated-workflow/start-workflow.sh feature.md --env=docker
```

### 3. 独立阶段运行

```bash
# 阶段 2.5: UI 设计同步
node scripts/automated-workflow/phases/phase-2.5-ui-design-sync.js <change-id>

# 阶段 6.5: UI 验证
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js <change-id>
```

---

## 环境配置

### 环境变量

```bash
# .env 文件
# MCP 传输方式: stdio | sse
PENCIL_MCP_TRANSPORT=sse
CHROME_DEVTOOLS_MCP_TRANSPORT=sse

# SSE 模式下的端点
PENCIL_MCP_ENDPOINT=http://localhost:3001
CHROME_DEVTOOLS_MCP_ENDPOINT=http://localhost:3002

# MCP Server 端口（Docker 模式）
PENCIL_MCP_PORT=3001
CHROME_DEVTOOLS_MCP_PORT=3002

# 应用 URL（用于 UI 验证）
APP_URL=http://localhost:3000
```

### 配置文件

`.mcp-config.json` - 不同环境的配置：

```json
{
  "environments": {
    "development": {
      "pencil": { "transport": "stdio", ... },
      "chromeDevTools": { "transport": "stdio", ... }
    },
    "docker": {
      "pencil": { "transport": "sse", "endpoint": "http://localhost:3001" },
      "chromeDevTools": { "transport": "sse", "endpoint": "http://localhost:3002" }
    }
  }
}
```

---

## 完整工作流（含 UI 设计/验证）

```
阶段 1: PRD 解析
    │
    ▼
阶段 2: 生成测试用例
    │
    ▼
阶段 2.5: UI 设计同步 ◄── Pencil MCP
    │  • 生成设计稿
    │  • 提取设计 token
    │  • 保存到 openspec/changes/<id>/design/
    │
    ▼
阶段 3: 提案审批
    │
    ▼
阶段 4: 代码实现
    │
    ▼
阶段 5: 测试验证
    │
    ▼
阶段 6: 智能提交
    │
    ▼
阶段 6.5: UI 验证 ◄── Chrome DevTools MCP
    │  • 截图对比
    │  • 设计 token 检查
    │  • 可访问性验证
    │  • 生成报告
    │
    ▼
阶段 7: 归档（可选）
```

---

## 故障排除

### MCP Server 连接失败

```bash
# 检查服务状态
docker-compose -f docker-compose.mcp.yml logs pencil-mcp
docker-compose -f docker-compose.mcp.yml logs chrome-devtools-mcp

# 重启服务
docker-compose -f docker-compose.mcp.yml restart

# 使用 stdio 模式（不依赖 Docker）
node scripts/automated-workflow/phases/phase-2.5-ui-design-sync.js <id> --skip-mcp
```

### UI 验证失败

```bash
# 查看详细报告
cat reports/ui-validation/<change-id>/summary.md

# 使用自动修复
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js <id> --auto-fix

# 跳过验证（不推荐）
node scripts/automated-workflow/phases/phase-7-test-validation.js <id>
```

---

## 自定义 MCP Server

### 添加新工具

编辑 `mcp-servers/pencil-mcp/server.js`：

```javascript
const TOOLS = [
  // ... 现有工具
  {
    name: 'my_custom_tool',
    description: '我的自定义工具',
    inputSchema: {
      type: 'object',
      properties: {
        param1: { type: 'string' }
      }
    }
  }
];

// 在工具实现中添加
async function myCustomTool(args) {
  // 实现逻辑
  return { success: true, result: ... };
}
```

### 使用第三方 MCP Server

修改 `.mcp-config.json`：

```json
{
  "pencil": {
    "transport": "sse",
    "endpoint": "https://your-pencil-mcp.com"
  }
}
```

---

## 性能优化

### 启用缓存

```bash
# Redis 缓存（可选）
docker-compose -f docker-compose.mcp.yml --profile queue up -d
```

### 并行验证

```javascript
// 在 phase-6.5-ui-validation.js 中
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

// 并行截图
await Promise.all(viewports.map(vp => captureScreenshot(vp)));
```

---

## 集成到 CI/CD

### GitHub Actions

```yaml
- name: Start MCP Servers
  run: docker-compose -f docker-compose.mcp.yml up -d

- name: Wait for MCP
  run: |
    sleep 10
    curl -f http://localhost:3001/sse
    curl -f http://localhost:3002/sse

- name: Run UI Validation
  run: |
    node scripts/automated-workflow/phases/phase-6.5-ui-validation.js ${{ inputs.change_id }}

- name: Upload Reports
  uses: actions/upload-artifact@v4
  with:
    name: ui-validation-reports
    path: reports/ui-validation/
```

---

## 参考

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Puppeteer Documentation](https://pptr.dev/)
- [Pixelmatch](https://github.com/mapbox/pixelmatch) - 视觉回归测试
