# todo-management Specification

## Purpose
待办事项（To-Do）任务管理系统，用于个人用户管理日常任务，支持子任务、关联任务、评论和积分激励机制。

## ADDED Requirements

### Requirement: Todo 数据模型定义
系统 SHALL 定义 Todo 数据模型，包含待办事项的所有核心字段。

#### Scenario: Todo 核心字段
- **GIVEN** 系统初始化完成
- **WHEN** 查询 Todo 类型定义
- **THEN** Todo 类型包含以下字段：
  - `id: string` - 待办事项唯一标识
  - `title: string` - 待办事项标题
  - `description: string` - 详细描述
  - `status: TodoStatus` - 状态
  - `priority: TodoPriority` - 优先级
  - `assignee: string` - 负责人
  - `startDate: string | null` - 开始时间
  - `dueDate: string | null` - 截止时间
  - `points: number` - 可获得积分
  - `tags: string[]` - 标签列表
  - `projectId: string | undefined` - 关联项目 ID
  - `createdAt: string` - 创建时间
  - `updatedAt: string` - 更新时间

#### Scenario: TodoStatus 类型定义
- **WHEN** 定义 TodoStatus
- **THEN** TodoStatus 为联合类型 `'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled'`
- **AND** `'todo'` 表示待处理
- **AND** `'in_progress'` 表示进行中
- **AND** `'blocked'` 表示已阻塞
- **AND** `'done'` 表示已完成
- **AND** `'cancelled'` 表示已取消

#### Scenario: TodoPriority 类型定义
- **WHEN** 定义 TodoPriority
- **THEN** TodoPriority 为联合类型 `'low' | 'medium' | 'high' | 'urgent'`

---

### Requirement: 子任务数据模型
系统 SHALL 定义 Subtask 数据模型，支持将待办事项拆解为更小的步骤。

#### Scenario: Subtask 核心字段
- **WHEN** 查询 Subtask 类型定义
- **THEN** Subtask 类型包含以下字段：
  - `id: string` - 子任务唯一标识
  - `todoId: string` - 关联的待办事项 ID
  - `title: string` - 子任务标题
  - `completed: boolean` - 是否完成
  - `assignee: string | undefined` - 负责人（可选）
  - `createdAt: string` - 创建时间

---

### Requirement: 关联任务数据模型
系统 SHALL 定义 TodoLink 数据模型，支持建立任务间依赖或参考关系。

#### Scenario: TodoLink 核心字段
- **WHEN** 查询 TodoLink 类型定义
- **THEN** TodoLink 类型包含以下字段：
  - `id: string` - 关联唯一标识
  - `sourceId: string` - 源待办事项 ID
  - `targetId: string` - 目标待办事项 ID
  - `linkType: LinkType` - 关联类型
  - `createdAt: string` - 创建时间

#### Scenario: LinkType 类型定义
- **WHEN** 定义 LinkType
- **THEN** LinkType 为联合类型 `'blocks' | 'blocked_by' | 'related_to'`
- **AND** `'blocks'` 表示本任务阻塞目标任务
- **AND** `'blocked_by'` 表示本任务被目标任务阻塞
- **AND** `'related_to'` 表示本任务与目标任务相关

---

### Requirement: 评论数据模型
系统 SHALL 定义 TodoComment 数据模型，支持在待办事项下进行讨论。

#### Scenario: TodoComment 核心字段
- **WHEN** 查询 TodoComment 类型定义
- **THEN** TodoComment 类型包含以下字段：
  - `id: string` - 评论唯一标识
  - `todoId: string` - 关联的待办事项 ID
  - `userId: string` - 评论用户 ID
  - `content: string` - 评论内容（支持富文本）
  - `createdAt: string` - 创建时间

---

### Requirement: 操作记录数据模型
系统 SHALL 定义 TodoActivity 数据模型，自动记录关键操作。

#### Scenario: TodoActivity 核心字段
- **WHEN** 查询 TodoActivity 类型定义
- **THEN** TodoActivity 类型包含以下字段：
  - `id: string` - 记录唯一标识
  - `todoId: string` - 关联的待办事项 ID
  - `userId: string` - 操作用户 ID
  - `action: string` - 操作类型
  - `details: string | undefined` - 操作详情
  - `createdAt: string` - 操作时间

---

### Requirement: 待办事项创建 API
系统 SHALL 提供创建待办事项的 API 接口。

#### Scenario: 创建待办事项成功
- **GIVEN** 用户已登录
- **WHEN** 用户发送 `POST /api/todos` 请求，请求体包含有效的待办事项数据
- **THEN** 系统创建新待办事项
- **AND** 系统生成唯一 ID
- **AND** 系统设置 `status` 为 `'todo'`
- **AND** 系统设置 `createdAt` 和 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, todo: Todo }`

#### Scenario: 标题验证
- **WHEN** 用户发送 `POST /api/todos` 请求，但 `title` 字段为空
- **THEN** 系统返回 `{ success: false, message: '标题不能为空' }`
- **AND** HTTP 状态码为 400

#### Scenario: 优先级验证
- **WHEN** 用户发送 `POST /api/todos` 请求，但 `priority` 字段不是有效值
- **THEN** 系统返回 `{ success: false, message: '无效的优先级' }`
- **AND** HTTP 状态码为 400

---

### Requirement: 待办事项列表 API
系统 SHALL 提供获取待办事项列表的 API 接口。

#### Scenario: 获取所有待办事项
- **WHEN** 用户发送 `GET /api/todos` 请求
- **THEN** 系统返回所有待办事项列表
- **AND** 响应格式为 `{ success: true, todos: Todo[] }`

#### Scenario: 按项目筛选
- **WHEN** 用户发送 `GET /api/todos?projectId=proj-1` 请求
- **THEN** 系统只返回该项目下的待办事项

#### Scenario: 按状态筛选
- **WHEN** 用户发送 `GET /api/todos?status=todo` 请求
- **THEN** 系统只返回状态为 `'todo'` 的待办事项

#### Scenario: 按负责人筛选
- **WHEN** 用户发送 `GET /api/todos?assignee=user-1` 请求
- **THEN** 系统只返回负责人为 `user-1` 的待办事项

---

### Requirement: 待办事项更新 API
系统 SHALL 提供更新待办事项的 API 接口。

#### Scenario: 更新状态
- **WHEN** 用户发送 `PUT /api/todos/todo-1` 请求，请求体包含 `{ status: 'in_progress' }`
- **THEN** 系统更新待办事项的 `status` 字段
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统记录操作日志
- **AND** 系统返回 `{ success: true, todo: Todo }`

#### Scenario: 完成待办事项发放积分
- **WHEN** 用户发送 `PUT /api/todos/todo-1` 请求，请求体包含 `{ status: 'done' }`
- **THEN** 系统更新待办事项状态
- **AND** 系统向负责人发放设定的积分
- **AND** 系统记录积分变更到操作日志

#### Scenario: 截止时间逾期
- **WHEN** 待办事项的 `dueDate` 早于当前日期
- **THEN** 系统在列表中标记该待办事项为逾期状态

---

### Requirement: 子任务管理 API
系统 SHALL 提供子任务的增删改查 API。

#### Scenario: 添加子任务
- **WHEN** 用户发送 `POST /api/todos/todo-1/subtasks` 请求，请求体包含 `{ title: '编写测试用例' }`
- **THEN** 系统创建新子任务
- **AND** 系统返回 `{ success: true, subtask: Subtask }`

#### Scenario: 更新子任务完成状态
- **WHEN** 用户发送 `PUT /api/todos/todo-1/subtasks/sub-1` 请求，请求体包含 `{ completed: true }`
- **THEN** 系统更新子任务的 `completed` 字段
- **AND** 系统记录操作日志

#### Scenario: 删除子任务
- **WHEN** 用户发送 `DELETE /api/todos/todo-1/subtasks/sub-1` 请求
- **THEN** 系统删除该子任务
- **AND** 系统返回 `{ success: true, message: '子任务已删除' }`

---

### Requirement: 关联任务管理 API
系统 SHALL 提供关联任务的管理 API。

#### Scenario: 添加关联
- **WHEN** 用户发送 `POST /api/todos/todo-1/links` 请求，请求体包含 `{ targetId: 'todo-2', linkType: 'blocks' }`
- **THEN** 系统创建关联关系
- **AND** 系统返回 `{ success: true, link: TodoLink }`

#### Scenario: 双向显示
- **GIVEN** 待办事项 A 阻塞待办事项 B
- **WHEN** 查询待办事项 A 的关联任务
- **THEN** 系统显示"阻塞 B"
- **WHEN** 查询待办事项 B 的关联任务
- **THEN** 系统显示"被 A 阻塞"

#### Scenario: 删除关联
- **WHEN** 用户发送 `DELETE /api/todos/todo-1/links/link-1` 请求
- **THEN** 系统删除该关联关系

---

### Requirement: 评论管理 API
系统 SHALL 提供评论的管理 API。

#### Scenario: 添加评论
- **WHEN** 用户发送 `POST /api/todos/todo-1/comments` 请求，请求体包含 `{ content: '这个接口需要加验签' }`
- **THEN** 系统创建新评论
- **AND** 系统返回 `{ success: true, comment: TodoComment }`

#### Scenario: 获取评论列表
- **WHEN** 用户发送 `GET /api/todos/todo-1/comments` 请求
- **THEN** 系统返回该待办事项的所有评论
- **AND** 评论按时间倒序排列

---

### Requirement: 操作记录 API
系统 SHALL 提供操作记录查询 API。

#### Scenario: 获取操作记录
- **WHEN** 用户发送 `GET /api/todos/todo-1/activities` 请求
- **THEN** 系统返回该待办事项的所有操作记录
- **AND** 记录按时间倒序排列

#### Scenario: 自动记录状态变更
- **WHEN** 待办事项状态从 `'todo'` 变更为 `'in_progress'`
- **THEN** 系统自动创建操作记录
- **AND** 记录内容为"将状态从'待处理'改为'进行中'"

---

### Requirement: 待办事项创建抽屉 UI
系统 SHALL 提供待办事项创建抽屉组件，严格按照 Pencil MCP 设计实现。

#### Scenario: 抽屉布局
- **WHEN** 打开待办事项创建抽屉
- **THEN** 抽屉宽度为 900px
- **AND** 采用双栏布局：左侧为表单区域，右侧为 Tab 区域
- **AND** 左侧宽度为 flex-1，右侧宽度为 360px

#### Scenario: 左侧面板字段
- **WHEN** 左侧面板渲染
- **THEN** 显示标题输入框（必填）
- **AND** 显示描述输入框（多行文本）
- **AND** 显示两列 InfoGrid 包含：状态、优先级、负责人、积分奖励、开始时间、截止时间
- **AND** 底部显示"取消"和"创建待办"按钮

#### Scenario: 右侧面板 Tab
- **WHEN** 右侧面板渲染
- **THEN** 显示 TabBar 包含四个 Tab：子任务、关联任务、评论、操作记录
- **AND** Tab 切换时显示对应内容

#### Scenario: 关闭抽屉
- **WHEN** 用户点击关闭按钮
- **THEN** 系统关闭抽屉
- **WHEN** 用户按 ESC 键
- **THEN** 系统关闭抽屉
- **WHEN** 用户点击抽屉外的遮罩层
- **THEN** 系统关闭抽屉

---

### Requirement: 子任务 Tab UI
系统 SHALL 提供子任务管理 Tab 组件。

#### Scenario: 显示子任务列表
- **WHEN** 子任务 Tab 激活
- **THEN** 显示子任务标题和数量
- **AND** 显示"添加子任务"按钮
- **AND** 显示子任务列表，每项包含复选框和标题

#### Scenario: 添加子任务
- **WHEN** 用户点击"添加子任务"按钮
- **THEN** 显示子任务输入框
- **WHEN** 用户输入子任务名称并按回车
- **THEN** 系统创建新子任务

#### Scenario: 完成子任务
- **WHEN** 用户勾选子任务复选框
- **THEN** 系统标记该子任务为已完成
- **AND** 子任务标题显示删除线

---

### Requirement: 关联任务 Tab UI
系统 SHALL 提供关联任务管理 Tab 组件。

#### Scenario: 显示关联任务列表
- **WHEN** 关联任务 Tab 激活
- **THEN** 显示关联任务标题和数量
- **AND** 显示"关联任务"按钮
- **AND** 显示已关联的任务列表

#### Scenario: 无关联任务提示
- **WHEN** 待办事项没有关联任务
- **THEN** 显示"暂无关联任务"提示

---

### Requirement: 评论 Tab UI
系统 SHALL 提供评论 Tab 组件。

#### Scenario: 显示评论列表
- **WHEN** 评论 Tab 激活
- **THEN** 显示评论标题和数量
- **AND** 显示评论输入框
- **AND** 显示评论列表，每项包含头像、用户名、时间和内容

#### Scenario: 发表评论
- **WHEN** 用户在评论输入框输入内容并发送
- **THEN** 系统创建新评论
- **AND** 评论立即显示在列表中

---

### Requirement: 操作记录 Tab UI
系统 SHALL 提供操作记录 Tab 组件。

#### Scenario: 显示操作记录
- **WHEN** 操作记录 Tab 激活
- **THEN** 显示操作记录标题
- **AND** 以时间线形式显示所有操作记录
- **AND** 每条记录显示时间、操作人和操作内容

---

### Requirement: 积分奖励机制
系统 SHALL 在待办事项完成时发放积分。

#### Scenario: 完成发放积分
- **WHEN** 待办事项状态变更为 `'done'`
- **THEN** 系统向负责人发放 `points` 字段设定的积分
- **AND** 系统记录积分变更到操作日志

#### Scenario: 积分建议
- **WHEN** 用户设置积分奖励时
- **THEN** 系统提供参考建议：简单=5，中等=10，复杂=20

---

### Requirement: 待办事项删除规则
系统 SHALL 限制待办事项的删除条件。

#### Scenario: 删除待处理待办事项
- **WHEN** 用户删除状态为 `'todo'` 的待办事项
- **THEN** 系统执行删除操作
- **AND** 系统返回 `{ success: true, message: '待办事项已删除' }`

#### Scenario: 禁止删除已完成待办事项
- **WHEN** 用户尝试删除状态为 `'done'` 的待办事项
- **THEN** 系统返回 `{ success: false, message: '已完成的待办事项不可删除，仅可归档' }`
- **AND** HTTP 状态码为 400

---

### Requirement: 待办事项国际化支持
系统 SHALL 为待办事项功能提供中英文国际化支持。

#### Scenario: 中文界面显示
- **GIVEN** 当前语言为中文
- **WHEN** 用户访问待办事项相关页面
- **THEN** 所有文本显示为中文
- **AND** 包括状态（待处理、进行中、已阻塞、已完成、已取消）
- **AND** 包括优先级（低、中、高、紧急）
- **AND** 包括表单标签和按钮

#### Scenario: 英文界面显示
- **GIVEN** 当前语言为英文
- **WHEN** 用户访问待办事项相关页面
- **THEN** 所有文本显示为英文
- **AND** 包括状态（Todo、In Progress、Blocked、Done、Cancelled）
- **AND** 包括优先级（Low、Medium、High、Urgent）
- **AND** 包括表单标签和按钮
