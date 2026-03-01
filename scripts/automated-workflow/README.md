# 自动化工作流系统

基于 OpenSpec + AI 的完整自动化开发工作流。

## 架构概览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           自动化工作流系统                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   PRD Markdown                                                              │
│        │                                                                    │
│        ▼                                                                    │
│   ┌─────────────────┐                                                       │
│   │ 阶段 1: 解析 PRD │ ──► openspec/changes/<id>/                          │
│   └─────────────────┘     ├── proposal.md                                   │
│        │                  ├── tasks.md                                      │
│        │                  └── specs/<capability>/spec.md                    │
│        ▼                                                                    │
│   ┌──────────────────┐                                                      │
│   │ 阶段 2: 生成测试  │ ──► apps/e2e/tests/                                 │
│   └──────────────────┘     ├── functional/<id>/                             │
│        │                   ├── contract/                                    │
│        │                   ├── security/                                    │
│        │                   └── accessibility/                               │
│        ▼                                                                    │
│   ┌──────────────────┐                                                      │
│   │ 阶段 3: 提案审批  │ ──► 用户确认/自动批准                                │
│   └──────────────────┘                                                      │
│        │                                                                    │
│        ▼                                                                    │
│   ┌──────────────────┐     ┌─────────────────┐                             │
│   │ 阶段 4: 代码实现  │ ◄── │ AI 集成模块      │                             │
│   └──────────────────┘     │ (Kimi Code CLI) │                             │
│        │                   └─────────────────┘                             │
│        │                                                                    │
│        ▼                                                                    │
│   ┌──────────────────┐                                                      │
│   │ 阶段 5: 验证提交  │ ──► 智能分批提交 + git push                         │
│   └──────────────────┘                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 快速开始

### 完整自动化流程

```bash
# 从 PRD 文件开始完整工作流
./scripts/automated-workflow/start-workflow.sh packages/product-designs/product/feature-x.md

# 自动批准模式（跳过人工确认）
./scripts/automated-workflow/start-workflow.sh feature.md --auto-approve

# 从指定阶段开始
./scripts/automated-workflow/start-workflow.sh feature.md --phase 3
```

### 分阶段执行

```bash
# 阶段 1: 解析 PRD 并生成提案
node scripts/automated-workflow/phases/phase-1-parse-prd.js packages/product-designs/product/feature-x.md

# 阶段 2: 生成测试用例
node scripts/automated-workflow/phases/phase-2-generate-tests.js <change-id>

# 阶段 3: 提案审批
node scripts/automated-workflow/phases/phase-3-approve.js <change-id>

# 阶段 4: 代码实现（AI/人工）
node scripts/automated-workflow/phases/phase-4-implement.js <change-id>

# 阶段 5: 验证并提交
node scripts/automated-workflow/phases/phase-5-verify-and-commit.js <change-id>
```

### 查看工作流状态

```bash
# 查看所有活跃提案状态
node scripts/automated-workflow/workflow-status.js

# 查看归档提案
node scripts/automated-workflow/workflow-status.js --archive
```

## 配置文件

`.workflow-config.json` - 工作流全局配置：

```json
{
  "approval": {
    "auto_approve_proposal": false
  },
  "testing": {
    "max_test_retries": 3,
    "auto_fix_on_failure": true
  },
  "commit": {
    "push_on_success": true,
    "auto_archive": false
  },
  "ai": {
    "enabled": true,
    "auto_implement": false
  }
}
```

## CI/CD 集成

GitHub Actions 工作流配置在 `.github/workflows/automated-workflow.yml`：

```bash
# 手动触发工作流
github workflow run automated-workflow.yml \
  -f prd_file=packages/product-designs/product/feature.md \
  -f auto_approve=true
```

## 目录结构

```
scripts/automated-workflow/
├── README.md                    # 本文档
├── start-workflow.sh           # 主入口脚本
├── workflow-status.js          # 状态监控工具
├── ai-integration.js           # AI 集成模块
├── lib/
│   ├── logger.sh              # 日志工具
│   └── utils.sh               # 通用工具
└── phases/
    ├── phase-1-parse-prd.js        # 解析 PRD
    ├── phase-2-generate-tests.js   # 生成测试
    ├── phase-3-approve.js          # 提案审批
    ├── phase-4-implement.js        # 代码实现
    └── phase-5-verify-and-commit.js # 验证提交
```

## 环境要求

- Node.js 18+
- pnpm
- openspec CLI (`npm install -g @openspec/cli`)
- Playwright (`pnpm exec playwright install`)
- git
- (可选) Kimi Code CLI (`npm install -g kimi-cli`)

## 工作流程详解

### 阶段 1: PRD 解析

1. 读取 Markdown PRD 文件
2. 提取标题、描述、需求、场景
3. 识别能力域 (capabilities)
4. 生成 OpenSpec 目录结构
5. 创建 proposal.md、tasks.md、specs/

### 阶段 2: 测试生成

1. 读取 OpenSpec specs/
2. 解析场景 (Scenario)
3. 生成四类测试：
   - Functional: 功能测试
   - Contract: API 契约测试
   - Security: 安全测试
   - Accessibility: 可访问性测试

### 阶段 3: 审批

1. 显示提案摘要
2. 等待用户确认
3. 标记为 APPROVED
4. (可选) 自动批准模式

### 阶段 4: 实现

1. 读取 tasks.md
2. 逐个实现任务
3. 支持 AI 集成 (Kimi Code CLI)
4. 更新任务状态

### 阶段 5: 验证与提交

1. 运行构建验证
2. 运行单元测试
3. 运行 E2E 测试
4. 自动修复（失败时重试）
5. 分析 git diff
6. 智能分批提交
7. 推送到远程

## 智能提交规则

根据文件变更自动分组：

| 文件类型 | Commit 类型 | 图标 |
|---------|------------|------|
| 功能代码 | feat(feature) | ✨ |
| API 路由 | feat(api) | ✨ |
| 测试文件 | test(e2e) | ✅ |
| 文档 | docs(openspec) | 📝 |
| 重构 | refactor(feature) | ♻️ |

## 扩展开发

### 添加新的 AI 集成

编辑 `ai-integration.js`：

```javascript
async function implementWithCustomAI(changeId) {
  const prompt = generatePrompt(changeId);
  // 调用你的 AI API
  // ...
}
```

### 自定义测试生成

编辑 `phase-2-generate-tests.js` 中的生成函数。

## 故障排除

### openspec validate 失败

```bash
# 查看详细错误
openspec show <change-id> --json --deltas-only

# 检查场景格式
# 必须是 #### Scenario: 标题 (4个#)
```

### 测试生成失败

```bash
# 检查 specs/ 目录是否存在
ls openspec/changes/<change-id>/specs/

# 手动创建默认测试
node scripts/automated-workflow/phases/phase-2-generate-tests.js <change-id>
```

### 提交失败

```bash
# 检查 git 状态
git status

# 手动提交
node scripts/automated-workflow/phases/phase-5-verify-and-commit.js <change-id> --skip-push
```

## License

MIT
