## ADDED Requirements

### Requirement: 回车键登录支持
系统 SHALL 支持用户在输入框中按回车键触发登录。

#### Scenario: 密码框按回车键登录
- **WHEN** 用户在密码输入框按回车键
- **THEN** 系统触发登录操作

#### Scenario: 账号框按回车键登录
- **WHEN** 用户在账号输入框按回车键
- **THEN** 系统聚焦到密码输入框

---

### Requirement: 表单提交处理
系统 SHALL 通过表单 `onSubmit` 事件统一处理登录提交。

#### Scenario: 表单提交触发登录
- **WHEN** 用户通过回车键或点击按钮提交表单
- **THEN** 系统调用登录接口进行认证
