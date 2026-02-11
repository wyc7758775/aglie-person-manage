# auth Specification

## Purpose
TBD - created by archiving change add-superadmin-account. Update Purpose after archive.
## Requirements
### Requirement: 用户角色定义
系统 SHALL 支持用户角色区分，包括普通用户和超级管理员。

#### Scenario: 角色字段存在于用户数据结构中
- **WHEN** 系统获取用户信息
- **THEN** 用户数据结构包含 `role` 字段，值为 `'user'` 或 `'superadmin'`

#### Scenario: 超级管理员角色标识
- **WHEN** 用户角色为 `'superadmin'`
- **THEN** 该用户拥有系统所有功能的访问权限

---

### Requirement: 超级管理员账号
系统 SHALL 提供一个默认的超级管理员账号用于系统管理。

#### Scenario: 超级管理员账号信息
- **GIVEN** 系统初始化完成
- **WHEN** 查询可用用户列表
- **THEN** 系统存在账号 `wuyucun`，密码为 `wyc7758775`，角色为 `superadmin`

#### Scenario: 超级管理员登录凭证
- **WHEN** 使用 `wuyucun/wyc7758775` 进行登录
- **THEN** 登录凭证被系统接受并验证通过

---

### Requirement: 登录响应角色标识
系统 SHALL 在用户登录成功后返回该用户是否为管理员的标识。

#### Scenario: 超级管理员登录响应
- **WHEN** 超级管理员 `wuyucun` 成功登录
- **THEN** 登录响应包含 `isAdmin: true`

#### Scenario: 普通用户登录响应
- **WHEN** 普通用户成功登录
- **THEN** 登录响应包含 `isAdmin: false`

#### Scenario: 登录响应数据结构
- **WHEN** 用户成功登录
- **THEN** 响应数据结构为 `{ success: true, message: string, user: { id: string, nickname: string, isAdmin: boolean } }`

---

### Requirement: 登录界面默认填充
系统 SHALL 在登录界面默认填充超级管理员的账号和密码。

#### Scenario: 登录页面初始状态
- **WHEN** 用户访问登录页面
- **THEN** 账号输入框默认值为 `wuyucun`
- **AND** 密码输入框默认值为 `wyc7758775`

---

### Requirement: 路由保护
系统 SHALL 保护 `/dashboard/*` 下的所有路由，未登录用户访问时自动重定向到登录页面。

#### Scenario: 未登录访问受保护路由
- **WHEN** 未登录用户直接访问 `/dashboard/overview`
- **THEN** 系统返回 302 重定向到登录页面
- **AND** URL 包含 `?next=/dashboard/overview` 参数

#### Scenario: 登录后自动跳转到目标页面
- **GIVEN** 用户通过 `/?next=/dashboard/task` 访问登录页面
- **AND** 用户完成登录
- **WHEN** 登录成功后
- **THEN** 系统自动跳转到 `/dashboard/task`

#### Scenario: 显示未登录提示
- **GIVEN** 用户通过 `/?next=/dashboard/task` 访问登录页面
- **WHEN** 登录页面加载完成
- **THEN** 系统显示 Toast 提示"请先登录后再访问"

#### Scenario: 已登录用户访问受保护路由
- **GIVEN** 用户已登录（`auth_access_token` Cookie 存在）
- **WHEN** 用户访问 `/dashboard/overview`
- **THEN** 系统正常显示页面内容
- **AND** 不进行重定向

### Requirement: Tab 键导航支持
系统 SHALL 支持用户使用 Tab 键在登录和注册表单的输入框及按钮之间按正确顺序切换。

#### Scenario: 登录表单 Tab 导航
- **WHEN** 用户在登录页面按 Tab 键
- **THEN** 焦点按以下顺序切换：账号输入框 → 密码输入框 → 登录按钮
- **AND** 焦点循环后回到账号输入框

#### Scenario: 注册表单 Tab 导航
- **WHEN** 用户在注册页面按 Tab 键
- **THEN** 焦点按以下顺序切换：账号输入框 → 邮箱输入框 → 密码输入框 → 确认密码输入框 → 注册按钮
- **AND** 焦点循环后回到账号输入框

---

### Requirement: 带校验的回车键提交
系统 SHALL 仅在表单校验通过时才允许通过回车键提交登录或注册请求。

#### Scenario: 登录表单校验失败时回车键不提交
- **WHEN** 用户在登录表单中输入无效数据（如账号为空或密码少于6位）
- **AND** 用户按回车键
- **THEN** 系统不触发登录操作
- **AND** 显示相应的验证错误提示

#### Scenario: 登录表单校验通过时回车键提交
- **WHEN** 用户在登录表单中输入有效凭据
- **AND** 用户按回车键
- **THEN** 系统触发登录操作

#### Scenario: 注册表单校验失败时回车键不提交
- **WHEN** 用户在注册表单中输入无效数据
- **AND** 用户按回车键
- **THEN** 系统不触发注册操作
- **AND** 显示相应的验证错误提示

#### Scenario: 注册表单校验通过时回车键提交
- **WHEN** 用户在注册表单中输入有效数据
- **AND** 用户按回车键
- **THEN** 系统触发注册操作

### Requirement: 用户退出登录
系统 SHALL 提供退出登录功能，用户可以安全退出系统。

#### Scenario: 点击退出图标执行退出
- **GIVEN** 用户已登录并访问Dashboard页面
- **WHEN** 用户点击导航栏底部的退出图标
- **THEN** 系统清除localStorage中的认证信息（`lastLoginNickname` 和 `lastLoginPassword`）
- **AND** 系统重定向用户到登录页面

#### Scenario: 退出后访问受保护页面
- **GIVEN** 用户已执行退出登录
- **WHEN** 用户尝试直接访问 `/dashboard/overview`
- **THEN** 系统将用户重定向到登录页面

#### Scenario: 退出API响应
- **WHEN** 调用 `/api/auth/logout` 接口
- **THEN** 接口返回 `{ success: true, message: "退出成功" }`

---

