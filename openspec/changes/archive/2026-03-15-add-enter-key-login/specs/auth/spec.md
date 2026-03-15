# auth Spec Delta

> 此变更为 auth capability 添加实现细节说明，不修改现有规格。

## MODIFIED Requirements

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

#### Scenario: 登录按钮作为表单提交按钮
- **GIVEN** 用户在登录界面
- **WHEN** 检查登录按钮的 HTML 属性
- **THEN** 按钮的 `type` 属性为 `submit`

#### Scenario: 注册按钮作为表单提交按钮
- **GIVEN** 用户在注册界面
- **WHEN** 检查注册按钮的 HTML 属性
- **THEN** 按钮的 `type` 属性为 `submit`
