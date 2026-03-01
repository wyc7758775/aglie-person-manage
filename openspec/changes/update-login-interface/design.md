# Design: update-login-interface

## 架构决策

### 1. 验证码存储方案

**选择**：PostgreSQL 表存储

**理由**：
- 项目已使用 PostgreSQL，无需引入 Redis 等额外依赖
- 验证码生命周期短（5分钟），通过定时清理或查询时过滤即可
- 单用户系统，并发量极低，无性能瓶颈

**表结构**：
```sql
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_verification_codes_email ON verification_codes(email);
```

### 2. 邮件发送方案

**选择**：控制台输出（开发阶段）

**理由**：
- 个人项目，暂不接入真实邮件服务
- 验证码在服务端日志中输出，方便开发调试
- 未来可替换为 Resend / Nodemailer 等邮件服务，接口不变

**接口设计**：
```typescript
// 抽象邮件发送接口，便于未来替换
async function sendVerificationEmail(email: string, code: string): Promise<void> {
  // 开发阶段：控制台输出
  console.log(`[验证码] ${email}: ${code}`);
  // 生产阶段：替换为真实邮件发送
}
```

### 3. 用户标识迁移

**现状**：当前用户通过 `nickname`（用户名）登录
**目标**：支持 `email` 登录，保留 `nickname` 作为显示名

**迁移策略**：
- `users` 表新增 `email` 列（VARCHAR(255), UNIQUE, NULLABLE）
- 现有用户的 `email` 为空，仍可通过原有密码登录方式访问
- 新用户通过验证码登录时自动填充 `email`
- 密码登录同时支持邮箱和用户名（向后兼容）

### 4. 账户锁定方案

**实现**：数据库字段记录

```sql
ALTER TABLE users ADD COLUMN login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN locked_until TIMESTAMP;
```

**逻辑**：
- 密码登录失败时 `login_attempts += 1`
- 达到 5 次时设置 `locked_until = NOW() + 15min`
- 登录前检查 `locked_until`，未过期则拒绝
- 登录成功后重置 `login_attempts = 0, locked_until = NULL`

### 5. 登录页面组件结构

```
LoginPage
├── BrandSection (Logo + 标题)
├── LoginTabs (验证码 | 密码)
├── CodeLoginForm
│   ├── EmailInput (实时校验)
│   ├── CodeInput (6位数字)
│   ├── SendCodeButton (倒计时)
│   └── SubmitButton (loading)
├── PasswordLoginForm
│   ├── EmailInput
│   ├── PasswordInput (显示/隐藏)
│   └── SubmitButton (loading)
└── Footer (版权信息)
```

## API 设计

### POST /api/auth/send-code
```
Request:  { email: string }
Response: { success: boolean, message: string }
```

### POST /api/auth/login-code
```
Request:  { email: string, code: string }
Response: { success: boolean, message: string, user?: { id, nickname, isAdmin } }
```

### POST /api/auth/login（修改）
```
Request:  { email: string, password: string }  // 或 { nickname: string, password: string }
Response: { success: boolean, message: string, user?: { id, nickname, isAdmin } }
```
