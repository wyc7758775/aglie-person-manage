# 实施任务：全量数据迁移至 PostgreSQL

## 1. 数据库表与 db 层
- [x] 1.1 在 `app/lib/db.ts` 的 `initializeDatabase()` 中为 `users` 表增加 `total_points` 列（若不存在）。
- [x] 1.2 在 `initializeDatabase()` 中新增 `tasks`、`requirements`、`defects` 表，字段与 `definitions.ts` 中类型一致（含 project_id、状态、优先级、日期、JSON 数组等）。
- [x] 1.3 在 `db.ts` 中实现任务 CRUD：getTasks、getTaskById、createTask、updateTask、deleteTask（支持按 projectId/status/priority 过滤）。
- [x] 1.4 在 `db.ts` 中实现需求 CRUD：getRequirements、getRequirementById、createRequirement、updateRequirement、deleteRequirement；在 updateRequirement 中当状态变为 completed 时调用用户积分累加（或由上层 requirements.ts 调用 db 的 updateUserTotalPoints）。
- [x] 1.5 在 `db.ts` 中实现缺陷 CRUD：getDefects、getDefectById、createDefect、updateDefect、deleteDefect。
- [x] 1.6 在 `db.ts` 中实现 getUserTotalPoints、updateUserTotalPoints（读写 users.total_points）；并在 findUserByNickname/findUserById 返回中包含 total_points（若类型需要）。

## 2. 移除内存回退与统一数据源
- [x] 2.1 修改 `app/lib/db-backend.ts`：移除对 db-memory 的加载与 `forceMemoryBackend`/`getShouldUseMemoryBackend` 的回退逻辑；当无 `POSTGRES_URL` 或连接失败时不再返回内存 backend，改为抛出明确错误或返回可识别的失败状态。
- [x] 2.2 修改 `app/lib/auth-db.ts`：移除在 `isConnectionError` 时调用 `forceMemoryBackend` 并重试的逻辑；连接失败时直接向上抛出或返回错误。
- [x] 2.3 修改 `app/lib/projects.ts`：移除对 `initialProjects` 和内存数组的引用；getProjects/getProjectById/createProject/updateProject/deleteProject 仅调用 `db.ts` 的 PostgreSQL 实现，且要求传入 userId；无 userId 时返回空列表或明确错误。

## 3. 任务、需求、缺陷库层改为仅用 DB
- [x] 3.1 修改 `app/lib/tasks.ts`：删除对 `placeholder-data` 的 import 与内存数组；所有 getTasks、getTaskById、createTask、updateTask、deleteTask 改为调用 `db.ts` 中对应函数（或通过单一 db 模块导出）。
- [x] 3.2 修改 `app/lib/requirements.ts`：删除对 `placeholder-data` 与 `db-memory` 的 import 与内存数组；所有 getRequirements、getRequirementById、createRequirement、updateRequirement、deleteRequirement 改为调用 db 层；需求完成时积分累加改为调用 db 的 updateUserTotalPoints。
- [x] 3.3 修改 `app/lib/defects.ts`：删除对 `placeholder-data` 的 import 与内存数组；所有 getDefects、getDefectById、createDefect、updateDefect、deleteDefect 改为调用 db 层。

## 4. API 与认证
- [x] 4.1 修改 `app/api/auth/login/route.ts` 与 `app/api/auth/register/route.ts`：在 PostgreSQL 不可用时不再 fallback 到内存，返回 503 或明确错误信息。
- [x] 4.2 修改 `app/api/init-db/route.ts`：移除「当前使用内存后端」的提示逻辑；仅在 DB 初始化成功/失败时返回对应信息；可选：在无 POSTGRES_URL 时返回 400 并提示配置。
- [x] 4.3 修改 `app/api/users/route.ts` 与 `app/api/users/[id]/route.ts`：从数据库读取用户列表/详情（通过 db 或 getUserBackend），不再从 placeholder-data 读取。
- [x] 4.4 若存在 `app/seed/route.ts`：改为向 PostgreSQL 插入种子数据（如默认用户、示例项目等），不再仅使用内存或占位数据。

## 5. 清理与文档
- [x] 5.1 删除或标记废弃 `app/lib/db-memory.ts`；若有测试依赖，改为 mock 或仅在文档中说明「仅用于无 DB 环境测试」。
- [x] 5.2 清理 `app/lib/auth.ts` 中对 `placeholder-data` 的依赖；若该文件仍被引用，改为委托给 auth-db 或移除重复的 findUserByNickname/findUserById/registerUser 等实现。
- [x] 5.3 从 `app/lib/placeholder-data.ts` 的运行时引用中剥离：确保无业务代码在运行时从该文件 import 并读取 users/projects/tasks/requirements/defects 数组；可保留文件仅用于 seed 数据定义。
- [x] 5.4 更新 `openspec/project.md` 中数据层约定：删除「其余模块使用内存数据」的表述，改为所有业务数据（用户、项目、任务、需求、缺陷、用户积分）均使用 PostgreSQL。
- [x] 5.5 更新 `AGENTS.md`（若仍包含「内存数据库」「placeholder data」等描述）：改为说明数据全部持久化到 PostgreSQL，并注明需配置 POSTGRES_URL。

## 6. 验证
- [ ] 6.1 配置 POSTGRES_URL 后执行 init-db，确认 users、projects、tasks、requirements、defects 表存在且 total_points 可用。
- [ ] 6.2 登录、注册、项目 CRUD、任务/需求/缺陷 CRUD、需求完成时积分更新均通过 API 或界面验证；重启服务后数据仍在。
- [ ] 6.3 未配置 POSTGRES_URL 或停止数据库时，登录或数据请求返回明确错误而非静默使用内存数据。
