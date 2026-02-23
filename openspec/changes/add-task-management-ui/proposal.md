# Change: 添加任务管理界面

## Why
目前系统已有项目管理和需求管理功能，但任务管理（日常任务、习惯、待办事项）是用户日常使用最频繁的核心功能。根据 pencil 设计稿，需要实现一套完整的任务列表、创建、详情、编辑界面，以及相应的筛选和搜索功能。

## What Changes
- 创建任务管理页面 (`/dashboard/tasks`)
- 实现三种任务类型（日常任务、习惯、待办事项）的列表展示
- 实现任务创建抽屉面板（支持三种类型切换）
- 实现任务详情抽屉面板（含游戏属性展示）
- 实现任务编辑抽屉面板
- 实现列表筛选和搜索功能
- 实现数据持久化（独立表结构存储三种任务类型）

## Impact
- **Affected specs**: task-management（新增）、ui-components（更新）
- **Affected code**: 
  - `apps/web/app/dashboard/tasks/` - 任务页面
  - `apps/web/app/ui/tasks/` - 任务相关组件
  - `apps/web/app/api/tasks/` - 任务 API
  - `apps/web/app/lib/db.ts` - 数据库操作
  - `apps/web/app/lib/definitions.ts` - 类型定义

## Reference
- UI 设计参考 pencil Node IDs: OcsmI, sBfMx, 2RaWt, FX7ab, AJhSP, Mq8Pk, 6hvSW, TvQyQ, v6EZ2, E4IoS
- 排除：过滤器部分和顶部菜单部分（已存在）
