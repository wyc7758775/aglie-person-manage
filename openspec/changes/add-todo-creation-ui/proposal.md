# Change: 新建待办事项界面

## Why
当前系统仅支持基础的任务管理（Task），但缺少面向个人用户的待办事项（To-Do）功能。用户需要一个结构化、游戏化、协作化的待办事项任务卡片系统，支持任务全生命周期管理，并集成积分激励机制以提升积极性。

## What Changes
- 新增待办事项（To-Do）数据模型，扩展现有 Task 类型，支持状态、优先级、积分、子任务、关联任务等字段
- 新增待办事项创建抽屉 UI，严格按照 Pencil MCP Node IDs (v6EZ2, oNMhQ) 的设计实现
- 新增子任务管理功能（Tab 页）
- 新增关联任务功能（Tab 页）
- 新增评论与操作记录功能（Tab 页）
- 新增积分奖励机制

## Impact
- Affected specs: todo-management（新增）
- Affected code:
  - `apps/web/app/lib/definitions.ts` - 类型定义扩展
  - `apps/web/app/lib/db.ts` - 数据库操作扩展
  - `apps/web/app/api/todos/` - 新增 API 路由
  - `apps/web/app/ui/dashboard/todo-*` - 新增 UI 组件
  - `apps/web/app/dashboard/project/[projectId]/todos/` - 新增页面

## Design Reference
UI 设计文件: `/Users/wuyucun/Documents/untitled.pen`
- Node ID `v6EZ2`: 新建待办事项面板（主容器）
- Node ID `oNMhQ`: 待办事项创建抽屉（核心组件）
- Node ID `u6Jf1`: 任务列表页
- Node ID `FX7ab`: 新建任务面板
- Node ID `AJhSP`: 任务详情面板
- Node ID `6hvSW`: 新建习惯面板
