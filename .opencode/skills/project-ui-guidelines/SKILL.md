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

### 可访问性保证

- 最小点击区域保持 ≥36px
- 文字对比度符合 WCAG 2.1 标准
- 支持浏览器缩放正常使用

## 色彩系统

### 主色调

| 色彩名称 | Hex 值 | Tailwind 类 | 使用场景 |
|----------|--------|-------------|----------|
| 古铜金 | `#d4a574` | - | Logo 渐变起始色 |
| 深古铜 | `#654321` | - | Logo 渐变结束色 |
| 琥珀橙 | `#fb923c` | `orange-400` | 强调色、CTA 按钮 |
| 深橙 | `#ea580c` | `orange-600` | 悬停状态、激活态 |
| 品牌主色 | `#EE3F4D` | - | 边框、强调色（旧版） |

### 功能色

| 状态 | 颜色 | 背景色 | 边框色 | 使用场景 |
|------|------|--------|--------|----------|
| 正常 | `emerald-500` | `bg-emerald-50` | `border-emerald-200` | 项目状态：正常 |
| 有风险 | `amber-500` | `bg-amber-50` | `border-amber-200` | 项目状态：有风险 |
| 失控 | `rose-500` | `bg-rose-50` | `border-rose-200` | 项目状态：失控 |
| 高优先级 | `rose-600` | `bg-rose-50` | `border-rose-200` | 优先级标签：高 |
| 中优先级 | `amber-600` | `bg-amber-50` | `border-amber-200` | 优先级标签：中 |
| 低优先级 | `slate-500` | `bg-slate-50` | `border-slate-200` | 优先级标签：低 |

### 中性色

| 色彩名称 | Hex 值 | Tailwind 类 | 使用场景 |
|----------|--------|-------------|----------|
| 纯白 | `#ffffff` | `white` | 卡片背景、文字 |
| 浅灰 | `#f8fafc` | `slate-50` | 页面背景 |
| 中灰 | `#94a3b8` | `slate-400` | 次要文字、图标 |
| 深灰 | `#334155` | `slate-700` | 正文文字 |
| 暗灰 | `#1e293b` | `slate-800` | 标题文字 |
| 近黑 | `#0f172a` | `slate-900` | 强对比元素 |
| 背景灰 | `#F4F1EC` | - | 页面背景（旧版） |

### 渐变方案

**登录页背景渐变：**
```css
background: linear-gradient(135deg, #fed7aa 0%, #fb923c 25%, #a78bfa 75%, #c084fc 100%);
```

**项目卡片类型渐变：**
- Sprint 项目：`from-orange-50 via-orange-100/50 to-amber-50`
- Slow-burn 项目：`from-emerald-50 via-emerald-100/50 to-teal-50`

**进度条渐变：**
- Sprint 项目：`from-orange-400 via-amber-400 to-yellow-400`
- Slow-burn 项目：`from-emerald-400 via-teal-400 to-cyan-400`

**按钮渐变：**
```css
bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600
```

## 字体系统

### 字体家族

```css
/* 正文字体 */
font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;

/* 标题字体 */
font-family: 'Poppins', 'Noto Sans SC', sans-serif;

/* 代码/复古字体 */
font-family: 'Courier New', Courier, monospace;

/* 像素风格（游戏场景） */
font-family: 'Press Start 2P', 'Courier New', monospace;
```

### 字体规格

| 样式 | 字体 | 大小 | 字重 | 行高 | 字间距 | 使用场景 |
|------|------|------|------|------|--------|----------|
| H1 | Poppins | 20px | 600 | 1.3 | -0.02em | 页面主标题 (text-xl) |
| H2 | Poppins | 18px | 600 | 1.3 | -0.02em | 区块标题 (text-lg) |
| H3 | Poppins | 16px | 600 | 1.3 | -0.02em | 卡片标题 (text-base) |
| Body | Noto Sans SC | 14px | 400 | 1.6 | 0.01em | 正文内容 (text-sm) |
| Small | Noto Sans SC | 12px | 400 | 1.5 | 0.005em | 辅助文字 (text-xs) |
| Label | Noto Sans SC | 10px | 500 | 1.4 | 0.05em | 标签、徽章 |
| Brand | Courier New | 10px | 700 | 1.2 | 0.1em | Logo 文字 |

## 间距系统

### 基础间距

| Token | 值 | 使用场景 |
|-------|-----|----------|
| `space-1` | 4px | 图标与文字间距 |
| `space-2` | 8px | 紧凑元素间距 |
| `space-3` | 12px | 标准元素间距 |
| `space-4` | 16px | 卡片内边距 |
| `space-6` | 24px | 区块间距 |
| `space-8` | 32px | 大区块间距 |

### 外边距 (Margin)

| 级别 | Tailwind | 实际值 | 用途 |
|------|----------|--------|------|
| 小 | ml-4 | 16px | 侧边栏偏移 |
| 中 | mb-3 | 12px | 按钮下边距 |
| 大 | mt-4 | 16px | 组件间距 |

### Gap 间距

| 级别 | Tailwind | 实际值 | 用途 |
|------|----------|--------|------|
| 小 | gap-2 | 8px | 紧凑布局 |
| 中 | gap-4 | 16px | Grid 间距 |
| 大 | gap-6 | 24px | 宽松布局 |

## 圆角系统

| Token | 值 | 使用场景 |
|-------|-----|----------|
| `rounded-sm` | 4px | 小按钮、标签 |
| `rounded-lg` | 8px | 输入框、小卡片 |
| `rounded-xl` | 12px | 按钮、头像 |
| `rounded-2xl` | 16px | 项目卡片 |
| `rounded-full` | 9999px | 圆形元素、药丸标签 |

## 阴影规范

| 级别 | Tailwind | 实际效果 | 用途 |
|------|----------|----------|------|
| 小 | shadow-sm | 0 1px 2px 0 rgba(0,0,0,0.05) | 小卡片、图标 |
| 中 | shadow-md | 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1) | 主卡片 |
| 大 | shadow-lg | 0 10px 15px -3px rgba(0,0,0,0.1) | 按钮悬停 |
| 彩色 | shadow-orange-500/30 | 品牌色阴影 | 渐变按钮 |

## 组件规范

### 通用下拉选择器 (DropdownOptions)

用于状态、优先级等选项的下拉选择，支持自定义触发器和选项渲染。

**基础用法：**
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

**使用 Badge 作为触发器（表格内使用）：**
```tsx
import DropdownOptions from '@/app/ui/dropdown-options';
import { StatusBadge, PriorityBadge } from './requirement-badges';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from './requirement-table';

// 状态选择器
<DropdownOptions
  options={STATUS_OPTIONS}
  value={status}
  onChange={handleStatusChange}
  minWidth={100}
  renderTrigger={() => <StatusBadge status={status} />}
  renderOption={(option) => <StatusBadge status={option.value} />}
/>

// 优先级选择器
<DropdownOptions
  options={PRIORITY_OPTIONS}
  value={priority}
  onChange={handlePriorityChange}
  minWidth={80}
  renderTrigger={() => <PriorityBadge priority={priority} />}
  renderOption={(option) => <PriorityBadge priority={option.value} />}
/>
```

**表单中的下拉选择器：**
```tsx
<DropdownOptions
  options={STATUS_OPTIONS}
  value={formData.status}
  onChange={(value) => handleChange('status', value)}
  minWidth="100%"
  disabled={isLoading}
  renderTrigger={(selectedOption, isOpen) => (
    <div className="w-full flex items-center justify-between px-3.5 text-xs"
      style={{
        height: '38px',
        backgroundColor: '#F5F0F0',
        borderRadius: '10px',
        color: '#1A1D2E',
      }}>
      <span>{selectedOption.label}</span>
      <ChevronDownIcon className="w-4 h-4" style={{ color: 'rgba(26, 29, 46, 0.33)' }} />
    </div>
  )}
  renderOption={(option) => (
    <span className="text-xs">{option.label}</span>
  )}
/>
```

**预定义选项配置：**
```tsx
// 状态选项（从 requirement-table.tsx 导出）
export const STATUS_OPTIONS = [
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'done', label: '已完成' },
  { value: 'accepted', label: '已验收' },
  { value: 'cancelled', label: '已取消' },
  { value: 'closed', label: '已关闭' },
];

// 优先级选项（从 requirement-table.tsx 导出）
export const PRIORITY_OPTIONS = [
  { value: 'p0', label: 'P0' },
  { value: 'p1', label: 'P1' },
  { value: 'p2', label: 'P2' },
  { value: 'p3', label: 'P3' },
  { value: 'p4', label: 'P4' },
];
```

**Props 说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `options` | `DropdownOption<T>[]` | 是 | 选项列表，每项包含 value 和 label |
| `value` | `T` | 是 | 当前选中的值 |
| `onChange` | `(value: T) => void` | 是 | 值变化回调 |
| `renderTrigger` | `(option, isOpen) => ReactNode` | 否 | 自定义触发器渲染 |
| `renderOption` | `(option, isSelected) => ReactNode` | 否 | 自定义选项渲染 |
| `minWidth` | `number \| string` | 否 | 下拉菜单最小宽度，默认 80 |
| `disabled` | `boolean` | 否 | 是否禁用 |
| `className` | `string` | 否 | 自定义容器类名 |

**下拉菜单样式规范：**
- 背景：白色 `#ffffff`
- 阴影：`0 4px 12px rgba(26, 29, 46, 0.15)`
- 选项内边距：`px-3 py-2`
- 悬停背景：`hover:bg-gray-50`
- 圆角：`rounded-lg` (8px)

### 按钮

**主按钮（CTA）：**
```tsx
className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
```

**次要按钮：**
```tsx
className="bg-white/80 backdrop-blur-sm border border-white/60 text-slate-700 px-4 py-2 rounded-xl hover:bg-white transition-all duration-200"
```

**图标按钮：**
```tsx
className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-all duration-200"
```

### 卡片

**项目卡片：**
```tsx
className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 border border-white/60 h-[380px]"
```

**玻璃态卡片：**
```tsx
className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl"
```

**标准卡片（旧版）：**
```tsx
className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#EE3F4D]/10 flex flex-col min-h-0"
```

### 标签

**状态标签（圆点+文字）：**
```tsx
className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
// 背景、文字、边框颜色根据状态动态设置
```

**优先级标签（图标+文字）：**
```tsx
className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
// 图标：高🔥 中⚡ 低🌱
```

**成功状态：**
```tsx
<span className="px-3 py-1 rounded-full text-xs font-medium border h-fit bg-emerald-100 text-emerald-700 border-emerald-200">
  正常
</span>
```

**警告状态：**
```tsx
<span className="px-3 py-1 rounded-full text-xs font-medium border h-fit bg-orange-100 text-orange-700 border-orange-200">
  中
</span>
```

### 输入框

**标准输入框：**
```tsx
className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200"
```

### 导航

**侧边栏 Logo：**
- 复古徽章 SVG，40x40px
- 古铜色渐变 + 噪点纹理
- 品牌文字：Courier New，10px，tracking-widest
- 副标题：6px，大写

**导航图标按钮：**
```tsx
className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300"
// 激活态：text-yellow-400 scale-110
// 非激活态：text-gray-400 opacity-60
```

## 动效规范

### 过渡时间

| 场景 | 时长 | 缓动函数 |
|------|------|----------|
| 悬停状态 | 200-300ms | `ease-out` |
| 卡片悬浮 | 500ms | `ease-out` |
| 页面切换 | 300ms | `ease-in-out` |
| 指示器移动 | 600-800ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### 关键动画

**玻璃态光效：**
```css
.hover\:shadow-orange-500\/10:hover {
  box-shadow: 0 25px 50px -12px rgba(251, 146, 60, 0.1);
}
```

**进度条闪烁：**
```css
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
animation: shimmer 2s infinite;
```

**导航指示器：**
```css
transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
```

**渐变背景动画（登录页）：**
```css
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
```

**通用过渡：**
```css
transition-all duration-300 ease-out
```

**悬停效果：**
- **卡片**: `hover:shadow-md` - 阴影加深
- **按钮**: `hover:-translate-y-0.5 hover:scale-[1.02]` - 轻微上移 + 放大
- **图标容器**: `hover:shadow-md` - 阴影加深

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

### 响应式断点

| 断点 | 宽度 | 布局调整 |
|------|------|----------|
| Mobile | < 640px | 单列布局，底部导航 |
| Tablet | 640-1024px | 双列卡片，侧边栏收起 |
| Desktop | > 1024px | 完整三栏布局 |

项目使用 Tailwind 默认断点：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 栅格系统

- 项目卡片网格：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- 卡片间距：`gap-6`
- 页面内边距：`p-6`（桌面）、`p-4`（移动）

### Grid 容器（项目卡片网格）

```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
```

## 图标规范

### 图标尺寸

| 场景 | 尺寸 | 示例 |
|------|------|------|
| 导航图标 | 20x20px | 仪表盘、项目、奖励 |
| 按钮图标 | 16x16px | 箭头、编辑、删除 |
| 标签图标 | 12x12px | 优先级图标 |
| Logo 图标 | 40x40px | BE.RUN 徽章 |

### 图标风格

- 使用线性图标（Outline style）
- 统一的 2px 描边
- 圆角线端（Round cap）
- 图标库：Heroicons

## 特殊元素

### Logo 规范

**复古徽章 Logo：**
- 尺寸：40x40px
- 渐变：`linear-gradient(135deg, #d4a574, #654321)`
- 中心文字："B"，Courier New，14px
- 顶部圆点：琥珀金 `#e8b923`
- 纹理：SVG 噪点滤镜

**品牌文字：**
- 主标题：BE.RUN，Courier New，10px，bold，tracking-widest
- 副标题：AGILE LIFE，6px，uppercase，tracking-[0.15em]

### 像素风格（游戏场景）

用于 Farming 小游戏等复古游戏场景：

```css
.pixel-font {
  font-family: 'Press Start 2P', 'Courier New', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pixel-panel {
  border: 4px solid #5c4033;
  background-color: #8b6914;
  box-shadow:
    inset -4px -4px 0px #3d2914,
    inset 4px 4px 0px #c9a227;
}
```

## 可访问性

### 色彩对比度

- 正文文字与背景对比度 ≥ 4.5:1
- 大号文字与背景对比度 ≥ 3:1
- 交互元素对比度 ≥ 3:1

### 交互状态

- 悬停状态：明显视觉反馈
- 焦点状态：2px 橙色轮廓线
- 禁用状态：透明度 50%，cursor: not-allowed

### 动画减弱

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 技术实现

### Tailwind 配置

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
```

### 全局样式

```css
/* global.css 关键样式 */
@layer base {
  html {
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    font-variant-ligatures: common-ligatures;
  }
  
  body {
    font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    line-height: 1.6;
    letter-spacing: 0.01em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

## 使用示例

### 创建一个标准项目卡片

```tsx
<div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#EE3F4D]/10 flex flex-col min-h-0 h-full">
  {/* 卡片头部 */}
  <div className="flex items-start justify-between gap-3">
    <h3 className="text-lg font-bold leading-tight line-clamp-2 flex-1">
      项目标题
    </h3>
  </div>
  
  {/* 描述 */}
  <p className="text-gray-600 mt-2">项目描述...</p>
  
  {/* 标签 */}
  <div className="flex gap-2 mt-3">
    <span className="px-3 py-1 rounded-full text-xs font-medium border h-fit bg-emerald-100 text-emerald-700 border-emerald-200">
      正常
    </span>
    <span className="px-3 py-1 rounded-full text-xs font-medium border h-fit bg-orange-100 text-orange-700 border-orange-200">
      中
    </span>
  </div>
  
  {/* 按钮 */}
  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 hover:scale-[1.02]">
    进入项目
  </button>
</div>
```

### Grid 容器

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-1">
  {/* 卡片列表 */}
</div>
```

### 玻璃态卡片

```tsx
<div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl p-6">
  {/* 内容 */}
</div>
```

## 资源链接

- Google Fonts：[Poppins](https://fonts.google.com/specimen/Poppins)、[Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC)
- 图标库：[Heroicons](https://heroicons.com/)
- Tailwind 文档：[tailwindcss.com](https://tailwindcss.com/)

## 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.2 | 2026-02-23 | 新增通用下拉选择器 DropdownOptions 组件规范，统一状态/优先级选择器样式 |
| v1.1 | 2026-02-21 | 全面优化为紧凑UI设计：减小图标、按钮、文字尺寸，提升信息密度20-25% |
| v1.0 | 2026-02-19 | 初始版本，整合现有设计规范，更新为"温暖复古 + 现代简约"风格 |
