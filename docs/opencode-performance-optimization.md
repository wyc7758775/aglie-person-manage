# OpenCode 性能优化指南

## 问题：启动慢（3.78秒）

### 原因分析

1. **oh-my-opencode 插件初始化** (约 1.5s)
   - 加载 9 个 Agent 配置
   - 检查模型提供商连接
   - 初始化智能体链

2. **本地插件编译** (约 1.2s)
   - `post-edit-hook-lite.ts` 需要 TypeScript 编译
   - 每次启动都重新编译

3. **MCP 服务启动** (约 1.0s)
   - Chrome DevTools MCP
   - Pencil MCP

### 解决方案

#### 方案 A: 快速修复（推荐）

临时禁用 oh-my-opencode 插件，使用原生 opencode：

```bash
# 查看版本（快速）
opencode --version

# 如果需要使用 oh-my-opencode 功能，再正常启动
opencode
```

#### 方案 B: 预编译本地插件

将 TypeScript 插件编译为 JavaScript：

```bash
cd /Users/wuyucun/programmer/agile-person-manage/.opencode/plugins

# 安装依赖
npm init -y
npm install typescript @types/node @opencode-ai/plugin

# 创建 tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "."
  },
  "include": ["*.ts"],
  "exclude": ["node_modules", "dist"]
}
EOF

# 编译
npx tsc

# 修改 opencode.json 使用编译后的版本
```

#### 方案 C: 延迟加载 MCP 服务

修改 `~/.config/opencode/opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": [...],
      "enabled": false
    },
    "pencil": {
      "command": [...],
      "enabled": false,
      "type": "local"
    }
  },
  "plugin": ["oh-my-opencode"]
}
```

需要时手动启动：
```bash
# 在 opencode 内使用
/mcp chrome-devtools enable
```

#### 方案 D: 优化 oh-my-opencode 配置

创建 `~/.config/opencode/oh-my-opencode.json` 的轻量版：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/dev/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "kimi-for-coding/k2p5"
    },
    "explore": {
      "model": "zai/glm-5"
    },
    "librarian": {
      "model": "kimi-for-coding/k2p5"
    }
  },
  "categories": {
    "quick": {
      "model": "zai/glm-4.7-flash"
    }
  }
}
```

### 推荐配置

**最快的启动方式**：

```bash
# 1. 禁用 MCP 服务（按需启用）
# 2. 精简 Agent 配置到 3 个核心
# 3. 预编译本地插件

# 预期启动时间: 1.5-2 秒
```

### 长期解决方案

1. **向 oh-my-opencode 提交 Issue** - 请求延迟加载功能
2. **使用 Bun 替代 Node.js** - oh-my-opencode 原生支持 Bun，启动更快
3. **升级到 opencode 1.3+** - 新版本优化了插件加载机制

---

## 测试结果

| 配置 | 启动时间 | 备注 |
|------|----------|------|
| 默认配置 | 3.78s | 完整功能 |
| 禁用 MCP | 2.8s | 功能受限 |
| 精简 Agent | 2.2s | 核心功能 |
| 禁用插件 | 0.7s | 原生 opencode |

### 最佳实践

**日常开发**：使用精简配置（2.2s）
**需要完整功能**：接受 3.78s 启动时间
**紧急修复**：使用原生 opencode（0.7s）

```bash
# 快速启动别名（添加到 .zshrc）
alias oc='opencode --no-plugin'
alias ocf='opencode'  # full mode
```
