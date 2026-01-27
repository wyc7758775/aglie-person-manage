## MODIFIED Requirements

### Requirement: 项目数据模型定义
系统 SHALL 定义 Project 数据模型，包含项目基本信息、类型、状态、优先级、目标、标签和积分。

#### Scenario: Project 核心字段
- **GIVEN** 系统初始化完成
- **WHEN** 查询 Project 类型定义
- **THEN** Project 类型包含以下字段：
  - `id: string` - 项目唯一标识
  - `name: string` - 项目名称
  - `description: string` - 项目描述
  - `type: ProjectType` - 项目类型（life 或 code）
  - `status: ProjectStatus` - 项目状态
  - `priority: ProjectPriority` - 项目优先级
  - `goals: string[]` - 目标列表
  - `tags: string[]` - 标签列表
  - `startDate: string` - 开始日期
  - `endDate: string | null` - 结束日期
  - `progress: number` - 进度百分比（0-100）
  - `points: number` - 项目积分值（非负数，默认为 0）
  - `createdAt: string` - 创建时间
  - `updatedAt: string` - 更新时间

---

### Requirement: 创建项目 API
系统 SHALL 提供创建新项目的 API 接口，支持积分字段的设置和自动计算。

#### Scenario: 创建项目成功
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/projects` 请求，请求体包含有效的项目数据
- **THEN** 系统创建新项目
- **AND** 系统为项目生成唯一 ID
- **AND** 系统设置 `progress` 为 0
- **AND** 如果请求体中未提供 `points` 字段，系统设置 `points` 为 0
- **AND** 如果请求体中提供了 `points` 字段，系统使用该值
- **AND** 系统设置 `createdAt` 和 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 项目积分验证
- **WHEN** 客户端发送 `POST /api/projects` 请求，但 `points` 字段为负数
- **THEN** 系统返回 `{ success: false, message: '积分不能为负数' }`
- **AND** HTTP 状态码为 400

#### Scenario: 自动计算项目积分
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/projects` 请求，请求体包含 `autoCalculatePoints: true` 和 `priority` 字段
- **THEN** 系统根据优先级自动计算积分：
  - `priority: 'high'` → `points: 20`
  - `priority: 'medium'` → `points: 10`
  - `priority: 'low'` → `points: 5`
- **AND** 系统使用计算出的积分值创建项目

---

### Requirement: 更新项目 API
系统 SHALL 提供更新项目信息的 API 接口，支持积分字段更新和完成时自动累加积分。

#### Scenario: 更新项目名称
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，请求体包含 `{ name: '新名称' }`
- **THEN** 系统更新项目的 `name` 字段
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 更新项目状态为已完成
- **GIVEN** 项目当前状态为 `'active'`，积分为 20
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，请求体包含 `{ status: 'completed' }`
- **THEN** 系统更新项目的 `status` 字段为 `'completed'`
- **AND** 系统将项目的 `points` 值累加到当前登录用户的总积分中
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 更新项目状态不会重复累加积分
- **GIVEN** 项目当前状态为 `'completed'`，积分为 20
- **AND** 用户总积分为 100
- **WHEN** 客户端再次发送 `PUT /api/projects/proj-1` 请求，请求体包含 `{ status: 'completed' }`
- **THEN** 系统不重复累加积分
- **AND** 用户总积分仍为 100

#### Scenario: 更新项目积分
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，请求体包含 `{ points: 30 }`
- **THEN** 系统更新项目的 `points` 字段为 30
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 更新项目积分验证
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，但 `points` 字段为负数
- **THEN** 系统返回 `{ success: false, message: '积分不能为负数' }`
- **AND** HTTP 状态码为 400

---

### Requirement: 项目表单 UI
系统 SHALL 提供项目表单组件，用于创建和编辑项目，包含积分输入字段。

#### Scenario: 显示表单字段
- **WHEN** 项目表单打开
- **THEN** 表单显示项目名称输入框
- **AND** 表单显示项目描述输入框
- **AND** 表单显示项目类型选择器（life/code）
- **AND** 表单显示项目状态选择器
- **AND** 表单显示项目优先级选择器
- **AND** 表单显示开始日期选择器
- **AND** 表单显示结束日期选择器
- **AND** 表单显示积分输入框
- **AND** 表单显示"自动计算积分"选项

#### Scenario: 自动计算积分选项
- **WHEN** 用户在项目表单中勾选"自动计算积分"选项
- **AND** 用户选择优先级
- **THEN** 系统根据优先级自动填充积分值：
  - `priority: 'high'` → `points: 20`
  - `priority: 'medium'` → `points: 10`
  - `priority: 'low'` → `points: 5`
- **AND** 积分输入框变为只读状态

#### Scenario: 手动设置积分
- **WHEN** 用户在项目表单中取消勾选"自动计算积分"选项
- **THEN** 积分输入框变为可编辑状态
- **AND** 用户可以手动输入积分值

#### Scenario: 积分输入验证
- **WHEN** 用户在积分输入框中输入负数
- **THEN** 系统显示错误提示"积分不能为负数"
- **AND** 表单不允许提交

---

### Requirement: 项目卡片 UI
系统 SHALL 提供项目卡片组件，展示项目基本信息，包括积分显示。

#### Scenario: 显示项目基本信息
- **WHEN** 项目卡片渲染
- **THEN** 卡片显示项目名称
- **AND** 卡片显示项目描述
- **AND** 卡片显示项目类型标签（life 或 code）
- **AND** 卡片显示项目状态标签
- **AND** 卡片显示项目优先级标签
- **AND** 卡片显示项目积分值
