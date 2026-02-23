# 设计：全量数据迁移至 PostgreSQL

## Context
- 当前：用户与项目在配置了 `POSTGRES_URL` 时使用 PostgreSQL，否则或连接失败时回退到内存（db-memory / placeholder-data）；任务、需求、缺陷、用户积分完全在内存中。
- 目标：所有业务数据仅存于 PostgreSQL，移除内存数据源与回退，保证数据持久化与一致性。

## Goals / Non-Goals
- **Goals**：用户、项目、任务、需求、缺陷、用户积分均持久化到 PostgreSQL；移除运行时对 placeholder-data 与 db-memory 的依赖；未配置或不可用 DB 时行为明确（报错或提示），不再静默回退到内存。
- **Non-Goals**：不改变现有 API 的 URL 与请求/响应形态（仅数据源从内存改为 DB）；不在本变更内实现多租户行级安全（仍按现有 projectId / userId 在应用层过滤）；不新增自动化测试框架（可后续单独变更）。

## Decisions
- **数据库为必选**：要求配置 `POSTGRES_URL`；若未配置或连接失败，`getUserBackend()` 不返回内存实现，登录/注册/项目等接口返回 503 或明确错误信息，并在 `init-db` 或启动时提示配置数据库。
- **表结构**：在现有 `users`、`projects` 基础上，新增 `tasks`、`requirements`、`defects`；`users` 表增加 `total_points INT DEFAULT 0`（若尚无）。表字段与 `app/lib/definitions.ts` 中类型对齐（如 JSONB 存数组、DATE/TIMESTAMP 存日期）。
- **任务/需求/缺陷归属**：通过 `project_id` 关联 `projects`；不强制 `user_id` 在业务表上（当前按 project 归属用户即可）。若后续需要按用户隔离，可在项目层通过 project 的 user_id 过滤。
- **实现位置**：PostgreSQL 的 CRUD 集中在 `app/lib/db.ts` 中实现（或拆分为 db-tasks.ts、db-requirements.ts、db-defects.ts 再在 db.ts 中聚合），避免在 API 层直接写 SQL。现有 `projects.ts`、`tasks.ts`、`requirements.ts`、`defects.ts` 改为调用 db 层，不再维护内存数组。
- **placeholder-data 与 seed**：`placeholder-data.ts` 保留为静态数据定义，仅用于 seed 脚本或 init-db 时向数据库插入示例数据；运行时不再 import 其数组作为数据源。若存在 `/seed` 路由，改为调用 db 的 insert 接口写入数据库。
- **db-memory 与 auth.ts**：生产路径不再使用 `db-memory.ts`；可删除或保留并在文档中标明「仅测试用」。`app/lib/auth.ts` 若仍被引用且依赖 placeholder，改为依赖 auth-db（或删除 auth.ts 中同步的 findUserByNickname/findUserById，统一走 auth-db）。

## Risks / Trade-offs
- **必须配置数据库**：本地开发或演示必须启动 PostgreSQL，否则无法登录或查看数据。缓解：在 README 与 init-db 中明确说明，并提供 docker-compose 或默认连接串示例。
- **迁移无自动数据**：现有内存中的数据不会自动导入 DB。缓解：通过 init-db 或 seed 插入默认/示例数据（如超级管理员账号）；生产环境由用户自行注册与创建数据。

## Migration Plan
1. 在 `db.ts` 的 `initializeDatabase()` 中增加 `users.total_points`（如不存在）、`tasks`、`requirements`、`defects` 的建表语句。
2. 在 `db.ts` 中实现任务/需求/缺陷的 CRUD 及用户积分的读写；在 `requirements` 完成状态变更时调用用户积分更新（与现有 requirements.ts 中逻辑一致，改为调用 db 的 updateUserTotalPoints）。
3. 修改 `db-backend.ts`：移除内存回退，仅在存在有效 `POSTGRES_URL` 时返回 backend；否则 throw 或返回明确错误。
4. 修改 `projects.ts`、`tasks.ts`、`requirements.ts`、`defects.ts`：移除对 placeholder-data 的初始化和内存数组；全部改为调用 db 层；projects 不再在无 userId 时回退到内存。
5. 更新 `auth-db.ts`、登录/注册/init-db 等：不再在连接失败时 fallback 到内存；返回明确错误或 503。
6. 将 `/api/users`、`/api/users/[id]` 改为从数据库读取（通过 db 或 getUserBackend）；若保留 seed，改为写入数据库。
7. 删除或标记废弃 `db-memory.ts`；清理 `placeholder-data.ts` 的运行时引用（仅保留 seed 用数据）。
8. 更新 `openspec/project.md` 数据层约定：所有业务数据使用 PostgreSQL，不再保留「其余模块使用内存」的表述。

## Open Questions
- 无。
