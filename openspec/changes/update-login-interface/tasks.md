# Tasks: update-login-interface

## 数据层

- [ ] 新增 `verification_codes` 表（email, code, expires_at, created_at, used）
- [ ] 在 `users` 表新增 `email` 字段（唯一索引）
- [ ] 在 `users` 表新增 `login_attempts` 和 `locked_until` 字段
- [ ] 编写数据库迁移 SQL

## API 层

- [ ] 新增 `POST /api/auth/send-code` — 发送验证码到邮箱
- [ ] 新增 `POST /api/auth/login-code` — 验证码登录（含自动注册）
- [ ] 修改 `POST /api/auth/login` — 支持邮箱+密码登录，增加锁定逻辑
- [ ] 实现验证码生成与过期校验逻辑
- [ ] 实现发送频率限制（60秒间隔、24小时10次）
- [ ] 实现账户锁定逻辑（5次错误锁定15分钟）

## 前端 — 登录页面

- [x] 创建 Demo 登录页面路由 `/demo/login` — 基于 pencil kWtgR 设计实现
- [ ] 重构登录页面布局（品牌区 + 表单区）
- [ ] 实现登录方式切换标签（验证码 | 密码）
- [ ] 实现邮箱验证码登录表单
- [ ] 实现密码登录表单（含密码显示/隐藏）
- [ ] 实现邮箱格式实时校验
- [ ] 实现「获取验证码」按钮及 60 秒倒计时
- [ ] 实现表单提交 loading 状态
- [ ] 实现错误提示（字段级 + Toast）
- [ ] 实现智能跳转逻辑（next 参数）
- [ ] 移除登录界面默认账号填充逻辑

## i18n

- [ ] 新增 `auth.*` 命名空间翻译字典（中/英/日）
- [ ] 登录页面接入 i18n

## 类型定义

- [ ] 新增 VerificationCode 类型
- [ ] 更新 User 类型（增加 email, login_attempts, locked_until）
- [ ] 新增登录 API 请求/响应类型

## 测试

- [ ] 编写验证码发送 API 单元测试
- [ ] 编写验证码登录 API 单元测试
- [ ] 编写密码登录锁定逻辑单元测试
- [ ] 编写登录页面组件测试
