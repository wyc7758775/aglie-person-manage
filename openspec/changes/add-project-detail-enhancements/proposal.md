# Change: 项目管理详情增强

## Why

当前项目管理模块已具备项目 CRUD、状态筛选、抽屉式详情编辑等基础能力。用户反馈希望功能更加清晰明了：项目描述支持富文本编辑、状态语义更贴近实际（正常/有风险/失控）、时间字段命名更准确（开始时间/截止时间）、详情界面减少干扰性操作入口。

## What Changes

- **项目描述**：将 textarea 替换为基于 Tiptap 的 Markdown 编辑器，支持标题、列表、粗体、链接等
- **项目状态**：从 planning/active/paused/completed 调整为 normal（正常）、at_risk（有风险）、out_of_control（失控）三值
- **时间字段**：UI 标签从「开始日期」「结束日期」改为「开始时间」「截止时间」；校验错误提示同步更新
- **项目详情抽屉**：移除底部删除按钮和「修改后自动保存」提示；删除仍通过项目卡片的「更多」菜单触发
- **国际化**：新增/更新 project.status.normal、at_risk、out_of_control；project.startTime、project.deadline；project.deadlineBeforeStart 等翻译键；**支持日文**（zh/en/ja）
- **示例数据**：删除现有项目数据，新增 7 个示例项目（使用新状态值）

## Impact

- **Affected specs**: project-management, i18n
- **Affected code**:
  - `app/lib/definitions.ts` - ProjectStatus 类型变更
  - `app/lib/projects.ts` - 状态筛选逻辑
  - `app/lib/placeholder-data.ts` - 删除现有项目，新增 7 个示例项目
  - `app/api/projects/` - 状态校验
  - `app/dashboard/project/page.tsx` - 筛选器、状态颜色
  - `app/dashboard/project/components/ProjectDrawer.tsx` - 描述编辑器、状态选项、时间标签、移除删除按钮与 autoSave 提示
  - `app/dashboard/project/components/EditableField.tsx` - 或新增 Markdown 编辑器组件
  - `app/lib/i18n/dictionary.*.ts` - 翻译字典（含新增 dictionary.ja.ts）
