## Context

本变更面向个人用户提供待办事项（To-Do）任务管理系统，区别于现有 Task（面向项目的开发任务）。设计参考 Pencil MCP 中的 UI 原型，采用双栏抽屉布局，左侧为基础信息表单，右侧为子任务/关联任务/评论/操作记录的 Tab 切换区域。

### 约束
- 必须严格按照 Pencil MCP Node IDs (v6EZ2, oNMhQ) 的 UI 设计实现
- 数据存储使用 PostgreSQL
- 使用 Tailwind CSS 实现样式
- 遵循现有项目的代码规范

## Goals / Non-Goals

### Goals
- 提供完整的待办事项创建界面，包含所有 PRD 定义的字段
- 支持子任务管理（增删改、完成状态）
- 支持关联任务管理（阻塞/被阻塞/相关）
- 支持评论与操作记录
- 积分奖励机制

### Non-Goals
- 不实现移动端适配（本次变更）
- 不实现数据导出功能
- 不实现团队排行榜（本次变更）

## Decisions

### 1. 数据模型设计
**决策**: 新建 `Todo` 类型，与现有 `Task` 并存，不修改现有 Task 模型

**理由**:
- Task 面向项目开发场景，Todo 面向个人日常管理
- Todo 需要支持子任务、关联任务、评论等复杂关联
- 分离模型便于独立演进

**数据结构**:
```typescript
type TodoStatus = 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';
type LinkType = 'blocks' | 'blocked_by' | 'related_to';

interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  assignee: string;
  startDate: string | null;
  dueDate: string | null;
  points: number;
  tags: string[];
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Subtask {
  id: string;
  todoId: string;
  title: string;
  completed: boolean;
  assignee?: string;
  createdAt: string;
}

interface TodoLink {
  id: string;
  sourceId: string;
  targetId: string;
  linkType: LinkType;
  createdAt: string;
}

interface TodoComment {
  id: string;
  todoId: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface TodoActivity {
  id: string;
  todoId: string;
  userId: string;
  action: string;
  details?: string;
  createdAt: string;
}
```

### 2. UI 组件结构
**决策**: 采用双栏抽屉布局，遵循 Pencil MCP 设计

**组件层级**:
```
TodoCreateDrawer (width: 900px)
├── LeftColumn (flex-1)
│   ├── TitleInput
│   ├── DescriptionInput
│   ├── InfoGrid (两列布局)
│   │   ├── StatusSelector
│   │   ├── PrioritySelector
│   │   ├── AssigneeSelector
│   │   ├── PointsSelector
│   │   ├── StartDateSelector
│   │   └── DueDateSelector
│   └── Footer (取消/创建按钮)
└── RightColumn (width: 360px)
    ├── TabBar (子任务/关联任务/评论/操作记录)
    └── TabContent
        ├── SubtaskTab
        ├── RelatedTaskTab
        ├── CommentTab
        └── ActivityTab
```

### 3. API 设计
**决策**: RESTful API，独立于现有 Task API

**端点**:
- `POST /api/todos` - 创建待办事项
- `GET /api/todos` - 获取待办事项列表
- `GET /api/todos/:id` - 获取待办事项详情
- `PUT /api/todos/:id` - 更新待办事项
- `DELETE /api/todos/:id` - 删除待办事项
- `POST /api/todos/:id/subtasks` - 添加子任务
- `PUT /api/todos/:id/subtasks/:subtaskId` - 更新子任务
- `DELETE /api/todos/:id/subtasks/:subtaskId` - 删除子任务
- `POST /api/todos/:id/links` - 添加关联任务
- `DELETE /api/todos/:id/links/:linkId` - 删除关联
- `POST /api/todos/:id/comments` - 添加评论
- `GET /api/todos/:id/activities` - 获取操作记录

### 4. 积分机制
**决策**: 任务状态变为 `done` 时发放积分

**实现**:
- 更新 Todo 状态时检查是否为 `done`
- 若为 `done`，调用积分服务增加用户积分
- 记录积分变更到操作日志

## Risks / Trade-offs

### 风险1: 数据库表设计复杂度
- **影响**: 需要创建 5 张新表
- **缓解**: 分步实施，先实现核心 Todo 表，再逐步添加关联表

### 风险2: UI 组件复杂度
- **影响**: 抽屉组件包含多个 Tab 和复杂交互
- **缓解**: 拆分为独立组件，使用 React 状态管理

### 风险3: 关联任务的双向同步
- **影响**: A 阻塞 B 时，B 页面需显示"被 A 阻塞"
- **缓解**: 查询时同时查询正向和反向关联

## Migration Plan

1. 创建数据库表（通过 `/api/init-db` 或迁移脚本）
2. 部署新 API 端点
3. 部署前端组件
4. 验证创建流程

**回滚方案**: 删除新表，移除 API 和前端组件

## Open Questions

1. 是否需要支持子任务的子任务？（当前设计不支持）
2. 积分兑换功能何时实现？（不在本次范围）
3. 是否需要支持任务模板？（不在本次范围）
