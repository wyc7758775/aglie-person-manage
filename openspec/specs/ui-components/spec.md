# ui-components Specification

## Purpose
TBD - created by archiving change extract-info-card-component. Update Purpose after archive.
## Requirements
### Requirement: Info Card Component
A reusable, controlled UI component SHALL display location information, current date, and time with a glassmorphism design.

#### Scenario: Display location and time information
Given the InfoCard component is rendered with valid locationInfo, dateInfo, and timeInfo props
When the component loads
Then it SHALL display:
- City and region in top-left position
- Current weekday (e.g., "Sun", "Mon") in large bold text
- Current day with ordinal suffix (e.g., "1st", "2nd", "15th")
- Current time in format "HH:MM AM/PM"
- User's IP address
- User's country name
- Star icon with "Star" text

#### Scenario: Apply conditional animations
Given the InfoCard component is rendered with `isSignUpMode={true}`
When the component renders
Then the outer container SHALL have CSS classes:
- `transform translate-x-[-130px] translate-y-[-70px] scale-53 rotate-[7deg] opacity-70`
- `z-index: 2`

Given the InfoCard component is rendered with `isSignUpMode={false}`
When the component renders
Then the outer container SHALL have CSS classes:
- `transform translate-x-0 translate-y-0 scale-100 rotate-0 opacity-100`
- `z-index: 20`

#### Scenario: Handle Join in button click
Given the InfoCard component is rendered with `onJoinInClick` callback
When the user clicks the "Join in" button
Then the `onJoinInClick` callback function SHALL be executed

#### Scenario: Render with glassmorphism design
Given the InfoCard component is rendered
When the component mounts
Then it SHALL display:
- Layer 1: White background with orange gradient circle decoration
- Layer 2: Semi-transparent white backdrop with blur effect (`backdrop-blur-xl`)
- Orange circle: Gradient from orange-300 to orange-400
- Decorative circle: Small orange-200/40 circle inside main circle

### Requirement: Component Reusability
UI components in `app/ui/` folder SHALL follow consistent patterns for props, exports, and styling.

#### Scenario: Import and use InfoCard
Given the InfoCard component exists in `app/ui/info-card.tsx`
When another file imports it
Then it MUST be importable using:
`import InfoCard from '@/app/ui/info-card';`
And MUST be usable as `<InfoCard {...props} />`

#### Scenario: TypeScript type safety
Given the InfoCard component has defined props interface
When the component is used
Then TypeScript SHALL provide:
- Type checking for all required props
- Intellisense for prop names and types
- Compile-time errors if required props are missing

### Requirement: Controlled Component Pattern
Presentational components SHALL receive all data and callbacks through props rather than managing internal state.

#### Scenario: Props-driven rendering
Given the InfoCard component receives all data via props
When the parent component state changes
Then the InfoCard SHALL re-render with new prop values
Without managing any internal state

#### Scenario: No side effects in render
Given the InfoCard component is a presentational component
When it renders
Then it MUST NOT:
- Call APIs directly
- Access browser storage
- Manage its own state
- Have side effects beyond rendering

### Requirement: 界面组件一致性
系统 SHALL 提供一致的界面组件，确保用户体验统一。

#### Scenario: 视觉一致性
- **GIVEN** 系统展示界面
- **THEN** 系统确保：
  - 同类组件具有统一的外观风格
  - 交互反馈方式一致
  - 间距和布局遵循统一规范

#### Scenario: 交互一致性
- **GIVEN** 用户使用界面
- **THEN** 系统确保：
  - 相同操作在不同页面表现一致
  - 按钮点击有统一的反馈
  - 表单提交有统一的处理流程

---

### Requirement: 按钮组件
系统 SHALL 提供按钮组件，供用户执行操作。

#### Scenario: 按钮点击
- **GIVEN** 按钮显示在界面上
- **WHEN** 用户点击按钮
- **THEN** 系统执行按钮关联的操作

#### Scenario: 按钮禁用状态
- **GIVEN** 按钮处于禁用状态
- **WHEN** 用户尝试点击
- **THEN** 系统不执行操作
- **AND** 按钮显示为不可点击样式

#### Scenario: 按钮加载状态
- **GIVEN** 按钮关联的操作正在执行
- **WHEN** 操作未完成
- **THEN** 按钮显示加载状态
- **AND** 防止重复点击

---

### Requirement: 表单组件
系统 SHALL 提供表单组件，收集用户输入。

#### Scenario: 文本输入
- **GIVEN** 表单包含文本输入字段
- **WHEN** 用户输入文本
- **THEN** 系统记录输入内容

#### Scenario: 输入验证
- **GIVEN** 用户填写表单
- **WHEN** 用户输入不符合要求
- **THEN** 系统显示验证错误提示
- **AND** 阻止表单提交直到修正

#### Scenario: 日期选择
- **GIVEN** 表单需要日期输入
- **WHEN** 用户选择日期
- **THEN** 系统记录选中的日期

#### Scenario: 下拉选择
- **GIVEN** 表单需要选择有限选项
- **WHEN** 用户展开下拉列表
- **THEN** 系统展示所有可选值
- **AND** 用户选择后系统记录选中值

#### Scenario: 表单提交
- **GIVEN** 用户填写完表单
- **WHEN** 用户提交表单
- **THEN** 系统验证所有字段
- **AND** 验证通过后执行提交操作

---

### Requirement: 列表组件
系统 SHALL 提供列表组件，展示集合数据。

#### Scenario: 列表展示
- **GIVEN** 系统需要展示多条数据
- **WHEN** 列表组件渲染
- **THEN** 系统展示所有数据项
- **AND** 每项显示关键信息

#### Scenario: 列表筛选
- **GIVEN** 列表有过滤条件
- **WHEN** 用户应用筛选
- **THEN** 系统仅展示符合条件的数据

#### Scenario: 列表排序
- **GIVEN** 列表支持排序
- **WHEN** 用户选择排序方式
- **THEN** 系统按选定方式重新排列数据

#### Scenario: 空列表状态
- **GIVEN** 列表没有数据
- **WHEN** 列表组件渲染
- **THEN** 系统展示空状态提示
- **AND** 提供创建新数据的引导

#### Scenario: 列表加载状态
- **GIVEN** 列表数据正在加载
- **WHEN** 用户查看列表
- **THEN** 系统展示加载状态指示

---

### Requirement: 卡片组件
系统 SHALL 提供卡片组件，展示实体概要信息。

#### Scenario: 卡片信息展示
- **GIVEN** 系统需要展示实体概要
- **WHEN** 卡片组件渲染
- **THEN** 卡片展示：
  - 实体名称或标题
  - 关键属性标签
  - 状态指示
  - 进度指示（如适用）

#### Scenario: 卡片操作
- **GIVEN** 卡片显示在界面上
- **WHEN** 用户选择卡片操作
- **THEN** 系统展示可用操作选项
- **AND** 执行用户选择的操作

#### Scenario: 卡片点击
- **GIVEN** 卡片可点击查看详情
- **WHEN** 用户点击卡片
- **THEN** 系统展示实体详细信息

---

### Requirement: 对话框组件
系统 SHALL 提供对话框组件，展示重要信息或收集输入。

#### Scenario: 信息对话框
- **GIVEN** 系统需要提醒用户
- **WHEN** 对话框打开
- **THEN** 系统展示提示信息
- **AND** 用户确认后关闭

#### Scenario: 确认对话框
- **GIVEN** 系统需要用户确认操作
- **WHEN** 对话框打开
- **THEN** 系统展示确认提示
- **AND** 提供确认和取消选项

#### Scenario: 表单对话框
- **GIVEN** 系统需要收集用户输入
- **WHEN** 对话框打开
- **THEN** 系统展示表单
- **AND** 用户可填写并提交

#### Scenario: 关闭对话框
- **GIVEN** 对话框已打开
- **WHEN** 用户选择关闭
- **THEN** 系统关闭对话框
- **AND** 对话框外点击也可关闭

---

### Requirement: 导航组件
系统 SHALL 提供导航组件，帮助用户在系统中移动。

#### Scenario: 主导航
- **GIVEN** 用户在使用系统
- **THEN** 系统展示主导航菜单
- **AND** 菜单包含系统主要功能入口

#### Scenario: 导航激活状态
- **GIVEN** 用户在某个功能页面
- **THEN** 导航中高亮当前所在功能

#### Scenario: 面包屑导航
- **GIVEN** 用户处于深层页面
- **THEN** 系统展示面包屑导航
- **AND** 显示从首页到当前页面的路径
- **AND** 用户可点击返回上级页面

---

### Requirement: 反馈组件
系统 SHALL 提供反馈机制，告知用户操作结果。

#### Scenario: 成功提示
- **GIVEN** 用户操作成功
- **WHEN** 操作完成
- **THEN** 系统展示成功提示
- **AND** 提示自动消失

#### Scenario: 错误提示
- **GIVEN** 用户操作失败
- **WHEN** 错误发生
- **THEN** 系统展示错误提示
- **AND** 说明错误原因

#### Scenario: 加载指示
- **GIVEN** 操作需要等待
- **WHEN** 操作执行中
- **THEN** 系统展示加载指示器
- **AND** 防止用户重复操作

---

### Requirement: 可访问性
系统组件 SHALL 遵循可访问性最佳实践。

#### Scenario: 键盘导航
- **GIVEN** 用户使用键盘
- **WHEN** 用户按 Tab 键
- **THEN** 焦点在可交互元素间移动
- **AND** 焦点顺序符合逻辑

#### Scenario: 焦点可见
- **GIVEN** 元素获得焦点
- **THEN** 系统显示清晰的焦点指示

#### Scenario: 屏幕阅读器支持
- **GIVEN** 用户使用辅助技术
- **THEN** 系统为组件提供适当的标签和描述
- **AND** 动态更新内容时通知辅助技术

