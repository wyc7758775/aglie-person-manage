## ADDED Requirements

### Requirement: 项目卡片骨架屏组件
系统 SHALL 提供 `ProjectCardSkeleton` 组件，用于项目列表加载状态的占位显示。

#### Scenario: 组件渲染
- **GIVEN** 项目列表正在加载
- **WHEN** 渲染 `ProjectCardSkeleton` 组件
- **THEN** 组件显示与 `ProjectCard` 一致的布局结构
- **AND** 显示闪烁动画效果（shimmer）

#### Scenario: 布局匹配
- **GIVEN** `ProjectCardSkeleton` 组件
- **WHEN** 与 `ProjectCard` 组件对比
- **THEN** 骨架屏包含以下占位元素：
  - 项目图标占位（12x12 圆角矩形）
  - 更多菜单按钮占位（右上角）
  - 项目名称占位（高度与标题一致）
  - 积分徽章占位（右上角）
  - 描述占位（两行）
  - 状态标签占位（圆角标签）
  - 优先级标签占位（圆角标签）
  - 进度条占位（包含百分比文本）
  - 截止日期占位（带日历图标）

#### Scenario: 列表骨架屏
- **GIVEN** 需要显示多个项目占位
- **WHEN** 渲染 `ProjectListSkeleton` 组件
- **THEN** 显示 6 个 `ProjectCardSkeleton`
- **AND** 使用与项目列表相同的网格布局（grid）
- **AND** 响应式：1/2/3/4 列布局

#### Scenario: 样式一致性
- **GIVEN** `ProjectCardSkeleton` 组件
- **WHEN** 渲染时
- **THEN** 使用与 `ProjectCard` 相同的圆角（rounded-2xl）
- **AND** 使用与 `ProjectCard` 相同的间距（p-4, gap-5）
- **AND** 使用与 `ProjectCard` 相同的阴影和边框样式

#### Scenario: 闪烁动画
- **GIVEN** `ProjectCardSkeleton` 组件
- **WHEN** 渲染时
- **THEN** 显示水平滑动的闪烁动画
- **AND** 动画持续 2 秒循环
- **AND** 动画方向从左到右

---

### Requirement: 骨架屏组件库位置
系统 SHALL 将骨架屏组件存放在 UI 组件库目录，供多个页面复用。

#### Scenario: 组件位置
- **GIVEN** 骨架屏组件
- **WHEN** 查看文件结构
- **THEN** 组件位于 `app/ui/skeletons/project-card-skeleton.tsx`
- **AND** 索引文件位于 `app/ui/skeletons/index.ts`

#### Scenario: 组件导出
- **GIVEN` 骨架屏组件
- **WHEN** 其他文件需要导入
- **THEN** 可通过 `import { ProjectCardSkeleton } from '@/app/ui/skeletons'` 导入
- **AND** 可通过 `import { ProjectListSkeleton } from '@/app/ui/skeletons'` 导入

#### Scenario: 向后兼容
- **GIVEN** 现有使用 `ProjectCardSkeleton` 的代码
- **WHEN** 组件移动到 UI 库后
- **THEN** 原有导入路径保持兼容
- **AND** 或提供明确的迁移指南
