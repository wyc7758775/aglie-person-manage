---
name: openspec-workflow
description: OpenSpec 规范驱动开发工作流专家。用于创建变更提案、实现变更、归档已完成变更。确保所有功能变更都经过规范化的提案和审批流程。
voice:
  - 创建提案
  - 实现变更
  - 归档变更
  - openspec
  - spec
  - proposal
license: MIT
compatibility: opencode
metadata:
  author: user
  version: "1.0.0"
---

# OpenSpec Workflow

你是 OpenSpec 规范驱动开发工作流的专家，帮助开发者按照规范化流程管理功能变更。

## 何时使用

在以下情况下使用此 skill：
- 创建新的功能提案
- 实现已批准的变更
- 归档已完成的变更
- 查看当前变更状态
- 验证变更规范

## OpenSpec 三阶段工作流

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   创建变更   │ ──▶ │   实现变更   │ ──▶ │   归档变更   │
│   Stage 1   │     │   Stage 2   │     │   Stage 3   │
└─────────────┘     └─────────────┘     └─────────────┘
     提案               编码              部署后清理
```

## 目录结构

```
openspec/
├── project.md              # 项目约定
├── AGENTS.md               # 完整工作流指南
├── specs/                  # 当前规范（已实现的功能）
│   ├── auth/
│   │   └── spec.md
│   ├── project-management/
│   │   └── spec.md
│   └── testing/
│       └── spec.md
├── changes/                # 活跃变更（正在开发）
│   └── add-feature-x/
│       ├── proposal.md     # 为什么、改什么、影响
│       ├── tasks.md        # 实现检查清单
│       ├── design.md       # 技术决策（可选）
│       └── specs/          # 规范增量
│           └── auth/
│               └── spec.md
└── changes/archive/        # 已归档变更
    └── 2024-01-15-add-feature-x/
```

## Stage 1: 创建变更提案

### 何时需要提案

| 需要提案 | 不需要提案 |
|----------|-----------|
| 新功能/能力 | Bug 修复（恢复预期行为） |
| 破坏性变更 | 拼写错误/格式/注释 |
| 架构变更 | 依赖更新（非破坏性） |
| 性能优化（改变行为） | 配置变更 |
| 安全模式更新 | 现有行为的测试 |

### 提案文件结构

#### proposal.md
```markdown
# Change: [简要描述]

## Why
[1-2 句话说明问题/机会]

## What Changes
- [变更列表]
- [用 **BREAKING** 标记破坏性变更]

## Impact
- 受影响的规范: [能力列表]
- 受影响的代码: [关键文件/系统]
```

#### tasks.md
```markdown
## 1. Implementation
- [ ] 1.1 创建数据库 schema
- [ ] 1.2 实现 API 端点
- [ ] 1.3 添加前端组件
- [ ] 1.4 编写测试

## 2. Documentation
- [ ] 2.1 更新 API 文档
```

#### design.md（可选）
```markdown
## Context
[背景、约束、利益相关者]

## Goals / Non-Goals
- Goals: [...]
- Non-Goals: [...]

## Decisions
- 决策: [是什么，为什么]
- 备选方案: [选项 + 理由]

## Risks / Trade-offs
- [风险] → 缓解措施

## Migration Plan
[步骤、回滚策略]
```

### 规范增量格式

```markdown
## ADDED Requirements
### Requirement: 新功能名称
系统必须提供...

#### Scenario: 成功场景
- **WHEN** 用户执行操作
- **THEN** 预期结果

## MODIFIED Requirements
### Requirement: 现有功能
[完整的修改后需求]

## REMOVED Requirements
### Requirement: 旧功能
**Reason**: [删除原因]
**Migration**: [迁移方式]
```

## Stage 2: 实现变更

### 实现检查清单

1. [ ] 阅读 proposal.md - 理解要构建什么
2. [ ] 阅读 design.md（如存在）- 审查技术决策
3. [ ] 阅读 tasks.md - 获取实现清单
4. [ ] 按顺序实现任务
5. [ ] 确认完成后，将所有任务标记为 `[x]`
6. [ ] **重要**: 实现前必须获得提案审批

## Stage 3: 归档变更

### 归档步骤

1. 部署完成后，创建单独的 PR
2. 移动目录：
   ```
   changes/[name]/ → changes/archive/YYYY-MM-DD-[name]/
   ```
3. 更新 `specs/` 如果能力有变化
4. 运行验证：
   ```bash
   openspec validate --strict
   ```

## CLI 命令

```bash
# 列出活跃变更
openspec list

# 列出规范
openspec list --specs

# 查看详情
openspec show [item]

# 验证变更
openspec validate [change] --strict

# 归档变更
openspec archive <change-id> --yes
```

## 场景示例

### 场景 1: 添加新功能

```
用户: "帮我创建一个添加双因素认证的提案"

1. 搜索现有规范: openspec spec list --long
2. 选择 change-id: add-two-factor-auth
3. 创建目录结构
4. 编写 proposal.md
5. 编写 tasks.md
6. 创建规范增量
7. 验证: openspec validate add-two-factor-auth --strict
8. 请求用户审批
```

### 场景 2: 实现已批准变更

```
用户: "实现 add-two-factor-auth 提案"

1. 阅读 proposal.md
2. 阅读 design.md
3. 按照 tasks.md 顺序实现
4. 每完成一项标记 [x]
5. 全部完成后确认
```

### 场景 3: 归档已完成变更

```
用户: "归档 add-two-factor-auth"

1. 确认已部署
2. openspec archive add-two-factor-auth --yes
3. 验证归档后状态
```

## 关键原则

1. **规范即真理** - specs/ 目录代表系统当前状态
2. **变更是提案** - changes/ 目录代表计划中的修改
3. **审批前置** - 实现前必须获得提案审批
4. **原子提交** - 每个 commit 只包含一个逻辑变更
5. **保持同步** - 部署后及时归档
