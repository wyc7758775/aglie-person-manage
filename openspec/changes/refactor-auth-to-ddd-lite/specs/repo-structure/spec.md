# Delta Spec: repo-structure (refactor-auth-to-ddd-lite)

## ADDED Requirements

### Requirement: 领域模块目录约定

主业务应用 SHALL 支持按领域模块组织代码；认证领域 SHALL 作为首个 DDD Lite 试点模块，使用 `domain`、`application`、`infrastructure`、`presentation` 四层目录。

#### Scenario: 认证模块目录存在
- **WHEN** 开发者查看 `apps/web/src/modules/auth`
- **THEN** 目录包含 `domain`
- **AND** 目录包含 `application`
- **AND** 目录包含 `infrastructure`
- **AND** 目录包含 `presentation`

#### Scenario: 领域层不依赖技术框架
- **WHEN** 开发者查看 `apps/web/src/modules/auth/domain`
- **THEN** 领域层不依赖 Next.js Route Handler
- **AND** 领域层不依赖 PostgreSQL 客户端
- **AND** 领域层不依赖 bcrypt
- **AND** 领域层不依赖 React

#### Scenario: API Route 作为适配层
- **WHEN** 开发者查看 `apps/web/app/api/auth/*`
- **THEN** API Route 负责 HTTP 请求解析和响应返回
- **AND** API Route 通过认证 application use case 执行业务流程
- **AND** API Route 不直接承载昵称校验、密码校验或角色权限核心规则

#### Scenario: 前端认证展示层范围
- **WHEN** 开发者查看 `apps/web/src/modules/auth/presentation`
- **THEN** 该层可以包含认证 Hook
- **AND** 该层可以包含认证 API client
- **AND** 本试点不要求迁移登录页视觉组件

#### Scenario: 旧认证实现文件移除
- **WHEN** 认证领域 DDD Lite 迁移完成
- **THEN** 旧 `apps/web/app/lib/auth*.ts` 认证实现文件不再作为业务逻辑来源
- **AND** 调用方通过新的认证领域模块使用认证能力
