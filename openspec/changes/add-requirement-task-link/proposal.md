# Change: 需求详情关联任务功能

## Why
当前需求详情页面已经预留了"关联任务"区域，但只是一个占位符，无法实现真正的任务关联功能。为了完善需求管理工作流，需要将需求与具体任务进行关联，便于追踪需求的实现进度和任务分配情况。

## What Changes
- 新增关联任务模态框组件（LinkTaskModal）
- 实现任务搜索和选择功能
- 实现需求与任务的关联存储（使用已存在的 related_tasks 字段）
- 新增 API 端点获取可关联的任务列表
- 新增 API 端点更新需求的关联任务
- 在需求详情面板显示已关联任务列表

## Impact
- Affected specs: requirement-management
- Affected code:
  - `apps/web/app/ui/dashboard/` - 新增 LinkTaskModal 组件
  - `apps/web/app/ui/dashboard/requirement-slide-panel.tsx` - 集成关联任务功能
  - `apps/web/app/api/requirements/[id]/tasks/` - 新增任务关联 API
  - `apps/web/app/api/tasks/` - 新增任务查询 API（支持搜索和过滤）
  - `apps/web/app/lib/db.ts` - 更新任务查询函数
  - `apps/web/app/lib/definitions.ts` - 添加关联任务相关类型

## Reference
- Pencil 设计: Node ID RI4aJ (LinkTaskModal)
- 数据库字段: requirements.related_tasks (JSONB)
