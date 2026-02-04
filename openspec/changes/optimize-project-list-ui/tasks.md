# Tasks: optimize-project-list-ui

## 1. 移除页面级标题与副标题

- [x] 1.1 从项目列表页移除主标题与副标题区块
  - 在 `app/dashboard/project/page.tsx` 中删除包含 `<h1>{t('project.title')}</h1>` 与 `<p>{t('project.subtitle')}</p>` 的整块 DOM（约 207–213 行）
  - 保留 SectionContainer 及其 `title` 传参（可继续使用 `t('project.title')` 或改为简短文案如 `t('project.shortTitle')`，若新增 i18n 键则同步更新字典）
  - 验证：访问 `/dashboard/project`，页面顶部无「项目管理」大标题与副标题小字；容器内仍显示区域标题与筛选、添加按钮

- [ ] 1.2 可选：若采用简短容器标题，更新 i18n
  - 在 `app/lib/i18n/dictionary.zh.ts` / `dictionary.en.ts` 中新增 `project.shortTitle`（如「项目」/ "Projects"）并在 SectionContainer 的 title 中使用
  - 验证：中英文切换后容器标题显示正确

## 2. 列表容器内容可滚动

- [x] 2.1 为项目列表内容区增加可滚动样式
  - 方案 A：在 `app/ui/dashboard/section-container.tsx` 中为内容区（包裹 children 的 div）增加 `max-height` 与 `overflow-y-auto`，或增加可选 prop 控制是否可滚动，避免影响其他使用该组件的页面
  - 方案 B：在 `app/dashboard/project/page.tsx` 中为 SectionContainer 的 children 外包一层带 `max-height` 与 `overflow-y-auto` 的 div
  - 验证：项目数量较多时，列表在固定高度内出现垂直滚动条，整页不被撑长

- [x] 2.2 确认其他使用 SectionContainer 的页面
  - 若在 SectionContainer 上做了通用可滚动改动，检查其他调用方（如任务、需求等）的布局是否仍符合预期
  - 验证：仅项目列表页或所有使用该容器的页面行为符合设计

## 3. 项目卡片自定义背景图

- [x] 3.1 扩展 Project 数据模型与 API
  - 在 `app/lib/definitions.ts` 的 `Project` 类型中新增可选字段 `coverImageUrl?: string`
  - 在 `app/lib/placeholder-data.ts`（或实际数据层）与 `app/api/projects/` 的 GET/POST/PATCH 中支持该字段的读写与返回
  - 验证：通过 API 创建/更新项目时能写入并返回 coverImageUrl；列表接口返回的 project 包含 coverImageUrl

- [x] 3.2 实现背景图上传组件（参考 design.md「背景图上传组件」）
  - 在 `app/dashboard/project/components/ProjectDrawer.tsx` 或 `ProjectForm.tsx` 中集成上传组件；上方为虚线框投放区，下方为文件列表区
  - 初始态：投放区显示主文案（点击或拖拽文件到此处上传）与副文案（支持单/批量、禁止内容说明）；支持点击打开文件选择、拖拽放入触发上传
  - 上传中：下方列表展示当前文件条，该条下方展示上传进度条
  - 成功：上方框展示背景图预览；下方列表保留该文件条，右侧提供垃圾桶图标可删除后重选；上传成功后写入 `coverImageUrl`（或先本地预览，提交表单时再提交 URL）
  - 失败：下方列表该项文件名红色、左侧红色附件图标、右侧红色垃圾桶图标；支持点击垃圾桶删除失败记录
  - 验证：拖拽/点击上传、进度条、成功预览、失败态样式与删除行为符合 design 与 spec
- [x] 3.2.1 可选：若需持久化文件，增加上传 API 与存储（或 design 中采用「前端预览 + 占位 URL，后端只存 URL」则本项可省略）

- [x] 3.3 列表卡片渲染支持背景图与回退
  - 在 `app/dashboard/project/page.tsx` 的 ProjectCard 中：若 `project.coverImageUrl` 存在且有效，使用该 URL 作为卡片背景（如 `background-image`）；否则使用现有 `getTypeBgColor(project.type)` 纯色背景
  - 确保前景文字在背景图上可读（如叠加半透明遮罩或文字阴影）
  - 验证：有 coverImageUrl 的项目卡片显示背景图；无或无效时显示纯色；中英文界面均正常

## 4. 验证与收尾

- [x] 4.1 功能与视觉验证
  - 手动检查：项目列表页无页面级主/副标题、容器内可滚动、有/无背景图时卡片展示正确
  - 若有 i18n 变更，检查中英文切换后文案正确
  - 验证：所有上述行为符合 spec 中的 ADDED Requirements

- [x] 4.2 构建与校验
  - 运行 `pnpm build` 确保无 TypeScript 与构建错误
  - 运行 `openspec validate optimize-project-list-ui --strict` 确保提案与 delta 格式正确（提案阶段已通过则实现后再次确认）
