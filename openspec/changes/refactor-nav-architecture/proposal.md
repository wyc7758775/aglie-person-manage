# Change: 导航架构调整

## Why

当前系统导航中，项目、需求、任务、缺陷处于同一层级（一级导航），用户需在侧边栏频繁切换才能在不同项目下查看需求、任务或缺陷。这种平铺结构无法体现「需求、任务、缺陷隶属于项目」的业务关系，且项目切换时缺乏上下文感知。

## What Changes

- **一级导航重构**：侧边栏仅保留概览、项目、奖励、通知、设置；需求、任务、缺陷从一级导航移除
- **项目列表页**：点击项目卡片进入项目详情页（`/dashboard/project/[projectId]`），而非打开抽屉；抽屉仍可通过卡片「更多」菜单的「编辑」触发
- **项目详情页**：新增 `/dashboard/project/[projectId]` 页面，顶部栏包含文件夹图标、面包屑、项目名、下拉菜单，以及需求/任务/缺陷 Tab
- **返回项目列表**：点击文件夹图标或下拉菜单中的「返回项目列表」跳转至 `/dashboard/project`
- **项目切换**：项目名下拉菜单支持切换至另一项目
- **Tab 内容**：需求、任务、缺陷 Tab 分别展示当前项目下的内容，按 `projectId` 筛选
- **数据模型与 API**：Requirement/Task/Defect 新增 `projectId` 字段；需求 API 扩展 projectId 筛选；新建任务 API、缺陷 API，支持 projectId 筛选
- **旧路径重定向**：直接访问 `/dashboard/requirement`、`/dashboard/task`、`/dashboard/defect` 时重定向至 `/dashboard/project`
- **国际化**：新增 `projectDetail` 模块，按 i18n.md 提供中/英/日翻译

## Impact

- **Affected specs**: navigation, project-management, i18n, requirement-management, task-management, defect-management
- **Affected code**:
  - `app/ui/dashboard/topnav.tsx`（或 SideNav）— 一级导航项调整
  - `app/ui/dashboard/NavMenu.tsx` — 若存在，同步移除需求/任务/缺陷
  - `app/dashboard/project/page.tsx` — 项目卡片点击行为改为路由跳转
  - `app/dashboard/project/[projectId]/` — 新建项目详情页及布局
  - `app/lib/definitions.ts` — Requirement 新增 projectId；新增 Task、Defect 类型及 projectId
  - `app/lib/placeholder-data.ts` — requirements 补充 projectId；新增 tasks、defects 数据
  - `app/lib/requirements.ts` — getRequirements 支持 projectId 筛选
  - `app/api/requirements/route.ts` — GET 支持 `?projectId=xxx`
  - 新建 `app/lib/tasks.ts`、`app/api/tasks/route.ts` — 任务 CRUD 及 projectId 筛选
  - 新建 `app/lib/defects.ts`、`app/api/defects/route.ts` — 缺陷 CRUD 及 projectId 筛选
  - `app/lib/i18n/dictionary.*.ts` — 新增 `projectDetail` 翻译
  - 中间件或路由 — 旧路径重定向
