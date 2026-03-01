# MCP 集成设计方案对比

## 📋 方案概览

| 方案 | 复杂度 | 稳定性 | 灵活性 | 成本 | 推荐场景 |
|-----|-------|-------|-------|------|---------|
| **A. MCP Server 直连** | 低 | 中 | 高 | 低 | 快速开始，轻量级 |
| **B. 独立服务架构** | 高 | 高 | 中 | 中 | 企业级，多团队协作 |
| **C. 混合架构** | 中 | 高 | 高 | 中 | 平衡选择 ⭐ |

---

## 方案 A: MCP Server 直连（轻量级）

```
┌─────────────────────────────────────────────────────────────────┐
│                    MCP Server 直连架构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   工作流脚本                                                      │
│        │                                                         │
│        ▼                                                         │
│   ┌─────────────────┐                                            │
│   │ MCP Client      │────► Pencil MCP Server (localhost:3001)    │
│   │ (stdio/sse)     │                                            │
│   └─────────────────┘────► Chrome DevTools MCP (localhost:3002) │
│        │                                                         │
│        ▼                                                         │
│   生成设计稿 / 验证 UI                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 工作流程

```bash
# 1. 启动 MCP Servers
pencil-mcp-server --port 3001
chrome-devtools-mcp --port 3002

# 2. 运行工作流（自动连接 MCP）
./start-workflow.sh feature.md --with-mcp
```

### 优点
- ✅ 配置简单，快速启动
- ✅ 无需额外基础设施
- ✅ 适合个人/小团队

### 缺点
- ❌ MCP Servers 需要手动管理生命周期
- ❌ 重启后状态丢失
- ❌ 难以水平扩展

---

## 方案 B: 独立服务架构（企业级）

```
┌─────────────────────────────────────────────────────────────────┐
│                    独立服务架构                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Docker Compose Network                      │   │
│   │                                                          │   │
│   │  ┌──────────────┐      ┌──────────────┐                 │   │
│   │  │ Pencil       │      │ Chrome       │                 │   │
│   │  │ MCP Service  │◄────►│ DevTools     │                 │   │
│   │  │ :3001        │      │ MCP Service  │                 │   │
│   │  └──────────────┘      │ :3002        │                 │   │
│   │         │              └──────────────┘                 │   │
│   │         │                      │                        │   │
│   │         └──────────────────────┘                        │   │
│   │                    │                                     │   │
│   │              ┌─────────┐                                │   │
│   │              │ Redis   │                                │   │
│   │              │ Queue   │                                │   │
│   │              └─────────┘                                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│   工作流脚本 ───────────────►│                                   │
│                              ▼                                   │
│                      HTTP API / gRPC                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 工作流程

```bash
# 1. 启动完整基础设施
docker-compose -f docker-compose.mcp.yml up -d

# 2. 运行工作流（通过 API 调用）
./start-workflow.sh feature.md --mcp-endpoint=http://localhost:8080
```

### 优点
- ✅ 服务高可用
- ✅ 状态持久化
- ✅ 支持并发任务
- ✅ 可水平扩展

### 缺点
- ❌ 架构复杂
- ❌ 需要 Docker 知识
- ❌ 资源占用较高

---

## 方案 C: 混合架构（推荐 ⭐）

```
┌─────────────────────────────────────────────────────────────────┐
│                    混合架构（推荐）                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              核心工作流引擎                                │   │
│   │                                                          │   │
│   │   阶段 1: PRD 解析                                          │   │
│   │        │                                                  │   │
│   │        ▼                                                  │   │
│   │   阶段 2: UI 设计 (MCP Call)  ◄── Pencil MCP Server      │   │
│   │        │          (按需启动)                               │   │
│   │        ▼                                                  │   │
│   │   阶段 3: 生成测试                                         │   │
│   │        │                                                  │   │
│   │        ▼                                                  │   │
│   │   阶段 4: 审批                                             │   │
│   │        │                                                  │   │
│   │        ▼                                                  │   │
│   │   阶段 5: 代码实现                                          │   │
│   │        │                                                  │   │
│   │        ▼                                                  │   │
│   │   阶段 6: UI 验证 (MCP Call)  ◄── Chrome DevTools MCP    │   │
│   │        │                                                  │   │
│   │        ▼                                                  │   │
│   │   阶段 7: 智能提交                                         │   │
│   │                                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   MCP Servers: 作为可插拔组件                                     │
│   - 开发环境: Local process                                      │
│   - CI/CD:    Docker container                                   │
│   - 生产:     Managed service                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 工作流程

```bash
# 开发环境 - 自动启动 MCP
./start-workflow.sh feature.md --env=development

# CI/CD - 使用 Docker
./start-workflow.sh feature.md --env=ci

# 生产环境 - 使用托管服务
./start-workflow.sh feature.md --env=production \
  --pencil-endpoint=https://pencil-mcp.company.com \
  --devtools-endpoint=wss://devtools-mcp.company.com
```

### 优点
- ✅ 兼顾简单性和可扩展性
- ✅ 环境自适应
- ✅ 易于维护
- ✅ 成本可控

### 缺点
- ⚠️ 需要环境配置管理

---

## 增强版工作流（含 UI 设计/验证）

### 完整流程

```
阶段 1: PRD 解析
    │
    ▼
阶段 2: UI 设计同步 ◄────── Pencil MCP
    │  - 根据 PRD 生成 UI 设计稿
    │  - 提取设计 token (颜色、字体、间距)
    │  - 生成组件规范
    │  - 保存设计快照到 openspec/changes/<id>/design/
    │
    ▼
阶段 3: 生成测试用例
    │  - 功能测试
    │  - UI 测试 (基于设计稿)
    │  - 视觉回归测试基线
    │
    ▼
阶段 4: 提案审批
    │
    ▼
阶段 5: 代码实现 (AI/人工)
    │
    ▼
阶段 6: UI 实现验证 ◄────── Chrome DevTools MCP + Pencil MCP
    │  - 截图当前页面
    │  - 与设计稿对比 (视觉回归)
    │  - 检查设计 token 一致性
    │  - 验证响应式布局
    │  - 输出差异报告
    │
    ▼
阶段 7: 自动修复 (可选)
    │  - 根据差异报告自动调整样式
    │  - 重新验证直到通过
    │
    ▼
阶段 8: 测试验证
    │
    ▼
阶段 9: 智能提交 & Push
```

### UI 设计同步输出

```
openspec/changes/<change-id>/
├── proposal.md
├── tasks.md
├── design/                          # 新增：设计相关文件
│   ├── design-tokens.json          # 设计 token
│   ├── components-spec.md          # 组件规范
│   ├── ui-mockups/                 # UI 设计稿
│   │   ├── desktop.png
│   │   ├── mobile.png
│   │   └── tablet.png
│   ├── design-system.md            # 设计系统说明
│   └── accessibility-notes.md      # 无障碍设计说明
└── specs/...
```

### UI 验证报告输出

```
reports/ui-validation/
├── <change-id>/
│   ├── screenshots/
│   │   ├── actual/
│   │   │   ├── desktop.png
│   │   │   └── mobile.png
│   │   └── expected/             # 来自 design/ui-mockups/
│   ├── diff/
│   │   ├── desktop-diff.png      # 差异高亮图
│   │   └── mobile-diff.png
│   ├── report.json               # 详细数据
│   └── summary.md                # 人工可读报告
```

---

## 技术选型建议

### Pencil MCP Server 实现选项

| 选项 | 技术栈 | 成熟度 | 备注 |
|-----|-------|-------|------|
| **A. 自研** | Node.js + Canvas/Puppeteer | 高 | 完全可控，推荐 |
| **B. Figma MCP** | Figma Plugin + MCP Bridge | 中 | 适合已有 Figma 工作流 |
| **C. Penpot MCP** | Penpot API + MCP Bridge | 低 | 开源免费 |

### Chrome DevTools MCP Server 实现选项

| 选项 | 技术栈 | 成熟度 | 备注 |
|-----|-------|-------|------|
| **A. Puppeteer + CDP** | Node.js + Puppeteer | 高 | 推荐 |
| **B. Playwright CT** | Playwright Component Testing | 高 | 适合 React 组件 |
| **C. Storybook MCP** | Storybook + MCP Bridge | 中 | 适合组件库 |

---

## 推荐配置（方案 C + 自研 Pencil + Puppeteer）

这是平衡了开发效率、维护成本和功能完整性的最佳组合。

```yaml
# docker-compose.mcp.yml
version: '3.8'
services:
  pencil-mcp:
    build: ./mcp-servers/pencil
    ports:
      - "3001:3001"
    volumes:
      - ./openspec:/app/openspec:ro
      - ./design-outputs:/app/outputs
    environment:
      - MCP_TRANSPORT=sse
      - OUTPUT_DIR=/app/outputs
      
  chrome-devtools-mcp:
    build: ./mcp-servers/chrome-devtools
    ports:
      - "3002:3002"
    volumes:
      - ./reports/ui-validation:/app/reports
    environment:
      - MCP_TRANSPORT=sse
      - REPORT_DIR=/app/reports
```

更多实现细节见各方案具体配置文件。
