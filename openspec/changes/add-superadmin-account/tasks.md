## 1. 类型定义更新

- [x] 1.1 在 `app/lib/definitions.ts` 中扩展 `User` 类型，添加 `role` 字段
- [x] 1.2 更新 `LoginResponse` 类型，添加 `isAdmin` 字段
- [x] 1.3 定义用户角色类型 `UserRole = 'user' | 'superadmin'`

## 2. 用户数据更新

- [x] 2.1 在 `app/lib/placeholder-data.ts` 中添加 `wuyucun` 用户，`role: 'superadmin'`
- [x] 2.2 为现有用户添加默认 `role: 'user'` 字段
- [x] 2.3 更新 `getSafeUserInfo` 函数返回用户角色信息

## 3. 认证逻辑更新

- [x] 3.1 在 `app/lib/auth.ts` 中添加 `isSuperAdmin()` 辅助函数
- [x] 3.2 在 `app/lib/auth.ts` 中添加 `getUserRole()` 函数
- [x] 3.3 确保角色信息在登录验证后可以被获取

## 4. 登录接口更新

- [x] 4.1 修改 `app/api/auth/login/route.ts`，登录成功后返回 `isAdmin` 标记
- [x] 4.2 根据用户角色设置 `isAdmin` 值

## 5. 登录界面更新

- [x] 5.1 在登录表单组件中设置默认账号：`wuyucun`
- [x] 5.2 在登录表单组件中设置默认密码：`wyc7758775`

## 6. 验证测试

- [ ] 6.1 使用 `wuyucun/wyc7758775` 登录，验证返回 `isAdmin: true`
- [ ] 6.2 使用普通用户登录，验证返回 `isAdmin: false`
- [ ] 6.3 验证登录界面默认值是否正确显示
- [x] 6.4 运行 `pnpm build` 确保构建成功
