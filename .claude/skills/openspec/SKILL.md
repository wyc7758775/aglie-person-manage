---
name: openspec
description: OpenSpec 规范驱动开发工作流。用于创建变更提案、实现变更、归档已完成变更。触发词：proposal、change、spec、创建提案、实现变更、归档变更。
metadata:
  version: "2.0.0"
---

# OpenSpec 规范驱动开发

## 基本规则
- 所有思考和注释用中文
- Always respond in 中文

## 三阶段工作流

### Stage 1：创建变更提案

**触发条件**：
- 添加新功能 / 破坏性变更 / 架构调整 / 性能优化 / 安全更新

**跳过提案直接修复**：
- Bug 修复 / 错别字 / 格式注释 / 依赖更新 / 配置调整 / 测试

**执行步骤**：
1. 阅读 `openspec/project.md`、运行 `openspec list`、`openspec list --specs`
2. 选择唯一的 kebab-case 动词开头的 `change-id`（如 `add-`、`update-`、`remove-`、`refactor-`）
3. 创建目录和文件：
   ```bash
   mkdir -p openspec/changes/<change-id>/specs/<capability>
   ```
4. 编写 `proposal.md`、`tasks.md`、可选的 `design.md`、delta spec 文件
5. 运行 `openspec validate <change-id> --strict` 并修复问题
6. **等待用户审批后再实现**

---

### Stage 2：实现变更

按顺序执行，每步完成后标记：
1. 阅读 `proposal.md` — 理解要构建什么
2. 阅读 `design.md`（如存在）— 技术决策
3. 阅读 `tasks.md` — 实现清单
4. 按顺序实现所有任务
5. 确认所有 task 完成
6. 更新 `tasks.md` 将所有 `- [ ]` 改为 `- [x]`
7. **未审批前不得开始实现**

---

### Stage 3：归档变更

部署后创建单独 PR：
```bash
openspec archive <change-id> --yes
openspec validate --strict
```
- 将 `changes/<name>/` 移动到 `changes/archive/YYYY-MM-DD-<name>/`
- 更新 `specs/` 中对应的 capability

---

## CLI 命令速查

```bash
# 查看状态
openspec list                          # 活跃变更列表
openspec list --specs                  # 规格说明列表
openspec show <item>                   # 查看变更或规格详情
openspec show <change> --json --deltas-only  # 调试 delta 解析

# 验证
openspec validate <change-id> --strict # 严格验证
openspec validate --strict             # 批量验证

# 归档
openspec archive <change-id> --yes     # 归档（非交互）
openspec archive <change-id> --skip-specs --yes  # 仅工具变更归档

# 项目管理
openspec init [path]                   # 初始化
openspec update [path]                 # 更新指令文件
```

### 命令参数
- `--json` — 机器可读输出
- `--type change|spec` — 指定类型
- `--strict` — 全面验证
- `--no-interactive` — 禁用交互提示
- `--skip-specs` — 归档时跳过 spec 更新
- `--yes`/`-y` — 跳过确认（自动化归档必加）

---

## 目录结构

```
openspec/
├── project.md              # 项目规范
├── specs/                  # 当前已构建的真相
│   └── <capability>/
│       ├── spec.md         # 需求和场景
│       └── design.md       # 技术模式（可选）
├── changes/                # 提案——应该变更什么
│   ├── <change-name>/
│   │   ├── proposal.md     # Why + What + Impact
│   │   ├── tasks.md        # 实现清单
│   │   ├── design.md       # 技术决策（可选）
│   │   └── specs/          # Delta 变更
│   │       └── <capability>/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # 已完成的变更
```

---

## 文件格式

### proposal.md
```markdown
# Change: <简短描述>

## Why
[1-2 句说明问题或机会]

## What Changes
- [变更列表]
- [破坏性变更标注 **BREAKING**]

## Impact
- Affected specs: [capability 列表]
- Affected code: [关键文件/系统]
```

### tasks.md
```markdown
## 1. Implementation
- [ ] 1.1 创建数据库 schema
- [ ] 1.2 实现 API 端点
- [ ] 1.3 添加前端组件
- [ ] 1.4 编写测试
```

### Delta Spec 格式（关键）

```markdown
## ADDED Requirements
### Requirement: 新功能名称
系统 SHALL 提供...

#### Scenario: 成功用例
- **WHEN** 用户执行操作
- **THEN** 预期结果

## MODIFIED Requirements
### Requirement: 已有功能名称
[完整的修改后需求，包含所有场景]

## REMOVED Requirements
### Requirement: 旧功能名称
**Reason**: [删除原因]
**Migration**: [迁移处理]
```

**场景格式（严格要求）**：
- ✅ 正确：`#### Scenario: 用户登录成功`（4个#号）
- ❌ 错误：`- **Scenario: ...**` 或 `### Scenario:` 或 `**Scenario**:`

每个 Requirement **必须**至少有一个 Scenario。

### ADDED vs MODIFIED 区分
- **ADDED**：全新的独立能力
- **MODIFIED**：修改现有需求行为（必须包含完整需求内容，包括之前的所有场景）
  - 步骤：从 `openspec/specs/<capability>/spec.md` 复制完整需求块 → 粘贴到 `## MODIFIED Requirements` 下 → 编辑

---

## 搜索指南

```bash
openspec spec list --long              # 枚举所有规格（推荐）
openspec list                          # 枚举活跃变更
rg -n "Requirement:|Scenario:" openspec/specs  # 全文搜索（仅在上述命令不够时使用）
```

---

## 常见错误排查

| 错误 | 原因 | 解决 |
|------|------|------|
| "Change must have at least one delta" | `changes/<name>/specs/` 不存在或无 .md | 检查目录和文件，确保有操作前缀 |
| "Requirement must have at least one scenario" | Scenario 格式错误 | 使用 `#### Scenario:` (4个#) |
| Silent scenario parsing failures | 格式不完全匹配 | `openspec show [change] --json --deltas-only` 调试 |

---

## 多 Capability 示例

```
openspec/changes/add-2fa-notify/
├── proposal.md
├── tasks.md
└── specs/
    ├── auth/
    │   └── spec.md   # ADDED: Two-Factor Authentication
    └── notifications/
        └── spec.md   # ADDED: OTP Email Notification
```

---

## 最佳实践

- 默认 < 100 行新代码
- 单文件实现，直到证明不够
- 避免无明确理由引入框架
- Capability 命名：动词-名词格式（如 `user-auth`、`payment-capture`）
- Change ID：kebab-case 动词开头，唯一（冲突时加 `-2`、`-3`）
