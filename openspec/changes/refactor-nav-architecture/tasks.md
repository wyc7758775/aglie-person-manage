# 导航架构调整 - 任务清单

## 0. 数据模型与 API（projectId 关联）

- [ ] 0.1 在 `app/lib/definitions.ts` 中为 Requirement 新增 `projectId: string` 字段
- [ ] 0.2 在 `app/lib/definitions.ts` 中新增 Task、Defect 类型定义，包含 `projectId: string`
- [ ] 0.3 在 `app/lib/placeholder-data.ts` 中为 requirements 补充 projectId；新增 tasks、defects 数据（含 projectId）
- [ ] 0.4 扩展 `app/lib/requirements.ts`：getRequirements 支持 projectId 筛选；createRequirement/updateRequirement 处理 projectId
- [ ] 0.5 扩展 `GET /api/requirements` 支持 `?projectId=xxx` 查询参数
- [ ] 0.6 新建 `app/lib/tasks.ts`：getTasks、createTask、updateTask、deleteTask，支持 projectId 筛选
- [ ] 0.7 新建 `app/api/tasks/route.ts`：GET 支持 `?projectId=xxx`；POST 接收 projectId
- [ ] 0.8 新建 `app/lib/defects.ts`：getDefects、createDefect、updateDefect、deleteDefect，支持 projectId 筛选
- [ ] 0.9 新建 `app/api/defects/route.ts`：GET 支持 `?projectId=xxx`；POST 接收 projectId

## 1. 一级导航重构

- [ ] 1.1 修改 `app/ui/dashboard/topnav.tsx`，从 mainLinks 移除需求、任务、缺陷三项
- [ ] 1.2 若存在 `app/ui/dashboard/NavMenu.tsx`，同步移除需求、任务、缺陷
- [ ] 1.3 验证侧边栏仅显示：概览、项目、奖励、通知、设置

## 2. 旧路径重定向

- [ ] 2.1 在 `/dashboard/requirement`、`/dashboard/task`、`/dashboard/defect` 页面添加重定向至 `/dashboard/project`
- [ ] 2.2 验证直接访问旧路径时正确重定向

## 3. 项目列表页

- [ ] 3.1 修改项目卡片点击行为：从打开 ProjectDrawer 改为 `router.push(/dashboard/project/[id])`
- [ ] 3.2 保留卡片「更多」菜单中的「编辑」选项，点击时打开 ProjectDrawer
- [ ] 3.3 验证无项目时显示空状态及新建引导

## 4. 项目详情页

- [ ] 4.1 新建 `app/dashboard/project/[projectId]/page.tsx` 动态路由
- [ ] 4.2 实现顶部栏组件：文件夹图标、面包屑、项目名、下拉菜单、需求/任务/缺陷 Tab
- [ ] 4.3 实现文件夹图标点击跳转 `/dashboard/project`
- [ ] 4.4 实现项目名下拉菜单：项目列表 +「返回项目列表」选项
- [ ] 4.5 实现下拉菜单切换项目（更新 URL 并刷新内容）
- [ ] 4.6 实现 Tab 切换（query `?tab=requirement|task|defect`，默认 requirement）
- [ ] 4.7 处理无效 projectId：重定向至项目列表并提示「项目不存在」
- [ ] 4.8 处理 life 类型项目：隐藏缺陷 Tab 或显示「仅代码项目有缺陷」

## 5. Tab 内容区

- [ ] 5.1 需求 Tab：复用 RequirementKanban，请求 `/api/requirements?projectId=xxx`
- [ ] 5.2 任务 Tab：复用任务列表组件，请求 `/api/tasks?projectId=xxx`
- [ ] 5.3 缺陷 Tab：复用缺陷列表组件，请求 `/api/defects?projectId=xxx`
- [ ] 5.4 各 Tab 空状态与加载失败提示

## 6. 国际化

- [ ] 6.1 在 `dictionary.zh.ts`、`dictionary.en.ts`、`dictionary.ja.ts` 中新增 `projectDetail` 对象
- [ ] 6.2 按 i18n.md 填充翻译：backToProjectList、switchProject、projectNotFound、defectOnlyForCode、emptyRequirement、emptyTask、emptyDefect、loadFailed、dropdown.*、folderIconTitle
- [ ] 6.3 验证项目详情页各文案正确显示

## 7. 验证

- [ ] 7.1 通过 AC-01 ~ AC-08 验收标准
- [ ] 7.2 运行 `pnpm build` 验证构建成功
- [ ] 7.3 手动测试：导航、项目列表、项目详情、Tab 切换、返回、项目切换、旧路径重定向、projectId 筛选
