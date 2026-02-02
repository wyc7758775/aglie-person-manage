# 项目管理详情增强 - 实施任务

## 1. 数据模型与示例数据

- [x] 1.1 更新 `app/lib/definitions.ts` 中 ProjectStatus 为 `'normal' | 'at_risk' | 'out_of_control'`
- [x] 1.2 删除 `app/lib/placeholder-data.ts` 中现有项目数据，新增 7 个示例项目（使用新状态值 normal/at_risk/out_of_control）
- [x] 1.3 更新 `app/lib/projects.ts` 中状态筛选逻辑以支持新三值

## 2. API 层

- [x] 2.1 更新 `app/api/projects/route.ts` 中 status 校验为新三值
- [x] 2.2 更新 `app/api/projects/[id]/route.ts` 中 status 校验及 endDate 错误消息（使用 project.deadlineBeforeStart）

## 3. 国际化（含日文）

- [x] 3.1 在 `app/lib/i18n/dictionary.zh.ts` 中新增/更新：project.status.normal、at_risk、out_of_control；project.startTime、project.deadline；project.deadlineBeforeStart；project.form.descriptionPlaceholder
- [x] 3.2 在 `app/lib/i18n/dictionary.en.ts` 中同步上述翻译
- [x] 3.3 新增 `app/lib/i18n/dictionary.ja.ts`，提供日文翻译（状态：正常、リスクあり、制御不能；时间：開始日時、締切日時；占位符：Markdown 対応；校验：締切は開始日時より前には設定できません）
- [x] 3.4 更新 `app/lib/i18n/types.ts`、`dictionary.ts`、`context.tsx` 及语言切换 UI，支持 `ja-JP` 日文
- [x] 3.5 移除或保留 project.autoSave 引用（UI 不再展示，可保留空字符串）

## 4. Tiptap Markdown 编辑器

- [x] 4.1 安装 Tiptap 依赖：`@tiptap/react`、`@tiptap/starter-kit`、`@tiptap/extension-placeholder` 等
- [x] 4.2 创建 Markdown 编辑器组件（或扩展现有 EditableField 支持 type="markdown"）
- [x] 4.3 在 ProjectDrawer 中将描述字段从 textarea 替换为 Tiptap MD 编辑器
- [x] 4.4 确保描述内容 XSS 过滤（Tiptap 默认处理）

## 5. 项目详情抽屉 UI

- [x] 5.1 将 ProjectDrawer 中状态选项改为 normal、at_risk、out_of_control
- [x] 5.2 将时间字段标签改为「开始时间」「截止时间」（使用 project.startTime、project.deadline）
- [x] 5.3 移除 ProjectDrawer 底部删除按钮
- [x] 5.4 移除 ProjectDrawer 底部「修改后自动保存」提示（t('project.autoSave')）
- [x] 5.5 确认删除仍可通过项目卡片「更多」菜单触发

## 6. 项目列表页

- [x] 6.1 更新 `app/dashboard/project/page.tsx` 中 filters 为 All、Normal、At Risk、Out of Control
- [x] 6.2 更新 getStatusColor 以支持新三值
- [x] 6.3 更新 ProjectForm（若仍使用）中的状态选项与时间标签

## 7. 校验与验收

- [x] 7.1 截止时间早于开始时间时显示 project.deadlineBeforeStart 错误提示
- [x] 7.2 运行 `pnpm build` 验证构建成功
- [x] 7.3 手动验证：描述可输入并渲染 Markdown、状态下拉仅显示三值、时间标签正确、详情底部无删除与 autoSave 提示
