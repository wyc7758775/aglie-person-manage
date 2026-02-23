## ADDED Requirements

### Requirement: 认证与用户数据仅使用 PostgreSQL
系统 SHALL 仅使用 PostgreSQL 存储认证与用户数据；SHALL NOT 在未配置数据库或连接失败时回退到内存数据源。

#### Scenario: 未配置数据库时认证失败
- **WHEN** 未配置 POSTGRES_URL 或数据库不可用
- **THEN** 登录、注册等认证相关请求返回明确错误（如 503 或错误信息）
- **AND** 系统不使用内存中的用户数据

#### Scenario: 用户积分持久化
- **WHEN** 系统更新用户积分（如需求完成时累加）
- **THEN** 积分 SHALL 持久化到数据库（users 表）
- **AND** 服务重启后仍可正确读取该用户的积分
