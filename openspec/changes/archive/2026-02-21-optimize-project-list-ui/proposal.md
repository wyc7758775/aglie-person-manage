# Change: 项目列表页界面优化

## Why

项目列表页需要简化首屏信息、改善长列表浏览体验，并支持卡片个性化展示。当前页面顶部重复展示「项目管理」主标题与副标题，占用空间且与容器内标题重复；列表容器无滚动限制，项目过多时整页被撑长；卡片仅支持按类型区分的纯色背景，无法自定义背景图。

## What Changes

- **移除页面级标题与副标题**：删除项目列表页顶部的 `<h1>`（如「项目管理」）及其下方副标题（小字）区块；容器内 SectionContainer 的标题可保留（沿用现有 i18n 或简短文案如「项目」），仅去掉页面级重复展示。
- **容器内容可滚动**：为项目列表所在内容区增加最大高度与垂直滚动（如 `max-height` + `overflow-y-auto`），使卡片列表在内容超出视口时在容器内滚动，而非撑长整页。
- **卡片自定义背景图**：项目数据模型新增可选字段（如 `coverImageUrl?: string`）；项目列表卡片在存在背景图时优先展示该背景图，否则回退到按类型区分的纯色背景；在创建/编辑项目的表单或抽屉中提供背景图 URL 设置入口。首版采用 URL 方式，后续可扩展为上传。

## Impact

- **Affected specs**: project-management（新增 delta，全部 ADDED）
- **Affected code**:
  - `app/dashboard/project/page.tsx` — 移除 h1+subtitle 区块；卡片渲染支持 coverImageUrl；可选：为列表外层增加可滚动容器
  - `app/ui/dashboard/section-container.tsx` — 内容区增加 max-height + overflow-y-auto，或由调用方包一层可滚动区域
  - `app/lib/definitions.ts` — Project 类型新增 `coverImageUrl?: string`
  - `app/api/projects/` 与 `app/lib/` 中项目读写逻辑 — 支持 coverImageUrl 的持久化与返回
  - `app/dashboard/project/components/ProjectDrawer.tsx` 或 `ProjectForm.tsx` — 增加背景图 URL 输入
  - 若 SectionContainer 改为通用可滚动，可能影响其他使用该组件的页面（需在实现时确认是否仅项目页需要滚动）
