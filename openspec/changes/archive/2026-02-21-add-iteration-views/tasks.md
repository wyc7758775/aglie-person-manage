## 1. 数据层与类型

- [ ] 1.1 在 `app/lib/definitions.ts` 中定义 `Iteration` 类型（含 id、projectId、name、goal、startDate、endDate、status 等）及 Create/Update 请求类型
- [ ] 1.2 在数据库（PostgreSQL）中新增迭代表，包含 projectId、name、goal、start_date、end_date、status、created_at、updated_at 等字段
- [ ] 1.3 在 `app/lib/db.ts`（或等价后端）中实现迭代的 CRUD 方法，支持按 projectId 查询

## 2. API 层

- [ ] 2.1 实现 `GET /api/iterations?projectId=xxx` 与 `POST /api/iterations`，请求体含 projectId
- [ ] 2.2 实现 `GET /api/iterations/[id]`、`PUT /api/iterations/[id]`、`DELETE /api/iterations/[id]`
- [ ] 2.3 响应格式与错误处理与现有 requirements/tasks 保持一致（如 `{ success, iterations?, iteration?, message? }`）

## 3. 项目详情页迭代 Tab

- [ ] 3.1 在项目详情页将 Tab 类型扩展为 `requirement | task | defect | iteration`，URL 支持 `?tab=iteration`
- [ ] 3.2 在顶部栏增加「迭代」Tab 按钮，与需求、任务、缺陷同级展示
- [ ] 3.3 迭代 Tab 内容区：请求 `GET /api/iterations?projectId=当前项目`，展示迭代列表（卡片或表格）
- [ ] 3.4 支持在迭代 Tab 内创建、编辑、删除迭代（调用上述 API），表单包含名称、目标、开始/结束日期、状态

## 4. UI 与国际化

- [ ] 4.1 新增迭代列表/卡片组件（如 `IterationCard`、`IterationList`），放在 `app/ui/dashboard/` 或项目详情相关目录
- [ ] 4.2 在 i18n 字典中增加迭代相关 key（如「迭代」、迭代状态、表单标签等），中英文（及项目既有语言）一致

## 5. 验证

- [ ] 5.1 手动验证：进入某项目详情页，切换至迭代 Tab，能列表展示、创建、编辑、删除迭代
- [ ] 5.2 运行 `pnpm build` 确保无类型与构建错误
