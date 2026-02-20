# Be.run UI 设计规范

本文档定义了 Be.run 项目管理系统的 UI 设计规范，确保界面视觉一致性。

## 1. 色彩系统

### 1.1 主色调
- **Primary**: Indigo/Blue 渐变（`from-indigo-500 to-blue-500`）
  - 用于：主按钮、选中状态、强调元素
  - Hover: `from-indigo-600 to-blue-600`
  - 阴影: `shadow-indigo-500/30`

### 1.2 状态色
- **Success (正常)**: Emerald 绿色系
  - 背景: `bg-emerald-50`
  - 文字: `text-emerald-700`
  - 边框: `border-emerald-200`
  - 圆点: `bg-emerald-500`

- **Warning (有风险)**: Amber 橙色系
  - 背景: `bg-amber-50`
  - 文字: `text-amber-700`
  - 边框: `border-amber-200`
  - 圆点: `bg-amber-500`

- **Danger (失控)**: Rose 红色系
  - 背景: `bg-rose-50`
  - 文字: `text-rose-700`
  - 边框: `border-rose-200`
  - 圆点: `bg-rose-500`

### 1.3 优先级色
- **High (高)**: `bg-rose-50 text-rose-600 border-rose-200`，图标: 🔥
- **Medium (中)**: `bg-amber-50 text-amber-600 border-amber-200`，图标: ⚡
- **Low (低)**: `bg-slate-50 text-slate-500 border-slate-200`，图标: 🌱

### 1.4 中性色
- **背景**: `bg-white/90 backdrop-blur-md`
- **边框**: `border-slate-100`
- **文字主色**: `text-slate-800`
- **文字次色**: `text-slate-500`
- **文字浅色**: `text-slate-400`

## 2. 组件规范

### 2.1 标签 (Badge/Tag)

**状态标签**（圆点 + 文字）:
```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border">
  <span className="w-1.5 h-1.5 rounded-full bg-{color}" />
  标签文字
</span>
```

**优先级标签**（图标 + 文字）:
```tsx
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border">
  <span className="text-[10px]">{icon}</span>
  标签文字
</span>
```

**徽章**（数字统计）:
```tsx
<span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
  {number}
</span>
```

### 2.2 按钮

**主按钮**:
```tsx
<button className="
  w-full flex items-center justify-center gap-2
  px-4 py-2.5 rounded-xl
  text-sm font-semibold
  transition-all duration-300 ease-out
  bg-gradient-to-r from-indigo-500 to-blue-500 
  hover:from-indigo-600 hover:to-blue-600 
  text-white
  shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50
  hover:-translate-y-0.5 hover:scale-[1.02]
  active:scale-[0.98] active:translate-y-0
  group
">
  按钮文字
  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
</button>
```

**添加按钮**（虚线框样式）:
```tsx
<button className="
  flex w-full items-center justify-center gap-2
  rounded-xl border-2 border-dashed border-slate-200
  bg-slate-50/50 py-3.5 text-sm font-medium text-slate-500
  transition-all duration-300 ease-out
  hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600
  hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5
  active:translate-y-0 active:shadow-none
  group
">
  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-500 transition-all group-hover:bg-indigo-100 group-hover:text-indigo-600">
    <PlusIcon className="h-3.5 w-3.5" />
  </div>
  <span>添加文字</span>
</button>
```

### 2.3 过滤标签组

```tsx
<div className="flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-xl">
  {filters.map((filter) => (
    <button
      key={filter}
      className={clsx(
        'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
        {
          'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200': isActive,
          'text-slate-500 hover:text-slate-700 hover:bg-slate-100': !isActive,
        }
      )}
    >
      {filter}
    </button>
  ))}
</div>
```

### 2.4 进度条

```tsx
<div className="h-2.5 rounded-full overflow-hidden shadow-inner relative bg-slate-100">
  {/* 光泽动画层 */}
  <div 
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    style={{ 
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s infinite'
    }} 
  />
  {/* 实际进度 */}
  <div
    className={clsx(
      'h-full rounded-full transition-all duration-700 ease-out relative',
      'bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400',
      progress === 0 && 'opacity-0'
    )}
    style={{ width: `${progress}%` }}
  >
    {/* 顶部光泽效果 */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
  </div>
</div>
{progress === 0 && (
  <p className="text-xs mt-1.5 text-center text-slate-400">
    点击卡片开始规划项目
  </p>
)}
```

### 2.5 卡片容器

```tsx
<div className="
  group relative rounded-2xl overflow-hidden cursor-pointer
  transition-all duration-500 ease-out
  hover:shadow-2xl hover:shadow-slate-500/10 hover:-translate-y-1
  border border-white/60
">
  {/* 玻璃态背景（无封面图时） */}
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-100/50 to-cyan-50" />
  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
  
  {/* 渐变遮罩（有封面图时） */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
  
  {/* 内容区域 */}
  <div className="relative z-10 p-5 flex flex-col h-full">
    {/* ... */}
  </div>
</div>
```

### 2.6 区域容器 (SectionContainer)

```tsx
<div className="
  bg-white/90 backdrop-blur-md rounded-2xl p-5 
  shadow-lg shadow-slate-200/50 border border-slate-100 
  flex flex-col min-h-0
">
  {/* 头部 */}
  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
    {/* 标题和徽章 */}
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-bold text-slate-800 tracking-tight">标题</h2>
      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
        {badge}
      </span>
    </div>
    {/* 过滤标签组 */}
  </div>
  
  {/* 内容 */}
  <div className="flex-1 min-h-0 flex flex-col">
    {/* ... */}
  </div>
</div>
```

## 3. 间距规范

### 3.1 容器间距
- 区域容器内边距: `p-5`
- 区域容器间距: `gap-5`
- 网格间距: `gap-5`
- 卡片内边距: `p-5`

### 3.2 组件间距
- 标题下方: `mb-4`
- 标签组间距: `gap-2`
- 按钮组间距: `gap-2`
- 表单元素间距: `gap-4`

### 3.3 固定高度（卡片内）
- 标题区域: `h-[48px]`
- 描述区域: `h-[40px]`
- 标签区域: `h-[26px]`
- 日期区域: `h-[36px]`

## 4. 动画规范

### 4.1 悬停效果
```css
/* 卡片悬停 */
transition-all duration-500 ease-out
hover:shadow-2xl hover:-translate-y-1

/* 按钮悬停 */
transition-all duration-300 ease-out
hover:-translate-y-0.5 hover:scale-[1.02]

/* 图标悬停 */
transition-transform duration-300
group-hover:translate-x-1
```

### 4.2 进度条光泽动画
```css
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
```

### 4.3 弹窗动画
```tsx
className="animate-in fade-in zoom-in-95 duration-200"
```

## 5. 响应式断点

- **Mobile**: 默认单列
- **Tablet (md)**: `grid-cols-2`
- **Desktop (lg)**: `grid-cols-3`
- **Wide (xl)**: `grid-cols-4`

## 6. 文字排版

### 6.1 字体大小
- 页面标题: `text-xl font-bold tracking-tight`
- 卡片标题: `text-lg font-bold leading-tight line-clamp-2`
- 正文: `text-sm leading-relaxed line-clamp-2`
- 标签文字: `text-xs font-medium`
- 徽章数字: `text-xs font-semibold`

### 6.2 行高限制
- 标题: `line-clamp-2`
- 描述: `line-clamp-2`

## 7. 图标规范

### 7.1 尺寸
- 按钮图标: `w-4 h-4`
- 菜单图标: `w-5 h-5`
- 标签图标: `text-[10px]`

### 7.2 优先级图标
- 高: `🔥`
- 中: `⚡`
- 低: `🌱`

## 8. 阴影规范

- 容器阴影: `shadow-lg shadow-slate-200/50`
- 卡片悬停: `hover:shadow-2xl hover:shadow-slate-500/10`
- 按钮阴影: `shadow-lg shadow-indigo-500/30`
- 按钮悬停: `hover:shadow-indigo-500/50`

## 9. 边框圆角

- 大容器: `rounded-2xl`
- 按钮: `rounded-xl`
- 标签: `rounded-full`
- 输入框: `rounded-lg`
- 小元素: `rounded-full` 或 `rounded-md`

## 10. 最佳实践

1. **颜色一致性**: 所有主交互元素使用 Indigo/Blue 渐变
2. **状态可见性**: 状态标签使用圆点 + 颜色区分，优先级使用图标区分
3. **反馈即时**: 所有可交互元素必须有 hover 和 active 状态
4. **文字可读性**: 封面图上的文字必须添加 drop-shadow 或使用渐变遮罩
5. **空状态处理**: 无描述时显示浅灰色斜体提示
6. **进度为0**: 显示"未开始"和引导提示而非"0%"
7. **动效适度**: 使用 300-500ms 过渡，避免过度动画
8. **间距统一**: 遵循 4px 基线网格系统
