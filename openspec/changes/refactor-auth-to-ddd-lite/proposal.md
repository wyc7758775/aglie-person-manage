# Change: 认证领域 DDD Lite 试点重构

## Why

当前认证代码分散在 API Route、`app/lib/auth*.ts`、数据库适配和前端 Hook 中，业务规则、HTTP 细节、Cookie、密码哈希、数据库访问混在一起，不利于理解 DDD，也不利于后续按领域逐步重构。

本变更以认证领域作为最小试点，在不改变现有登录、注册、登出、权限判断用户体验和 API 行为的前提下，验证一套适合本项目的轻量 DDD 分层方式。

## What Changes

- 将认证领域拆为 `domain`、`application`、`infrastructure`、`presentation` 四层。
- 定义认证领域术语和边界：用户、昵称、密码、角色、认证会话、权限策略。
- 将昵称校验、密码校验、角色判断等业务规则迁入领域层。
- 将登录、注册、获取当前用户、退出登录等流程迁入应用用例层。
- 将 PostgreSQL、bcrypt、JWT/Cookie、Next.js Route Handler 等技术细节保留在基础设施或适配层。
- 将前端认证 Hook/API 调用整理到认证领域的 presentation 层；登录页视觉组件暂不搬迁。
- 补充认证用例单元测试，确保核心业务逻辑可脱离 Next.js 和数据库测试。
- 删除旧 `app/lib/auth*.ts` 认证实现文件，并全量替换引用，不保留长期 facade。
- 移除硬编码默认管理员账号；系统初始化或首次使用时应创建真实账户。
- 明确登录态以 `auth_access_token` Cookie 为准，`lastLoginNickname` 只用于记住上次登录名。
- 认证模型不引入 email；用户登录标识继续使用 nickname。
- 认证角色模型支持 `guest`、`user`、`admin`、`superadmin`。

## Non-Goals

- 不新增邮箱验证码登录。
- 不修改当前昵称密码登录行为。
- 不修改现有 API 路径和响应结构。
- 不重构项目、任务、需求、缺陷、奖励等其他领域。
- 不一次性迁移全仓库到 DDD。
- 不重构登录页视觉设计。
- 不引入 email 字段。

## Impact

- Affected specs: `auth`, `repo-structure`
- Affected code:
  - `apps/web/app/api/auth/*`
  - `apps/web/app/lib/auth.ts`
  - `apps/web/app/lib/auth-db.ts`
  - `apps/web/app/lib/auth-cookie.ts`
  - `apps/web/app/lib/auth-utils.ts`
  - `apps/web/app/lib/hooks/useAuth.tsx`
  - 新增 `apps/web/src/modules/auth/**`
- Breaking internal imports:
  - 旧 `app/lib/auth*.ts` 认证实现将被删除或仅在迁移过程中临时存在，所有引用需要改为新模块路径。
- User-facing behavior:
  - 现有昵称密码登录、注册、获取当前用户、退出登录行为保持不变。
  - 不再依赖硬编码默认管理员账号。

## Dependency / Conflict Notes

- 当前存在活跃变更 `update-login-interface`，该变更会引入邮箱验证码登录和账户锁定。本变更只迁移现有认证架构，不实现新登录能力。
- 如果 `update-login-interface` 先实现，本变更需要把验证码登录也纳入 auth application use case。
- 如果本变更先实现，`update-login-interface` 后续应基于新的 auth DDD Lite 目录继续开发。

## Open Questions Before Implementation

- `admin` 与 `superadmin` 的权限边界需要最终确认。本提案默认：`guest` 只读，`user` 管理自己的数据，`admin` 管理业务数据，`superadmin` 管理系统级能力。
- 本提案默认禁止在 localStorage 中保存密码；如需保留“记住密码”，必须另行创建安全设计提案。
