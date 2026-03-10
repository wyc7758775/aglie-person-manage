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

### Requirement: 用户认证
系统 SHALL 提供用户认证机制，确保只有授权用户可访问受保护功能。

#### Scenario: 用户登录
- **GIVEN** 用户已注册账号
- **WHEN** 用户提交有效的登录凭据
- **THEN** 系统验证凭据
- **AND** 系统为用户创建认证会话
- **AND** 系统将用户标记为已登录状态

#### Scenario: 登录失败处理
- **GIVEN** 用户提供的凭据无效
- **WHEN** 用户尝试登录
- **THEN** 系统拒绝认证
- **AND** 系统提示用户凭据错误
- **AND** 系统不创建认证会话

#### Scenario: 会话保持
- **GIVEN** 用户已成功登录
- **WHEN** 用户在同一会话期间访问其他功能
- **THEN** 系统识别用户已登录状态
- **AND** 允许用户访问受保护功能

#### Scenario: 用户登出
- **GIVEN** 用户已登录
- **WHEN** 用户选择退出登录
- **THEN** 系统销毁用户认证会话
- **AND** 系统将用户标记为已登出状态
- **AND** 要求重新认证才能访问受保护功能

---

### Requirement: 用户角色与权限
系统 SHALL 支持区分用户角色，不同角色拥有不同权限级别。

#### Scenario: 普通用户权限
- **GIVEN** 用户角色为普通用户
- **WHEN** 用户访问系统功能
- **THEN** 系统仅允许访问个人数据
- **AND** 系统禁止访问系统管理功能
- **AND** 系统禁止访问其他用户数据

#### Scenario: 管理员权限
- **GIVEN** 用户角色为管理员
- **WHEN** 用户访问系统功能
- **THEN** 系统允许访问所有功能
- **AND** 系统允许管理系统级配置
- **AND** 系统允许查看所有用户数据

#### Scenario: 角色识别
- **GIVEN** 用户已登录
- **WHEN** 系统需要判断用户权限时
- **THEN** 系统正确识别用户角色
- **AND** 系统根据角色应用相应权限规则

---

### Requirement: 认证状态提示
系统 SHALL 向用户明确展示当前认证状态，并在状态变化时提供反馈。

#### Scenario: 登录成功反馈
- **WHEN** 用户成功登录
- **THEN** 系统显示登录成功提示
- **AND** 系统将用户引导至主界面

#### Scenario: 未认证访问提示
- **GIVEN** 用户未登录
- **WHEN** 用户尝试访问受保护功能
- **THEN** 系统提示用户需要登录
- **AND** 系统引导用户前往登录界面
- **AND** 系统记录用户原本要访问的功能，以便登录后自动跳转

#### Scenario: 会话过期提示
- **GIVEN** 用户会话已过期
- **WHEN** 用户尝试执行需要认证的操作
- **THEN** 系统提示用户会话已过期
- **AND** 系统要求用户重新登录

---

### Requirement: 默认管理员账号
系统 SHALL 预置一个默认管理员账号用于系统初始化和管理。

#### Scenario: 默认账号存在
- **GIVEN** 系统完成初始化
- **WHEN** 查询系统用户
- **THEN** 系统包含预置的管理员账号
- **AND** 管理员账号拥有完整系统权限

#### Scenario: 默认账号登录
- **WHEN** 使用预置管理员凭据登录
- **THEN** 系统接受凭据并授予管理员权限
- **AND** 系统识别用户为管理员角色

---

### Requirement: 登录界面可用性
系统提供的登录界面 SHALL 便于用户操作，支持标准输入方式。

#### Scenario: 表单字段导航
- **GIVEN** 用户在登录界面
- **WHEN** 用户使用键盘在表单字段间移动
- **THEN** 焦点按逻辑顺序在字段间切换
- **AND** 用户可通过键盘完成所有操作

#### Scenario: 快捷提交
- **GIVEN** 用户在登录界面填写了有效信息
- **WHEN** 用户在任意字段按确认键
- **THEN** 系统提交登录请求
- **AND** 无需用户额外点击提交按钮

#### Scenario: 输入验证
- **GIVEN** 用户在登录界面输入了无效信息
- **WHEN** 用户尝试提交
- **THEN** 系统阻止提交
- **AND** 系统提示用户修正输入

#### Scenario: 默认凭据填充
- **GIVEN** 系统配置了默认登录凭据
- **WHEN** 用户访问登录界面
- **THEN** 系统可选地预填充默认账号信息
- **AND** 用户可修改预填充内容

