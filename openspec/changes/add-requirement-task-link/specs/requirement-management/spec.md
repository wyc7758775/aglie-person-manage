## ADDED Requirements

### Requirement: 需求关联任务数据模型
系统 SHALL 在 Requirement 类型中支持关联任务列表。

#### Scenario: Requirement 包含关联任务字段
- **GIVEN** 系统查询需求数据
- **WHEN** 返回 Requirement 对象
- **THEN** 对象包含 `relatedTasks?: string[]` 字段
- **AND** 字段存储关联的任务ID数组

#### Scenario: 关联任务数据库存储
- **GIVEN** 数据库中 requirements 表
- **WHEN** 查询单条需求记录
- **THEN** 记录包含 `related_tasks` JSONB 字段
- **AND** 字段格式为任务ID字符串数组

---

### Requirement: 任务列表查询 API
系统 SHALL 提供获取可关联任务列表的 API 接口。

#### Scenario: 获取项目的任务列表
- **WHEN** 客户端发送 `GET /api/tasks?projectId=proj-1` 请求
- **THEN** 系统返回项目 proj-1 下的所有任务
- **AND** 响应格式为 `{ success: true, tasks: TaskSummary[] }`
- **AND** TaskSummary 包含 id, title, status, priority 字段

#### Scenario: 搜索任务
- **WHEN** 客户端发送 `GET /api/tasks?projectId=proj-1&search=登录` 请求
- **THEN** 系统返回标题包含"登录"的任务
- **AND** 或返回ID包含"登录"的任务

#### Scenario: 未指定项目ID
- **WHEN** 客户端发送 `GET /api/tasks` 请求（无 projectId）
- **THEN** 系统返回 `{ success: false, message: '项目ID不能为空' }`
- **AND** HTTP 状态码为 400

---

### Requirement: 需求关联任务更新 API
系统 SHALL 提供更新需求关联任务的 API 接口。

#### Scenario: 更新关联任务成功
- **GIVEN** 需求 REQ-001 当前关联任务 [TASK-001, TASK-002]
- **WHEN** 客户端发送 `PUT /api/requirements/REQ-001/tasks` 
- **AND** 请求体为 `{ taskIds: ['TASK-001', 'TASK-003'] }`
- **THEN** 系统更新需求关联任务为 [TASK-001, TASK-003]
- **AND** 系统返回 `{ success: true, requirement: Requirement }`

#### Scenario: 清空关联任务
- **WHEN** 客户端发送 `PUT /api/requirements/REQ-001/tasks`
- **AND** 请求体为 `{ taskIds: [] }`
- **THEN** 系统清空需求的关联任务
- **AND** 系统返回 `{ success: true, requirement: Requirement }`

#### Scenario: 需求不存在
- **WHEN** 客户端发送 `PUT /api/requirements/NONEXISTENT/tasks` 请求
- **THEN** 系统返回 `{ success: false, message: '需求不存在' }`
- **AND** HTTP 状态码为 404

#### Scenario: 包含无效任务ID
- **WHEN** 客户端发送 `PUT /api/requirements/REQ-001/tasks`
- **AND** 请求体包含不存在的任务ID
- **THEN** 系统返回 `{ success: false, message: '任务 TASK-999 不存在' }`
- **AND** HTTP 状态码为 400

---

### Requirement: 关联任务模态框 UI
系统 SHALL 提供关联任务模态框组件，用于选择和管理需求的关联任务。

#### Scenario: 模态框基本结构
- **WHEN** LinkTaskModal 组件渲染
- **THEN** 显示模态框标题"关联任务"
- **AND** 显示关闭按钮（X图标）
- **AND** 显示搜索框
- **AND** 显示任务列表区域
- **AND** 显示底部操作栏

#### Scenario: 搜索功能
- **GIVEN** 模态框已打开并加载任务列表
- **WHEN** 用户在搜索框输入"登录"
- **THEN** 任务列表只显示标题或ID包含"登录"的任务
- **AND** 已关联任务区域保持不变

#### Scenario: 显示已关联任务
- **GIVEN** 需求 REQ-001 已关联任务 [TASK-001, TASK-002]
- **WHEN** 模态框打开
- **THEN** "已关联"区域显示 TASK-001 和 TASK-002
- **AND** 每个任务项显示复选框（已选中）
- **AND** 显示"已关联"标签

#### Scenario: 显示可关联任务
- **GIVEN** 项目下有任务 [TASK-001, TASK-002, TASK-003]
- **AND** 需求 REQ-001 已关联 [TASK-001]
- **WHEN** 模态框打开
- **THEN** "可关联"区域显示 TASK-002 和 TASK-003
- **AND** 每个任务项显示复选框（未选中）

#### Scenario: 选择任务关联
- **GIVEN** 模态框显示可关联任务 TASK-002（未选中）
- **WHEN** 用户点击 TASK-002 的复选框
- **THEN** 复选框变为选中状态
- **AND** 任务项高亮显示（橙色边框）
- **AND** 显示"新选择"标签

#### Scenario: 取消已关联任务
- **GIVEN** 模态框显示已关联任务 TASK-001（已选中）
- **WHEN** 用户点击 TASK-001 的复选框取消选择
- **THEN** 复选框变为未选中状态
- **AND** 任务项移动到"可关联"区域

#### Scenario: 底部统计显示
- **GIVEN** 需求原有关联 2 个任务
- **AND** 用户新选择 1 个任务
- **AND** 用户取消 1 个原有关联
- **THEN** 底部显示"已选择 2 个任务（新增 1 个）"

#### Scenario: 确认关联
- **GIVEN** 用户选择了新的关联任务
- **WHEN** 用户点击"确认关联"按钮
- **THEN** 系统调用 API 更新关联任务
- **AND** 模态框关闭
- **AND** 触发 onConfirm 回调

#### Scenario: 取消操作
- **WHEN** 用户点击"取消"按钮
- **OR** 用户点击关闭按钮
- **OR** 用户点击遮罩层
- **THEN** 模态框关闭
- **AND** 不保存任何变更

---

### Requirement: 需求详情面板集成
系统 SHALL 在需求详情面板中集成关联任务功能。

#### Scenario: 显示关联任务区域
- **WHEN** 需求详情面板打开（非创建模式）
- **THEN** 显示"关联任务"区域
- **AND** 显示关联任务数量
- **AND** 显示"新建"按钮

#### Scenario: 打开关联任务模态框
- **GIVEN** 需求详情面板已打开
- **WHEN** 用户点击"关联任务"区域的"新建"按钮
- **THEN** 系统打开 LinkTaskModal 模态框
- **AND** 模态框传入当前需求的 projectId 和 linkedTaskIds

#### Scenario: 关联成功后刷新
- **GIVEN** 用户在模态框中确认关联
- **WHEN** 模态框关闭并返回新的关联列表
- **THEN** 需求详情面板更新关联任务数量显示
- **AND** 可选：显示已关联任务列表

---

## MODIFIED Requirements

### Requirement: 需求详情 API 返回关联任务
系统 SHALL 在获取需求详情时返回关联任务列表。

#### Scenario: 获取需求详情包含关联任务
- **WHEN** 客户端发送 `GET /api/requirements/REQ-001` 请求
- **THEN** 响应中的 requirement 对象包含 `relatedTasks` 字段
- **AND** 字段值为关联的任务ID数组
