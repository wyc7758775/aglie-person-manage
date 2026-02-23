## ADDED Requirements

### Requirement: 日常任务数据模型
系统 SHALL 定义 DailyTask 数据模型，用于存储日常任务信息。

#### Scenario: DailyTask 核心字段
- **GIVEN** 系统初始化完成
- **WHEN** 查询 DailyTask 类型定义
- **THEN** DailyTask 类型包含以下字段：
  - `id: string` - 任务唯一标识
  - `name: string` - 任务名称（必填）
  - `description: string` - 任务描述
  - `difficulty: 'easy' | 'medium' | 'hard'` - 任务难度
  - `frequency: 'daily' | 'weekdays' | 'weekly' | 'custom'` - 执行频率
  - `repeatDays: number[]` - 重复日（0=周日, 1=周一...），当 frequency 为 'custom' 时使用
  - `startDate: string` - 开始日期
  - `tags: string[]` - 标签列表
  - `status: 'pending' | 'in_progress' | 'completed'` - 任务状态
  - `streak: number` - 连续完成天数
  - `goldReward: number` - 完成奖励金币数
  - `goldPenalty: number` - 未完成惩罚金币数
  - `createdAt: string` - 创建时间
  - `updatedAt: string` - 更新时间

#### Scenario: 任务状态流转
- **WHEN** 任务刚创建时
- **THEN** 状态为 `'pending'`
- **WHEN** 用户开始执行任务
- **THEN** 状态变为 `'in_progress'`
- **WHEN** 用户标记任务完成
- **THEN** 状态变为 `'completed'`
- **AND** 连胜天数 `streak` 增加 1
- **AND** 用户金币增加 `goldReward`

### Requirement: 习惯数据模型
系统 SHALL 定义 Habit 数据模型，用于存储习惯追踪信息。

#### Scenario: Habit 核心字段
- **GIVEN** 系统初始化完成
- **WHEN** 查询 Habit 类型定义
- **THEN** Habit 类型包含以下字段：
  - `id: string` - 习惯唯一标识
  - `name: string` - 习惯名称（必填）
  - `description: string` - 习惯描述
  - `direction: 'positive' | 'negative' | 'both'` - 计数方向（正向/负向/双向）
  - `difficulty: 'easy' | 'medium' | 'hard'` - 难度等级
  - `tags: string[]` - 标签列表
  - `streak: number` - 连续坚持天数
  - `totalCount: number` - 总执行次数
  - `goldReward: number` - 完成奖励金币
  - `createdAt: string` - 创建时间
  - `updatedAt: string` - 更新时间

#### Scenario: 习惯计数方向
- **WHEN** 习惯的 `direction` 为 `'positive'`
- **THEN** 用户每次记录正向行为时金币增加
- **WHEN** 习惯的 `direction` 为 `'negative'`
- **THEN** 用户每次记录负向行为时金币减少（戒除坏习惯）
- **WHEN** 习惯的 `direction` 为 `'both'`
- **THEN** 支持正向和负向两种记录方式

### Requirement: 待办事项数据模型
系统 SHALL 定义 Todo 数据模型，用于存储待办事项信息。

#### Scenario: Todo 核心字段
- **GIVEN** 系统初始化完成
- **WHEN** 查询 Todo 类型定义
- **THEN** Todo 类型包含以下字段：
  - `id: string` - 待办唯一标识
  - `name: string` - 待办标题（必填）
  - `description: string` - 待办描述
  - `status: 'pending' | 'in_progress' | 'completed'` - 待办状态
  - `priority: 'high' | 'medium' | 'low'` - 优先级
  - `assignee: string | null` - 负责人（可选）
  - `points: number` - 积分奖励
  - `startDate: string | null` - 开始日期（可选）
  - `dueDate: string | null` - 截止日期（可选）
  - `tags: string[]` - 标签列表
  - `projectId: string | null` - 关联项目 ID（可选）
  - `requirementId: string | null` - 关联需求 ID（可选）
  - `defectId: string | null` - 关联缺陷 ID（可选）
  - `subTasks: SubTask[]` - 子任务列表
  - `comments: Comment[]` - 评论列表
  - `history: HistoryLog[]` - 历史记录
  - `createdAt: string` - 创建时间
  - `updatedAt: string` - 更新时间

#### Scenario: SubTask 类型定义
- **WHEN** 定义 SubTask 类型
- **THEN** SubTask 包含以下字段：
  - `id: string` - 子任务 ID
  - `title: string` - 子任务标题
  - `completed: boolean` - 是否完成
  - `createdAt: string` - 创建时间

#### Scenario: Comment 类型定义
- **WHEN** 定义 Comment 类型
- **THEN** Comment 包含以下字段：
  - `id: string` - 评论 ID
  - `content: string` - 评论内容
  - `author: string` - 评论作者
  - `createdAt: string` - 创建时间

#### Scenario: HistoryLog 类型定义
- **WHEN** 定义 HistoryLog 类型
- **THEN** HistoryLog 包含以下字段：
  - `id: string` - 记录 ID
  - `action: string` - 操作类型（如 'created', 'completed', 'updated'）
  - `description: string` - 操作描述
  - `timestamp: string` - 操作时间

### Requirement: 任务列表 API
系统 SHALL 提供获取任务列表的 API 接口，支持按类型筛选。

#### Scenario: 获取所有日常任务
- **WHEN** 客户端发送 `GET /api/tasks?type=daily` 请求
- **THEN** 系统返回所有日常任务列表
- **AND** 响应格式为 `{ success: true, tasks: DailyTask[] }`

#### Scenario: 获取所有习惯
- **WHEN** 客户端发送 `GET /api/tasks?type=habit` 请求
- **THEN** 系统返回所有习惯列表
- **AND** 响应格式为 `{ success: true, tasks: Habit[] }`

#### Scenario: 获取所有待办事项
- **WHEN** 客户端发送 `GET /api/tasks?type=todo` 请求
- **THEN** 系统返回所有待办事项列表
- **AND** 响应格式为 `{ success: true, tasks: Todo[] }`

#### Scenario: 按状态筛选任务
- **WHEN** 客户端发送 `GET /api/tasks?type=daily&status=completed` 请求
- **THEN** 系统只返回状态为 `completed` 的日常任务

#### Scenario: 按标签筛选任务
- **WHEN** 客户端发送 `GET /api/tasks?type=daily&tags=工作` 请求
- **THEN** 系统只返回包含"工作"标签的日常任务

### Requirement: 创建日常任务 API
系统 SHALL 提供创建日常任务的 API 接口。

#### Scenario: 创建日常任务成功
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/tasks/daily` 请求，请求体包含有效的任务数据
- **THEN** 系统创建新日常任务
- **AND** 系统生成唯一 ID
- **AND** 系统设置 `status` 为 `'pending'`
- **AND** 系统设置 `streak` 为 0
- **AND** 系统设置 `createdAt` 和 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, task: DailyTask }`

#### Scenario: 任务名称验证
- **WHEN** 客户端发送 `POST /api/tasks/daily` 请求，但 `name` 字段为空
- **THEN** 系统返回 `{ success: false, message: '任务名称不能为空' }`
- **AND** HTTP 状态码为 400

#### Scenario: 难度验证
- **WHEN** 客户端发送 `POST /api/tasks/daily` 请求，但 `difficulty` 不是有效值
- **THEN** 系统返回 `{ success: false, message: '无效的难度等级' }`
- **AND** HTTP 状态码为 400

### Requirement: 创建习惯 API
系统 SHALL 提供创建习惯的 API 接口。

#### Scenario: 创建习惯成功
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/tasks/habits` 请求，请求体包含有效的习惯数据
- **THEN** 系统创建新习惯
- **AND** 系统生成唯一 ID
- **AND** 系统设置 `streak` 为 0
- **AND** 系统设置 `totalCount` 为 0
- **AND** 系统返回 `{ success: true, habit: Habit }`

#### Scenario: 计数方向验证
- **WHEN** 客户端发送 `POST /api/tasks/habits` 请求，但 `direction` 不是有效值
- **THEN** 系统返回 `{ success: false, message: '无效的计数方向' }`
- **AND** HTTP 状态码为 400

### Requirement: 创建待办事项 API
系统 SHALL 提供创建待办事项的 API 接口。

#### Scenario: 创建待办事项成功
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/tasks/todos` 请求，请求体包含有效的待办数据
- **THEN** 系统创建新待办事项
- **AND** 系统生成唯一 ID
- **AND** 系统设置 `status` 为 `'pending'`
- **AND** 系统设置 `subTasks` 为空数组
- **AND** 系统设置 `comments` 为空数组
- **AND** 系统设置 `history` 为包含创建记录的数组
- **AND** 系统返回 `{ success: true, todo: Todo }`

#### Scenario: 优先级验证
- **WHEN** 客户端发送 `POST /api/tasks/todos` 请求，但 `priority` 不是有效值
- **THEN** 系统返回 `{ success: false, message: '无效的优先级' }`
- **AND** HTTP 状态码为 400

### Requirement: 任务详情 API
系统 SHALL 提供获取单个任务详情的 API 接口。

#### Scenario: 获取日常任务详情
- **WHEN** 客户端发送 `GET /api/tasks/daily/task-1` 请求
- **THEN** 系统返回 ID 为 `task-1` 的日常任务完整信息
- **AND** 响应格式为 `{ success: true, task: DailyTask }`

#### Scenario: 获取习惯详情
- **WHEN** 客户端发送 `GET /api/tasks/habits/habit-1` 请求
- **THEN** 系统返回 ID 为 `habit-1` 的习惯完整信息
- **AND** 响应格式为 `{ success: true, habit: Habit }`

#### Scenario: 获取待办事项详情
- **WHEN** 客户端发送 `GET /api/tasks/todos/todo-1` 请求
- **THEN** 系统返回 ID 为 `todo-1` 的待办事项完整信息
- **AND** 包含 `subTasks`、`comments`、`history` 等关联数据
- **AND** 响应格式为 `{ success: true, todo: Todo }`

#### Scenario: 任务不存在
- **WHEN** 客户端发送 `GET /api/tasks/daily/nonexistent-id` 请求
- **THEN** 系统返回 `{ success: false, message: '任务不存在' }`
- **AND** HTTP 状态码为 404

### Requirement: 更新任务 API
系统 SHALL 提供更新任务信息的 API 接口。

#### Scenario: 更新日常任务
- **WHEN** 客户端发送 `PUT /api/tasks/daily/task-1` 请求，请求体包含 `{ name: '新名称' }`
- **THEN** 系统更新任务的 `name` 字段
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, task: DailyTask }`

#### Scenario: 更新习惯
- **WHEN** 客户端发送 `PUT /api/tasks/habits/habit-1` 请求，请求体包含 `{ direction: 'positive' }`
- **THEN** 系统更新习惯的 `direction` 字段
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, habit: Habit }`

#### Scenario: 更新待办事项
- **WHEN** 客户端发送 `PUT /api/tasks/todos/todo-1` 请求，请求体包含 `{ status: 'completed' }`
- **THEN** 系统更新待办的 `status` 字段
- **AND** 系统在 `history` 中添加完成记录
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, todo: Todo }`

### Requirement: 删除任务 API
系统 SHALL 提供删除任务的 API 接口。

#### Scenario: 删除日常任务
- **WHEN** 客户端发送 `DELETE /api/tasks/daily/task-1` 请求
- **THEN** 系统删除 ID 为 `task-1` 的日常任务
- **AND** 系统返回 `{ success: true, message: '任务已删除' }`

#### Scenario: 删除习惯
- **WHEN** 客户端发送 `DELETE /api/tasks/habits/habit-1` 请求
- **THEN** 系统删除 ID 为 `habit-1` 的习惯
- **AND** 系统返回 `{ success: true, message: '习惯已删除' }`

#### Scenario: 删除待办事项
- **WHEN** 客户端发送 `DELETE /api/tasks/todos/todo-1` 请求
- **THEN** 系统删除 ID 为 `todo-1` 的待办事项
- **AND** 系统级联删除关联的子任务、评论和历史记录
- **AND** 系统返回 `{ success: true, message: '待办事项已删除' }`

### Requirement: 标记任务完成 API
系统 SHALL 提供标记任务完成的 API 接口。

#### Scenario: 完成日常任务
- **WHEN** 客户端发送 `POST /api/tasks/daily/task-1/complete` 请求
- **THEN** 系统将任务状态更新为 `'completed'`
- **AND** 系统增加连胜天数 `streak`
- **AND** 系统给用户增加金币 `goldReward`
- **AND** 系统返回 `{ success: true, task: DailyTask }`

#### Scenario: 记录习惯执行
- **GIVEN** 习惯的 `direction` 为 `'positive'`
- **WHEN** 客户端发送 `POST /api/tasks/habits/habit-1/complete` 请求
- **THEN** 系统增加 `totalCount`
- **AND** 系统增加连胜天数 `streak`
- **AND** 系统给用户增加金币
- **AND** 系统返回 `{ success: true, habit: Habit }`

#### Scenario: 完成待办事项
- **WHEN** 客户端发送 `POST /api/tasks/todos/todo-1/complete` 请求
- **THEN** 系统将待办状态更新为 `'completed'`
- **AND** 系统给用户增加积分 `points`
- **AND** 系统在 `history` 中添加完成记录
- **AND** 系统返回 `{ success: true, todo: Todo }`

### Requirement: 任务列表页面 UI
系统 SHALL 提供任务列表页面，显示所有任务并支持类型切换、筛选和搜索。

#### Scenario: 显示任务列表页
- **GIVEN** 用户已登录
- **WHEN** 用户访问 `/dashboard/tasks` 页面
- **THEN** 系统显示任务列表页面
- **AND** 页面显示类型切换标签栏（习惯/日常任务/待办事项）
- **AND** 默认显示日常任务列表

#### Scenario: 切换任务类型
- **GIVEN** 用户在任务列表页面
- **WHEN** 用户点击"习惯"标签
- **THEN** 系统显示习惯列表
- **AND** 习惯列表显示：名称、难度、连胜天数、金币奖励
- **WHEN** 用户点击"待办事项"标签
- **THEN** 系统显示待办事项列表
- **AND** 待办列表显示：标题、优先级、状态、截止日期

#### Scenario: 筛选任务
- **GIVEN** 用户在任务列表页面
- **WHEN** 用户点击状态筛选器（如"已完成"）
- **THEN** 系统只显示状态为"已完成"的任务
- **WHEN** 用户点击标签筛选器（如"工作"）
- **THEN** 系统只显示包含"工作"标签的任务

#### Scenario: 搜索任务
- **GIVEN** 用户在任务列表页面
- **WHEN** 用户在搜索框输入关键词
- **THEN** 系统实时过滤显示匹配的任务
- **AND** 匹配规则包括任务名称和描述

#### Scenario: 显示加载状态
- **WHEN** 任务列表正在加载
- **THEN** 系统显示加载动画或骨架屏

#### Scenario: 显示空状态
- **WHEN** 没有符合条件的任务
- **THEN** 系统显示"没有找到符合条件的任务"提示

### Requirement: 任务创建抽屉 UI
系统 SHALL 提供任务创建抽屉，支持创建三种类型的任务。

#### Scenario: 打开创建抽屉
- **GIVEN** 用户在任务列表页面
- **WHEN** 用户点击"新建任务"按钮
- **THEN** 系统从右侧滑出创建抽屉
- **AND** 抽屉宽度为 560px
- **AND** 抽屉显示半透明遮罩层

#### Scenario: 选择任务类型
- **GIVEN** 创建抽屉已打开
- **THEN** 抽屉顶部显示任务类型选择器（习惯/日常任务/待办事项）
- **WHEN** 用户点击不同类型
- **THEN** 抽屉动态切换对应的表单字段

#### Scenario: 创建日常任务表单
- **GIVEN** 用户选择"日常任务"类型
- **THEN** 表单显示以下字段：
  - 任务名称（必填）
  - 备注说明
  - 难度选择器（简单/中等/困难）
  - 频率选择器（每天/工作日/每周/自定义）
  - 重复日选择器（当选择自定义时显示）
  - 开始日期选择器
  - 标签输入

#### Scenario: 创建习惯表单
- **GIVEN** 用户选择"习惯"类型
- **THEN** 表单显示以下字段：
  - 习惯名称（必填）
  - 备注说明
  - 计数方向（正向/负向/双向）
  - 难度选择器
  - 标签输入
  - 习惯预览表（显示示例记录）

#### Scenario: 创建待办事项表单
- **GIVEN** 用户选择"待办事项"类型
- **THEN** 表单显示左右两栏布局（宽度 900px）
  - **左栏**包含：
    - 任务标题（必填）
    - 任务描述
    - 状态和优先级选择器
    - 负责人和积分
    - 开始日期和截止日期
  - **右栏**包含 Tab 切换：
    - 子任务列表
    - 关联项（项目/需求/缺陷）
    - 评论列表
    - 历史记录

#### Scenario: 重复日选择器
- **GIVEN** 用户选择了自定义频率
- **THEN** 显示周一至周日的选择按钮
- **WHEN** 用户点击某个日期按钮
- **THEN** 按钮变为激活状态（橙色背景）
- **WHEN** 用户再次点击
- **THEN** 按钮恢复默认状态

#### Scenario: 标签输入
- **GIVEN** 表单显示标签输入区域
- **THEN** 显示已添加的标签（带删除按钮）
- **WHEN** 用户点击"添加标签"
- **THEN** 弹出标签选择器或输入框
- **WHEN** 用户选择或输入标签
- **THEN** 新标签添加到列表

#### Scenario: 表单验证
- **GIVEN** 用户提交表单
- **WHEN** 必填字段为空
- **THEN** 在对应字段旁显示错误提示
- **AND** 不提交表单

#### Scenario: 关闭创建抽屉
- **WHEN** 用户点击"取消"按钮
- **THEN** 系统关闭创建抽屉
- **WHEN** 用户点击遮罩层
- **THEN** 系统关闭创建抽屉
- **WHEN** 用户按 ESC 键
- **THEN** 系统关闭创建抽屉

### Requirement: 任务详情抽屉 UI
系统 SHALL 提供任务详情抽屉，展示任务完整信息和游戏属性。

#### Scenario: 打开详情抽屉
- **GIVEN** 用户在任务列表页面
- **WHEN** 用户点击某行任务
- **THEN** 系统从右侧滑出详情抽屉
- **AND** 抽屉宽度为 614px
- **AND** 抽屉显示任务完整信息

#### Scenario: 详情抽屉头部
- **GIVEN** 详情抽屉已打开
- **THEN** 头部显示：
  - 任务类型标签（如"日常任务"）
  - "任务详情"标题
  - "编辑"按钮
  - 关闭按钮

#### Scenario: 显示游戏属性卡片
- **GIVEN** 详情抽屉已打开
- **THEN** 显示游戏属性卡片（深色背景）：
  - 连胜天数（Streak）
  - 金币奖励（Gold）
  - 如果是习惯，显示总次数
  - 如果是待办，显示积分

#### Scenario: 显示任务信息网格
- **GIVEN** 详情抽屉已打开
- **THEN** 显示任务信息网格（浅色背景）：
  - 难度等级
  - 频率/优先级
  - 开始日期
  - 重复日/截止日期
  - 标签列表

#### Scenario: 显示备注说明
- **GIVEN** 详情抽屉已打开
- **AND** 任务有描述
- **THEN** 显示"备注说明"区域
- **AND** 显示任务描述内容

#### Scenario: 显示完成记录（日常任务和习惯）
- **GIVEN** 详情抽屉已打开（日常任务或习惯）
- **THEN** 显示"完成记录"区域
- **AND** 显示本周完成情况（周一到周日）
- **AND** 显示本周完成率

#### Scenario: 显示操作日志
- **GIVEN** 详情抽屉已打开
- **THEN** 显示"操作日志"区域
- **AND** 按时间倒序显示操作记录
- **AND** 每条记录显示时间、操作类型和描述

#### Scenario: 标记完成按钮
- **GIVEN** 详情抽屉已打开
- **AND** 任务状态不是已完成
- **THEN** 显示"标记完成"按钮（绿色）
- **WHEN** 用户点击按钮
- **THEN** 调用完成 API
- **AND** 更新任务状态

#### Scenario: 编辑按钮行为
- **GIVEN** 详情抽屉已打开
- **WHEN** 用户点击"编辑"按钮
- **THEN** 系统关闭详情抽屉
- **AND** 系统打开编辑抽屉

#### Scenario: 关闭详情抽屉
- **WHEN** 用户点击关闭按钮
- **THEN** 系统关闭详情抽屉
- **WHEN** 用户点击遮罩层
- **THEN** 系统关闭详情抽屉
- **WHEN** 用户按 ESC 键
- **THEN** 系统关闭详情抽屉

### Requirement: 任务编辑抽屉 UI
系统 SHALL 提供任务编辑抽屉，用于修改任务信息。

#### Scenario: 打开编辑抽屉
- **GIVEN** 用户在详情抽屉中点击"编辑"
- **THEN** 系统从右侧滑出编辑抽屉
- **AND** 编辑抽屉宽度为 560px（日常任务/习惯）或 900px（待办）
- **AND** 表单预填充当前任务数据

#### Scenario: 编辑抽屉头部
- **GIVEN** 编辑抽屉已打开
- **THEN** 头部显示：
  - "编辑日常任务"/"编辑习惯"/"编辑待办事项"标题
  - "查看详情"按钮（返回详情）
  - 关闭按钮

#### Scenario: 保存修改
- **GIVEN** 用户修改了表单字段
- **WHEN** 用户点击"保存修改"按钮
- **THEN** 系统调用更新 API
- **AND** 系统关闭编辑抽屉
- **AND** 系统刷新任务列表

#### Scenario: 取消编辑
- **WHEN** 用户点击"取消"按钮
- **THEN** 系统关闭编辑抽屉
- **AND** 不保存任何修改

### Requirement: 待办事项子任务 UI
系统 SHALL 提供子任务管理功能，支持在待办事项中添加和完成子任务。

#### Scenario: 显示子任务列表
- **GIVEN** 用户在待办详情或创建页面
- **WHEN** 用户切换到"子任务" Tab
- **THEN** 显示子任务列表
- **AND** 每个子任务显示复选框和标题
- **AND** 已完成的子任务显示为完成状态

#### Scenario: 添加子任务
- **GIVEN** 用户在子任务 Tab
- **THEN** 显示"添加子任务"输入框
- **WHEN** 用户输入标题并提交
- **THEN** 新子任务添加到列表
- **AND** 子任务状态为未完成

#### Scenario: 完成子任务
- **GIVEN** 子任务列表中有未完成任务
- **WHEN** 用户点击子任务的复选框
- **THEN** 子任务标记为完成
- **AND** 更新子任务状态

#### Scenario: 删除子任务
- **GIVEN** 子任务列表中有任务
- **WHEN** 用户点击子任务的删除按钮
- **THEN** 子任务从列表中移除

### Requirement: 待办事项评论 UI
系统 SHALL 提供评论功能，支持在待办事项中添加和查看评论。

#### Scenario: 显示评论列表
- **GIVEN** 用户在待办详情页面
- **WHEN** 用户切换到"评论" Tab
- **THEN** 显示评论列表
- **AND** 每条评论显示作者、内容和时间

#### Scenario: 添加评论
- **GIVEN** 用户在评论 Tab
- **THEN** 显示评论输入框
- **WHEN** 用户输入内容并提交
- **THEN** 新评论添加到列表顶部
- **AND** 清空输入框

### Requirement: 任务数据持久化
系统 SHALL 使用 PostgreSQL 数据库存储任务数据。

#### Scenario: 创建任务持久化
- **WHEN** 用户创建新任务
- **THEN** 任务数据保存到 PostgreSQL
- **AND** 刷新页面后任务仍然存在

#### Scenario: 更新任务持久化
- **WHEN** 用户更新任务信息
- **THEN** 更新后的数据保存到 PostgreSQL
- **AND** 刷新页面后更新仍然生效

#### Scenario: 删除任务持久化
- **WHEN** 用户删除任务
- **THEN** 任务从 PostgreSQL 中移除
- **AND** 刷新页面后任务不再显示
