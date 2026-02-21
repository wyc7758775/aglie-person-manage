# Change: Update Slow-Burn Project Fields

## Why

当前项目类型 `slow-project` 的命名不够准确地表达其业务含义。Slow-burn（慢燃）更贴切地描述了这种项目的特性：缓慢而持续地积累，带有明确的目的性。同时，现有时间字段包含结束时间，而 slow-burn 项目本质上是持续积累型的，不需要固定截止日期。此外，slow-burn 项目需要一个指标系统来衡量进度和价值。

## What Changes

- **BREAKING**: 将项目类型从 `slow-project` 重命名为 `slow-burn`，更准确地表达"有目的的积累"概念
- **BREAKING**: 移除 slow-burn 项目的结束时间字段，仅保留开始时间
- 统一所有时间展示为年月日格式（YYYY/MM/DD）
- 为 slow-burn 项目引入指标体系，支持多维度追踪进度
- 优化富文本编辑器，使用 Tiptap 全家桶提升 Markdown 编辑体验

## Impact

- Affected specs: `project-management`, `i18n`, `ui-components`
- Affected code: 
  - `app/lib/definitions.ts` - 类型定义更新
  - `app/api/projects/` - API 端点更新
  - `app/dashboard/project/` - 前端组件更新
  - Database schema - 添加 indicators 字段
  - i18n dictionaries - 翻译键更新
