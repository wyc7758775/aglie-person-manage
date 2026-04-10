# Tasks: 认证领域 DDD Lite 试点

## 1. 准备与基线

- [ ] 记录当前 `pnpm --filter web typecheck` 结果，区分历史错误和本变更新增错误
- [ ] 记录当前 `pnpm --filter web test:unit` 结果，区分历史错误和本变更新增错误
- [ ] 梳理现有认证调用点：API Route、middleware、auth utils、前端 Hook
- [ ] 确认本变更不实现 `update-login-interface` 中的邮箱验证码登录
- [ ] 确认本变更不引入 email 字段
- [ ] 确认 `auth_access_token` Cookie 是唯一登录态依据
- [ ] 确认 `lastLoginNickname` 仅用于记住上次登录名
- [ ] 确认 localStorage 不再保存密码
- [ ] 确认不保留硬编码默认管理员账号

## 2. 领域层

- [ ] 创建 `apps/web/src/modules/auth/domain/entities/User.ts`
- [ ] 创建 `Nickname` 值对象，收拢昵称长度和字符校验
- [ ] 创建 `Password` 值对象，收拢密码长度校验
- [ ] 创建 `PasswordHash` 类型，区分明文密码和持久化密码哈希
- [ ] 创建 `UserRole` 值对象或枚举，统一 `guest`、`user`、`admin`、`superadmin`
- [ ] 创建 `AuthPolicy`，收拢 `isSuperAdmin`、权限判断和 safe user 输出规则
- [ ] 创建 `UserRepository` 领域接口，隐藏数据库实现细节

## 3. 应用层

- [ ] 创建 `LoginUser` 用例，编排昵称校验、用户查询、密码验证和登录结果
- [ ] 创建 `RegisterUser` 用例，编排昵称校验、密码校验、重复昵称检查和用户创建
- [ ] 创建 `GetCurrentUser` 用例，封装当前用户查询
- [ ] 创建 `LogoutUser` 用例，封装退出登录语义
- [ ] 创建 `PasswordHasher` port，隔离 bcrypt
- [ ] 创建 `SessionManager` port，隔离 Cookie/Token
- [ ] 定义认证 DTO，保持现有 API 响应结构兼容

## 4. 基础设施层

- [ ] 创建 `PostgresUserRepository`，复用现有 PostgreSQL 用户访问逻辑
- [ ] 创建 `BcryptPasswordHasher`，封装密码哈希和校验
- [ ] 创建 `CookieSessionManager`，封装认证 Cookie 读写和清理
- [ ] 创建 `UserMapper`，隔离数据库行、领域用户、API safe user 之间的转换
- [ ] 移除硬编码默认管理员账号逻辑，改为真实账户初始化或注册流程
- [ ] 全量替换现有 `app/lib/auth*.ts` 引用后删除旧认证实现文件

## 5. 适配层

- [ ] 更新 `/api/auth/login` Route，仅保留请求解析、调用 use case、写 session、返回响应
- [ ] 更新 `/api/auth/register` Route，仅保留请求解析、调用 use case、返回响应
- [ ] 更新 `/api/auth/me` Route，改用 `GetCurrentUser`
- [ ] 更新 `/api/auth/logout` Route，改用 `LogoutUser` 和 `SessionManager`
- [ ] 更新前端 `useAuth` 或新增 auth presentation hook，避免 UI 直接承载认证业务规则
- [ ] 保持登录页视觉组件不迁移、不重构、不改交互表现
- [ ] 替换所有旧 auth import 路径，确保不存在对已删除旧认证实现的引用

## 6. 测试

- [ ] 为 `Nickname` 添加单元测试
- [ ] 为 `Password` 添加单元测试
- [ ] 为 `AuthPolicy` 添加单元测试
- [ ] 为 `UserRole` 权限矩阵添加单元测试
- [ ] 为 `LoginUser` 添加用例测试，覆盖成功、用户不存在、密码错误、输入无效
- [ ] 为 `RegisterUser` 添加用例测试，覆盖成功、昵称重复、昵称无效、密码无效
- [ ] 为 API Route 保留兼容性测试，确认响应结构不变

## 7. 验证与收尾

- [ ] 运行 `pnpm --filter web typecheck`
- [ ] 运行 `pnpm --filter web test:unit`
- [ ] 手动验证登录、注册、获取当前用户、退出登录流程
- [ ] 清理重复认证逻辑，确保旧文件只作为兼容适配或被安全删除
- [ ] 确认旧认证实现文件已删除且没有遗留引用
- [ ] 更新本任务清单为实际完成状态
