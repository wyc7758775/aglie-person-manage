# Change: 移除所有内存数据，全部迁移至真实数据库（PostgreSQL）

## Why
当前系统存在「用户与项目用 PostgreSQL、其余用内存」的双轨制：任务、需求、缺陷、用户积分等仍依赖 `placeholder-data.ts` 与 `db-memory.ts`，服务重启后数据丢失，且无法与已持久化的用户、项目形成一致的数据边界。需要将所有运行时业务数据统一迁移到 PostgreSQL，移除内存数据源与回退逻辑，使系统仅依赖真实数据库。

## What Changes
- **认证与用户**：移除认证/用户层的内存回退；用户积分（total_points）持久化到数据库（users 表新增列）；未配置 `POSTGRES_URL` 或数据库不可用时不再自动切到内存，改为明确报错或提示。
- **项目**：移除 `app/lib/projects.ts` 中基于内存数组的回退逻辑，项目 CRUD 仅通过 PostgreSQL 执行；调用方必须提供已登录用户（userId）。
- **任务、需求、缺陷**：在 PostgreSQL 中新增表 `tasks`、`requirements`、`defects`，表结构对齐现有 TypeScript 类型；`app/lib/tasks.ts`、`requirements.ts`、`defects.ts` 改为仅调用数据库层，不再从 `placeholder-data` 初始化或维护内存数组。
- **数据层入口**：移除或禁用 `db-backend` 的内存回退（`forceMemoryBackend` / `getShouldUseMemoryBackend`）；`getUserBackend()` 仅在存在有效 `POSTGRES_URL` 时返回 PostgreSQL 实现，否则返回错误或使请求失败。
- **placeholder-data 与 db-memory**：`placeholder-data.ts` 不再作为运行时数据源；可保留为种子数据（seed）供初始化或测试插入数据库使用。`db-memory.ts` 不再被生产路径使用，可删除或仅保留用于本地无 DB 的测试场景（需在文档中说明）。
- **受影响的 API**：`/api/users`、`/api/users/[id]`、`/api/init-db`、登录/注册、项目/任务/需求/缺陷相关 API 均改为仅依赖 PostgreSQL；种子路由（如 `/seed`）若保留则改为向数据库插入数据。
- **BREAKING**：未配置 `POSTGRES_URL` 或数据库不可用时，应用将无法正常提供用户、项目、任务、需求、缺陷等数据，需在文档与启动逻辑中明确要求配置数据库。

## Impact
- Affected specs: auth（认证与用户仅用 DB、用户积分持久化）, data-persistence（新增：任务/需求/缺陷仅用 PostgreSQL）
- Affected code: `app/lib/db.ts`（扩展表与 API）、`app/lib/db-backend.ts`、`app/lib/db-memory.ts`、`app/lib/auth-db.ts`、`app/lib/projects.ts`、`app/lib/tasks.ts`、`app/lib/requirements.ts`、`app/lib/defects.ts`、`app/lib/placeholder-data.ts`、`app/api/auth/*`、`app/api/projects/*`、`app/api/tasks/*`、`app/api/requirements/*`、`app/api/defects/*`、`app/api/users/*`、`app/api/init-db/route.ts`、可选 `app/seed/route.ts`、`openspec/project.md`（数据层约定更新）
