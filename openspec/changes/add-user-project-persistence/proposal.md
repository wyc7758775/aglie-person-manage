# Change: 用户与项目数据持久化

## Why

用户与项目数据当前仅存于内存（或进程内存储），服务重启即丢失；项目与用户无关联，无法实现「我的项目」与按用户维度的数据隔离。需要将用户注册/登录与项目 CRUD 改为真实数据库（PostgreSQL）持久化，并建立用户-项目关联。

## What Changes

- **约定**：确保 `openspec/project.md` 中数据层约定为「用户+项目使用 PostgreSQL，其余模块用内存」，无全局「使用内存数据库」表述。
- **用户**：注册/登录改为读写 PostgreSQL；密码保持哈希（bcrypt）；昵称在 DB 层唯一。
- **项目**：项目 CRUD 通过真实 API 读写 PostgreSQL；项目表含用户关联字段（如 `userId`）；列表/详情/创建/更新/删除均以**当前登录用户**为维度；未登录访问项目接口返回 401 或重定向登录；操作非本人项目返回 403/404。

## Impact

- **Affected specs**: auth（ADDED 用户认证数据持久化等）, project-management（MODIFIED 项目数据持久化, ADDED 用户-项目关联）
- **Affected code**:
  - `app/lib/db-memory.ts` — 切换或新增 PostgreSQL 持久化路径
  - `app/lib/projects.ts` — 对接 PostgreSQL，按 userId 过滤
  - `app/api/auth/*` — 使用真实 DB 层
  - `app/api/projects/*` — 解析当前用户，未登录 401，非本人 403/404
  - `openspec/project.md` — 核对数据层约定
  - 前端：确认登录/注册/项目接口调用与 401/403/404 处理符合 PRD
