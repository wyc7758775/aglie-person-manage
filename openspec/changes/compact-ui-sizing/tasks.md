## 1. 核心组件改造
- [x] 1.1 修改 SectionContainer (`app/ui/dashboard/section-container.tsx`)
  - [x] 更新容器内边距: p-5 → p-4
  - [x] 更新头部下边距: mb-4 pb-3 → mb-3 pb-2
  - [x] 更新标题文字: text-xl → text-lg
  - [x] 更新徽章内边距: px-2.5 → px-2
  - [x] 更新添加按钮: px-4 py-2 → px-3 py-1.5, icon h-3.5 → h-3
  - [x] 更新筛选标签: px-3 py-1.5 → px-2.5 py-1

- [x] 1.2 修改 TopNav (`app/ui/dashboard/topnav.tsx`)
  - [x] 更新导航按钮: w-10 h-10 → w-8 h-8
  - [x] 更新图标尺寸: w-5 h-5 → w-4 h-4
  - [x] 更新容器间距: space-y-3 → space-y-2
  - [x] 更新Logo下边距: mb-6 → mb-4

- [x] 1.3 修改 Dashboard布局 (`app/dashboard/layout.tsx`)
  - [x] 更新左侧留白: pl-20 → pl-16

## 2. 导航组件改造
- [x] 2.1 修改 BreadcrumbNav (`app/ui/dashboard/breadcrumb-nav.tsx`)
  - [x] 更新项目选择器: px-4 py-2 → px-3 py-1.5
  - [x] 更新下拉容器: py-2 → py-1.5
  - [x] 更新菜单项: px-4 py-2 → px-3 py-1.5
  - [x] 更新返回按钮: px-3 py-2 → px-2.5 py-1.5

- [x] 2.2 修改 ProjectTabMenu (`app/ui/dashboard/project-tab-menu.tsx`)
  - [x] 更新容器内边距: p-1.5 → p-1
  - [x] 更新Tab按钮: px-5 py-2 → px-4 py-1.5
  - [x] 更新指示器: h-[calc(100%-12px)] → h-[calc(100%-8px)]

## 3. 项目相关组件改造
- [x] 3.1 修改 ProjectCard (`app/dashboard/project/components/ProjectCard.tsx`)
  - [x] 更新卡片内边距: p-4 → p-3
  - [x] 更新项目图标: w-12 h-12 text-2xl → w-10 h-10 text-xl
  - [x] 更新菜单图标: w-5 h-5 → w-4 h-4
  - [x] 更新箭头图标: w-4 h-4 → h-3.5 w-3.5
  - [x] 更新名称区域高度: h-[48px] → h-[44px]
  - [x] 更新项目名称: text-lg → text-base
  - [x] 更新积分标签: px-3 py-1.5 → px-2.5 py-1
  - [x] 更新描述区域: h-[40px] → h-[36px]
  - [x] 更新标签区域: h-[26px] → h-[24px]
  - [x] 更新进度间距: mb-3 → mb-2
  - [x] 更新日期区域: h-[36px] → h-[32px]

- [x] 3.2 修改 ProjectDrawer (`app/dashboard/project/components/ProjectDrawer.tsx`)
  - [x] 更新头部: px-6 py-4 → px-5 py-3
  - [x] 更新标题: text-xl → text-lg
  - [x] 更新关闭按钮: text-2xl → text-xl
  - [x] 更新内容区: p-6 → p-5
  - [x] 更新表单间距: space-y-6 → space-y-5
  - [x] 更新底部栏: px-6 py-4 → px-5 py-3

- [x] 3.3 修改 Project列表页面 (`app/dashboard/project/page.tsx`)
  - [x] 更新卡片间距: gap-5 → gap-4

## 4. 其他页面调整
- [x] 4.1 修改各页面标题区域
  - [x] 通知页面 (notifications/page.tsx): text-2xl → text-xl
  - [x] 奖励页面 (rewards/page.tsx): text-2xl → text-xl
  - [x] 日常页面 (dailies/page.tsx): text-2xl → text-xl
  - [x] 习惯页面 (habits/page.tsx): text-2xl → text-xl
  - [x] 待办页面 (todos/page.tsx): text-2xl → text-xl

- [x] 4.2 修改设置页面 (`app/dashboard/setting/page.tsx`)
  - [x] 检查并调整容器内边距 p-6 → p-5

## 5. 规范同步更新
- [x] 5.1 更新 UI 规范文档 (`.opencode/skills/project-ui-guidelines/SKILL.md`)
  - [x] 更新版本号: v1.0 → v1.1
  - [x] 添加"紧凑UI设计原则"章节
  - [x] 更新字体规格表格
  - [x] 添加尺寸映射表
  - [x] 更新版本历史

## 6. 实施完成总结

### 修改文件列表
1. `app/ui/dashboard/section-container.tsx` - SectionContainer 紧凑化
2. `app/ui/dashboard/topnav.tsx` - 导航按钮和图标尺寸调整
3. `app/dashboard/layout.tsx` - 左侧留白调整
4. `app/ui/dashboard/breadcrumb-nav.tsx` - 面包屑导航紧凑化
5. `app/ui/dashboard/project-tab-menu.tsx` - Tab菜单紧凑化
6. `app/dashboard/project/components/ProjectCard.tsx` - 项目卡片紧凑化
7. `app/dashboard/project/components/ProjectDrawer.tsx` - 抽屉表单紧凑化
8. `app/dashboard/project/page.tsx` - 卡片间距调整
9. `app/dashboard/notifications/page.tsx` - 标题尺寸调整
10. `app/dashboard/rewards/page.tsx` - 标题尺寸调整
11. `app/dashboard/dailies/page.tsx` - 标题尺寸调整
12. `app/dashboard/habits/page.tsx` - 标题尺寸调整
13. `app/dashboard/todos/page.tsx` - 标题尺寸调整
14. `app/dashboard/setting/page.tsx` - 容器内边距调整
15. `.opencode/skills/project-ui-guidelines/SKILL.md` - UI规范更新

### 核心尺寸调整总结
- **图标**: h-5/w-5 (20px) → h-4/w-4 (16px) [-20%]
- **按钮**: px-4/py-2 → px-3/py-1.5 [-25%]
- **标题**: text-xl (20px) → text-lg (18px) [-10%]
- **卡片内边距**: p-5 (20px) → p-4 (16px) [-20%]
- **元素间距**: gap-4 (16px) → gap-3 (12px) [-25%]
- **导航按钮**: w-10 h-10 (40px) → w-8 h-8 (32px) [-20%]

### 预期效果
- 信息密度提升约 20-25%
- 单屏可展示更多项目卡片
- 减少滚动需求
- 界面更加紧凑专业

### 可访问性保证
- 最小点击区域保持 ≥36px
- 文字对比度符合 WCAG 2.1
- 支持浏览器缩放正常使用
