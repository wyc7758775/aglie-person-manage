# add-route-guard 任务清单

## 任务1：创建 Cookie 工具模块

### 1.1 创建 auth-cookie.ts
- [ ] 创建 `app/lib/auth-cookie.ts`
- [ ] 实现 `getToken()` 从 Cookie 读取
- [ ] 实现 `setToken()` 设置 Cookie
- [ ] 实现 `removeToken()` 清除 Cookie

**验证方式**：
- 运行 `pnpm build` 无错误

---

## 任务2：创建 Middleware 路由保护

### 2.1 创建 middleware.ts
- [ ] 创建项目根目录 `middleware.ts`
- [ ] 定义受保护路由 `/dashboard/*`
- [ ] 定义公开路由 `/`, `/api/*`
- [ ] 实现 Cookie token 检查
- [ ] 未登录时重定向到 `/?next=原路径`

**验证方式**：
- 直接访问 `/dashboard/overview` 返回 302 重定向

---

## 任务3：修改 useAuth.tsx

### 3.1 添加 token 同步到 Cookie
- [ ] 在登录成功后同步 token 到 Cookie
- [ ] 在页面加载时同步 localStorage token 到 Cookie
- [ ] 在登出时清除 Cookie

**验证方式**：
- 登录后检查浏览器 Cookie 存在

---

## 任务4：修改登录页面

### 4.1 添加 next 参数处理和 Toast 提示
- [ ] 解析 `?next=/dashboard/xxx` 参数
- [ ] 检测到 next 参数时显示 Toast 提示（3秒）
- [ ] 登录成功后跳转到 next 目标页面

**验证方式**：
- 访问 `/?next=/dashboard/task` 显示提示，登录后跳转到 `/dashboard/task`

---

## 任务5：更新国际化文案

### 5.1 添加路由守卫提示文案
- [ ] 修改 `app/lib/i18n/dictionary.zh.ts`
- [ ] 添加 `login.guards.pleaseLogin` = "请先登录后再访问"

**验证方式**：
- Toast 显示中文提示

---

## 任务6：更新 Auth Spec

### 6.1 添加路由保护需求
- [ ] 修改 `openspec/specs/auth/spec.md`
- [ ] 添加 Requirement: 路由保护
- [ ] 添加 Scenario: 未登录访问重定向

**验证方式**：
- 运行 `openspec validate add-route-guard --strict` 通过

---

## 任务7：构建验证

### 7.1 运行完整构建
- [ ] 运行 `pnpm build`
- [ ] 无编译错误

**验证方式**：
- 构建成功，输出包含所有路由

---

## 验收检查清单

- [ ] 未登录访问 Dashboard 自动跳转登录页
- [ ] 登录页面显示"请先登录"Toast 提示（3秒）
- [ ] 登录成功后自动跳转到目标页面
- [ ] 已登录用户正常访问 Dashboard
- [ ] 退出登录后再次访问 Dashboard 需要重新登录
- [ ] `pnpm build` 成功

---

## 预估工时

| 任务 | 预估时间 |
|------|----------|
| 创建 auth-cookie.ts | 10分钟 |
| 创建 middleware.ts | 15分钟 |
| 修改 useAuth.tsx | 15分钟 |
| 修改 page.tsx | 10分钟 |
| 更新 i18n 文案 | 5分钟 |
| 更新 auth spec | 5分钟 |
| 构建验证 | 5分钟 |
| **总计** | **65分钟** |
