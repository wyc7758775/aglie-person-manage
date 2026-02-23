## ADDED Requirements

### Requirement: 任务与项目关联
系统 SHALL 为任务（Task）提供 projectId 关联，支持按项目筛选任务。

#### Scenario: Task 数据模型包含 projectId
- **WHEN** 查询 Task 类型定义
- **THEN** Task 包含 `projectId: string` 字段
- **AND** projectId 指向所属项目的 id

#### Scenario: 获取任务按 projectId 筛选
- **WHEN** 客户端发送 `GET /api/tasks?projectId=xxx` 请求
- **THEN** 系统仅返回 projectId 匹配的任务
- **AND** 响应格式为 `{ success: true, tasks: Task[] }`

#### Scenario: 创建任务时必填 projectId
- **WHEN** 客户端发送 `POST /api/tasks` 请求
- **THEN** 请求体必须包含 `projectId` 字段
- **AND** 新建任务与指定项目关联
