## MODIFIED Requirements

### Requirement: 项目数据模型定义
系统 SHALL 定义 Project 数据模型，包含项目基本信息、类型、状态、优先级、目标和标签。对于 slow-burn 项目类型，SHALL 支持积累指标系统。

#### Scenario: Project 核心字段更新
- **GIVEN** 系统初始化完成
- **WHEN** 查询 Project 类型定义
- **THEN** Project 类型包含以下字段：
  - `id: string` - 项目唯一标识
  - `name: string` - 项目名称
  - `description: string` - 项目描述
  - `type: ProjectType` - 项目类型（sprint-project 或 slow-burn）
  - `status: ProjectStatus` - 项目状态
  - `priority: ProjectPriority` - 项目优先级
  - `goals: string[]` - 目标列表
  - `tags: string[]` - 标签列表
  - `startDate: string` - 开始日期
  - `endDate: string | null` - 结束日期
  - `progress: number` - 进度百分比（0-100），slow-burn 项目基于指标权重计算
  - `indicators: ProjectIndicator[] | null` - 积累指标列表（仅 slow-burn 项目）
  - `createdAt: string` - 创建时间
  - `updatedAt: string` - 更新时间

#### Scenario: ProjectType 类型定义更新
- **WHEN** 定义 ProjectType
- **THEN** ProjectType 为联合类型 `'sprint-project' | 'slow-burn'`
- **AND** `'sprint-project'` 表示冲刺项目
- **AND** `'slow-burn'` 表示慢燃项目（有目的的长期积累）

#### Scenario: ProjectIndicator 类型定义
- **WHEN** 定义 ProjectIndicator
- **THEN** ProjectIndicator 包含以下字段：
  - `id: string` - 指标唯一标识
  - `name: string` - 指标名称（1-50字符）
  - `value: number` - 当前值（>= 0）
  - `target: number` - 目标值（> 0）
  - `weight: number` - 权重（0-100）
- **AND** 单个 slow-burn 项目的所有指标权重之和必须等于 100

---

### Requirement: 创建项目 API
系统 SHALL 提供创建新项目的 API 接口，支持 slow-burn 项目类型和积累指标。

#### Scenario: 创建 slow-burn 项目
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/projects` 请求，请求体包含 `type: 'slow-burn'` 和有效的 indicators 数组
- **THEN** 系统创建新项目
- **AND** 系统验证 indicators 数组不为空
- **AND** 系统验证所有指标权重之和等于 100
- **AND** 系统基于 indicators 计算 progress
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: slow-burn 项目结束日期验证
- **WHEN** 客户端发送 `POST /api/projects` 请求，请求体包含 `type: 'slow-burn'`
- **THEN** 系统不验证 endDate 字段（可为 null）

#### Scenario: 项目类型验证更新
- **WHEN** 客户端发送 `POST /api/projects` 请求，但 `type` 字段不是 `'sprint-project'` 或 `'slow-burn'`
- **THEN** 系统返回 `{ success: false, message: '无效的项目类型' }`
- **AND** HTTP 状态码为 400

#### Scenario: 积累指标验证
- **WHEN** 客户端发送 `POST /api/projects` 请求创建 slow-burn 项目，但 indicators 为空数组
- **THEN** 系统返回 `{ success: false, message: '慢燃项目至少需要设置一个积累指标' }`
- **AND** HTTP 状态码为 400

#### Scenario: 指标权重验证
- **WHEN** 客户端发送 `POST /api/projects` 请求创建 slow-burn 项目，但 indicators 权重之和不等于 100
- **THEN** 系统返回 `{ success: false, message: '所有指标权重之和必须等于 100%' }`
- **AND** HTTP 状态码为 400

---

### Requirement: 更新项目 API
系统 SHALL 提供更新项目信息的 API 接口，支持更新积累指标。

#### Scenario: 更新 slow-burn 项目指标
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，请求体包含新的 `indicators` 数组
- **THEN** 系统验证 indicators 权重之和等于 100
- **AND** 系统重新计算 progress
- **AND** 系统更新项目的 `indicators` 和 `progress` 字段
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 更新进度自动计算
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求更新 slow-burn 项目的 indicators value
- **THEN** 系统自动根据公式重新计算 progress：`Σ(min(100%, value/target * 100%) * weight) / 100`
- **AND** progress 值存储在 0-100 范围内

---

### Requirement: 项目表单 UI
系统 SHALL 提供项目表单组件，根据项目类型动态显示不同字段。

#### Scenario: 显示 slow-burn 项目表单
- **WHEN** 用户选择项目类型为 slow-burn
- **THEN** 表单隐藏结束日期选择器
- **AND** 表单显示"积累指标"区域
- **AND"积累指标"区域允许添加/编辑/删除指标

#### Scenario: 积累指标管理
- **WHEN** 用户在 slow-burn 项目表单中
- **THEN** 用户可点击"添加指标"按钮添加新指标
- **AND** 每个指标显示名称输入框、目标值输入框、当前值输入框、权重输入框
- **AND** 用户可以删除指标（至少保留一个）
- **AND** 表单实时显示权重总和提示（必须等于 100%）

#### Scenario: 指标数量限制
- **WHEN** 用户尝试添加第 11 个指标
- **THEN** 系统禁用"添加指标"按钮
- **AND** 显示提示"最多添加 10 个指标"

---

### Requirement: 项目卡片 UI
系统 SHALL 提供项目卡片组件，展示项目基本信息和进度。

#### Scenario: slow-burn 项目卡片显示
- **WHEN** 项目卡片渲染 slow-burn 项目
- **THEN** 卡片显示类型标签"慢燃项目"（或"Slow-burn Project"）
- **AND** 卡片显示开始日期（不显示结束日期）
- **AND** 卡片显示基于 indicators 计算的进度

#### Scenario: 时间格式显示
- **WHEN** 项目卡片显示日期
- **THEN** 日期格式为 `YYYY/MM/DD`（中文环境）或 `MM/DD/YYYY`（英文环境）
- **AND** 不显示时分秒

---

### Requirement: 项目详情弹窗 UI
系统 SHALL 提供项目详情弹窗，根据项目类型显示不同信息。

#### Scenario: slow-burn 项目详情
- **WHEN** 用户打开 slow-burn 项目详情弹窗
- **THEN** 系统显示积累指标列表
- **AND** 每个指标显示名称、当前值/目标值、完成百分比
- **AND** 显示总进度条
- **AND** 不显示结束日期

#### Scenario: 指标进度显示
- **WHEN** 项目详情弹窗显示 indicators
- **THEN** 每个指标显示进度条
- **AND** 总进度显示在弹窗顶部或显著位置
