# OpenSpec 实现变更

实现 OpenSpec 变更：$ARGUMENTS

## 执行流程

### 前置确认
确认该变更提案已通过用户审批，否则停止并说明原因。

### 按顺序完成以下步骤（逐一完成，勿跳过）

**Step 1** — 阅读 `openspec/changes/<change-id>/proposal.md`
理解要构建什么、为什么构建、影响范围。

**Step 2** — 阅读 `openspec/changes/<change-id>/design.md`（如存在）
理解技术决策、架构选型、迁移方案。

**Step 3** — 阅读 `openspec/changes/<change-id>/tasks.md`
获取完整实现清单，按顺序逐一完成。

**Step 4** — 阅读受影响的规格
```bash
openspec show <change-id> --json --deltas-only
```
阅读 `openspec/specs/<capability>/spec.md` 了解现有规格。

**Step 5** — 实现所有任务
- 严格按 tasks.md 顺序执行
- 每完成一个子任务，在对话中标记进度
- 遇到问题立即停止并说明

**Step 5.5** — Playwriter 自动验证（Stage 2.5）
代码实现完成后，**必须自动执行 Playwriter 验证**：

1. **检查前置条件**：
   - Chrome 浏览器已打开且 Playwriter extension 已启用
   - 如果不可用，跳过此步骤并在 tasks.md 中标记为"需手动验证"

2. **执行验证**：
   - 如果存在 `verify.mjs`，使用其定义的场景
   - 如果不存在，根据 proposal.md 自动生成验证场景：
     - 登录相关：验证登录/注册流程
     - 表单相关：验证提交/校验逻辑
     - 页面跳转：验证导航正确性

3. **记录结果**：
   - 将验证结果更新到 tasks.md 的验证部分
   - 所有场景通过后才能进入下一步

4. **验证命令**：
   ```
   使用 mcp__playwriter__execute 工具执行验证
   ```

**Step 6** — 验证实现
确认 tasks.md 中每一项均已完成，无遗漏。

**Step 7** — 更新 tasks.md
将所有 `- [ ]` 改为 `- [x]`，反映实际完成状态。

**Step 8** — 提示归档
告知用户实现已完成，可以运行 `/openspec-archive <change-id>` 进行归档。
