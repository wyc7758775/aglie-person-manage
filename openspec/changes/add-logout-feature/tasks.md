# add-logout-feature 任务清单

## 已完成功能

### 1. 存储适配器 (auth-storage.ts)
- [x] 创建 `app/lib/auth-storage.ts`
- [x] 实现 localStorage 操作方法
- [x] 支持访问令牌、刷新令牌、用户名、密码的存取

### 2. 认证Hook (useAuth.tsx)
- [x] 创建 `app/lib/hooks/useAuth.tsx`
- [x] 实现 AuthProvider 上下文提供者
- [x] 实现 useAuth 自定义Hook
- [x] 支持登录状态管理
- [x] 支持退出登录功能
- [x] 支持凭证保存/清除
- [x] 支持令牌刷新机制

### 3. 退出登录API
- [x] 创建 `app/api/auth/logout/route.ts`
- [x] 实现POST方法处理退出请求
- [x] 返回成功响应

### 4. Token刷新API
- [x] 创建 `app/api/auth/refresh/route.ts`
- [x] 实现POST方法处理令牌刷新
- [x] 返回新的访问令牌和刷新令牌

### 5. TopNav组件修改
- [x] 修改 `app/ui/dashboard/topnav.tsx`
- [x] 导入 useAuth Hook
- [x] 将退出图标从 Link 改为按钮
- [x] 调用 logout() 函数处理退出逻辑

### 6. Layout修改
- [x] 修改 `app/layout.tsx`
- [x] 导入 AuthProvider
- [x] 包裹 LanguageProvider

---

## 测试场景

1. **正常退出流程**
   - 点击退出图标
   - localStorage被清除
   - 页面跳转到登录页
   - 直接访问Dashboard被重定向

2. **Token刷新流程**
   - Token过期前自动调用刷新API
   - 获取新的Token继续使用

3. **网络异常处理**
   - API调用失败时仍执行本地清除
   - 用户仍能正常退出

---

## 文件清单

| 文件 | 状态 |
|------|------|
| `app/lib/auth-storage.ts` | 已创建 |
| `app/lib/hooks/useAuth.tsx` | 已创建 |
| `app/api/auth/logout/route.ts` | 已创建 |
| `app/api/auth/refresh/route.ts` | 已创建 |
| `app/ui/dashboard/topnav.tsx` | 已修改 |
| `app/layout.tsx` | 已修改 |
