# Tasks: add-user-project-persistence

## 1. 约定与文档

- [x] 1.1 核对并必要时更新 project.md
  - 确认「数据层约定」为「用户与项目使用真实数据库（PostgreSQL），其余模块暂用内存」
  - 确认无「全系统使用内存数据库」或「数据库在服务器重启时重置」等全局表述
  - 验证：查阅 `openspec/project.md` 与 PRD 验收项 AC-01 一致

## 2. 数据库设计与建表

- [x] 2.1 设计 users、projects 表结构
  - users：id、nickname、password_hash、role 等；nickname 唯一索引
  - projects：在现有 Project 字段基础上增加 userId（或 ownerId）；与 users 关联
  - 在 design.md 或迁移脚本中定稿
  - 验证：表结构满足注册/登录与项目 CRUD 及按用户维度的查询需求

- [x] 2.2 提供建表脚本或迁移
  - 可执行 SQL 或迁移工具（如 Prisma migrate）创建 users、projects 表
  - 验证：在本地 PostgreSQL 执行后表存在且约束正确

## 3. 用户持久化

- [x] 3.1 实现用户层对接 PostgreSQL
  - 新增或切换为基于 POSTGRES_URL 的持久化层（如 db-pg.ts），实现 findUserByNickname、findUserById、createUser、verifyUserPassword、getSafeUserInfo 等
  - 密码使用 bcrypt 哈希存储；昵称唯一性由 DB 唯一索引或约束保证
  - 验证：注册/登录 API 调用该层，数据写入并可从 PostgreSQL 查询

- [x] 3.2 注册/登录 API 使用真实 DB 层
  - `app/api/auth/register/route.ts`、`app/api/auth/login/route.ts` 使用 PostgreSQL 驱动层而非内存
  - 登录失败时统一返回「昵称或密码错误」（不区分昵称不存在与密码错误）
  - 验证：注册后重启服务仍可登录；登录失败提示符合 spec

- [x] 3.3 init-db/seed 创建默认用户
  - 保留或更新 `app/api/init-db/route.ts`，在 PostgreSQL 中创建默认用户（含超级管理员 wuyucun 等）
  - 验证：执行 init-db 后默认用户存在且可登录

## 4. 项目持久化

- [x] 4.1 实现项目层对接 PostgreSQL
  - 项目 CRUD 读写 PostgreSQL；项目表含 userId；getProjects、getProjectById、createProject、updateProject、deleteProject 支持按当前用户过滤或校验
  - 验证：创建/更新/删除后数据落库；重启后项目数据仍在

- [x] 4.2 项目 API 鉴权与归属校验
  - GET/POST /api/projects、GET/PUT/DELETE /api/projects/[id] 从请求解析当前用户（如 getCurrentUser）
  - 未登录：返回 401 或等效（如重定向登录）
  - 列表/详情：仅返回当前用户的项目；详情若项目不属于当前用户返回 403 或 404
  - 创建：写入当前 userId；更新/删除：校验归属，非本人返回 403 或 404
  - 验证：未登录请求项目接口得 401；多账号登录时仅能见本人项目；操作他人项目得 403/404

## 5. 前端对齐

- [x] 5.1 确认登录/注册/项目接口调用与错误处理
  - 登录/注册已调用真实 API；项目列表/详情/表单提交调用真实 API
  - 未登录时项目接口 401 的提示与跳转（如重定向登录）符合 PRD 4.2
  - 403/404 时前端展示无权限或不存在提示
  - 验证：未登录访问项目页跳转登录；错误码与提示与 PRD 一致

## 6. 验收与校验

- [x] 6.1 功能验收
  - 重启服务后使用已注册账号仍可登录
  - 项目 CRUD 持久化：创建/编辑/删除后刷新或重启，数据保留
  - 多账号数据隔离：不同账号登录仅能查看与操作本人项目
  - 验证：AC-02～AC-05 满足

- [x] 6.2 OpenSpec 校验
  - 运行 `openspec validate add-user-project-persistence --strict` 通过
  - 验证：无 delta 格式或 Scenario 错误
