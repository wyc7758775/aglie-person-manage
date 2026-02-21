# Change: 优化项目详情页面面包屑与 Tab 菜单 UI

## Why
当前项目详情页面的面包屑导航和 Tab 菜单样式与整体设计风格不够统一：
1. 面包屑使用简单的 FolderIcon 和 > 符号，视觉表现单调
2. Tab 菜单使用蓝色下划线样式，与侧边导航栏的糖果色渐变和圆角设计风格不一致
3. 缺少品牌一致的动效和交互反馈

需要重新设计以符合项目中活泼、可爱的糖果色渐变设计风格。

## What Changes
- **重新设计面包屑组件**：
  - 使用糖果色渐变背景（与 Logo 风格一致）
  - 添加圆角胶囊形状
  - 项目下拉选择器使用悬浮卡片样式
  - 添加流畅的展开/收起动效
  
- **重新设计 Tab 菜单**：
  - 统一使用胶囊形状按钮
  - 当前选中项使用糖果色渐变背景
  - 添加滑动切换动效（类似侧边导航栏的指示器效果）
  - 未选中项使用柔和灰色背景

- **新增可复用组件**：
  - `BreadcrumbNav`：统一面包屑导航组件
  - `ProjectTabMenu`：项目 Tab 切换菜单组件

## Impact
- Affected specs: ui-components, project-management
- Affected code: 
  - `apps/web/app/dashboard/project/[projectId]/page.tsx`
  - `apps/web/app/ui/dashboard/breadcrumb-nav.tsx` (新增)
  - `apps/web/app/ui/dashboard/project-tab-menu.tsx` (新增)
- Breaking changes: 无
- Migration: 无需迁移，纯 UI 优化
