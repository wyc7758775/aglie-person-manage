## Context
需要实现需求详情页面的任务关联功能。该功能允许用户在查看需求详情时，将需求与一个或多个任务进行关联。系统已经具备数据库支持（requirements.related_tasks JSONB 字段），需要补全前后端功能。

## Goals
- 实现一个模态框组件用于任务关联
- 支持搜索任务（按名称或ID）
- 显示已关联任务和可关联任务列表
- 支持多选任务进行关联/取消关联
- 实时显示已选择数量和新增数量
- 使用真实数据库数据

## Non-Goals
- 不实现任务创建功能（已有独立入口）
- 不实现任务详情查看（点击任务跳转至任务管理）
- 不实现批量关联超过20个任务

## Decisions

### 1. 数据库设计
**Decision**: 使用已存在的 `requirements.related_tasks` JSONB 字段存储关联任务ID列表
- **Rationale**: 字段已存在，无需修改 schema，保持简单的一对多关系
- **Format**: `string[]` - 任务ID数组

### 2. API 设计
**Decision**: 新增两个 API 端点
- `GET /api/tasks?projectId={id}&search={query}` - 获取可关联的任务列表
- `PUT /api/requirements/[id]/tasks` - 更新需求的关联任务列表

**Rationale**: 
- 分离查询和更新操作，符合 REST 原则
- 支持搜索和分页，避免一次性加载过多任务

### 3. 前端组件设计
**Decision**: 创建独立的 LinkTaskModal 组件
- **Props**:
  - `open: boolean` - 控制显示
  - `requirementId: string` - 当前需求ID
  - `projectId: string` - 所属项目ID
  - `linkedTaskIds: string[]` - 已关联的任务ID列表
  - `onClose: () => void` - 关闭回调
  - `onConfirm: (taskIds: string[]) => void` - 确认回调

**UI 结构**（基于 Pencil RI4aJ）:
- 头部：标题 + 关闭按钮
- 搜索框：支持按任务名称或ID搜索
- 已关联区域：显示当前已关联的任务（可取消关联）
- 可关联区域：显示同项目下其他任务（可选择关联）
- 底部：选择统计 + 取消/确认按钮

### 4. 状态管理
**Decision**: 使用 React useState 管理模态框内部状态
- `searchQuery`: 搜索关键词
- `selectedTaskIds`: 当前选中的任务ID集合
- `linkedTaskIds`: 已关联的任务ID（从 props 初始化）
- `availableTasks`: 可关联的任务列表（从 API 加载）

### 5. 任务列表获取策略
**Decision**: 
- 模态框打开时一次性加载同项目下的所有任务
- 前端本地过滤实现搜索功能
- 限制最大加载数量为 100 条

**Rationale**: 
- 任务数量通常不会太多，前端过滤响应更快
- 简化实现，避免复杂分页逻辑

## Risks / Trade-offs
- **Risk**: 项目下任务过多时（>100）加载慢
  - **Mitigation**: 添加加载状态提示，后续可添加分页
- **Risk**: 用户误操作取消关联
  - **Mitigation**: 模态框内显示明确的状态标签（已关联/新选择）

## Migration Plan
无需数据迁移，使用已存在的字段。

## Open Questions
无
