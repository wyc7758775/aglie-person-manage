## ADDED Requirements

### Requirement: 需求与项目关联
系统 SHALL 为需求（Requirement）提供 projectId 关联，支持按项目筛选需求。

#### Scenario: Requirement 数据模型包含 projectId
- **WHEN** 查询 Requirement 类型定义
- **THEN** Requirement 包含 `projectId: string` 字段
- **AND** projectId 指向所属项目的 id

#### Scenario: 获取需求按 projectId 筛选
- **WHEN** 客户端发送 `GET /api/requirements?projectId=xxx` 请求
- **THEN** 系统仅返回 projectId 匹配的需求
- **AND** 响应格式为 `{ success: true, requirements: Requirement[] }`

#### Scenario: 创建需求时必填 projectId
- **WHEN** 客户端发送 `POST /api/requirements` 请求
- **THEN** 请求体必须包含 `projectId` 字段
- **AND** 新建需求与指定项目关联
