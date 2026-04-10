# Design: 认证领域 DDD Lite 试点

## Goal

让认证领域成为本项目第一个可读、可测、可迁移的 DDD Lite 示例。目标不是追求完整 DDD 教科书实现，而是建立一套前后端都能理解和维护的领域分层模板。

## Glossary

- **认证领域 Auth Domain**：负责识别用户身份、建立会话、销毁会话、判断角色权限的业务边界。
- **用户 User**：可以登录系统并拥有角色的实体，通过 `id` 标识身份。
- **昵称 Nickname**：用户登录使用的名称，属于值对象，需要满足长度和字符规则。
- **密码 Password**：用户登录凭据，领域层只关心密码规则，哈希实现属于基础设施。
- **密码哈希 PasswordHash**：密码经过哈希后的持久化结果，只能存在于基础设施层和持久化模型中。
- **用户角色 UserRole**：用户权限级别，支持访客、普通用户、管理员和超级管理员。
- **认证会话 AuthSession**：用户登录成功后获得的访问状态，具体存储方式可以是 Cookie 或 Token。
- **权限策略 AuthPolicy**：根据用户角色判断是否允许访问某类能力的规则。

## Confirmed Decisions

- 本试点只支持现有 `nickname + password` 登录。
- 本试点不引入 email 字段。
- 本试点不实现邮箱验证码登录。
- 用户官方字段为：`id`、`nickname`、`passwordHash`、`role`、`totalPoints`。
- 领域模型不得使用 `password` 表示持久化密码，必须使用 `passwordHash`。
- 用户角色为：`guest`、`user`、`admin`、`superadmin`。
- 登录态以 `auth_access_token` Cookie 为准。
- `lastLoginNickname` 只用于记住上次登录名，不代表登录态。
- 禁止在 localStorage 保存密码。
- 不保留硬编码默认管理员账号。
- 旧 `app/lib/auth*.ts` 认证实现文件不作为长期 facade 保留；实现阶段需要全量替换引用后删除。

## Permission Model

| Role | Meaning | Default Permission |
| --- | --- | --- |
| `guest` | 只读访客 | 只能查看允许公开或只读访问的数据，不能创建、修改、删除 |
| `user` | 普通用户 | 可以管理自己的个人数据 |
| `admin` | 管理员 | 可以管理业务数据，但不默认拥有系统级配置权限 |
| `superadmin` | 超级管理员 | 拥有系统级管理能力 |

> 注：`admin` 与 `superadmin` 的最终边界如果后续更细，需要单独提权限设计变更。

## Proposed Structure

```text
apps/web/src/modules/auth/
  domain/
    entities/
      User.ts
    value-objects/
      Nickname.ts
      Password.ts
      UserRole.ts
    services/
      AuthPolicy.ts
    repositories/
      UserRepository.ts

  application/
    use-cases/
      LoginUser.ts
      RegisterUser.ts
      GetCurrentUser.ts
      LogoutUser.ts
    ports/
      PasswordHasher.ts
      SessionManager.ts
    dto/
      AuthDTO.ts

  infrastructure/
    repositories/
      PostgresUserRepository.ts
    services/
      BcryptPasswordHasher.ts
      CookieSessionManager.ts
    mappers/
      UserMapper.ts

  presentation/
    hooks/
      useAuth.tsx
    api/
      authApiClient.ts
```

## Layer Rules

### Domain

- 只表达认证业务规则。
- 不 import `next/server`。
- 不 import `postgres`。
- 不 import `bcrypt`。
- 不 import React。
- 可以被 Vitest 直接单测。

### Application

- 编排登录、注册、获取当前用户、退出登录等用例。
- 依赖领域对象和 ports。
- 不直接操作 HTTP request/response。
- 不直接操作数据库。
- 不直接调用 bcrypt。

### Infrastructure

- 实现数据库访问、密码哈希、Cookie/Token 会话。
- 可以依赖 `postgres`、`bcrypt`、Next.js Cookie 能力。
- 不向 domain 暴露技术对象。

### Presentation / Adapter

- API Route 只负责 HTTP 输入输出转换。
- 前端 Hook 只负责 UI 状态和调用认证 API。
- 页面组件不直接包含认证业务规则。
- 本试点只迁移前端 `useAuth` 和 auth API client。
- 本试点不迁移登录页视觉组件，不改变页面样式和交互表现。

## Frontend Migration Impact

- 受影响的是认证相关 import 路径和 Hook 所在目录。
- 登录页和注册页的视觉结构不作为本次重构目标。
- 页面仍通过 Hook 或 API client 发起登录、注册、登出请求。
- 前端迁移的目的只是让前端认证逻辑也归属于 auth 领域，避免继续散落在 `app/lib/hooks`。

## Use Case Flow

### LoginUser

```text
API Route
  -> parse request
  -> LoginUser.execute({ nickname, password })
  -> SessionManager.write(session)
  -> return existing response shape
```

### RegisterUser

```text
API Route
  -> parse request
  -> RegisterUser.execute({ nickname, password })
  -> return existing response shape
```

### GetCurrentUser

```text
API Route / middleware helper
  -> SessionManager.read()
  -> GetCurrentUser.execute(session)
  -> return safe user info
```

## Compatibility

- `/api/auth/login` 保持现有路径和响应结构。
- `/api/auth/register` 保持现有路径和响应结构。
- `/api/auth/me` 保持现有路径和响应结构。
- `/api/auth/logout` 保持现有路径和响应结构。
- 当前 nickname/password 登录不改变。
- 当前 `isAdmin` 输出不改变。
- `isAdmin` 在兼容响应中表示用户是否拥有管理员级能力；后续如需要区分 `admin` 和 `superadmin`，应新增非破坏性字段。
- `lastLoginNickname` 可继续写入 Cookie 或本地存储，但不得作为认证凭证。

## Migration Strategy

1. 新建 `src/modules/auth`，先复制并收拢认证类型和业务规则。
2. 为 `Nickname`、`Password`、`AuthPolicy`、`LoginUser`、`RegisterUser` 写单元测试。
3. 用新 application use case 替换现有 auth API Route 内部逻辑。
4. 全量替换旧 `app/lib/auth*.ts` 的引用。
5. 删除旧 `app/lib/auth*.ts` 认证实现文件。
6. 更新前端认证 Hook 的引用路径，但不迁移登录页视觉组件。

## Risks

- 当前 `update-login-interface` 活跃变更可能修改同一认证文件，存在合并冲突。
- 当前 typecheck 和 Vitest 已存在失败，迁移前应记录基线，避免把历史问题误判为本变更引入。
- 如果同时迁移登录 UI 和认证架构，范围会过大，应避免。
- 如果过度抽象，会增加前端理解成本，因此本次只做 DDD Lite。
- 直接删除旧认证文件会导致引用替换范围变大，必须在同一实施批次完成全量替换。
