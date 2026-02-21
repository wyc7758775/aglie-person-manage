# Change: 添加敏捷开发中的迭代界面

## Why

当前项目详情页仅提供需求、任务、缺陷三个 Tab，缺少敏捷开发中的**迭代（Sprint/Iteration）**维度。迭代是敏捷里规划与交付的基本时间单元，用户需要按迭代查看与规划工作。将迭代与需求、任务置于同一层级（项目详情页 Tab），可在一处完成「选项目 → 看迭代 → 看需求/任务」的动线。

## What Changes

- **数据层**：在 `app/lib/definitions.ts` 中新增迭代（Iteration）类型；在数据库（PostgreSQL）中新增迭代表，归属项目（projectId）。
- **API 层**：提供迭代 CRUD：`GET/POST /api/iterations?projectId=xxx`、`GET/PUT/DELETE /api/iterations/[id]`。
- **UI 层**：在项目详情页（`/dashboard/project/[projectId]`）增加「迭代」Tab，与需求、任务、缺陷同级；迭代 Tab 内提供迭代列表（及可选简单看板/时间线），支持创建、编辑、删除迭代。
- **导航与路由**：项目详情页 Tab 枚举扩展为 `requirement | task | defect | iteration`，URL 支持 `?tab=iteration`；不改变一级主导航（仍为概览、项目、奖励等）。

## Impact

- **新增规范**：`specs/iteration-management/spec.md`（迭代数据模型、API、迭代列表与基础视图）
- **受影响规范**：`specs/project-management/spec.md`（项目详情页顶部栏与 Tab 内容中增加迭代 Tab）
- **受影响代码**：
  - `app/lib/definitions.ts` — 新增 Iteration 类型
  - `app/lib/db.ts` 或等价数据层 — 迭代表与 CRUD
  - `app/api/iterations/route.ts`、`app/api/iterations/[id]/route.ts` — 新增
  - `app/dashboard/project/[projectId]/page.tsx` — 增加 iteration Tab 与内容区
  - `app/ui/dashboard/` — 迭代列表/卡片组件（及可选视图）
  - `app/lib/i18n/` — 迭代相关文案与 i18n key
