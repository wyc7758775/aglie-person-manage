# OpenSpec 查看状态

查看当前 OpenSpec 工作区状态。

## 执行

```bash
# 活跃变更列表
openspec list

# 规格说明列表
openspec list --specs
```

汇总显示：
1. **活跃变更**：列出所有 `openspec/changes/` 中的未归档变更，并说明每个变更的当前阶段（草稿/待审批/实现中/待归档）
2. **现有规格**：列出所有 `openspec/specs/` 中的 capability
3. **建议下一步**：根据当前状态给出行动建议

如需查看特定变更详情：
```bash
openspec show <change-id>
openspec show <change-id> --json --deltas-only  # 调试用
```

如需验证：
```bash
openspec validate <change-id> --strict
openspec validate --strict  # 全量验证
```
