# Be.run UI 设计规范 - Memory 速查表

> 更新时间: 2026-03-07  
> 适用范围: apps/web 项目所有 UI 开发  
> **使用方法**: 每次修改 UI 前，先查看此规范确保一致性

---

## 🎨 色彩系统

### 主色（Indigo/Blue 渐变）
```
渐变: from-indigo-500 to-blue-500
Hover: from-indigo-600 to-blue-600
阴影: shadow-indigo-500/30
悬停阴影: shadow-indigo-500/50
```

### 状态色
| 状态 | 背景 | 文字 | 边框 | 圆点 |
|------|------|------|------|------|
| 成功 | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` | `bg-emerald-500` |
| 警告 | `bg-amber-50` | `text-amber-700` | `border-amber-200` | `bg-amber-500` |
| 危险 | `bg-rose-50` | `text-rose-700` | `border-rose-200` | `bg-rose-500` |

### 优先级色
| 优先级 | 样式 | 图标 |
|--------|------|------|
| 高 | `bg-rose-50 text-rose-600 border-rose-200` | 🔥 |
| 中 | `bg-amber-50 text-amber-600 border-amber-200` | ⚡ |
| 低 | `bg-slate-50 text-slate-500 border-slate-200` | 🌱 |

### 中性色
- 背景: `bg-white/90 backdrop-blur-md`
- 边框: `border-slate-100`
- 主文字: `text-slate-800`
- 次文字: `text-slate-500`
- 浅色文字: `text-slate-400`

---

## 📐 布局规范

### 页面结构（参考 t2B5Z 需求列表页）

```
┌─────────────────────────────────────────┐
│         Top Navigation (60px)           │ bg-white, border-bottom
│  Logo ───────────────────── UserMenu    │
├─────────────────────────────────────────┤
│                                         │
│           Content Area                  │ p-6, bg-slate-50/50
│  ┌───────────────────────────────────┐  │
│  │         Filter Row                │  │ justify-between
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │         Table Card                │  │ rounded-2xl, bg-white
│  │  ┌─────────────────────────────┐  │  │
│  │  │       Table Content         │  │  │ overflow-x-auto
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 关键尺寸
- **导航栏高度**: 60px
- **内容区内边距**: p-6 (24px)
- **区块间距**: gap-5 (20px)
- **容器圆角**: rounded-2xl (16px)
- **按钮圆角**: rounded-xl (12px)
- **标签圆角**: rounded-full

---

## 🔤 排版规范

| 层级 | 样式 |
|------|------|
| 页面标题 | `text-xl font-bold tracking-tight` |
| 卡片标题 | `text-lg font-bold leading-tight line-clamp-2` |
| 正文 | `text-sm leading-relaxed line-clamp-2` |
| 标签文字 | `text-xs font-medium` |
| 徽章数字 | `text-xs font-semibold` |

---

## 📦 组件索引

### 基础组件 (app/components/ui/)

| 组件 | 路径 | 关键 Props |
|------|------|-----------|
| Button | `app/ui/button.tsx` | `variant`, `size` |
| Modal | `app/components/ui/modal.tsx` | `isOpen`, `onClose`, `title` |
| ConfirmDialog | `app/components/ui/confirm-dialog.tsx` | `isOpen`, `onConfirm`, `onCancel` |
| FormInput | `app/components/ui/form-input.tsx` | `label`, `error` |
| FormSelect | `app/components/ui/form-select.tsx` | `label`, `options` |
| FormDatePicker | `app/components/ui/form-date-picker.tsx` | `label`, `value` |
| FormRadio | `app/components/ui/form-radio.tsx` | `label`, `options` |
| FormLabel | `app/components/ui/form-label.tsx` | `required` |
| Toast | `app/ui/toast.tsx` | `type`, `message` |

### 需求管理组件
- `requirement-table.tsx` - 需求列表表格
- `requirement-card.tsx` - 需求卡片
- `requirement-form.tsx` - 需求表单
- `requirement-kanban.tsx` - 需求看板
- `requirement-slide-panel.tsx` - 侧滑详情面板
- `requirement-badges.tsx` - 状态徽章
- `sub-requirement-list.tsx` - 子需求列表
- `sub-requirement-modal.tsx` - 子需求弹窗

### 任务管理组件
- `task-card.tsx` - 任务卡片
- `todo-create-drawer.tsx` - 待办创建抽屉
- `related-task-list.tsx` - 关联任务列表
- `empty-task-state.tsx` - 空状态

### 习惯管理组件
- `habits/HabitDetailDrawer.tsx` - 习惯详情抽屉
- `habits/StatsCard.tsx` - 统计卡片
- `habits/PanelHeader.tsx` - 面板头部
- `habits/InfoGrid.tsx` - 信息网格
- `habits/InlineCounter.tsx` - 行内计数器
- `habits/UnsavedChangesDialog.tsx` - 未保存提示

### 导航组件
- `sidenav.tsx` - 侧边导航
- `topnav.tsx` - 顶部导航
- `nav-links.tsx` - 导航链接
- `breadcrumb-nav.tsx` - 面包屑
- `view-switcher.tsx` - 视图切换
- `project-tab-menu.tsx` - 项目标签

### 其他组件
- `section-container.tsx` - 区域容器
- `comment-section.tsx` - 评论区域
- `operation-log-list.tsx` - 操作日志
- `field-change-log.tsx` - 字段变更
- `markdown-editor-field.tsx` - Markdown 编辑器

### 空状态组件
- `empty-project-state.tsx`
- `empty-requirement-state.tsx`
- `empty-defect-state.tsx`
- `empty-task-state.tsx`

### 图标组件

#### Heroicons (app/ui/icons/heroicons/)
共 24 个: UserGroupIcon, CalendarIcon, DocumentTextIcon, CurrencyDollarIcon, ChartBarIcon, ShieldCheckIcon, ArrowPathIcon, GiftIcon, CalendarDaysIcon, XMarkIcon, ClockIcon, EyeSlashIcon, HeartIcon, ArrowRightIcon, PowerIcon, MagnifyingGlassIcon, ArrowLeftIcon, BellIcon, HomeIcon, EllipsisVerticalIcon, UserCircleIcon, TagIcon, CheckCircleIcon, FlagIcon

#### 其他图标
- **action/**: PencilIcon, LogoutIcon, TrashIcon, CheckIcon, PlusIcon, ChevronRightIcon, ChevronDownIcon
- **feedback/**: SettingsIcon, StarIcon, DefectIcon, NotificationIcon
- **navigation/**: DailiesIcon, TodosIcon, ProjectIcon, HabitsIcon, RewardIcon, DashboardIcon, DatabaseIcon, TaskIcon
- **form/**: EyeOffIcon, LockIcon, UserIcon, EyeIcon

---

## ⚡ 快速代码片段

### 状态标签
```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
  标签文字
</span>
```

### 主按钮
```tsx
<button className="
  flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
  text-sm font-semibold transition-all duration-300 ease-out
  bg-gradient-to-r from-indigo-500 to-blue-500 
  hover:from-indigo-600 hover:to-blue-600 
  text-white shadow-lg shadow-indigo-500/30 
  hover:shadow-indigo-500/50
  hover:-translate-y-0.5 hover:scale-[1.02]
  active:scale-[0.98] active:translate-y-0
">
  按钮文字
</button>
```

### 添加按钮（虚线样式）
```tsx
<button className="
  flex w-full items-center justify-center gap-2
  rounded-xl border-2 border-dashed border-slate-200
  bg-slate-50/50 py-3.5 text-sm font-medium text-slate-500
  transition-all duration-300 ease-out
  hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600
  hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5
">
  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
    <PlusIcon className="h-3.5 w-3.5" />
  </div>
  添加文字
</button>
```

### 区域容器 (SectionContainer)
```tsx
<div className="
  bg-white/90 backdrop-blur-md rounded-2xl p-5 
  shadow-lg shadow-slate-200/50 border border-slate-100 
  flex flex-col min-h-0
">
  {/* Header */}
  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
    <h2 className="text-xl font-bold text-slate-800 tracking-tight">标题</h2>
    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
      12
    </span>
  </div>
  {/* Content */}
</div>
```

### 进度条
```tsx
<div className="h-2.5 rounded-full overflow-hidden shadow-inner relative bg-slate-100">
  <div 
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }} 
  />
  <div
    className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 transition-all duration-700"
    style={{ width: '60%' }}
  />
</div>
```

---

## 📱 页面模板

### 列表页模板
```tsx
export default function ListPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* 60px 高度导航栏 */}
      <nav className="h-[60px] bg-white border-b border-slate-100 px-8 flex items-center justify-between">
        {/* Logo & Nav */}
        {/* User Actions */}
      </nav>

      {/* 内容区 */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Filter Row */}
          <div className="flex items-center justify-between">
            {/* Filters & Actions */}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden">
            {/* Table Content */}
          </div>
        </div>
      </main>
    </div>
  );
}
```

### 表单页模板
```tsx
<main className="p-6">
  <div className="max-w-3xl mx-auto">
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-800">标题</h1>
      </div>
      <form className="space-y-4">
        {/* Form Fields */}
      </form>
    </div>
  </div>
</main>
```

### 详情页模板
```tsx
<main className="p-6">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <SectionContainer title="主内容" badge="12">
          {/* Content */}
        </SectionContainer>
      </div>
      <div className="space-y-5">
        <SectionContainer title="侧边栏">
          {/* Sidebar */}
        </SectionContainer>
      </div>
    </div>
  </div>
</main>
```

---

## ✅ 检查清单

添加新 UI 时检查:
- [ ] 是否使用了正确的颜色（Indigo/Blue 渐变）
- [ ] 是否遵循了间距规范（4px 基线）
- [ ] 是否有 hover 和 active 状态
- [ ] 是否有适当的过渡动画（300-500ms）
- [ ] 是否检查了已有组件可以复用
- [ ] 是否提供了 TypeScript Props 类型
- [ ] 空状态是否已处理

---

## 🔗 相关文件

- 完整规范: `apps/web/UI_DESIGN_SPEC.md`
- Tailwind 配置: `apps/web/tailwind.config.ts`
- 组件目录: `apps/web/app/ui/`, `apps/web/app/components/ui/`
