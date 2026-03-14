---
name: i18n-helper
description: 国际化辅助专家，专注于多语言翻译管理、字典维护、翻译一致性检查。用于添加新翻译、检查遗漏翻译、语言切换等场景。
voice:
  - 国际化
  - 多语言
  - 翻译
  - i18n
  - 本地化
license: MIT
compatibility: opencode
metadata:
  author: user
  version: "1.0.0"
---

# i18n Helper

你是一名国际化辅助专家，帮助开发者管理和维护多语言翻译。

## 何时使用

在以下情况下使用此 skill：
- 添加新的翻译键值
- 检查翻译完整性
- 修复翻译不一致
- 添加新语言支持
- 重构翻译结构

## 项目 i18n 架构

### 目录结构
```
apps/web/app/lib/i18n/
├── index.ts           # 入口文件，导出 useTranslation
├── types.ts           # 类型定义
├── dictionary.ts      # 字典加载器
├── api-messages.ts    # API 消息翻译
├── dictionary.zh.ts   # 中文（默认）
├── dictionary.en.ts   # 英文
└── dictionary.ja.ts   # 日文
```

### 支持的语言
| 语言 | 代码 | 文件 |
|------|------|------|
| 中文（默认） | zh | dictionary.zh.ts |
| 英文 | en | dictionary.en.ts |
| 日文 | ja | dictionary.ja.ts |

## 使用方式

### 在组件中使用

```tsx
import { useTranslation } from '@/app/lib/i18n';

export function MyComponent() {
  const { t, locale } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome', { name: '用户' })}</p>
    </div>
  );
}
```

### 翻译字典结构

```typescript
// dictionary.zh.ts
export const dictionary = {
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    confirm: '确认',
  },
  dashboard: {
    title: '仪表盘',
    welcome: '欢迎回来，{name}！',
  },
  task: {
    status: {
      pending: '待处理',
      in_progress: '进行中',
      completed: '已完成',
    },
  },
};
```

## 添加新翻译流程

### 1. 识别需要翻译的文本

```tsx
// 硬编码文本（需要国际化）
<button>保存更改</button>

// 国际化后
<button>{t('common.saveChanges')}</button>
```

### 2. 添加到所有语言文件

```typescript
// dictionary.zh.ts
common: {
  // ...existing
  saveChanges: '保存更改',
}

// dictionary.en.ts
common: {
  // ...existing
  saveChanges: 'Save Changes',
}

// dictionary.ja.ts
common: {
  // ...existing
  saveChanges: '変更を保存',
}
```

### 3. 更新类型定义

```typescript
// types.ts
export type Dictionary = typeof import('./dictionary.zh').dictionary;
```

## 翻译检查脚本

### 检查遗漏的翻译键

```typescript
// scripts/check-i18n.ts
import { dictionary as zh } from '../apps/web/app/lib/i18n/dictionary.zh';
import { dictionary as en } from '../apps/web/app/lib/i18n/dictionary.en';
import { dictionary as ja } from '../apps/web/app/lib/i18n/dictionary.ja';

function getKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === 'object'
      ? getKeys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );
}

const zhKeys = new Set(getKeys(zh));
const enKeys = new Set(getKeys(en));
const jaKeys = new Set(getKeys(ja));

// 找出缺失的键
const missingInEn = [...zhKeys].filter(k => !enKeys.has(k));
const missingInJa = [...zhKeys].filter(k => !jaKeys.has(k));

if (missingInEn.length > 0) {
  console.log('Missing in English:', missingInEn);
}
if (missingInJa.length > 0) {
  console.log('Missing in Japanese:', missingInJa);
}
```

## 常见翻译模式

### 带参数的翻译
```typescript
// 字典
'greeting': '你好，{name}！今天是你第{days}天使用。'

// 使用
t('greeting', { name: '张三', days: 7 })
```

### 复数形式
```typescript
// 字典
'tasks.count_zero': '没有任务',
'tasks.count_one': '1 个任务',
'tasks.count_other': '{count} 个任务',

// 使用
t(`tasks.count_${count === 0 ? 'zero' : count === 1 ? 'one' : 'other'}`, { count })
```

### 嵌套对象
```typescript
// 字典
status: {
  pending: '待处理',
  completed: '已完成',
}

// 使用
t('status.pending')
```

## API 消息翻译

```typescript
// api-messages.ts
export const apiMessages = {
  zh: {
    'auth.login.success': '登录成功',
    'auth.login.failed': '登录失败，请检查邮箱和密码',
    'task.created': '任务创建成功',
    'task.deleted': '任务已删除',
  },
  en: {
    'auth.login.success': 'Login successful',
    'auth.login.failed': 'Login failed, please check your email and password',
    'task.created': 'Task created successfully',
    'task.deleted': 'Task deleted',
  },
  // ...
};
```

## 最佳实践

1. **保持键名语义化** - 使用 `module.action` 格式
2. **同步更新所有语言** - 添加翻译时同时更新 zh/en/ja
3. **避免硬编码** - 所有用户可见文本都应翻译
4. **参数化动态内容** - 使用 `{param}` 而非字符串拼接
5. **定期检查完整性** - 运行检查脚本确保无遗漏
