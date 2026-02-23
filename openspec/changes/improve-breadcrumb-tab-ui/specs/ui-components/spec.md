## ADDED Requirements

### Requirement: BreadcrumbNav Component
系统 SHALL 提供一个面包屑导航组件，用于项目详情页面的层级导航。

#### Scenario: 渲染面包屑导航
- **GIVEN** 用户位于项目详情页面
- **WHEN** BreadcrumbNav 组件渲染
- **THEN** 组件显示：
  - 返回项目列表的图标按钮（胶囊形状，糖果色渐变背景）
  - 分隔符（使用 `/` 或圆点样式）
  - 当前项目名称（带下拉箭头）
  - 整体容器使用圆角胶囊形状（border-radius: 9999px）
  - 背景使用微妙的灰色渐变或白色带阴影

#### Scenario: 展开项目下拉菜单
- **GIVEN** BreadcrumbNav 组件已渲染
- **WHEN** 用户点击项目名称区域
- **THEN** 下拉菜单以动画形式展开：
  - 使用 scale 和 opacity 过渡（0.2s ease-out）
  - 菜单背景为白色带柔和阴影
  - 圆角 12px
  - 显示其他项目列表（最多 10 个）
  - 底部显示"返回项目列表"选项

#### Scenario: 选择其他项目
- **GIVEN** 下拉菜单已展开
- **WHEN** 用户点击列表中的其他项目
- **THEN** 页面导航到该项目的详情页
- **AND** 下拉菜单收起

#### Scenario: 关闭下拉菜单
- **GIVEN** 下拉菜单已展开
- **WHEN** 用户点击菜单外部区域
- **THEN** 下拉菜单收起（带收起动画）

---

### Requirement: ProjectTabMenu Component
系统 SHALL 提供一个 Tab 切换菜单组件，用于项目详情页的需求/任务/缺陷切换。

#### Scenario: 渲染 Tab 菜单
- **GIVEN** 用户位于项目详情页面
- **WHEN** ProjectTabMenu 组件渲染
- **THEN** 组件显示：
  - 胶囊形状的按钮组容器（border-radius: 9999px）
  - 灰色背景（bg-gray-100 或类似）
  - 每个 Tab 按钮为胶囊形状
  - Tab 之间的间距为 4px

#### Scenario: 切换 Tab
- **GIVEN** Tab 菜单已渲染
- **WHEN** 用户点击不同的 Tab 按钮
- **THEN** 滑动指示器平滑移动到新的位置：
  - 使用 transform translateX 或 left 属性过渡
  - 过渡时间为 300-400ms
  - 使用 cubic-bezier(0.34, 1.56, 0.64, 1) 缓动函数

#### Scenario: 选中 Tab 视觉状态
- **GIVEN** 某个 Tab 处于选中状态
- **WHEN** 组件渲染
- **THEN** 选中 Tab 显示：
  - 糖果色渐变背景（从左到右：粉色 → 紫色 → 蓝色）
  - 白色文字
  - 轻微阴影效果
  - 平滑的过渡动画

#### Scenario: 未选中 Tab 视觉状态
- **GIVEN** Tab 菜单已渲染
- **WHEN** 查看未选中的 Tab
- **THEN** 未选中 Tab 显示：
  - 透明背景
  - 灰色文字（text-gray-600）
  - 悬停时背景变为稍深灰色（hover:bg-gray-200）

#### Scenario: 响应式布局
- **GIVEN** 用户在不同屏幕尺寸下访问
- **WHEN** 屏幕宽度小于 640px
- **THEN** Tab 菜单按钮尺寸自适应缩小
- **AND** 保持胶囊形状和基本布局

---

### Requirement: 视觉风格一致性
所有的 BreadcrumbNav 和 ProjectTabMenu 组件 SHALL 遵循统一的设计规范。

#### Scenario: 颜色规范
- **WHEN** 组件渲染
- **THEN** 使用的颜色包括：
  - 糖果粉：#FF6B9D 到 #FF8FB0（渐变）
  - 糖果紫：#C084FC 到 #D8B4FE（渐变）
  - 糖果蓝：#60A5FA 到 #93C5FD（渐变）
  - 背景灰：bg-gray-50, bg-gray-100
  - 文字灰：text-gray-600, text-gray-900

#### Scenario: 动效规范
- **WHEN** 组件有交互或状态变化
- **THEN** 动效参数为：
  - 过渡时间：200-400ms
  - 缓动函数：cubic-bezier(0.34, 1.56, 0.64, 1)（弹性效果）
  - 使用 transform 和 opacity 进行动画

#### Scenario: 圆角规范
- **WHEN** 组件渲染
- **THEN** 所有容器和按钮使用圆角：
  - 胶囊形状：border-radius: 9999px（rounded-full）
  - 下拉菜单：border-radius: 12px（rounded-xl）

## MODIFIED Requirements

### Requirement: 项目详情页面 UI
[保持不变，此变更仅涉及样式优化，不改变功能需求]
