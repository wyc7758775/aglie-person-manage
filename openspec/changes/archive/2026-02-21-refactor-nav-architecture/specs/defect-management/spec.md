## ADDED Requirements

### Requirement: 缺陷与项目关联
系统 SHALL 为缺陷（Defect）提供 projectId 关联，支持按项目筛选缺陷。

#### Scenario: Defect 数据模型包含 projectId
- **WHEN** 查询 Defect 类型定义
- **THEN** Defect 包含 `projectId: string` 字段
- **AND** projectId 指向所属项目的 id

#### Scenario: 获取缺陷按 projectId 筛选
- **WHEN** 客户端发送 `GET /api/defects?projectId=xxx` 请求
- **THEN** 系统仅返回 projectId 匹配的缺陷
- **AND** 响应格式为 `{ success: true, defects: Defect[] }`

#### Scenario: 创建缺陷时必填 projectId
- **WHEN** 客户端发送 `POST /api/defects` 请求
- **THEN** 请求体必须包含 `projectId` 字段
- **AND** 新建缺陷与指定项目关联
