# Delta Spec: auth (refactor-auth-to-ddd-lite)

## ADDED Requirements

### Requirement: 认证身份与会话口径

系统 SHALL 使用昵称和密码作为本试点的唯一登录凭据，并使用 `auth_access_token` Cookie 作为登录态依据。

#### Scenario: 昵称密码登录口径
- **GIVEN** 用户需要登录系统
- **WHEN** 用户提交登录凭据
- **THEN** 系统使用昵称和密码进行认证
- **AND** 系统不要求用户提供 email

#### Scenario: 登录态口径
- **GIVEN** 用户已登录
- **WHEN** 系统判断用户是否处于登录状态
- **THEN** 系统以有效的 `auth_access_token` Cookie 作为登录态依据
- **AND** `lastLoginNickname` 不作为登录态依据

#### Scenario: 上次登录名记忆
- **GIVEN** 用户成功登录
- **WHEN** 系统记录上次登录名
- **THEN** 系统可以保存 `lastLoginNickname`
- **AND** 该值只用于登录界面默认填充或提示
- **AND** 该值不能用于鉴权

#### Scenario: 禁止本地保存密码
- **WHEN** 用户完成登录或退出登录
- **THEN** 系统不得在 localStorage 中保存明文密码
- **AND** 系统不得将 localStorage 中的密码作为认证凭据

### Requirement: 认证领域边界

系统 SHALL 将认证能力作为独立领域管理，负责用户身份识别、登录注册、会话管理和角色权限判断。

#### Scenario: 认证领域只处理认证职责
- **GIVEN** 系统需要处理登录、注册、获取当前用户或退出登录
- **WHEN** 开发者查看认证领域代码
- **THEN** 认证领域包含用户、昵称、密码、角色、会话和权限策略相关规则
- **AND** 认证领域不包含项目、任务、需求、缺陷或奖励业务规则

#### Scenario: 认证行为保持兼容
- **GIVEN** 用户使用现有昵称和密码登录
- **WHEN** 认证领域完成 DDD Lite 重构后
- **THEN** 用户仍可通过原有登录流程进入系统
- **AND** 登录成功响应仍包含用户 ID、昵称和管理员标识

### Requirement: 用户角色模型

系统 SHALL 在认证领域中统一用户角色模型，支持访客、普通用户、管理员和超级管理员。

#### Scenario: 角色集合
- **WHEN** 系统定义用户角色
- **THEN** 用户角色包含 `guest`
- **AND** 用户角色包含 `user`
- **AND** 用户角色包含 `admin`
- **AND** 用户角色包含 `superadmin`

#### Scenario: 访客只读
- **GIVEN** 用户角色为 `guest`
- **WHEN** 用户访问系统能力
- **THEN** 系统仅允许只读访问
- **AND** 系统禁止创建、修改或删除业务数据

#### Scenario: 普通用户管理个人数据
- **GIVEN** 用户角色为 `user`
- **WHEN** 用户访问系统能力
- **THEN** 系统允许用户管理自己的个人数据
- **AND** 系统禁止用户管理其他用户数据

#### Scenario: 管理员管理业务数据
- **GIVEN** 用户角色为 `admin`
- **WHEN** 用户访问系统能力
- **THEN** 系统允许用户管理业务数据
- **AND** 系统不默认授予系统级配置权限

#### Scenario: 超级管理员管理系统
- **GIVEN** 用户角色为 `superadmin`
- **WHEN** 用户访问系统能力
- **THEN** 系统允许用户执行系统级管理操作

### Requirement: 真实账户初始化

系统 SHALL 不依赖硬编码默认管理员账号完成认证，管理员用户应作为真实账户存在。

#### Scenario: 不使用硬编码管理员凭据
- **WHEN** 系统初始化认证能力
- **THEN** 系统不应依赖写死在代码或规格中的管理员昵称和密码
- **AND** 管理员账号应通过真实账户初始化、注册或运维配置产生

#### Scenario: 管理员账号可被认证
- **GIVEN** 系统中存在真实管理员账户
- **WHEN** 管理员提交有效凭据
- **THEN** 系统接受凭据
- **AND** 系统根据账户角色授予管理员能力

### Requirement: 认证业务规则可独立测试

系统 SHALL 允许认证核心业务规则脱离 Next.js、数据库和浏览器环境进行单元测试。

#### Scenario: 昵称和密码规则独立测试
- **WHEN** 测试昵称和密码校验规则
- **THEN** 测试不需要启动 Next.js 服务
- **AND** 测试不需要连接 PostgreSQL
- **AND** 测试不需要访问浏览器 Cookie 或 localStorage

#### Scenario: 角色权限规则独立测试
- **WHEN** 测试普通用户和超级管理员权限判断
- **THEN** 测试通过领域对象完成断言
- **AND** 测试不依赖 HTTP request 或 response

### Requirement: 认证用例编排

系统 SHALL 通过应用用例编排登录、注册、获取当前用户和退出登录流程，并保持 API 行为不变。

#### Scenario: 登录用例
- **GIVEN** 用户提交昵称和密码
- **WHEN** 登录用例执行
- **THEN** 系统校验输入格式
- **AND** 系统查询用户
- **AND** 系统验证密码
- **AND** 系统返回登录成功或失败结果

#### Scenario: 注册用例
- **GIVEN** 用户提交昵称和密码
- **WHEN** 注册用例执行
- **THEN** 系统校验输入格式
- **AND** 系统检查昵称是否已存在
- **AND** 系统创建新用户或返回注册失败结果

#### Scenario: 获取当前用户用例
- **GIVEN** 请求中存在有效认证会话
- **WHEN** 获取当前用户用例执行
- **THEN** 系统返回当前用户的安全信息
- **AND** 返回信息不包含密码哈希

#### Scenario: 退出登录用例
- **GIVEN** 用户已登录
- **WHEN** 退出登录用例执行
- **THEN** 系统销毁当前认证会话
- **AND** 用户再次访问受保护功能时需要重新登录

## MODIFIED Requirements

### Requirement: 用户角色定义

系统 SHALL 支持用户角色区分，包括访客、普通用户、管理员和超级管理员。

#### Scenario: 角色字段存在于用户数据结构中
- **WHEN** 系统获取用户信息
- **THEN** 用户数据结构包含 `role` 字段
- **AND** `role` 字段值为 `guest`、`user`、`admin` 或 `superadmin`

#### Scenario: 超级管理员角色标识
- **WHEN** 用户角色为 `superadmin`
- **THEN** 该用户拥有系统级管理权限

#### Scenario: 管理员角色标识
- **WHEN** 用户角色为 `admin`
- **THEN** 该用户拥有业务数据管理权限
- **AND** 该用户不默认拥有系统级配置权限

#### Scenario: 访客角色标识
- **WHEN** 用户角色为 `guest`
- **THEN** 该用户只能进行只读访问

### Requirement: 超级管理员账号

系统 SHALL 支持超级管理员账户，但不得依赖硬编码默认昵称和密码作为认证机制。

#### Scenario: 超级管理员账号来源
- **GIVEN** 系统需要超级管理员账户
- **WHEN** 系统初始化或运维配置用户
- **THEN** 超级管理员账号作为真实用户账户存在
- **AND** 密码经过哈希后持久化存储

#### Scenario: 超级管理员登录凭证
- **WHEN** 使用真实超级管理员账户凭据进行登录
- **THEN** 登录凭证被系统接受并验证通过

### Requirement: 用户退出登录

系统 SHALL 提供退出登录功能，用户可以安全退出系统。

#### Scenario: 点击退出图标执行退出
- **GIVEN** 用户已登录并访问 Dashboard 页面
- **WHEN** 用户点击导航栏底部的退出图标
- **THEN** 系统清除认证会话
- **AND** 系统不得在 localStorage 中保留明文密码
- **AND** 系统重定向用户到登录页面

#### Scenario: 退出后访问受保护页面
- **GIVEN** 用户已执行退出登录
- **WHEN** 用户尝试直接访问 `/dashboard/overview`
- **THEN** 系统将用户重定向到登录页面

#### Scenario: 退出API响应
- **WHEN** 调用 `/api/auth/logout` 接口
- **THEN** 接口返回 `{ success: true, message: "退出成功" }`
