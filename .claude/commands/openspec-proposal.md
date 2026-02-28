# OpenSpec 创建变更提案

为功能需求 "$ARGUMENTS" 创建 OpenSpec 变更提案。

## 执行流程

### 1. 了解当前上下文
```bash
openspec list
openspec list --specs
```
阅读 `openspec/project.md` 了解项目规范。

### 2. 检查是否已有相关变更或规格
- 搜索已有的 changes 目录，避免重复
- 使用 `openspec show <spec>` 查看受影响的规格

### 3. 选择 change-id
- kebab-case，动词开头：`add-`、`update-`、`remove-`、`refactor-`
- 确保唯一，冲突时加 `-2`

### 4. 创建提案结构
```bash
mkdir -p openspec/changes/<change-id>/specs/<capability>
```

创建以下文件：
- `proposal.md` — Why / What Changes / Impact
- `tasks.md` — 实现清单（全部 `- [ ]`）
- `design.md` — 可选，满足以下任一条件时创建：
  - 跨模块/服务的架构变更
  - 新外部依赖或重大数据模型变更
  - 安全、性能或迁移复杂度高
  - 需要在编码前做技术决策

### 5. 编写 Delta Spec
在 `openspec/changes/<change-id>/specs/<capability>/spec.md` 中使用：
- `## ADDED Requirements` — 新能力
- `## MODIFIED Requirements` — 修改已有需求（必须粘贴完整原始内容后编辑）
- `## REMOVED Requirements` — 废弃功能

每个 Requirement 必须有至少一个 `#### Scenario:` (4个#号)。

### 6. 验证
```bash
openspec validate <change-id> --strict
```
修复所有报错后再提交提案。

### 7. 提交给用户审批
列出提案摘要，**等待用户批准后再实现**。
