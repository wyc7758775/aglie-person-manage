# MCP 集成总结

## 📊 三种方案对比

| 维度 | 方案 A: stdio | 方案 B: Docker | 方案 C: 混合 (推荐) |
|------|--------------|----------------|-------------------|
| **复杂度** | ⭐ 低 | ⭐⭐⭐ 高 | ⭐⭐ 中 |
| **稳定性** | ⭐⭐ 中 | ⭐⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐ 高 |
| **性能** | ⭐⭐⭐ 中 | ⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐ 高 |
| **资源占用** | ⭐⭐⭐⭐⭐ 低 | ⭐⭐⭐ 中 | ⭐⭐⭐⭐ 可调 |
| **扩展性** | ⭐⭐ 低 | ⭐⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐ 高 |
| **维护成本** | ⭐⭐⭐⭐⭐ 低 | ⭐⭐⭐ 中 | ⭐⭐⭐⭐ 低 |

## 🎯 推荐配置（方案 C）

### 开发环境
```bash
# 使用 stdio 模式，快速启动
pnpm workflow:ui-design <change-id>
```

### CI/CD 环境
```bash
# 启动 Docker 服务
pnpm mcp:up

# 运行工作流
pnpm workflow:ui-validate <change-id>

# 清理
pnpm mcp:down
```

## 📁 新增文件清单

```
项目根目录/
├── docker-compose.mcp.yml              # Docker 编排配置
├── .mcp-config.json                    # MCP 环境配置
├── mcp-servers/
│   ├── pencil-mcp/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── server.js                   # Pencil MCP Server
│   └── chrome-devtools-mcp/
│       ├── Dockerfile
│       ├── package.json
│       └── server.js                   # Chrome DevTools MCP
├── scripts/automated-workflow/
│   ├── lib/
│   │   └── mcp-client.js               # MCP 客户端工具
│   ├── phases/
│   │   ├── phase-2.5-ui-design-sync.js # UI 设计同步 ⭐ NEW
│   │   └── phase-6.5-ui-validation.js  # UI 验证 ⭐ NEW
│   ├── test-mcp.js                     # MCP 测试工具
│   ├── MCP_SETUP_GUIDE.md              # 设置指南
│   ├── MCP_INTEGRATION_DESIGN.md       # 设计方案文档
│   ├── SCENARIO_EXAMPLES.md            # 使用示例
│   └── INTEGRATION_SUMMARY.md          # 本文档
└── package.json                        # 新增脚本命令
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装 MCP Server 依赖
cd mcp-servers/pencil-mcp && npm install
cd ../chrome-devtools-mcp && npm install
cd ../..
```

### 2. 测试 MCP 连接

```bash
pnpm workflow:test-mcp
```

### 3. 运行完整工作流

```bash
# 包含 UI 设计
pnpm workflow:start feature.md --with-ui

# 或分阶段
pnpm workflow:ui-design <change-id>
pnpm workflow:ui-validate <change-id>
```

## 🔧 新增命令

| 命令 | 说明 |
|------|------|
| `pnpm workflow:ui-design <id>` | UI 设计同步（阶段 2.5） |
| `pnpm workflow:ui-validate <id>` | UI 验证（阶段 6.5） |
| `pnpm workflow:test-mcp` | 测试 MCP 连接 |
| `pnpm mcp:up` | 启动 MCP Docker 服务 |
| `pnpm mcp:down` | 停止 MCP Docker 服务 |
| `pnpm mcp:logs` | 查看 MCP 日志 |

## 📈 增强后的工作流

```
┌─────────────────────────────────────────────────────────────────────┐
│                    增强版自动化工作流                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  阶段 1:  PRD 解析                                                    │
│       ↓                                                              │
│  阶段 2:  生成测试用例                                                 │
│       ↓                                                              │
│  阶段 2.5: UI 设计同步 ◄── Pencil MCP ⭐ NEW                          │
│       - 生成设计稿                                                    │
│       - 提取设计 token                                                │
│       - 保存到 openspec/changes/<id>/design/                          │
│       ↓                                                              │
│  阶段 3:  提案审批                                                    │
│       ↓                                                              │
│  阶段 4:  代码实现                                                    │
│       ↓                                                              │
│  阶段 5:  测试验证                                                    │
│       ↓                                                              │
│  阶段 6:  智能提交                                                    │
│       ↓                                                              │
│  阶段 6.5: UI 验证 ◄── Chrome DevTools MCP ⭐ NEW                     │
│       - 截图对比                                                      │
│       - 设计 token 检查                                               │
│       - 可访问性验证                                                  │
│       - 生成报告到 reports/ui-validation/<id>/                        │
│       ↓                                                              │
│  阶段 7:  归档                                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎨 UI 设计同步输出

```
openspec/changes/<change-id>/design/
├── README.md                    # 设计文档
├── design-tokens.json          # 颜色、字体、间距
├── components-spec.json        # 组件规范
└── ui-mockups/
    ├── desktop.png             # 桌面端 (1440x900)
    ├── tablet.png              # 平板端 (768x1024)
    └── mobile.png              # 移动端 (375x667)
```

## 🔍 UI 验证报告输出

```
reports/ui-validation/<change-id>/
├── report.json                 # 详细数据
├── summary.md                  # 人工可读报告
├── screenshots/
│   ├── actual/                 # 实际截图
│   │   ├── desktop.png
│   │   └── mobile.png
│   └── expected/               # 预期截图（来自 design/）
└── diff/                       # 差异图
    ├── desktop-diff.png
    └── mobile-diff.png
```

## 💡 关键特性

### 1. 环境自适应
- 开发：自动使用 stdio 模式
- CI：自动使用 Docker/SSE 模式
- 生产：可配置远程 MCP 服务

### 2. 可选阶段
- 纯后端功能：跳过 UI 相关阶段
- 已有设计稿：使用 `--skip-mcp` 直接验证
- 快速迭代：使用 `--auto-fix` 自动修复

### 3. 详细报告
- JSON 格式：程序化消费
- Markdown 格式：人工审查
- 差异图片：可视化对比

### 4. 可扩展性
- 支持添加新的 MCP Server
- 支持自定义验证规则
- 支持插件化设计

## 📝 配置文件示例

### `.mcp-config.json`
```json
{
  "environments": {
    "development": {
      "pencil": {
        "transport": "stdio",
        "command": "node",
        "args": ["mcp-servers/pencil-mcp/server.js"]
      },
      "chromeDevTools": {
        "transport": "stdio",
        "command": "node", 
        "args": ["mcp-servers/chrome-devtools-mcp/server.js"]
      }
    },
    "docker": {
      "pencil": {
        "transport": "sse",
        "endpoint": "http://localhost:3001"
      },
      "chromeDevTools": {
        "transport": "sse",
        "endpoint": "http://localhost:3002"
      }
    }
  }
}
```

### `docker-compose.mcp.yml`
```yaml
version: '3.8'
services:
  pencil-mcp:
    build: ./mcp-servers/pencil-mcp
    ports:
      - "3001:3001"
    environment:
      - MCP_TRANSPORT=sse
      
  chrome-devtools-mcp:
    build: ./mcp-servers/chrome-devtools-mcp
    ports:
      - "3002:3002"
    environment:
      - MCP_TRANSPORT=sse
```

## 🔄 迁移指南

### 从旧工作流迁移

1. 安装新依赖
```bash
cd mcp-servers/pencil-mcp && npm install
cd ../chrome-devtools-mcp && npm install
```

2. 更新配置文件
```bash
cp .mcp-config.json.example .mcp-config.json
# 编辑配置以匹配你的环境
```

3. 测试 MCP 连接
```bash
pnpm workflow:test-mcp
```

4. 开始使用新阶段
```bash
# 对于新功能，完整流程
pnpm workflow:start feature.md --with-ui

# 对于已有功能，添加 UI 验证
pnpm workflow:ui-validate existing-feature-id
```

## 🎉 总结

通过集成 Pencil MCP 和 Chrome DevTools MCP，我们实现了：

1. **设计先行**: 在编码前自动生成设计规范
2. **质量保证**: 自动验证 UI 实现是否符合设计
3. **可追溯性**: 设计稿、实现、验证报告完整关联
4. **灵活性**: 支持多种环境和使用场景
5. **可扩展性**: 易于添加新的验证规则和工具

这个方案将设计系统与开发工作流紧密结合，确保 UI 质量的同时提高开发效率。
