# add-i18n-support 设计文档

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      应用程序入口                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │              LanguageProvider (Context)             │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │              useLanguage Hook                │   │   │
│  │  │  ┌─────────────────────────────────────┐   │   │   │
│  │  │  │        i18n Dictionary               │   │   │   │
│  │  │  │  ┌─────────┐  ┌─────────────────┐   │   │   │   │
│  │  │  │  │  common  │  │     login       │   │   │   │   │
│  │  │  │  └─────────┘  │ ┌─────────────┐ │   │   │   │   │
│  │  │  │                │ │  dashboard  │ │   │   │   │   │
│  │  │  │                │ └─────────────┘ │   │   │   │   │
│  │  │  │                └─────────────────┘   │   │   │   │
│  │  │  └─────────────────────────────────────┘   │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                 │
│          ┌───────────────┼───────────────┐                │
│          ▼               ▼               ▼                │
│    ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│    │ 页面组件  │   │ API路由   │   │ 语言切换器 │            │
│    └──────────┘   └──────────┘   └──────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### 组件关系

```
LanguageProvider
├── 提供 LanguageContext
├── 读取 localStorage 初始值
├── 同步用户偏好到数据库（如果已登录）
├── 监听登录状态变化
└── 提供 translate() 函数

useLanguage Hook
├── 返回当前语言设置
├── 返回语言切换函数
├── 返回翻译函数
└── 处理本地存储

LanguageSwitcher 组件
├── 显示当前语言
├── 提供切换按钮
└── 触发页面刷新

翻译字典结构
├── common (通用文本)
│   ├── buttons
│   ├── errors
│   └── messages
├── login (登录页面)
├── dashboard (仪表盘)
│   ├── nav
│   ├── overview
│   ├── project
│   ├── requirement
│   ├── task
│   ├── defect
│   ├── rewards
│   ├── notifications
│   └── setting
└── api (API消息)
```

## 目录结构

```
app/
├── lib/
│   ├── i18n/
│   │   ├── index.ts           # 主入口，导出 Context 和 Hook
│   │   ├── context.tsx        # LanguageContext 定义
│   │   ├── dictionary.ts      # 翻译字典
│   │   ├── dictionary.zh.ts   # 中文翻译
│   │   ├── dictionary.en.ts   # 英文翻译
│   │   └── types.ts           # 类型定义
│   └── auth.ts                # 修改：增加语言偏好字段

ui/
├── language-switcher.tsx      # 语言切换组件
└── dashboard/
    └── topnav.tsx             # 集成语言切换器

api/
├── auth/
│   ├── login/route.ts         # 修改：返回语言设置
│   └── register/route.ts      # 修改：处理语言偏好
└── user/
    └── preference/route.ts    # 新增：用户偏好API

dashboard/
├── overview/page.tsx          # 修改：使用翻译
├── project/page.tsx           # 修改：使用翻译
├── requirement/page.tsx       # 修改：使用翻译
├── task/page.tsx              # 修改：使用翻译
├── defect/page.tsx            # 修改：使用翻译
├── rewards/page.tsx           # 修改：使用翻译
├── dailies/page.tsx           # 修改：使用翻译
├── habits/page.tsx            # 修改：使用翻译
├── todos/page.tsx             # 修改：使用翻译
├── notifications/page.tsx     # 修改：使用翻译
└── setting/page.tsx           # 修改：使用翻译

page.tsx                       # 登录页面：使用翻译
layout.tsx                     # 修改：集成 LanguageProvider
```

## 核心实现

### 1. 类型定义 (types.ts)

```typescript
export type Locale = 'zh-CN' | 'en-US';

export interface LanguagePreferences {
  locale: Locale;
  updatedAt: string;
}

export type NestedDictionary = Record<string, string | NestedDictionary>;

export interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRtl?: boolean;
}
```

### 2. 字典结构

```typescript
// dictionary.zh.ts
export const zhCN = {
  common: {
    buttons: {
      login: '登录',
      register: '注册',
      save: '保存',
      cancel: '取消',
      delete: '删除',
      edit: '编辑',
      confirm: '确认',
    },
    errors: {
      networkError: '网络错误，请稍后重试',
      unauthorized: '未授权，请先登录',
      forbidden: '没有权限执行此操作',
      notFound: '请求的资源不存在',
      serverError: '服务器内部错误',
    },
  },
  login: {
    title: '登录',
    subtitle: '让每天都充实且有意义',
    nickname: '昵称',
    password: '密码',
    confirmPassword: '确认密码',
    loginButton: '登录',
    registerButton: '注册',
    switchingToRegister: '注册',
    switchingToLogin: '登录',
  },
  dashboard: {
    nav: {
      overview: '概览',
      project: '项目',
      requirement: '需求',
      task: '任务',
      defect: '缺陷',
      rewards: '奖励',
      notifications: '通知',
      setting: '设置',
    },
  },
};

// dictionary.en.ts
export const enUS = {
  common: {
    buttons: {
      login: 'Log in',
      register: 'Sign up',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
    },
    errors: {
      networkError: 'Network error, please try again later',
      unauthorized: 'Unauthorized, please log in first',
      forbidden: 'You do not have permission to perform this action',
      notFound: 'The requested resource was not found',
      serverError: 'Internal server error',
    },
  },
  login: {
    title: 'Log in',
    subtitle: 'Make every day fulfilling and rewarding',
    nickname: 'nickname',
    password: 'password',
    confirmPassword: 'confirm password',
    loginButton: 'Login',
    registerButton: 'Sign up',
    switchingToRegister: 'Sign up',
    switchingToLogin: 'Log in',
  },
  dashboard: {
    nav: {
      overview: 'Overview',
      project: 'Project',
      requirement: 'Requirement',
      task: 'Task',
      defect: 'Defect',
      rewards: 'Rewards',
      notifications: 'Notifications',
      setting: 'Setting',
    },
  },
};
```

### 3. LanguageProvider 实现

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Locale, LanguageContextType } from './types';
import { zhCN, enUS } from './dictionary';

const dictionaries = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh-CN');
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化语言设置
  useEffect(() => {
    const stored = localStorage.getItem('user-locale');
    if (stored && (stored === 'zh-CN' || stored === 'en-US')) {
      setLocaleState(stored as Locale);
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language;
      if (browserLang.startsWith('zh')) {
        setLocaleState('zh-CN');
      } else if (browserLang.startsWith('en')) {
        setLocaleState('en-US');
      }
      // 保存默认设置
      localStorage.setItem('user-locale', locale);
    }
    setIsInitialized(true);
  }, []);

  // 同步到数据库（如果已登录）
  useEffect(() => {
    if (!isInitialized) return;
    
    const syncToDatabase = async () => {
      try {
        await fetch('/api/user/preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale }),
        });
      } catch (error) {
        console.error('Failed to sync locale to database:', error);
      }
    };

    // 检查是否已登录（通过API或状态）
    const token = document.cookie.includes('auth-token');
    if (token) {
      syncToDatabase();
    }
  }, [locale, isInitialized]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('user-locale', newLocale);
    // 触发完整页面刷新
    window.location.reload();
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let result: any = dictionaries[locale];
    
    for (const k of keys) {
      result = result?.[k];
    }
    
    if (typeof result !== 'string') {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [placeholder, value]) => str.replace(`{${placeholder}}`, value),
        result
      );
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
```

### 4. 语言切换组件

```typescript
'use client';

import { useLanguage } from '@/app/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        onClick={() => setLocale('zh-CN')}
        className={locale === 'zh-CN' ? 'active' : ''}
      >
        中文
      </button>
      <span className="divider">|</span>
      <button
        onClick={() => setLocale('en-US')}
        className={locale === 'en-US' ? 'active' : ''}
      >
        EN
      </button>
    </div>
  );
}
```

### 5. API用户偏好路由

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale } = body;

    // 验证locale值
    if (!['zh-CN', 'en-US'].includes(locale)) {
      return NextResponse.json(
        { success: false, message: 'Invalid locale' },
        { status: 400 }
      );
    }

    // TODO: 更新数据库中的用户语言偏好
    // 需要与现有的用户认证系统集成

    return NextResponse.json({ success: true, locale });
  } catch (error) {
    console.error('Failed to update preference:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update preference' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // TODO: 从数据库获取用户语言偏好
    // 返回格式: { locale: 'zh-CN' | 'en-US' }

    return NextResponse.json({ locale: 'zh-CN' });
  } catch (error) {
    console.error('Failed to get preference:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get preference' },
      { status: 500 }
    );
  }
}
```

### 6. API消息国际化

```typescript
// API响应消息国际化映射
export const apiMessages = {
  'zh-CN': {
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    registerSuccess: '注册成功',
    registerFailed: '注册失败',
    nicknameRequired: '请填写昵称',
    passwordRequired: '请填写密码',
    passwordTooShort: '密码长度至少6位',
    passwordMismatch: '两次输入的密码不一致',
    userNotFound: '用户不存在',
    wrongPassword: '密码错误',
    userAlreadyExists: '用户已存在',
  },
  'en-US': {
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    registerSuccess: 'Registration successful',
    registerFailed: 'Registration failed',
    nicknameRequired: 'Please enter your nickname',
    passwordRequired: 'Please enter your password',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    userNotFound: 'User not found',
    wrongPassword: 'Incorrect password',
    userAlreadyExists: 'User already exists',
  },
};
```

## 翻译键命名规范

### 规则

1. **层级结构**：使用点分隔符表示层级
2. **语义化命名**：键名应表达其用途，而非位置
3. **一致性**：相同类型的文本使用相同的命名模式

### 示例

```
# 通用按钮
common.buttons.save
common.buttons.cancel
common.buttons.delete

# 错误消息
common.errors.networkError
common.errors.unauthorized

# 导航
dashboard.nav.overview
dashboard.nav.project

# 页面标题
login.title
login.subtitle

# 表单字段
login.nickname
login.password
login.confirmPassword
```

## 性能考虑

1. **懒加载字典**：仅加载当前语言的字典
2. **避免深层嵌套**：翻译键查找最多3-4层
3. **Context优化**：LanguageProvider位于顶层，避免不必要的重渲染

## 测试策略

1. **单元测试**：测试翻译函数的各种场景
2. **集成测试**：测试语言切换流程
3. **视觉测试**：确保所有页面文本正确显示

## 扩展性

### 添加新语言

1. 在 `dictionary.ts` 中添加新的语言导出
2. 在 `dictionaries` 对象中添加映射
3. 更新类型定义中的 Locale 联合类型

### 添加新翻译

1. 在对应模块的字典文件中添加新键值对
2. 保持其他语言版本的同步更新
3. 使用一致的命名规范
