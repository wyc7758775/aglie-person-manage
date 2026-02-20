# UI 设计规范文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-02-19 |
| 更新日期 | 2026-02-19 |
| 状态 | 正式发布 |

---

## 1. 设计原则

### 1.1 设计理念

本项目采用 **"温暖复古 + 现代简约"** 的设计风格，核心理念是**"将生活产品化"**，致敬《人人都是产品经理》一书。设计目标是创造一个既专业又温馨的个人项目管理空间。

### 1.2 设计关键词

- **温暖**：柔和的渐变色彩、圆润的边角
- **复古**：打字机字体、徽章元素、墨渍纹理
- **玻璃态**：毛玻璃效果、半透明层级
- **有机**：流畅的动画、自然的过渡

---

## 2. 色彩系统

### 2.1 主色调

| 色彩名称 | Hex 值 | Tailwind 类 | 使用场景 |
|----------|--------|-------------|----------|
| 古铜金 | `#d4a574` | - | Logo 渐变起始色 |
| 深古铜 | `#654321` | - | Logo 渐变结束色 |
| 琥珀橙 | `#fb923c` | `orange-400` | 强调色、CTA 按钮 |
| 深橙 | `#ea580c` | `orange-600` | 悬停状态、激活态 |

### 2.2 功能色

| 状态 | 颜色 | 背景色 | 边框色 | 使用场景 |
|------|------|--------|--------|----------|
| 正常 | `emerald-500` | `bg-emerald-50` | `border-emerald-200` | 项目状态：正常 |
| 有风险 | `amber-500` | `bg-amber-50` | `border-amber-200` | 项目状态：有风险 |
| 失控 | `rose-500` | `bg-rose-50` | `border-rose-200` | 项目状态：失控 |
| 高优先级 | `rose-600` | `bg-rose-50` | `border-rose-200` | 优先级标签：高 |
| 中优先级 | `amber-600` | `bg-amber-50` | `border-amber-200` | 优先级标签：中 |
| 低优先级 | `slate-500` | `bg-slate-50` | `border-slate-200` | 优先级标签：低 |

### 2.3 中性色

| 色彩名称 | Hex 值 | Tailwind 类 | 使用场景 |
|----------|--------|-------------|----------|
| 纯白 | `#ffffff` | `white` | 卡片背景、文字 |
| 浅灰 | `#f8fafc` | `slate-50` | 页面背景 |
| 中灰 | `#94a3b8` | `slate-400` | 次要文字、图标 |
| 深灰 | `#334155` | `slate-700` | 正文文字 |
| 暗灰 | `#1e293b` | `slate-800` | 标题文字 |
| 近黑 | `#0f172a` | `slate-900` | 强对比元素 |

### 2.4 渐变方案

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

---

## 3. 字体系统

### 3.1 字体家族

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

### 3.2 字体规格

| 样式 | 字体 | 大小 | 字重 | 行高 | 字间距 | 使用场景 |
|------|------|------|------|------|--------|----------|
| H1 | Poppins | 24px | 600 | 1.3 | -0.02em | 页面主标题 |
| H2 | Poppins | 20px | 600 | 1.3 | -0.02em | 区块标题 |
| H3 | Poppins | 16px | 600 | 1.3 | -0.02em | 卡片标题 |
| Body | Noto Sans SC | 14px | 400 | 1.6 | 0.01em | 正文内容 |
| Small | Noto Sans SC | 12px | 400 | 1.5 | 0.005em | 辅助文字 |
| Label | Noto Sans SC | 10px | 500 | 1.4 | 0.05em | 标签、徽章 |
| Brand | Courier New | 10px | 700 | 1.2 | 0.1em | Logo 文字 |

---

## 4. 间距系统

### 4.1 基础间距

| Token | 值 | 使用场景 |
|-------|-----|----------|
| `space-1` | 4px | 图标与文字间距 |
| `space-2` | 8px | 紧凑元素间距 |
| `space-3` | 12px | 标准元素间距 |
| `space-4` | 16px | 卡片内边距 |
| `space-6` | 24px | 区块间距 |
| `space-8` | 32px | 大区块间距 |

### 4.2 圆角系统

| Token | 值 | 使用场景 |
|-------|-----|----------|
| `rounded-sm` | 4px | 小按钮、标签 |
| `rounded-lg` | 8px | 输入框、小卡片 |
| `rounded-xl` | 12px | 按钮、头像 |
| `rounded-2xl` | 16px | 项目卡片 |
| `rounded-full` | 9999px | 圆形元素 |

---

## 5. 组件规范

### 5.1 按钮

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

### 5.2 卡片

**项目卡片：**
```tsx
className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 border border-white/60 h-[380px]"
```

**玻璃态卡片：**
```tsx
className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl"
```

### 5.3 标签

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

### 5.4 输入框

**标准输入框：**
```tsx
className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200"
```

### 5.5 导航

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

---

## 6. 动效规范

### 6.1 过渡时间

| 场景 | 时长 | 缓动函数 |
|------|------|----------|
| 悬停状态 | 200-300ms | `ease-out` |
| 卡片悬浮 | 500ms | `ease-out` |
| 页面切换 | 300ms | `ease-in-out` |
| 指示器移动 | 600-800ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### 6.2 关键动画

**玻璃态光效：**
```css
.hover\:shadow-orange-500/10:hover {
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

---

## 7. 布局规范

### 7.1 页面结构

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

### 7.2 响应式断点

| 断点 | 宽度 | 布局调整 |
|------|------|----------|
| Mobile | < 640px | 单列布局，底部导航 |
| Tablet | 640-1024px | 双列卡片，侧边栏收起 |
| Desktop | > 1024px | 完整三栏布局 |

### 7.3 栅格系统

- 项目卡片网格：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- 卡片间距：`gap-6`
- 页面内边距：`p-6`（桌面）、`p-4`（移动）

---

## 8. 图标规范

### 8.1 图标尺寸

| 场景 | 尺寸 | 示例 |
|------|------|------|
| 导航图标 | 20x20px | 仪表盘、项目、奖励 |
| 按钮图标 | 16x16px | 箭头、编辑、删除 |
| 标签图标 | 12x12px | 优先级图标 |
| Logo 图标 | 40x40px | BE.RUN 徽章 |

### 8.2 图标风格

- 使用线性图标（Outline style）
- 统一的 2px 描边
- 圆角线端（Round cap）
- 图标库：Heroicons

---

## 9. 特殊元素

### 9.1 Logo 规范

**复古徽章 Logo：**
- 尺寸：40x40px
- 渐变：`linear-gradient(135deg, #d4a574, #654321)`
- 中心文字："B"，Courier New，14px
- 顶部圆点：琥珀金 `#e8b923`
- 纹理：SVG 噪点滤镜

**品牌文字：**
- 主标题：BE.RUN，Courier New，10px，bold，tracking-widest
- 副标题：AGILE LIFE，6px，uppercase，tracking-[0.15em]

### 9.2 像素风格（游戏场景）

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

---

## 10. 可访问性

### 10.1 色彩对比度

- 正文文字与背景对比度 ≥ 4.5:1
- 大号文字与背景对比度 ≥ 3:1
- 交互元素对比度 ≥ 3:1

### 10.2 交互状态

- 悬停状态：明显视觉反馈
- 焦点状态：2px 橙色轮廓线
- 禁用状态：透明度 50%，cursor: not-allowed

### 10.3 动画减弱

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. 技术实现

### 11.1 Tailwind 配置

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

### 11.2 全局样式

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

---

## 12. 附录

### 12.1 资源链接

- Google Fonts：[Poppins](https://fonts.google.com/specimen/Poppins)、[Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC)
- 图标库：[Heroicons](https://heroicons.com/)
- Tailwind 文档：[tailwindcss.com](https://tailwindcss.com/)

### 12.2 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-02-19 | 初始版本，整合现有设计规范 |

