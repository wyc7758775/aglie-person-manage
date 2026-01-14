# add-logout-feature 设计文档

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      认证模块架构                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   useAuth Hook                       │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │              AuthContext                    │   │   │
│  │  │  ┌─────────────────────────────────────┐   │   │   │
│  │  │  │         AuthStorage                 │   │   │   │
│  │  │  │  ┌─────────┐  ┌─────────────────┐   │   │   │   │
│  │  │  │  │ localStorage │ JWT Tokens │   │   │   │   │
│  │  │  │  └─────────┘  └─────────────────┘   │   │   │   │
│  │  │  └─────────────────────────────────────┘   │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                 │
│          ┌───────────────┼───────────────┐                │
│          ▼               ▼               ▼                │
│    ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│    │ 登录页面 │   │ TopNav   │   │  API路由  │            │
│    └──────────┘   └──────────┘   └──────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## 文件结构

```
app/
├── lib/
│   ├── auth-storage.ts      # 存储适配器
│   └── hooks/
│       └── useAuth.ts       # 认证Hook
├── api/
│   └── auth/
│       ├── logout/
│       │   └── route.ts     # 退出API
│       └── refresh/
│           └── route.ts     # Token刷新API
└── ui/
    └── dashboard/
        └── topnav.tsx       # 修改：使用useAuth
```

## 核心实现

### 1. 存储适配器 (auth-storage.ts)

```typescript
// app/lib/auth-storage.ts

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  NICKNAME: 'lastLoginNickname',
  PASSWORD: 'lastLoginPassword',
} as const;

export interface AuthStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  removeAccessToken(): void;
  
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  removeRefreshToken(): void;
  
  getNickname(): string | null;
  setNickname(value: string): void;
  removeNickname(): void;
  
  getPassword(): string | null;
  setPassword(value: string): void;
  removePassword(): void;
  
  clearAll(): void;
}

export const authStorage: AuthStorage = {
  getAccessToken: () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token) => localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  removeAccessToken: () => localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
  
  getRefreshToken: () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token) => localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: () => localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
  
  getNickname: () => localStorage.getItem(STORAGE_KEYS.NICKNAME),
  setNickname: (value) => localStorage.setItem(STORAGE_KEYS.NICKNAME, value),
  removeNickname: () => localStorage.removeItem(STORAGE_KEYS.NICKNAME),
  
  getPassword: () => localStorage.getItem(STORAGE_KEYS.PASSWORD),
  setPassword: (value) => localStorage.setItem(STORAGE_KEYS.PASSWORD, value),
  removePassword: () => localStorage.removeItem(STORAGE_KEYS.PASSWORD),
  
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
```

### 2. useAuth Hook

```typescript
// app/lib/hooks/useAuth.ts

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage, AuthStorage } from '../auth-storage';

export interface User {
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

interface AuthContextValue extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const token = authStorage.getAccessToken();
    const nickname = authStorage.getNickname();
    
    if (token && nickname) {
      setState({
        isLoggedIn: true,
        user: { id: '', nickname, isAdmin: false },
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (user: User) => {
    setState({ isLoggedIn: true, user, isLoading: false });
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    authStorage.clearAll();
    setState({ isLoggedIn: false, user: null, isLoading: false });
    router.push('/');
  };

  const saveCredentials = (nickname: string, password: string) => {
    authStorage.setNickname(nickname);
    authStorage.setPassword(password);
  };

  const clearCredentials = () => {
    authStorage.removeNickname();
    authStorage.removePassword();
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = authStorage.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        authStorage.setAccessToken(data.accessToken);
        if (data.refreshToken) {
          authStorage.setRefreshToken(data.refreshToken);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, saveCredentials, clearCredentials, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 3. 退出API

```typescript
// app/api/auth/logout/route.ts

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ success: true, message: '退出成功' });
  } catch (error) {
    console.error('退出失败:', error);
    return NextResponse.json(
      { success: false, message: '退出失败' },
      { status: 500 }
    );
  }
}
```

### 4. Token刷新API

```typescript
// app/api/auth/refresh/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: '无效的刷新令牌' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      accessToken: 'new_access_token_' + Date.now(),
      refreshToken: 'new_refresh_token_' + Date.now(),
    });
  } catch (error) {
    console.error('Token刷新失败:', error);
    return NextResponse.json(
      { success: false, message: 'Token刷新失败' },
      { status: 500 }
    );
  }
}
```

### 5. TopNav修改

```typescript
// app/ui/dashboard/topnav.tsx (部分修改)

import { useAuth } from '@/app/lib/hooks/useAuth';

// 在组件中使用
const { logout, user } = useAuth();

// 修改退出图标（第241行附近）
<button
  onClick={logout}
  className="w-10 h-10 flex items-center justify-center transition-all duration-300 ease-in-out rounded-full bg-transparent border-none cursor-pointer"
>
  <svg>...</svg>
</button>
```

## 修改文件清单

| 文件 | 修改内容 |
|------|----------|
| `app/lib/auth-storage.ts` | 新建 |
| `app/lib/hooks/useAuth.ts` | 新建 |
| `app/api/auth/logout/route.ts` | 新建 |
| `app/api/auth/refresh/route.ts` | 新建 |
| `app/ui/dashboard/topnav.tsx` | 使用useAuth Hook |
| `app/layout.tsx` | 包裹AuthProvider |

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
