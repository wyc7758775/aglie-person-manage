# consolidate-icons 设计文档

## 架构设计

### 目录结构

```
app/ui/icons/
├── index.ts                    # 统一导出入口
├── navigation/                 # 导航类图标
│   ├── DashboardIcon.tsx
│   ├── ProjectIcon.tsx
│   ├── TaskIcon.tsx
│   ├── DatabaseIcon.tsx
│   ├── DailiesIcon.tsx
│   ├── HabitsIcon.tsx
│   ├── TodosIcon.tsx
│   └── RewardIcon.tsx
├── action/                     # 操作类图标
│   ├── ChevronRightIcon.tsx
│   ├── PlusIcon.tsx           # Heroicons 包装
│   ├── CheckIcon.tsx           # Heroicons 包装
│   ├── PencilIcon.tsx           # Heroicons 包装
│   ├── TrashIcon.tsx            # Heroicons 包装
│   └── LogoutIcon.tsx
├── form/                       # 表单类图标
│   ├── UserIcon.tsx
│   ├── LockIcon.tsx
│   ├── EyeIcon.tsx
│   └── EyeOffIcon.tsx
├── feedback/                   # 反馈类图标
│   ├── NotificationIcon.tsx
│   ├── SettingsIcon.tsx
│   ├── StarIcon.tsx
│   └── DefectIcon.tsx
└── heroicons/                  # Heroicons 包装
    ├── CalendarIcon.tsx
    ├── ClockIcon.tsx
    ├── ArrowRightIcon.tsx
    ├── ArrowLeftIcon.tsx
    ├── ArrowPathIcon.tsx
    ├── XMarkIcon.tsx
    ├── PowerIcon.tsx
    ├── MagnifyingGlassIcon.tsx
    └── ArrowSolidIcon.tsx
```

## 核心设计决策

### 1. Heroicons 包装策略

**决策**：保留 `@heroicons/react` 依赖，创建包装模块

**理由**：
- 减少依赖管理复杂性
- 保持 Heroicons 官方维护和更新
- 包装层便于未来统一迁移

**实现**：

```typescript
// app/ui/icons/heroicons/CalendarIcon.tsx
import { CalendarIcon as HeroCalendarIcon } from '@heroicons/react/24/outline';

export const CalendarIcon: React.FC<{ className?: string }> = (props) => (
  <HeroCalendarIcon {...props} />
);
```

### 2. 自定义图标设计

**决策**：直接内联 SVG，无外部依赖

**理由**：
- 减少构建包大小
- 保持现有样式一致
- 便于自定义修改

**IconProps 接口**：

```typescript
interface IconProps {
  className?: string;
  color?: string;
}
```

默认值：
- `className = "w-5 h-5"` 或 `"w-4 h-4"`（根据原设计）
- `color = "currentColor"`

### 3. 统一导出设计

`app/ui/icons/index.ts` 将导出：

```typescript
// 导出所有自定义图标
export { DashboardIcon } from './navigation/DashboardIcon';
export { ProjectIcon } from './navigation/ProjectIcon';
// ... 所有 39 个图标

// 导出所有 Heroicons 包装
export { CalendarIcon } from './heroicons/CalendarIcon';
// ... 所有 10 个 Heroicons

// 图标映射对象（向后兼容）
export const Icons = {
  dashboard: DashboardIcon,
  project: ProjectIcon,
  // ... 所有映射
} as const;

export type IconName = keyof typeof Icons;
```

## 组件导入变更

### 变更前后对比

**变更前**：
```typescript
// 自定义图标
import { UserIcon, LockIcon } from '@/app/ui/icons';

// Heroicons
import { CalendarIcon } from '@heroicons/react/24/outline';
```

**变更后**：
```typescript
// 所有图标统一路径
import { UserIcon, LockIcon, CalendarIcon } from '@/app/ui/icons';
```

### 迁移文件清单（18 个）

| 文件 | Heroicons 图标 | 新导入路径 |
|------|----------------|------------|
| dashboard/notifications/page.tsx | CalendarIcon, CheckIcon, XMarkIcon | `@/app/ui/icons/heroicons` |
| dashboard/habits/page.tsx | PlusIcon | `@/app/ui/icons/action` |
| dashboard/overview/page.tsx | CalendarIcon, PlusIcon | `@/app/ui/icons/heroicons`, `@/app/ui/icons/action` |
| dashboard/requirement/page.tsx | CalendarIcon | `@/app/ui/icons/heroicons` |
| dashboard/task/page.tsx | CalendarIcon, ClockIcon | `@/app/ui/icons/heroicons` |
| dashboard/defect/page.tsx | CalendarIcon, ClockIcon | `@/app/ui/icons/heroicons` |
| dashboard/setting/page.tsx | CalendarIcon | `@/app/ui/icons/heroicons` |
| dashboard/project/page.tsx | CalendarIcon | `@/app/ui/icons/heroicons` |
| ui/login-form.tsx | ArrowRightIcon, CalendarIcon | `@/app/ui/icons/heroicons` |
| ui/search.tsx | MagnifyingGlassIcon | `@/app/ui/icons/heroicons` |
| ui/invoices/status.tsx | CheckIcon, ClockIcon | `@/app/ui/icons/action`, `@/app/ui/icons/heroicons` |
| ui/invoices/edit-form.tsx | CalendarIcon | `@/app/ui/icons/heroicons` |
| ui/invoices/buttons.tsx | PencilIcon, PlusIcon, TrashIcon | `@/app/ui/icons/action` |
| ui/invoices/create-form.tsx | CalendarIcon | `@/app/ui/icons/heroicons` |
| ui/invoices/pagination.tsx | ArrowLeftIcon, ArrowRightIcon | `@/app/ui/icons/heroicons` |
| ui/dashboard/sidenav.tsx | PowerIcon | `@/app/ui/icons/heroicons` |
| ui/dashboard/revenue-chart.tsx | CalendarIcon | `@/app/ui/icons/heroicons` |
| ui/dashboard/latest-invoices.tsx | ArrowPathIcon | `@/app/ui/icons/heroicons` |
| ui/dashboard/section-container.tsx | PlusIcon | `@/app/ui/icons/action` |
| ui/dashboard/task-card.tsx | CheckIcon | `@/app/ui/icons/action` |

## 清理策略

删除 `app/ui/icons.tsx` 文件（419 行）

**时机**：在所有导入路径修改完成并验证后

**验证**：
- 运行 `rg "from.*@/app/ui/icons"'` 确认无残留引用
- 运行 `pnpm build` 确保构建成功

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 导入路径遗漏 | 构建失败 | 逐步修改，每步验证构建 |
| Heroicons 版本兼容 | 图标显示异常 | 使用 Heroicons 官方包装，保持兼容 |
| 类型错误 | TypeScript 编译失败 | 确保包装组件类型正确 |

## 性能影响

- **构建包大小**：略微增加（包装层）
- **运行时影响**：无（包装组件透明）
- **Tree-shaking**：保持有效（单独导出）
