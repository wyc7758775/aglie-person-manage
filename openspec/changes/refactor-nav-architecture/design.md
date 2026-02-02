# 导航架构调整 - 设计文档

## Context

基于 `product-designs/导航架构调整-20260202/prd.md` 与 `i18n.md`，对 Dashboard 导航与项目详情视图进行重构。当前实现中，项目、需求、任务、缺陷处于同一层级（一级导航），用户需频繁切换才能在不同项目下查看需求/任务/缺陷。项目卡片点击打开 ProjectDrawer，无独立项目详情页。

## Goals / Non-Goals

- **Goals**：重构导航层级、新增项目详情页、提升项目上下文感知、减少导航跳转次数
- **Non-Goals**：习惯、每日、待办在导航中的最终归属（本期可保留在概览内）；项目详情页内新建需求/任务/缺陷的快捷入口优化

## Decisions

### 1. 一级导航结构

- **Decision**：侧边栏仅保留概览、项目、奖励、通知、设置；需求、任务、缺陷从一级导航移除
- **Rationale**：体现「需求、任务、缺陷隶属于项目」的业务关系，简化主导航
- **Implementation**：修改 `app/ui/dashboard/topnav.tsx` 中 `mainLinks`，移除 requirement、task、defect 三项

### 2. 项目卡片点击行为

- **Decision**：点击项目卡片跳转至 `/dashboard/project/[projectId]`，不再打开 ProjectDrawer
- **Rationale**：进入项目详情页，在项目上下文中查看需求/任务/缺陷
- **Implementation**：项目卡片 `onClick` 改为 `router.push(`/dashboard/project/${project.id}`)`；ProjectDrawer 仍通过卡片「更多」菜单的「编辑」触发

### 3. 项目详情页路由与布局

- **Decision**：新建 `/dashboard/project/[projectId]` 动态路由，顶部栏布局：文件夹图标 > 项目名 ∨ | 需求 | 任务 | 缺陷
- **Rationale**：与 PRD 视觉参考一致，Tab 切换不整页刷新
- **Implementation**：新建 `app/dashboard/project/[projectId]/page.tsx`，顶部栏组件 + Tab 内容区；Tab 通过 query `?tab=requirement|task|defect` 控制，默认 `requirement`

### 4. 返回项目列表与项目切换

- **Decision**：文件夹图标点击跳转 `/dashboard/project`；项目名下拉菜单展示项目列表 +「返回项目列表」选项
- **Rationale**：提供明确的返回入口，支持快速切换项目
- **Implementation**：文件夹图标使用 `Link` 或 `router.push`；项目名使用 Dropdown 组件，列表项为 `Link` 或 `router.push`

### 5. 需求/任务/缺陷数据模型与 API 扩展（本期完整实现）

- **Decision**：本期完整实现 projectId 关联。Requirement、Task、Defect 类型新增 `projectId: string` 字段；placeholder 数据补充 projectId；需求 API 扩展 projectId 筛选；新建任务 API、缺陷 API，支持 projectId 筛选；创建/更新时必填 projectId
- **Rationale**：PRD 要求按项目筛选，需真实数据关联；当前 Requirement 无 projectId，Task/Defect 无 API 与统一类型定义，本期一并补齐
- **Implementation**：
  - `app/lib/definitions.ts`：Requirement 新增 projectId；新增 Task、Defect 类型及 projectId
  - `app/lib/placeholder-data.ts`：requirements 补充 projectId；新增 tasks、defects 数据及 projectId
  - `app/lib/requirements.ts`：getRequirements 支持 projectId 筛选；createRequirement 接收 projectId
  - `app/api/requirements/route.ts`：GET 支持 `?projectId=xxx`
  - 新建 `app/lib/tasks.ts`、`app/api/tasks/route.ts`：任务 CRUD 及 projectId 筛选
  - 新建 `app/lib/defects.ts`、`app/api/defects/route.ts`：缺陷 CRUD 及 projectId 筛选

### 6. 旧路径重定向

- **Decision**：直接访问 `/dashboard/requirement`、`/dashboard/task`、`/dashboard/defect` 时重定向至 `/dashboard/project`
- **Rationale**：兼容旧书签与外部链接
- **Implementation**：在 `app/dashboard/requirement/page.tsx` 等使用 `redirect()`，或通过 middleware 统一处理

### 7. 缺陷 Tab 与项目类型

- **Decision**：code 类型项目显示缺陷 Tab；life 类型可隐藏缺陷 Tab 或显示「仅代码项目有缺陷」提示
- **Rationale**：PRD 规定 life 项目无缺陷概念

### 8. 国际化

- **Decision**：新增 `projectDetail` 模块，按 i18n.md 提供中/英/日翻译；Tab 标签复用 `dashboard.nav.requirement`、`dashboard.nav.task`、`dashboard.nav.defect`
- **Rationale**：与现有 i18n 结构一致，避免覆盖已有文案

## Risks / Trade-offs

- **数据迁移**：现有 requirements 无 projectId，需为 placeholder 数据分配 projectId（可默认关联首个项目或按业务规则分配）
- **add-nav-menu 冲突**：add-nav-menu 变更中 NavMenu 显示「需求、任务、缺陷」等，需同步更新为仅显示概览、项目、奖励等，或移除对应项

## Migration Plan

1. 扩展 Requirement/Task/Defect 数据模型，新增 projectId
2. 更新 placeholder 数据，为 requirements 补充 projectId；新增 tasks、defects 数据
3. 扩展需求 API、新建任务 API、缺陷 API，支持 projectId 筛选
4. 修改 SideNav 一级导航项
5. 新建项目详情页及顶部栏组件
6. 修改项目卡片点击行为
7. 复用 RequirementKanban、TaskCard、Defect 等组件，传入 projectId 筛选
8. 添加旧路径重定向
9. 添加 projectDetail i18n 翻译
10. 验证 AC-01 ~ AC-08
