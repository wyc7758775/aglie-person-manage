# add-logout-feature: 添加退出登录功能

## 概述

为系统添加退出登录功能，用户点击导航栏中的退出图标后可以安全退出并返回登录页面。同时封装认证状态管理，提供可复用的`useAuth` Hook，支持JWT Token认证和存储方式切换。

## 为什么

1. **用户体验**：用户需要能够退出系统以切换账号或保护隐私
2. **安全性**：退出时需要清除认证信息，防止未授权访问
3. **完整性**：登录和注册功能已实现，退出是认证流程的必要组成部分
4. **可维护性**：封装认证状态管理，未来可轻松更换存储方式
5. **现代化**：引入JWT Token认证，支持Token刷新机制

## 什么变化

- 新增 `/api/auth/logout` API端点
- 新增 `app/lib/auth-storage.ts` - 存储适配器接口
- 新增 `app/lib/hooks/useAuth.ts` - 认证状态Hook
- 修改 `topnav.tsx` 中的退出图标，添加退出逻辑
- 修改登录页面使用 `useAuth` Hook
- 支持JWT Token存储和刷新

## 目标

- 用户点击退出图标后清除认证状态
- 清除JWT Token和保存的凭据
- 重定向用户到登录页面
- 实现Token自动刷新机制
- 封装认证状态管理，支持存储方式切换

## 非目标

- 不引入Redux、Zustand等状态管理库
- 不修改数据库结构
- 不实现OAuth等第三方登录

## 范围

### 包含

- 创建退出登录API端点
- 创建auth-storage.ts存储适配器（支持localStorage + JWT）
- 创建useAuth认证Hook
- 修改topnav.tsx添加退出逻辑
- 修改登录页面使用新的Hook
- 实现Token刷新机制

### 不包含

- Session管理
- 记住我功能（默认开启）
- 多设备登录控制
- OAuth第三方登录

## 方案概述

### 1. 存储适配器 (auth-storage.ts)

```typescript
interface AuthStorage {
  // Token管理
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  removeAccessToken(): void;
  
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  removeRefreshToken(): void;
  
  // 凭据管理（用于自动填充）
  getNickname(): string | null;
  setNickname(value: string): void;
  removeNickname(): void;
  
  getPassword(): string | null;
  setPassword(value: string): void;
  removePassword(): void;
  
  // 清除所有认证数据
  clearAll(): void;
}
```

### 2. useAuth Hook

```typescript
interface User {
  id: string;
  nickname: string;
  isAdmin: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  saveCredentials: (nickname: string, password: string) => void;
  clearCredentials: () => void;
  refreshToken: () => Promise<boolean>;
}

function useAuth(): AuthState & AuthActions
```

### 3. API层

- `POST /api/auth/logout` - 退出登录
- `POST /api/auth/refresh` - 刷新Token

## 技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| Token存储 | localStorage | 简单可靠，用户确认 |
| Token刷新 | 自动刷新机制 | 提升安全性 |
| 存储抽象 | 适配器模式 | 便于未来切换存储方式 |
| 重定向 | Next.js router | 与应用路由系统一致 |

## 用户故事

1. **已登录用户**：点击退出图标后清除Token并返回登录页面
2. **开发者**：需要获取认证状态时调用`useAuth()`
3. **维护者**：未来需要更换存储方式时只需修改auth-storage.ts
4. **安全需求**：Token过期前自动刷新，保持登录状态

## 验收标准

- [ ] 点击退出图标后清除所有认证数据
- [ ] 用户被重定向到登录页面
- [ ] Token过期前自动刷新
- [ ] 退出后无法访问受保护路由
- [ ] useAuth Hook可正常获取认证状态
- [ ] 登录页面可使用useAuth保存凭据
- [ ] 修改存储方式只需修改auth-storage.ts

## 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| Token泄露 | HTTPS传输 + 短期过期 |
| 刷新失败 | 自动登出，提示用户重新登录 |
| 存储方式切换 | 适配器模式隔离 |

## 依赖

无外部依赖，使用现有技术栈。

## 相关变更

- 基于现有的认证系统 (`app/api/auth/`)
- 与i18n变更互补
