# Delta Spec: auth (update-login-interface)

## ADDED Requirements

### Requirement: 邮箱验证码登录
系统 SHALL 支持用户通过邮箱验证码完成登录，作为主要登录方式。

#### Scenario: 发送验证码
- **GIVEN** 用户在验证码登录表单中输入了合法的邮箱地址
- **WHEN** 用户点击「获取验证码」按钮
- **THEN** 系统调用 `POST /api/auth/send-code` 发送 6 位数字验证码到该邮箱
- **AND** 按钮进入 60 秒倒计时状态，倒计时期间不可再次点击

#### Scenario: 验证码有效期
- **GIVEN** 系统已向用户邮箱发送验证码
- **WHEN** 验证码在 5 分钟内使用
- **THEN** 验证码可正常验证通过

#### Scenario: 验证码过期
- **GIVEN** 系统已向用户邮箱发送验证码
- **WHEN** 超过 5 分钟后用户提交该验证码
- **THEN** 系统返回错误提示「验证码已过期，请重新获取」

#### Scenario: 验证码登录成功
- **GIVEN** 用户输入了正确的邮箱和有效的验证码
- **WHEN** 用户点击「登录」按钮
- **THEN** 系统调用 `POST /api/auth/login-code` 完成登录
- **AND** 返回 `{ success: true, user: { id, nickname, isAdmin } }`

#### Scenario: 验证码错误
- **GIVEN** 用户输入了错误的验证码
- **WHEN** 用户点击「登录」按钮
- **THEN** 系统返回错误提示「验证码错误，请重新输入」

#### Scenario: 验证码发送频率限制
- **GIVEN** 用户在 60 秒内已发送过一次验证码
- **WHEN** 用户再次请求发送验证码
- **THEN** 系统拒绝请求，按钮保持倒计时状态

#### Scenario: 24小时发送次数限制
- **GIVEN** 同一邮箱 24 小时内已发送 10 次验证码
- **WHEN** 用户再次请求发送验证码
- **THEN** 系统返回错误提示「发送过于频繁，请稍后再试」

---

### Requirement: 自动注册
系统 SHALL 在新用户通过邮箱验证码登录时自动创建账户，无需独立注册流程。

#### Scenario: 新邮箱首次验证码登录
- **GIVEN** 用户输入的邮箱在系统中不存在
- **WHEN** 用户通过验证码登录成功
- **THEN** 系统自动创建新用户账户
- **AND** 用户昵称默认为邮箱前缀（如 `user@example.com` → `user`）
- **AND** 新用户无初始密码

#### Scenario: 已注册邮箱验证码登录
- **GIVEN** 用户输入的邮箱已在系统中注册
- **WHEN** 用户通过验证码登录成功
- **THEN** 系统直接登录该已有账户，不创建新账户

---

### Requirement: 登录方式切换
系统 SHALL 提供验证码登录与密码登录之间的切换功能。

#### Scenario: 默认显示验证码登录
- **WHEN** 用户访问登录页面
- **THEN** 默认展示验证码登录表单

#### Scenario: 切换到密码登录
- **GIVEN** 当前显示验证码登录表单
- **WHEN** 用户点击「密码登录」标签
- **THEN** 表单切换为密码登录模式（邮箱 + 密码）

#### Scenario: 切换到验证码登录
- **GIVEN** 当前显示密码登录表单
- **WHEN** 用户点击「验证码登录」标签
- **THEN** 表单切换为验证码登录模式（邮箱 + 验证码）

---

### Requirement: 密码登录账户锁定
系统 SHALL 在连续多次密码错误后锁定账户，防止暴力破解。

#### Scenario: 连续5次密码错误锁定
- **GIVEN** 用户连续 5 次输入错误密码
- **WHEN** 第 5 次错误发生
- **THEN** 系统锁定该账户 15 分钟
- **AND** 返回提示「账户已锁定，请 15 分钟后重试」

#### Scenario: 锁定期间拒绝登录
- **GIVEN** 账户处于锁定状态
- **WHEN** 用户尝试密码登录
- **THEN** 系统拒绝登录并提示「账户已锁定，请 15 分钟后重试」

#### Scenario: 锁定过期后恢复
- **GIVEN** 账户锁定已超过 15 分钟
- **WHEN** 用户尝试密码登录
- **THEN** 系统正常处理登录请求

#### Scenario: 登录成功重置计数
- **GIVEN** 用户之前有过密码错误记录
- **WHEN** 用户成功登录（密码或验证码方式）
- **THEN** 系统重置错误计数为 0

---

### Requirement: 验证码数据表
系统 SHALL 使用 `verification_codes` 表存储验证码数据。

#### Scenario: 验证码数据结构
- **WHEN** 系统创建验证码记录
- **THEN** 记录包含字段：`id`（UUID）、`email`、`code`（6位数字）、`expires_at`、`used`（布尔）、`created_at`

---

### Requirement: 邮箱格式校验
系统 SHALL 在前端实时校验邮箱格式。

#### Scenario: 邮箱格式正确
- **WHEN** 用户输入符合格式的邮箱（如 `user@example.com`）
- **THEN** 输入框显示正常状态

#### Scenario: 邮箱格式错误
- **WHEN** 用户输入不符合格式的邮箱
- **THEN** 输入框边框变红
- **AND** 失焦后下方显示提示「请输入有效的邮箱地址」

#### Scenario: 空邮箱不校验
- **WHEN** 邮箱输入框为空
- **THEN** 不显示格式错误提示

---

### Requirement: 密码显示切换
系统 SHALL 支持密码输入框的显示/隐藏切换。

#### Scenario: 默认隐藏密码
- **WHEN** 密码登录表单加载
- **THEN** 密码输入框内容默认隐藏（type="password"）

#### Scenario: 点击显示密码
- **GIVEN** 密码当前为隐藏状态
- **WHEN** 用户点击显示密码图标
- **THEN** 密码以明文显示（type="text"）

#### Scenario: 点击隐藏密码
- **GIVEN** 密码当前为明文显示状态
- **WHEN** 用户点击隐藏密码图标
- **THEN** 密码恢复为隐藏状态

---

### Requirement: i18n 多语言支持
系统 SHALL 为登录界面提供中文、英文、日文三语翻译。

#### Scenario: 翻译键命名空间
- **WHEN** 登录界面使用 i18n
- **THEN** 所有翻译键以 `auth.` 为命名空间前缀

#### Scenario: 支持动态参数
- **WHEN** 翻译文本包含动态内容（如倒计时秒数、用户名）
- **THEN** 使用 `{param}` 占位符格式（如 `{seconds} 秒后重试`）

---

## MODIFIED Requirements

### Requirement: 登录界面默认填充
~~系统 SHALL 在登录界面默认填充超级管理员的账号和密码。~~

系统 SHALL 在登录页面展示品牌信息和空白登录表单。

#### Scenario: 登录页面初始状态
- **WHEN** 用户访问登录页面
- **THEN** 页面展示 Be.run Logo 和标题「欢迎回来」
- **AND** 默认显示验证码登录表单
- **AND** 所有输入框为空

---

### Requirement: Tab 键导航支持
系统 SHALL 支持用户使用 Tab 键在登录表单的输入框及按钮之间按正确顺序切换。

#### Scenario: 验证码登录表单 Tab 导航
- **WHEN** 用户在验证码登录表单按 Tab 键
- **THEN** 焦点按以下顺序切换：邮箱输入框 → 验证码输入框 → 获取验证码按钮 → 登录按钮

#### Scenario: 密码登录表单 Tab 导航
- **WHEN** 用户在密码登录表单按 Tab 键
- **THEN** 焦点按以下顺序切换：邮箱输入框 → 密码输入框 → 登录按钮

---

### Requirement: 带校验的回车键提交
系统 SHALL 仅在表单校验通过时才允许通过回车键提交登录请求。

#### Scenario: 验证码登录表单校验失败时回车键不提交
- **WHEN** 用户在验证码登录表单中邮箱或验证码未填写/格式错误
- **AND** 用户按回车键
- **THEN** 系统不触发登录操作
- **AND** 显示相应的验证错误提示

#### Scenario: 验证码登录表单校验通过时回车键提交
- **WHEN** 用户在验证码登录表单中输入了合法邮箱和 6 位验证码
- **AND** 用户按回车键
- **THEN** 系统触发验证码登录操作

#### Scenario: 密码登录表单校验失败时回车键不提交
- **WHEN** 用户在密码登录表单中邮箱或密码未填写/格式错误
- **AND** 用户按回车键
- **THEN** 系统不触发登录操作
- **AND** 显示相应的验证错误提示

#### Scenario: 密码登录表单校验通过时回车键提交
- **WHEN** 用户在密码登录表单中输入了合法邮箱和有效密码
- **AND** 用户按回车键
- **THEN** 系统触发密码登录操作

---

### Requirement: 登录响应角色标识
系统 SHALL 在用户登录成功后返回该用户是否为管理员的标识。

#### Scenario: 超级管理员登录响应
- **WHEN** 超级管理员成功登录（密码或验证码方式）
- **THEN** 登录响应包含 `isAdmin: true`

#### Scenario: 普通用户登录响应
- **WHEN** 普通用户成功登录（密码或验证码方式）
- **THEN** 登录响应包含 `isAdmin: false`

#### Scenario: 登录响应数据结构
- **WHEN** 用户成功登录
- **THEN** 响应数据结构为 `{ success: true, message: string, user: { id: string, nickname: string, isAdmin: boolean } }`

---

## REMOVED Requirements

### Requirement: 注册表单 Tab 导航
~~系统 SHALL 支持用户在注册页面使用 Tab 键导航。~~

**原因**：新增自动注册机制后，独立注册页面不再需要，注册通过验证码首次登录自动完成。

### Requirement: 注册表单回车键提交
~~系统 SHALL 在注册表单校验通过时允许回车键提交。~~

**原因**：同上，独立注册流程被自动注册取代。
