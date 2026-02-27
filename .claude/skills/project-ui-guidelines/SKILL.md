# Agile Person Manage UI 规范

> **版本**: v1.2
> **更新日期**: 2026-02-23
> **状态**: 正式发布
> **变更**: 新增通用下拉选择器 DropdownOptions 组件规范

本项目是敏捷个人管理系统，基于 Next.js + Tailwind CSS 构建。本文档总结了项目中的 UI 设计规范和组件样式标准。

## 设计原则

### 设计理念

本项目采用 **"温暖复古 + 现代简约"** 的设计风格，核心理念是**"将生活产品化"**，致敬《人人都是产品经理》一书。设计目标是创造一个既专业又温馨的个人项目管理空间。

### 设计关键词

- **温暖**：柔和的渐变色彩、圆润的边角
- **复古**：打字机字体、徽章元素、墨渍纹理
- **玻璃态**：毛玻璃效果、半透明层级
- **有机**：流畅的动画、自然的过渡
- **紧凑**：高密度信息布局、减少不必要的留白

## 紧凑UI设计原则

### 设计目标

提升界面信息密度，在保持可读性和美观的前提下，减少滚动需求，让用户能够在一个屏幕内看到更多内容。

### 核心调整（v1.1）

| 元素类型 | 原尺寸 | 调整后 | 变化 |
|---------|--------|--------|------|
| 图标 | w-5 h-5 (20px) | w-4 h-4 (16px) | -20% |
| 按钮内边距 | px-4 py-2 | px-3 py-1.5 | -25% |
| 标题文字 | text-xl (20px) | text-lg (18px) | -10% |
| 卡片内边距 | p-5 (20px) | p-4 (16px) | -20% |
| 元素间距 | gap-4 (16px) | gap-3 (12px) | -25% |
| 导航按钮 | w-10 h-10 | w-8 h-8 | -20% |

### 间距映射表

```
原尺寸 → 调整后
p-6 (24px) → p-4 (16px)
p-5 (20px) → p-4 (16px)
p-4 (16px) → p-3 (12px)
gap-6 (24px) → gap-4 (16px)
gap-4 (16px) → gap-3 (12px)
gap-3 (12px) → gap-2 (8px)
```

## 色彩系统

### 主色调

| 色彩名称 | Hex 值 | Tailwind 类 | 使用场景 |
|----------|--------|-------------|----------|
| 古铜金 | `#d4a574` | - | Logo 渐变起始色 |
| 深古铜 | `#654321` | - | Logo 渐变结束色 |
| 琥珀橙 | `#fb923c` | `orange-400` | 强调色、CTA 按钮 |
| 深橙 | `#ea580c` | `orange-600` | 悬停状态、激活态 |

### 功能色

| 状态 | 颜色 | 背景色 | 边框色 |
|------|------|--------|--------|
| 正常 | `emerald-500` | `bg-emerald-50` | `border-emerald-200` |
| 有风险 | `amber-500` | `bg-amber-50` | `border-amber-200` |
| 失控 | `rose-500` | `bg-rose-50` | `border-rose-200` |
| 高优先级 | `rose-600` | `bg-rose-50` | `border-rose-200` |
| 中优先级 | `amber-600` | `bg-amber-50` | `border-amber-200` |
| 低优先级 | `slate-500` | `bg-slate-50` | `border-slate-200` |

### 渐变方案

**登录页背景渐变：**
```css
background: linear-gradient(135deg, #fed7aa 0%, #fb923c 25%, #a78bfa 75%, #c084fc 100%);
```

**按钮渐变：**
```css
bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600
```

## 字体系统

```css
/* 正文字体 */
font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;

/* 标题字体 */
font-family: 'Poppins', 'Noto Sans SC', sans-serif;

/* 代码/复古字体 */
font-family: 'Courier New', Courier, monospace;
```

| 样式 | 字体 | 大小 | 字重 | 使用场景 |
|------|------|------|------|----------|
| H1 | Poppins | 20px | 600 | 页面主标题 (text-xl) |
| H2 | Poppins | 18px | 600 | 区块标题 (text-lg) |
| H3 | Poppins | 16px | 600 | 卡片标题 (text-base) |
| Body | Noto Sans SC | 14px | 400 | 正文内容 (text-sm) |
| Small | Noto Sans SC | 12px | 400 | 辅助文字 (text-xs) |

## 组件规范

### 主按钮（CTA）
```tsx
className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-300"
```

### 玻璃态卡片
```tsx
className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl"
```

### 通用下拉选择器 (DropdownOptions)

```tsx
import DropdownOptions from '@/app/ui/dropdown-options';

<DropdownOptions
  options={[
    { value: 'todo', label: '待办' },
    { value: 'in_progress', label: '进行中' },
    { value: 'done', label: '已完成' },
  ]}
  value={status}
  onChange={setStatus}
  minWidth={100}
/>
```

**Props 说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `options` | `DropdownOption<T>[]` | 是 | 选项列表 |
| `value` | `T` | 是 | 当前选中的值 |
| `onChange` | `(value: T) => void` | 是 | 值变化回调 |
| `renderTrigger` | `(option, isOpen) => ReactNode` | 否 | 自定义触发器 |
| `renderOption` | `(option, isSelected) => ReactNode` | 否 | 自定义选项渲染 |
| `minWidth` | `number \| string` | 否 | 下拉菜单最小宽度 |
| `disabled` | `boolean` | 否 | 是否禁用 |

### 预定义选项

```tsx
export const STATUS_OPTIONS = [
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'done', label: '已完成' },
  { value: 'accepted', label: '已验收' },
  { value: 'cancelled', label: '已取消' },
  { value: 'closed', label: '已关闭' },
];

export const PRIORITY_OPTIONS = [
  { value: 'p0', label: 'P0' },
  { value: 'p1', label: 'P1' },
  { value: 'p2', label: 'P2' },
  { value: 'p3', label: 'P3' },
  { value: 'p4', label: 'P4' },
];
```

## 动效规范

| 场景 | 时长 | 缓动函数 |
|------|------|----------|
| 悬停状态 | 200-300ms | `ease-out` |
| 卡片悬浮 | 500ms | `ease-out` |
| 页面切换 | 300ms | `ease-in-out` |
| 导航指示器 | 600-800ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

## 布局规范

### 页面结构

```
Dashboard Layout
├── 左侧边栏 (fixed, 80px 宽)
│   ├── Logo
│   ├── 主导航（3 项）
│   ├── 选项导航（2 项）
│   └── 用户区
├── 主内容区
│   ├── 顶部标题栏
│   └── 内容区域
└── 可选：右侧边栏
```

### 栅格系统

- 项目卡片网格：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- 卡片间距：`gap-6`
- 页面内边距：`p-6`（桌面）、`p-4`（移动）

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.2 | 2026-02-23 | 新增通用下拉选择器 DropdownOptions 组件规范 |
| v1.1 | 2026-02-21 | 全面优化为紧凑UI设计，提升信息密度20-25% |
| v1.0 | 2026-02-19 | 初始版本，整合现有设计规范 |
