# OpenSpec 归档变更

归档已完成的 OpenSpec 变更：$ARGUMENTS

## 执行流程

### 1. 确认变更已完成
检查 `openspec/changes/<change-id>/tasks.md`，确认所有任务均为 `- [x]`。

### 2. 执行归档
```bash
openspec archive <change-id> --yes
```

若为纯工具/配置变更（不影响 specs），使用：
```bash
openspec archive <change-id> --skip-specs --yes
```

### 3. 验证归档结果
```bash
openspec validate --strict
```
确认归档后的变更通过验证。

### 4. 确认目录移动
变更目录从 `changes/<name>/` 移动到 `changes/archive/YYYY-MM-DD-<name>/`。

### 5. 提交变更
```bash
git add openspec/
git commit -m "📦 chore(openspec): 归档变更 <change-id>"
```

### 注意事项
- 归档应在部署后单独创建 PR
- 如 specs 有更新，确认 `openspec/specs/` 中对应文件已同步
