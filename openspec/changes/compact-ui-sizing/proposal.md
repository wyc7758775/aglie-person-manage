# Change: 统一UI组件尺寸为更紧凑规格

## Why
当前项目中的图标、按钮、文字尺寸以及容器间距普遍偏大，导致：
1. 界面元素过于松散，屏幕空间利用率低
2. 标题容器区域占用过多垂直空间
3. 仪表盘页面需要频繁滚动才能查看完整信息
4. 项目卡片内边距过大，单屏可展示卡片数量受限
5. 左侧导航栏图标和按钮尺寸偏大

通过系统性减小各元素尺寸和间距，可以提升信息密度，让界面更加紧凑专业。

## What Changes

### 核心尺寸调整
- **图标尺寸**: 默认从 h-5/w-5 (20px) → h-4/w-4 (16px)，导航图标保持 h-5
- **按钮尺寸**: 从 px-4/py-2 (16/8px) → px-3/py-1.5 (12/6px)
- **按钮文字**: text-sm 保持，主要减小内边距
- **容器内边距**: p-6 → p-4，p-5 → p-4，p-4 → p-3
- **元素间距**: gap-6 (24px) → gap-4 (16px)，gap-4 → gap-3 (12px)

### 标题区域优化
- **SectionContainer标题**: text-xl → text-lg，mb-4 → mb-3
- **页面标题**: text-2xl → text-xl
- **头部容器**: py-4 → py-3，减少垂直占用
- **徽章尺寸**: px-2.5 → px-2，保持可读性

### 项目卡片优化
- **卡片内边距**: p-4 → p-3
- **项目图标**: w-12 h-12 text-2xl → w-10 h-10 text-xl
- **项目名称**: text-lg → text-base
- **积分标签**: px-3 py-1.5 → px-2.5 py-1
- **卡片间距**: gap-5 → gap-4

### 左侧导航优化
- **导航按钮**: w-10 h-10 → w-8 h-8
- **图标尺寸**: w-5 h-5 → w-4 h-4
- **Logo区域**: 适当压缩尺寸
- **布局调整**: pl-20 → pl-16 配合导航宽度

### Tab菜单优化
- **容器内边距**: p-1.5 → p-1
- **Tab按钮**: px-5 py-2 → px-4 py-1.5
- **指示器高度**: 自适应调整

### Drawer抽屉优化
- **头部**: px-6 py-4 → px-5 py-3
- **内容区**: p-6 → p-5
- **标题**: text-xl → text-lg
- **表单间距**: space-y-6 → space-y-5

### Breadcrumb优化
- **项目选择器按钮**: px-4 py-2 → px-3 py-1.5
- **下拉菜单项**: 保持紧凑布局

## Impact
- **Affected specs**: specs/ui-components/
- **Affected code**: 
  - `app/ui/dashboard/section-container.tsx`
  - `app/ui/dashboard/topnav.tsx`
  - `app/ui/dashboard/breadcrumb-nav.tsx`
  - `app/ui/dashboard/project-tab-menu.tsx`
  - `app/dashboard/project/components/ProjectCard.tsx`
  - `app/dashboard/project/components/ProjectDrawer.tsx`
  - `app/dashboard/layout.tsx`
  - 各页面标题和容器组件
- **No breaking changes**: 纯视觉样式调整，不影响功能逻辑
- **User impact**: 界面信息密度提升约20-25%，减少滚动需求
