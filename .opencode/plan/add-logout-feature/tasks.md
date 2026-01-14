# add-logout-feature 任务清单

## 任务1：创建退出登录API

### 1.1 创建API路由
- [ ] 创建 `app/api/auth/logout/route.ts`
- [ ] 实现POST方法处理退出请求
- [ ] 返回成功响应

**验证方式**：
- 调用API返回 `{ success: true, message: "退出成功" }`

---

## 任务2：修改TopNav退出图标

### 2.1 修改退出图标链接
- [ ] 修改 `app/ui/dashboard/topnav.tsx` 第241行
- [ ] 将 `<Link href="/dashboard/reward">` 改为可点击的按钮或处理函数
- [ ] 添加 `onClick` 事件处理退出逻辑

**验证方式**：
- 点击退出图标触发处理函数

### 2.2 实现退出逻辑
- [ ] 清除 localStorage 中的 `lastLoginNickname`
- [ ] 清除 localStorage 中的 `lastLoginPassword`
- [ ] 调用退出API（可选）
- [ ] 使用 router 重定向到登录页面

**验证方式**：
- localStorage 被正确清除
- 页面跳转到登录页面

---

## 依赖关系

- 任务2.1 依赖 任务1.1（可并行，但先完成API更清晰）

---

## 验收检查清单

- [ ] 退出图标可点击
- [ ] 点击后清除认证信息
- [ ] 重定向到登录页面
- [ ] 无JavaScript错误
- [ ] 退出后无法直接访问Dashboard

---

## 预估工时

| 任务 | 预估时间 |
|------|----------|
| 创建退出登录API | 10分钟 |
| 修改TopNav组件 | 15分钟 |
| **总计** | **25分钟** |
