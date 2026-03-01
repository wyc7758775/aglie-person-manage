# 增强版工作流快速开始（含 MCP UI 集成）

## 🎯 核心变化

在原有 5 阶段工作流基础上，增加了 **阶段 2.5** 和 **阶段 6.5**：

```
阶段 1:  PRD 解析
阶段 2:  生成测试
阶段 2.5: UI 设计同步 ⭐ NEW（调用 Pencil MCP）
阶段 3:  提案审批
阶段 4:  代码实现
阶段 5:  测试验证
阶段 6:  智能提交
阶段 6.5: UI 验证 ⭐ NEW（调用 Chrome DevTools MCP）
阶段 7:  归档
```

## 🚀 快速使用

### 1. 完整流程（含 UI 设计/验证）

```bash
# 使用 --with-ui 启用 MCP UI 阶段
./scripts/automated-workflow/start-workflow.sh feature.md --with-ui
```

### 2. 仅后端功能（跳过 UI）

```bash
# 不加 --with-ui，保持原有流程
./scripts/automated-workflow/start-workflow.sh api-endpoint.md
```

### 3. 指定 MCP 模式

```bash
# 自动检测（默认）
./scripts/automated-workflow/start-workflow.sh feature.md --with-ui

# 强制使用 Docker
./scripts/automated-workflow/start-workflow.sh feature.md --with-ui --mcp-mode=docker

# 强制使用 stdio（直接启动进程）
./scripts/automated-workflow/start-workflow.sh feature.md --with-ui --mcp-mode=stdio

# 跳过 MCP（仅生成文档框架）
./scripts/automated-workflow/start-workflow.sh feature.md --with-ui --mcp-mode=none
```

## 🎨 新增的 UI 阶段说明

### 阶段 2.5: UI 设计同步

**自动执行：**
- 调用 Pencil MCP 分析 PRD
- 生成多视口设计稿（desktop/tablet/mobile）
- 提取设计 token（颜色、字体、间距）
- 识别 UI 组件
- 保存到 `openspec/changes/<id>/design/`

**输出文件：**
```
openspec/changes/<id>/design/
├── README.md                    # 设计文档
├── design-tokens.json          # 设计 token
├── components-spec.json        # 组件规范
└── ui-mockups/
    ├── desktop.png             # 桌面端设计稿
    ├── tablet.png              # 平板端设计稿
    └── mobile.png              # 移动端设计稿
```

### 阶段 6.5: UI 验证

**自动执行：**
- 调用 Chrome DevTools MCP 截图
- 与设计稿进行视觉回归对比
- 检查设计 token 一致性
- 验证可访问性
- 生成详细报告

**输出文件：**
```
reports/ui-validation/<id>/
├── report.json                 # 详细数据
├── summary.md                  # 人工可读报告
├── screenshots/
│   ├── actual/                 # 实际截图
│   └── expected/               # 预期截图
└── diff/                       # 差异高亮图
```

## 🔄 常用场景

### 场景 1：新功能完整开发

```bash
# 1. 启动完整流程
./scripts/automated-workflow/start-workflow.sh \
  packages/product-designs/product/task-filter.md \
  --with-ui \
  --auto-approve

# 2. 在阶段 4 按提示实现代码（参考生成的设计稿）

# 3. 确保应用在 localhost:3000 运行

# 4. 继续完成后续阶段（UI 验证会自动执行）
```

### 场景 2：修复 UI 差异

```bash
# UI 验证失败后，查看报告
cat reports/ui-validation/<change-id>/summary.md

# 修改代码后重新验证（从阶段 6.5 开始）
./scripts/automated-workflow/start-workflow.sh \
  --phase 6 \
  --with-ui

# 或直接使用阶段脚本
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js <change-id>
```

### 场景 3：已有设计稿，跳过生成

```bash
# 手动创建设计目录和文件
mkdir -p openspec/changes/my-feature/design/ui-mockups
cp /path/to/designs/*.png openspec/changes/my-feature/design/ui-mockups/

# 运行工作流（MCP 会检测已有设计稿）
./scripts/automated-workflow/start-workflow.sh \
  --phase 3 \
  --with-ui
```

### 场景 4：CI/CD 集成

```bash
# CI 环境自动使用 Docker 模式
export CI=true
./scripts/automated-workflow/start-workflow.sh \
  feature.md \
  --with-ui \
  --auto-approve \
  --skip-push

# 或显式指定
./scripts/automated-workflow/start-workflow.sh \
  feature.md \
  --with-ui \
  --mcp-mode=docker \
  --auto-approve
```

## ⚙️ 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `APP_URL` | 应用 URL（用于 UI 验证） | `http://localhost:3000` |
| `PENCIL_MCP_ENDPOINT` | Pencil MCP SSE 端点 | `http://localhost:3001` |
| `CHROME_DEVTOOLS_MCP_ENDPOINT` | Chrome DevTools MCP SSE 端点 | `http://localhost:3002` |
| `CI` | CI 环境标志（自动启用 docker 模式） | - |

## 🛠️ MCP 模式详解

### auto 模式（推荐）

自动检测最佳模式：
```
有 CI 环境变量？    →  docker 模式
Docker 可用？       →  docker 模式
否则               →  stdio 模式
```

### stdio 模式

- **适用场景**：本地开发
- **特点**：直接启动 MCP 进程，随工作流结束而关闭
- **优点**：简单快速，无需 Docker
- **缺点**：进程重启后状态丢失

### docker 模式

- **适用场景**：CI/CD、稳定环境
- **特点**：使用 Docker Compose 启动服务
- **优点**：稳定、可扩展、状态持久化
- **缺点**：需要 Docker，启动稍慢

### none 模式

- **适用场景**：已有设计稿、纯后端功能
- **特点**：跳过 MCP 调用，仅生成文档框架
- **优点**：最快
- **缺点**：无设计生成和验证

## 📝 分阶段执行（调试/开发）

```bash
# 阶段 1-2.5: PRD → 提案 → UI 设计
node scripts/automated-workflow/phases/phase-1-parse-prd.js feature.md
node scripts/automated-workflow/phases/phase-2-generate-tests.js <change-id>
node scripts/automated-workflow/phases/phase-2.5-ui-design-sync.js <change-id>

# 查看生成的设计稿
ls openspec/changes/<change-id>/design/ui-mockups/

# 阶段 3-4: 审批 → 实现
node scripts/automated-workflow/phases/phase-3-approve.js <change-id>
# ... 手动实现代码 ...

# 阶段 5-6.5: 测试 → UI 验证
pnpm --filter web test:unit
node scripts/automated-workflow/phases/phase-6.5-ui-validation.js <change-id>

# 阶段 6-7: 提交 → 归档
node scripts/automated-workflow/phases/phase-5-verify-and-commit.js <change-id>
openspec archive <change-id> --yes
```

## 🔍 故障排除

### MCP 连接失败

```bash
# 测试 MCP 连接
pnpm workflow:test-mcp

# 如果失败，尝试：
# 1. 使用 --mcp-mode=none 跳过 UI 阶段
./scripts/automated-workflow/start-workflow.sh feature.md --with-ui --mcp-mode=none

# 2. 或手动启动 Docker MCP
pnpm mcp:up
./scripts/automated-workflow/start-workflow.sh feature.md --with-ui --mcp-mode=docker
```

### UI 验证失败

```bash
# 查看详细报告
cat reports/ui-validation/<change-id>/summary.md

# 查看差异图片
open reports/ui-validation/<change-id>/diff/desktop-diff.png

# 跳过 UI 验证继续
./scripts/automated-workflow/start-workflow.sh --phase 6 --with-ui --skip-ui-validate
```

### 应用未运行

```bash
# 在另一个终端启动应用
pnpm dev

# 或指定应用 URL
APP_URL=http://localhost:3001 ./scripts/automated-workflow/start-workflow.sh \
  feature.md --with-ui
```

## 📊 工作流对比

| 功能 | 原工作流 | 增强版（--with-ui） |
|------|---------|-------------------|
| PRD 解析 | ✅ | ✅ |
| 生成测试 | ✅ | ✅ |
| UI 设计生成 | ❌ | ✅ (阶段 2.5) |
| 提案审批 | ✅ | ✅ |
| 代码实现 | ✅ | ✅ (参考设计稿) |
| 测试验证 | ✅ | ✅ |
| 智能提交 | ✅ | ✅ |
| UI 验证 | ❌ | ✅ (阶段 6.5) |
| 归档 | 手动 | ✅ (阶段 7) |

## 🎉 总结

使用 `--with-ui` 标志即可启用完整的 UI 设计和验证流程：

```bash
# 一键启用
./scripts/automated-workflow/start-workflow.sh feature.md --with-ui
```

系统会自动：
1. 检测并启动 MCP Servers
2. 生成 UI 设计稿
3. 在代码实现后验证 UI 质量
4. 生成详细的验证报告
