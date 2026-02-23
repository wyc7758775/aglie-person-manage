## MODIFIED Requirements

### Requirement: 需求数据模型定义
系统 SHALL 定义 Requirement 数据模型，包含需求的基本信息、类型、状态、优先级、分配信息、故事点数和积分。

#### Scenario: Requirement 核心字段
- **GIVEN** 系统初始化完成
- **WHEN** 查询 Requirement 类型定义
- **THEN** Requirement 类型包含以下字段：
  - `id: string` - 需求唯一标识
  - `title: string` - 需求标题
  - `description: string` - 需求描述
  - `type: RequirementType` - 需求类型
  - `status: RequirementStatus` - 需求状态
  - `priority: RequirementPriority` - 需求优先级
  - `assignee: string` - 分配给
  - `reporter: string` - 报告人
  - `createdDate: string` - 创建日期
  - `dueDate: string` - 截止日期
  - `storyPoints: number` - 故事点数
  - `points: number` - 需求积分值（非负数，默认为 0）
  - `tags: string[]` - 标签列表

---

### Requirement: 需求创建 API
系统 SHALL 提供创建新需求的 API 接口，支持积分字段的设置和自动计算。

#### Scenario: 创建需求成功
- **WHEN** 客户端发送 `POST /api/requirements` 请求
- **AND** 请求体包含有效的需求数据（title, description, type, status, priority 等）
- **THEN** 系统创建新需求
- **AND** 如果请求体中未提供 `points` 字段，系统设置 `points` 为 0
- **AND** 如果请求体中提供了 `points` 字段，系统使用该值
- **AND** 返回创建的需求对象
- **AND** 响应格式为 `{ success: true, requirement: Requirement }`

#### Scenario: 需求积分验证
- **WHEN** 客户端发送 `POST /api/requirements` 请求，但 `points` 字段为负数
- **THEN** 系统返回 `{ success: false, message: '积分不能为负数' }`
- **AND** HTTP 状态码为 400

#### Scenario: 自动计算需求积分
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/requirements` 请求，请求体包含 `autoCalculatePoints: true` 和 `priority` 字段
- **THEN** 系统根据优先级自动计算积分：
  - `priority: 'critical'` → `points: 15`
  - `priority: 'high'` → `points: 10`
  - `priority: 'medium'` → `points: 5`
  - `priority: 'low'` → `points: 2`
- **AND** 系统使用计算出的积分值创建需求

---

### Requirement: 需求更新 API
系统 SHALL 提供更新需求的 API 接口，支持积分字段更新和完成时自动累加积分。

#### Scenario: 更新需求成功
- **WHEN** 客户端发送 `PUT /api/requirements/[id]` 请求
- **AND** 请求体包含要更新的字段
- **AND** 需求 ID 存在
- **THEN** 系统更新需求
- **AND** 返回更新后的需求对象
- **AND** 响应格式为 `{ success: true, requirement: Requirement }`

#### Scenario: 更新需求状态为已完成
- **GIVEN** 需求当前状态为 `'development'`，积分为 10
- **WHEN** 客户端发送 `PUT /api/requirements/req-1` 请求，请求体包含 `{ status: 'completed' }`
- **THEN** 系统更新需求的 `status` 字段为 `'completed'`
- **AND** 系统将需求的 `points` 值累加到当前登录用户的总积分中
- **AND** 系统返回 `{ success: true, requirement: Requirement }`

#### Scenario: 更新需求状态不会重复累加积分
- **GIVEN** 需求当前状态为 `'completed'`，积分为 10
- **AND** 用户总积分为 100
- **WHEN** 客户端再次发送 `PUT /api/requirements/req-1` 请求，请求体包含 `{ status: 'completed' }`
- **THEN** 系统不重复累加积分
- **AND** 用户总积分仍为 100

#### Scenario: 更新需求积分
- **WHEN** 客户端发送 `PUT /api/requirements/req-1` 请求，请求体包含 `{ points: 15 }`
- **THEN** 系统更新需求的 `points` 字段为 15
- **AND** 系统返回 `{ success: true, requirement: Requirement }`

#### Scenario: 更新需求积分验证
- **WHEN** 客户端发送 `PUT /api/requirements/req-1` 请求，但 `points` 字段为负数
- **THEN** 系统返回 `{ success: false, message: '积分不能为负数' }`
- **AND** HTTP 状态码为 400

---

### Requirement: 需求表单 UI
系统 SHALL 提供需求表单组件，用于创建和编辑需求，包含积分输入字段。

#### Scenario: 显示表单字段
- **WHEN** 需求表单打开
- **THEN** 表单显示需求标题输入框
- **AND** 表单显示需求描述输入框
- **AND** 表单显示需求类型选择器
- **AND** 表单显示需求状态选择器
- **AND** 表单显示需求优先级选择器
- **AND** 表单显示积分输入框
- **AND** 表单显示"自动计算积分"选项

#### Scenario: 自动计算积分选项
- **WHEN** 用户在需求表单中勾选"自动计算积分"选项
- **AND** 用户选择优先级
- **THEN** 系统根据优先级自动填充积分值：
  - `priority: 'critical'` → `points: 15`
  - `priority: 'high'` → `points: 10`
  - `priority: 'medium'` → `points: 5`
  - `priority: 'low'` → `points: 2`
- **AND** 积分输入框变为只读状态

#### Scenario: 手动设置积分
- **WHEN** 用户在需求表单中取消勾选"自动计算积分"选项
- **THEN** 积分输入框变为可编辑状态
- **AND** 用户可以手动输入积分值

#### Scenario: 积分输入验证
- **WHEN** 用户在积分输入框中输入负数
- **THEN** 系统显示错误提示"积分不能为负数"
- **AND** 表单不允许提交

---

### Requirement: 需求列表视图
系统 SHALL 提供需求列表视图，以卡片网格形式展示需求，包括积分显示。

#### Scenario: 显示需求列表
- **GIVEN** 用户访问需求管理页面
- **WHEN** 视图模式为列表视图
- **THEN** 系统以卡片网格形式展示所有需求
- **AND** 每个需求卡片显示：ID、标题、描述、类型、状态、优先级、故事点数、积分、标签、分配人、截止日期

---

### Requirement: 需求看板视图
系统 SHALL 提供需求看板视图，以列的形式按状态或优先级分组展示需求，包括积分显示。

#### Scenario: 按状态分组的看板视图
- **GIVEN** 用户访问需求管理页面
- **WHEN** 视图模式为看板视图
- **AND** 分组方式为"按状态"
- **THEN** 系统显示多个列，每列对应一个状态（draft, review, approved, development, testing, completed, rejected）
- **AND** 每个需求卡片显示在对应状态的列中
- **AND** 每个需求卡片显示积分值
- **AND** 每列显示该状态下的需求数量
