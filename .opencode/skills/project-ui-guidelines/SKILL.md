# Agile Person Manage UI 规范

本项目是敏捷个人管理系统，基于 Next.js + Tailwind CSS 构建。本文档总结了项目中的 UI 设计规范和组件样式标准。

## 设计风格概览

- **设计哲学**: 现代化、玻璃态（Glassmorphism）、卡片式布局
- **色彩基调**: 以白色/半透明为主背景，搭配品牌色 `#EE3F4D`（红珊瑚色）
- **字体**: 中文使用 Noto Sans SC，英文使用 Poppins
- **设计语言**: 简洁、专业、有层次感的阴影和圆角

## 颜色规范

### 主色调
| 颜色 | 色值 | 用途 |
|------|------|------|
| 品牌主色 | `#EE3F4D` | 边框、强调色 |
| 品牌浅色 | `rgba(238, 63, 77, 0.1)` | 卡片边框 |
| 纯白 | `#FFFFFF` | 卡片背景、按钮 |
| 半透明白 | `rgba(255, 255, 255, 0.8)` | 玻璃态卡片背景 |
| 背景灰 | `#F4F1EC` | 页面背景 |

### 语义化颜色
| 类型 | 背景色 | 文字色 | 边框色 | 用途 |
|------|--------|--------|--------|------|
| 成功/正常 | `bg-emerald-100` (#D1FAE5) | `text-emerald-700` (#047857) | `border-emerald-200` | 状态标签、成功提示 |
| 警告/中 | `bg-orange-100` (#FFEDD5) | `text-orange-700` (#C2410C) | `border-orange-200` | 优先级标签 |
| 紫色/筛选 | `bg-purple-100` (#F3E8FF) | `text-purple-700` (#7E22CE) | - | 筛选按钮激活态 |
| 信息/悬停 | `bg-gray-100` | `text-gray-500` | - | 筛选按钮默认态 |

### 渐变色按钮
- **橙色渐变**: `from-orange-500 to-amber-500`
- **绿色渐变**: `from-emerald-500 to-teal-500`

## 卡片样式规范

### 主要卡片（项目卡片、内容卡片）
```
类名组合: bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#EE3F4D]/10

实际 CSS:
- background: rgba(255, 255, 255, 0.8)  (80% 白色 + 毛玻璃)
- border-radius: 12px (rounded-xl)
- padding: 16px (p-4)
- border: 1px solid rgba(238, 63, 77, 0.1)  (品牌色 10% 透明度边框)
- box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
- backdrop-filter: blur(8px) (backdrop-blur-sm)
```

**特点:**
- 玻璃态效果：半透明背景 + 背景模糊
- 品牌色边框点缀
- 柔和的多层阴影
- 大尺寸圆角 (12px)

### 小型交互卡片（侧边栏图标容器）
```
类名组合: rounded-full p-1 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out

实际 CSS:
- background: #FFFFFF
- border-radius: 9999px (rounded-full)
- padding: 4px (p-1)
- box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- transition: box-shadow 0.3s ease-in-out
```

**特点:**
- 完全圆形
- 纯白色背景
- 轻微阴影
- 悬停时阴影加深

### 筛选标签
```
类名组合: rounded-md px-2 py-0.5 text-xs font-medium

变体:
- 激活态: bg-purple-100 text-purple-700
- 默认态: text-gray-500 hover:bg-gray-100
- 添加按钮: border border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100
```

## 标签/徽章样式

### 状态标签
```
类名组合: px-3 py-1 rounded-full text-xs font-medium border h-fit

成功状态: bg-emerald-100 text-emerald-700 border-emerald-200
警告状态: bg-orange-100 text-orange-700 border-orange-200

实际 CSS:
- border-radius: 9999px (药丸形)
- padding: 4px 12px
- font-size: 12px
- border: 1px solid
```

## 按钮样式规范

### 主要操作按钮（进入项目）
```
类名组合: w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out group/btn

渐变变体:
- 橙色: bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600
- 绿色: bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600

通用样式:
- color: #FFFFFF
- border-radius: 12px (rounded-xl)
- padding: 10px 16px
- box-shadow: 0 10px 15px -3px rgba(orange/emerald, 0.3)
- 悬停: shadow 加深 + 轻微上移 + 缩放
- transition: all 0.3s ease-out
```

### 次要按钮/筛选按钮
```
类名组合: rounded-md px-2 py-0.5 text-xs font-medium

实际 CSS:
- border-radius: 6px
- padding: 2px 8px
- font-size: 12px
```

### 虚线边框按钮（添加项目）
```
类名组合: rounded-md border border-dashed border-gray-300 bg-gray-50 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100

实际 CSS:
- border: 1px dashed #D1D5DB
- background: #F9FAFB
- border-radius: 6px
- padding: 8px 0
```

## 容器布局规范

### Grid 容器（项目卡片网格）
```
类名组合: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-1

实际 CSS:
- display: grid
- grid-template-columns: repeat(4, 1fr) (桌面端)
- gap: 16px
- padding: 4px

响应式断点:
- 移动端: grid-cols-1
- 平板: md:grid-cols-2
- 桌面: lg:grid-cols-4
```

### 主内容区域
```
类名组合: bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#EE3F4D]/10 flex flex-col min-h-0

实际 CSS:
- min-height: 0 (允许收缩)
- 高度: 填满父容器 (h-full)
- 其他同主要卡片样式
```

### 侧边栏
```
类名组合: fixed h-full flex flex-col items-center justify-between py-8 ml-4

实际 CSS:
- position: fixed
- height: 100%
- padding: 32px 0 (py-8)
- margin-left: 16px (ml-4)
- display: flex
- flex-direction: column
- align-items: center
```

## 圆角规范

| 尺寸 | Tailwind | 实际值 | 用途 |
|------|----------|--------|------|
| 无 | rounded-none | 0px | - |
| 小 | rounded-md | 6px | 小按钮、标签 |
| 中 | rounded-lg | 8px | 输入框、小卡片 |
| 大 | rounded-xl | 12px | 主卡片、大按钮 |
| 全圆 | rounded-full | 9999px | 头像、状态标签、图标容器 |

## 间距规范

### 内边距 (Padding)
| 级别 | Tailwind | 实际值 | 用途 |
|------|----------|--------|------|
| 极小 | p-1 | 4px | 图标容器 |
| 小 | p-2 | 8px | 紧凑内容 |
| 中 | p-4 | 16px | 主卡片内边距 |
| 大 | py-8 | 32px (垂直) | 侧边栏 |

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

## 阴影规范

| 级别 | Tailwind | 实际效果 | 用途 |
|------|----------|----------|------|
| 小 | shadow-sm | 0 1px 2px 0 rgba(0,0,0,0.05) | 小卡片、图标 |
| 中 | shadow-md | 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1) | 主卡片 |
| 大 | shadow-lg | 0 10px 15px -3px rgba(0,0,0,0.1) | 按钮悬停 |
| 彩色 | shadow-orange-500/30 | 品牌色阴影 | 渐变按钮 |

## 动画与过渡

### 通用过渡
```css
transition-all duration-300 ease-out
```

### 悬停效果
- **卡片**: `hover:shadow-md` - 阴影加深
- **按钮**: `hover:-translate-y-0.5 hover:scale-[1.02]` - 轻微上移 + 放大
- **图标容器**: `hover:shadow-md` - 阴影加深

### 阴影过渡
```css
transition-shadow duration-300 ease-in-out
```

## 字体规范

### 字体家族
```css
--font-chinese: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
--font-heading: 'Poppins', 'Noto Sans SC', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
```

### 标题样式
```css
h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', 'Noto Sans SC', sans-serif;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.3;
}
```

### 卡片标题
```
类名组合: text-lg font-bold leading-tight line-clamp-2 flex-1 text-white drop-shadow-md

实际 CSS:
- font-size: 18px
- font-weight: 700
- line-height: 1.25
- color: #FFFFFF (在卡片内使用白色文字)
- text-shadow: 0 0 2px rgba(0,0,0,0.5)
```

## 使用示例

### 创建一个标准项目卡片
```tsx
<div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#EE3F4D]/10 flex flex-col min-h-0 h-full">
  {/* 卡片头部 */}
  <div className="flex items-start justify-between gap-3">
    <h3 className="text-lg font-bold leading-tight line-clamp-2 flex-1 text-white drop-shadow-md">
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

### 状态标签
```tsx
{/* 成功状态 */}
<span className="px-3 py-1 rounded-full text-xs font-medium border h-fit bg-emerald-100 text-emerald-700 border-emerald-200">
  正常
</span>

{/* 警告状态 */}
<span className="px-3 py-1 rounded-full text-xs font-medium border h-fit bg-orange-100 text-orange-700 border-orange-200">
  中
</span>
```

## 响应式断点

项目使用 Tailwind 默认断点：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 注意事项

1. **玻璃态效果需要 backdrop-blur 支持**，在不支持的浏览器会优雅降级为半透明背景
2. **品牌色 `#EE3F4D` 主要用于点缀**，不要大面积使用
3. **阴影使用多层叠加** 创造深度感
4. **动画使用 transform 和 opacity** 以获得更好的性能
5. **中文内容使用 Noto Sans SC** 确保最佳可读性
