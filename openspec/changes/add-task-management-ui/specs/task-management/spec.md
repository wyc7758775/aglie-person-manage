## ADDED Requirements

### Requirement: 任务与项目关联
系统 SHALL 确保任务与项目关联，通过 projectId 字段建立关系。

#### Scenario: Task 数据模型包含 projectId
- **GIVEN** 系统初始化完成
- **WHEN** 查询 Task 类型定义
- **THEN** Task 类型包含 `projectId: string` 字段
- **AND** 该字段表示任务所属项目

#### Scenario: 获取任务按 projectId 筛选
- **WHEN** 客户端发送 `GET /api/tasks?projectId=proj-1` 请求
- **THEN** 系统只返回 projectId 为 `proj-1` 的任务

#### Scenario: 创建任务时必填 projectId
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/tasks` 请求，但请求体不包含 `projectId`
- **THEN** 系统返回 `{ success: false, message: '项目ID不能为空' }`
- **AND** HTTP 状态码为 400

### Requirement: 四种任务类型数据模型
系统 SHALL 定义支持四种任务类型的统一 Task 数据模型：爱好(Hobby)、习惯(Habit)、任务(Task)、欲望(Desire)。

#### Scenario: Task 核心字段
- **GIVEN** 系统初始化完成
- **WHEN** 查询 Task 类型定义
- **THEN** Task 类型包含以下字段：
  - `id: string` - 任务唯一标识
  - `title: string` - 任务标题（必填）
  - `description: string` - 任务描述
  - `type: 'hobby' | 'habit' | 'task' | 'desire'` - 任务类型
  - `status: 'todo' | 'in_progress' | 'completed' | 'cancelled'` - 任务状态
  - `priority: 'p0' | 'p1' | 'p2' | 'p3'` - 优先级
  - `difficulty: 'easy' | 'medium' | 'hard'` - 难度等级
  - `projectId: string` - 所属项目ID
  - `assignee: string | null` - 负责人
  - `points: number` - 积分奖励
  - `goldReward: number` - 金币奖励
  - `goldPenalty: number` - 未完成惩罚金币
  - `streak: number` - 连续完成天数（习惯类型）
  - `totalCount: number` - 总执行次数（习惯类型）
  - `frequency: 'daily' | 'weekdays' | 'weekly' | 'custom'` - 执行频率
  - `repeatDays: number[]` - 重复日（0=周日...6=周六）
  - `startDate: string | null` - 开始日期
  - `dueDate: string | null` - 截止日期
  - `tags: string[]` - 标签列表
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
  - `action: string` - 操作类型
  - `description: string` - 操作描述
  - `timestamp: string` - 操作时间

### Requirement: 任务列表 API
系统 SHALL 提供获取任务列表的 API 接口，支持按项目和类型筛选。

#### Scenario: 获取指定项目的所有任务
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `GET /api/tasks?projectId=proj-1` 请求
- **THEN** 系统返回 projectId 为 `proj-1` 的所有任务
- **AND** 响应格式为 `{ success: true, tasks: Task[] }`

#### Scenario: 按类型筛选任务
- **WHEN** 客户端发送 `GET /api/tasks?projectId=proj-1&type=habit` 请求
- **THEN** 系统只返回 projectId 为 `proj-1` 且类型为 habit 的任务

#### Scenario: 按状态筛选任务
- **WHEN** 客户端发送 `GET /api/tasks?projectId=proj-1&status=completed` 请求
- **THEN** 系统只返回 projectId 为 `proj-1` 且状态为 completed 的任务

#### Scenario: 组合筛选条件
- **WHEN** 客户端发送 `GET /api/tasks?projectId=proj-1&type=task&status=todo` 请求
- **THEN** 系统返回符合所有条件的任务

### Requirement: 创建任务 API
系统 SHALL 提供创建任务的 API 接口，支持四种任务类型。

#### Scenario: 创建爱好类型任务
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/tasks` 请求，请求体包含 `type: 'hobby'` 和有效数据
- **THEN** 系统创建新爱好任务
- **AND** 系统设置 `status` 为 `'todo'`
- **AND** 系统设置 `streak` 为 0
- **AND** 系统返回 `{ success: true, task: Task }`

#### Scenario: 创建习惯类型任务
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/tasks` 请求，请求体包含 `type: 'habit'` 和有效数据
- **THEN** 系统创建新习惯任务
- **AND** 系统设置 `streak` 为 0
- **AND** 系统设置 `totalCount` 为 0
- **AND** 系统返回 `{ success: true, task: Task }`

#### Scenario: 创建任务类型
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/tasks` 请求，请求体包含 `type: 'task'` 和有效数据
- **THEN** 系统创建新任务
- **AND** 系统设置 `subTasks` 为空数组
- **AND** 系统设置 `comments` 为空数组
- **AND** 系统返回 `{ success: true, task: Task }`

#### Scenario: 创建欲望类型任务
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/tasks` 请求，请求体包含 `type: 'desire'` 和有效数据
- **THEN** 系统创建新欲望任务
- **AND** 系统返回 `{ success: true, task: Task }`

#### Scenario: 任务标题验证
- **WHEN** 客户端发送 `POST /api/tasks` 请求，但 `title` 字段为空
- **THEN** 系统返回 `{ success: false, message: '任务标题不能为空' }`
- **AND** HTTP 状态码为 400

#### Scenario: 项目ID验证
- **WHEN** 客户端发送 `POST /api/tasks` 请求，但 `projectId` 为空
- **THEN** 系统返回 `{ success: false, message: '项目ID不能为空' }`
- **AND** HTTP 状态码为 400

### Requirement: 任务详情 API
系统 SHALL 提供获取单个任务详情的 API 接口。

#### Scenario: 获取任务详情成功
- **WHEN** 客户端发送 `GET /api/tasks/task-1` 请求
- **THEN** 系统返回 ID 为 `task-1` 的任务完整信息
- **AND** 包含 `subTasks`、`comments`、`history` 等关联数据
- **AND** 响应格式为 `{ success: true, task: Task }`

#### Scenario: 任务不存在
- **WHEN** 客户端发送 `GET /api/tasks/nonexistent-id` 请求
- **THEN** 系统返回 `{ success: false, message: '任务不存在' }`
- **AND** HTTP 状态码为 404

### Requirement: 更新任务 API
系统 SHALL 提供更新任务信息的 API 接口。

#### Scenario: 更新任务标题
- **WHEN** 客户端发送 `PUT /api/tasks/task-1` 请求，请求体包含 `{ title: '新标题' }`
- **THEN** 系统更新任务的 `title` 字段
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统在 `history` 中添加更新记录
- **AND** 系统返回 `{ success: true, task: Task }`

#### Scenario: 更新任务状态
- **WHEN** 客户端发送 `PUT /api/tasks/task-1` 请求，请求体包含 `{ status: 'completed' }`
- **THEN** 系统更新任务的 `status` 字段
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统在 `history` 中添加状态变更记录
- **AND** 系统返回 `{ success: true, task: Task }`

### Requirement: 删除任务 API
系统 SHALL 提供删除任务的 API 接口。

#### Scenario: 删除任务成功
- **WHEN** 客户端发送 `DELETE /api/tasks/task-1` 请求
- **THEN** 系统删除 ID 为 `task-1` 的任务
- **AND** 系统级联删除关联的子任务、评论和历史记录
- **AND** 系统返回 `{ success: true, message: '任务已删除' }`

#### Scenario: 删除不存在的任务
- **WHEN** 客户端发送 `DELETE /api/tasks/nonexistent-id` 请求
- **THEN** 系统返回 `{ success: false, message: '任务不存在' }`
- **AND** HTTP 状态码为 404

### Requirement: 标记任务完成 API
系统 SHALL 提供标记任务完成的 API 接口。

#### Scenario: 完成任务并增加连胜
- **GIVEN** 任务类型为 habit
- **WHEN** 客户端发送 `POST /api/tasks/task-1/complete` 请求
- **THEN** 系统将任务状态更新为 `'completed'`
- **AND** 系统增加连胜天数 `streak`
- **AND** 系统增加 `totalCount`
- **AND** 系统给用户增加金币 `goldReward`
- **AND** 系统在 `history` 中添加完成记录
- **AND** 系统返回 `{ success: true, task: Task }`

#### Scenario: 完成任务获得积分
- **GIVEN** 任务类型为 task 且有积分设置
- **WHEN** 客户端发送 `POST /api/tasks/task-1/complete` 请求
- **THEN** 系统将任务状态更新为 `'completed'`
- **AND** 系统给用户增加积分 `points`
- **AND** 系统在 `history` 中添加完成记录
- **AND** 系统返回 `{ success: true, task: Task }`

### Requirement: 项目详情页任务 Tab UI
系统 SHALL 在项目详情页的任务 Tab 中提供完整的任务管理界面。UI 设计严格参考 pencil Node OcsmI (`任务列表页_日常任务`)。

#### Scenario: 显示任务 Tab 内容
- **GIVEN** 用户已登录并访问项目详情页
- **WHEN** 用户切换到任务 Tab（URL 参数 `tab=task`）
- **THEN** 系统显示任务管理界面
- **AND** 界面显示类型切换标签栏（爱好/习惯/任务/欲望）
- **AND** 默认显示所有类型任务列表
- **AND** 整体布局与 pencil Node OcsmI 一致：
  - 白色卡片容器：bg-white, rounded-2xl (16px)
  - 阴影效果：blur 20px, color #1A1D2E15, offset 0 4px
  - Tab 栏：圆角 14px, 填充背景 rgba(26, 29, 46, 0.04)
  - 内容区域：padding [24, 32, 32, 32], gap 20px
- **IMPLEMENTATION NOTE**: 实现后必须调用 `pencil_get_screenshot --nodeId OcsmI` 验证布局还原度

#### Scenario: 任务 Tab 工具栏
- **GIVEN** 用户在项目详情页的任务 Tab
- **THEN** 工具栏显示：
  - 状态筛选器（全部/待办/进行中/已完成）
  - 类型筛选器（全部类型/爱好/习惯/任务）
  - 搜索框（支持实时搜索）
  - "新建任务"按钮

#### Scenario: 切换任务类型
- **GIVEN** 用户在项目详情页的任务 Tab
- **WHEN** 用户点击"习惯"类型标签
- **THEN** 系统只显示习惯类型的任务
- **AND** 任务列表显示：标题、难度、连胜天数、金币奖励
- **WHEN** 用户点击"任务"类型标签
- **THEN** 系统只显示普通任务
- **AND** 任务列表显示：标题、优先级、状态、截止日期

#### Scenario: 筛选任务
- **GIVEN** 用户在项目详情页的任务 Tab
- **WHEN** 用户点击状态筛选器（如"已完成"）
- **THEN** 系统只显示状态为"已完成"的任务
- **WHEN** 用户点击类型筛选器（如"习惯"）
- **THEN** 系统只显示习惯类型的任务

#### Scenario: 搜索任务
- **GIVEN** 用户在项目详情页的任务 Tab
- **WHEN** 用户在搜索框输入关键词
- **THEN** 系统实时过滤显示匹配的任务
- **AND** 匹配规则包括任务标题和描述

#### Scenario: 显示加载状态
- **WHEN** 任务列表正在加载
- **THEN** 系统显示加载动画或骨架屏

#### Scenario: 显示空状态
- **WHEN** 当前项目没有任务
- **THEN** 系统显示"暂无任务"提示和引导创建任务的插图

### Requirement: 任务创建抽屉 UI
系统 SHALL 在项目详情页的任务 Tab 中提供任务创建抽屉。UI 设计严格参考 pencil Nodes FX7ab (`新建任务面板`)、6hvSW (`新建习惯面板`)、v6EZ2 (`新建待办事项面板`)。

#### Scenario: 打开创建抽屉
- **GIVEN** 用户在项目详情页的任务 Tab
- **WHEN** 用户点击"新建任务"按钮
- **THEN** 系统从右侧滑出创建抽屉
- **AND** 抽屉宽度为 560px（爱好/习惯/欲望）或 900px（任务）
- **AND** 抽屉自动填充当前项目的 `projectId`
- **AND** 抽屉样式与 pencil Node FX7ab 一致：
  - 遮罩层：半透明深色 rgba(26, 29, 46, 0.27)
  - 面板阴影：blur 40px, color #1A1D2E30, offset -8px 0
  - 头部：高度 56px, 底部边框 rgba(26, 29, 46, 0.06)
  - 内容区域：padding 24px, 垂直布局, gap 18px
  - 底部按钮栏：高度 68px, 顶部边框, 右对齐
- **IMPLEMENTATION NOTE**: 实现后必须调用 `pencil_get_screenshot --nodeId FX7ab` 验证抽屉样式

#### Scenario: 选择任务类型
- **GIVEN** 创建抽屉已打开
- **THEN** 抽屉顶部显示任务类型选择器（爱好/习惯/任务/欲望）
- **AND** 类型选择器样式：横向排列, gap 8px
- **WHEN** 用户点击不同类型
- **THEN** 抽屉动态切换对应的表单字段
- **AND** 切换动画与 pencil Node FX7ab 中 typeRow 一致

#### Scenario: 创建爱好/习惯表单
- **GIVEN** 用户选择"爱好"或"习惯"类型
- **THEN** 表单显示以下字段，布局参考 pencil Node FX7ab：
  - 分组标题：font-weight 700, font-size 13px, 颜色 #1A1D2E
  - 任务标题（必填）：输入框样式参考 nameF 字段
  - 备注说明：文本域样式参考 notesF 字段
  - 难度选择器（简单/中等/困难）：两列布局参考 twoCol1
  - 频率选择器（每天/工作日/每周/自定义）：参考 repeatF 字段
  - 重复日选择器（当选择自定义时显示）：参考 repeatF 字段
  - 金币奖励设置：两列布局
  - 标签输入：参考 tagsF 字段
- **IMPLEMENTATION NOTE**: 实现后必须调用 `pencil_get_screenshot --nodeId FX7ab` 验证表单布局

#### Scenario: 创建任务表单
- **GIVEN** 用户选择"任务"类型
- **THEN** 表单显示左右两栏布局（宽度 900px）
  - **左栏**包含：
    - 任务标题（必填）
    - 任务描述
    - 状态和优先级选择器
    - 负责人和积分
    - 开始日期和截止日期
    - 难度选择器
    - 金币奖励和惩罚
    - 标签输入
  - **右栏**包含 Tab 切换：
    - 子任务列表
    - 关联项（项目/需求/缺陷）
    - 评论列表
    - 历史记录

#### Scenario: 创建欲望表单
- **GIVEN** 用户选择"欲望"类型
- **THEN** 表单显示以下字段：
  - 欲望标题（必填）
  - 描述
  - 优先级
  - 期望完成日期
  - 积分消耗（兑换所需积分）
  - 金币消耗（兑换所需金币）
  - 标签输入

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
系统 SHALL 提供任务详情抽屉，展示任务完整信息和游戏属性。UI 设计严格参考 pencil Nodes AJhSP (`任务详情面板`)、Mq8Pk (`DetailPanel_完整展示`)。

#### Scenario: 打开详情抽屉
- **GIVEN** 用户在项目详情页的任务 Tab
- **WHEN** 用户点击某行任务
- **THEN** 系统从右侧滑出详情抽屉
- **AND** 抽屉宽度为 614px
- **AND** 抽屉样式与 pencil Node AJhSP 一致：
  - 遮罩层：半透明深色 rgba(26, 29, 46, 0.27)
  - 面板阴影：blur 40px, color #1A1D2E30, offset -8px 0
  - 头部：高度 60px, 底部边框 rgba(26, 29, 46, 0.08)
  - 内容区域：可滚动, padding 24px, gap 24px
- **IMPLEMENTATION NOTE**: 实现后必须调用 `pencil_get_screenshot --nodeId AJhSP` 验证抽屉结构

#### Scenario: 详情抽屉头部
- **GIVEN** 详情抽屉已打开
- **THEN** 头部显示，布局参考 pencil Node AJhSP PanelHeader：
  - 头部左侧：任务类型标签 + "任务详情"标题
  - 头部右侧：编辑按钮（图标）+ 关闭按钮（x 图标）
- **AND** 头部样式：高度 60px, 底部边框 rgba(26, 29, 46, 0.08), padding [0, 24]

#### Scenario: 显示游戏属性卡片
- **GIVEN** 详情抽屉已打开
- **THEN** 显示游戏属性卡片，样式参考 pencil Node Mq8Pk statsCard：
  - 卡片容器：bg-[#1A1D2E], rounded-[16px], padding 20px, gap 16px
  - 标题："游戏属性", 白色文字, font-size 14px, font-weight 700
  - 属性网格：2x2 布局, gap 12px
  - 属性块：bg-[#FFFFFF10] (rgba 255,255,255,0.06), rounded-[12px], padding 14px, gap 8px
  - 连胜天数（Streak）- 仅习惯类型显示
  - 经验值（XP）
  - 金币奖励（Gold）
  - HP 值
- **IMPLEMENTATION NOTE**: 实现后必须调用 `pencil_get_screenshot --nodeId Mq8Pk` 验证游戏属性卡片样式

#### Scenario: 显示任务信息网格
- **GIVEN** 详情抽屉已打开
- **THEN** 显示任务信息网格，样式参考 pencil Node Mq8Pk infoGrid：
  - 网格容器：bg-[#F5F0F0], rounded-[16px], padding 20px, gap 12px
  - 两列布局：gap 16px
  - 信息项：难度等级、频率/优先级、开始日期、重复日/截止日期、标签列表
  - 每项包含：标签（小字灰色）+ 值（黑色正文）
- **IMPLEMENTATION NOTE**: 实现后必须调用 `pencil_get_screenshot --nodeId Mq8Pk` 验证信息网格样式

#### Scenario: 显示备注说明
- **GIVEN** 详情抽屉已打开
- **AND** 任务有描述
- **THEN** 显示"备注说明"区域，样式参考 pencil Node Mq8Pk descSection：
  - 区域标题：图标 (file-text) + "备注说明", font-weight 600, gap 8px
  - 描述卡片：bg-[#F5F0F0], rounded-[12px], padding 16px
  - 描述文字：font-size 13px, line-height 1.6, 颜色 #1A1D2E
  - 分隔线：在描述区域前，高度 1px, 颜色 rgba(26, 29, 46, 0.06)

#### Scenario: 显示完成记录（习惯类型）
- **GIVEN** 详情抽屉已打开且任务类型为习惯
- **THEN** 显示"完成记录"区域，样式参考 pencil Node Mq8Pk historySection：
  - 区域标题："完成记录" + 本周完成率徽章（圆角 10px, bg rgba 26,29,46,0.08）
  - 周完成网格：bg-[#F5F0F0], rounded-[12px], padding 16px, gap 12px
  - 周一到周日横向排列
  - 每天显示：星期标签 + 完成状态指示
  - 汇总行：本周完成次数 + 完成率
  - 分隔线：在区域前，高度 1px, 颜色 rgba(26, 29, 46, 0.06)

#### Scenario: 显示操作日志
- **GIVEN** 详情抽屉已打开
- **THEN** 显示"操作日志"区域，样式参考 pencil Node Mq8Pk logSection：
  - 区域标题：图标 (history) + "操作日志", font-weight 600, gap 8px
  - 日志列表：垂直排列, gap 8px
  - 单条日志：时间 + 操作类型 + 描述，水平排列, gap 12px
  - 时间格式：相对时间（如"2小时前"）或绝对时间
  - 分隔线：在区域前，高度 1px, 颜色 rgba(26, 29, 46, 0.06)

#### Scenario: 标记完成按钮
- **GIVEN** 详情抽屉已打开
- **AND** 任务状态不是已完成
- **THEN** 显示"标记完成"按钮，样式参考 pencil Node Mq8Pk titleRow：
  - 按钮容器：bg-[#4CAF5015], rounded-[10px], padding [8, 16], gap 6px
  - 图标：circle-check, 颜色 #4CAF50, 尺寸 16px
  - 文字："标记完成", 颜色 #4CAF50, font-size 13px, font-weight 600
- **WHEN** 用户点击按钮
- **THEN** 调用完成 API
- **AND** 更新任务状态
- **AND** 刷新任务列表

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
系统 SHALL 提供任务编辑抽屉，用于修改任务信息。UI 设计严格参考 pencil Nodes TvQyQ (`习惯任务_详情编辑`)、E4IoS (`待办任务_详情编辑`)。

#### Scenario: 打开编辑抽屉
- **GIVEN** 用户在详情抽屉中点击"编辑"
- **THEN** 系统从右侧滑出编辑抽屉
- **AND** 编辑抽屉宽度为 560px（爱好/习惯/欲望）或 900px（任务）
- **AND** 表单预填充当前任务数据
- **AND** 抽屉样式与 pencil Node TvQyQ 一致：
  - 面板阴影：blur 40px, color #1A1D2E30, offset -8px 0
  - 头部：高度 56px, 底部边框 rgba(26, 29, 46, 0.06)
  - 内容区域：padding 24px, 垂直布局, gap 18px
  - 底部按钮栏：高度 64px, 顶部边框, 右对齐
- **IMPLEMENTATION NOTE**: 实现后必须调用 `pencil_get_screenshot --nodeId TvQyQ` 验证编辑抽屉结构

#### Scenario: 编辑抽屉头部
- **GIVEN** 编辑抽屉已打开
- **THEN** 头部显示，样式参考 pencil Node TvQyQ EditPanel PanelHeader：
  - 标题："编辑日常任务"/"编辑习惯"/"编辑任务"/"编辑欲望"
  - "查看详情"按钮：带图标，圆角 8px, bg-[#F5F0F0], gap 4px, padding [6, 12]
  - 关闭按钮：x 图标, 颜色 rgba(26, 29, 46, 0.53)
- **AND** 头部样式：高度 56px, padding [0, 24], 底部边框

#### Scenario: 编辑抽屉表单
- **GIVEN** 编辑抽屉已打开
- **THEN** 表单字段预填充现有数据
- **AND** 表单布局参考 pencil Node TvQyQ PanelBody：
  - 字段垂直排列, gap 18px
  - 每个字段：标签 + 输入框, gap 6px
  - 两列字段：水平排列, gap 16px
  - 与创建表单字段一致

#### Scenario: 编辑任务/待办抽屉
- **GIVEN** 用户编辑"任务"类型
- **THEN** 编辑抽屉宽度为 560px（单栏简化版）
- **AND** 表单布局参考 pencil Node E4IoS：
  - 头部："编辑待办事项"标题 + 查看详情按钮 + 关闭按钮
  - 包含字段：标题、描述、状态和优先级、标签
  - 底部保存/取消按钮栏
- **IMPLEMENTATION NOTE**: 实现后必须调用 `pencil_get_screenshot --nodeId E4IoS` 验证待办编辑抽屉

#### Scenario: 保存修改
- **GIVEN** 用户修改了表单字段
- **WHEN** 用户点击"保存修改"按钮
- **THEN** 按钮样式：bg-[#E8944A], 圆角 10px, padding [10, 24]
- **AND** 系统调用更新 API
- **AND** 系统关闭编辑抽屉
- **AND** 系统刷新任务列表

#### Scenario: 取消编辑
- **WHEN** 用户点击"取消"按钮
- **THEN** 按钮样式：bg-[#F5F0F0], 圆角 10px, padding [10, 24]
- **AND** 系统关闭编辑抽屉
- **AND** 不保存任何修改

### Requirement: 任务子任务 UI
系统 SHALL 提供子任务管理功能，支持在任务中添加和完成子任务。

#### Scenario: 显示子任务列表
- **GIVEN** 用户在任务详情或创建页面
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

### Requirement: 任务评论 UI
系统 SHALL 提供评论功能，支持在任务中添加和查看评论。

#### Scenario: 显示评论列表
- **GIVEN** 用户在任务详情页面
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

---

## Pencil 设计验证规范

### 验证工具
所有 UI 组件必须通过 Pencil MCP 截图验证，确保设计还原度。

### 验证命令
```bash
# 获取设计截图
pencil_get_screenshot --filePath /Users/wuyucun/Documents/untitled.pen --nodeId <NODE_ID>
```

### 验证检查清单

#### Node: OcsmI (`任务列表页_日常任务`)
- [ ] 白色卡片容器：bg-white, rounded-2xl (16px)
- [ ] 阴影效果：blur 20px, color #1A1D2E15
- [ ] Tab 栏：圆角 14px, 背景 rgba(26, 29, 46, 0.04)
- [ ] 内容区域：padding [24, 32, 32, 32]

#### Node: FX7ab (`新建任务面板`)
- [ ] 抽屉宽度：560px
- [ ] 遮罩层：rgba(26, 29, 46, 0.27)
- [ ] 面板阴影：blur 40px, #1A1D2E30, offset -8px 0
- [ ] 头部：高度 56px, 底部边框 rgba(26, 29, 46, 0.06)
- [ ] 内容区域：padding 24px, gap 18px
- [ ] 创建按钮：bg-[#E8944A], rounded 10px

#### Node: 6hvSW (`新建习惯面板`)
- [ ] 同 560px 宽度
- [ ] 计数方向选择器（正向/负向/双向）
- [ ] 习惯预览表区域

#### Node: v6EZ2 (`新建待办事项面板`)
- [ ] 抽屉宽度：900px
- [ ] 左栏：表单字段，右侧边框分隔
- [ ] 右栏：360px 宽度，Tab 切换

#### Node: AJhSP (`任务详情面板`)
- [ ] 抽屉宽度：614px
- [ ] 头部：高度 60px, 底部边框 rgba(26, 29, 46, 0.08)
- [ ] 内容区域：padding 24px, gap 24px

#### Node: Mq8Pk (`DetailPanel_完整展示`)
- [ ] 游戏属性卡片：bg-[#1A1D2E], rounded 16px
- [ ] 属性块：bg-[#FFFFFF10], rounded 12px
- [ ] 信息网格：bg-[#F5F0F0], rounded 16px
- [ ] 完成按钮：bg-[#4CAF5015], 文字 #4CAF50
- [ ] 分隔线：高度 1px, rgba(26, 29, 46, 0.06)

#### Node: TvQyQ (`习惯任务_详情编辑`)
- [ ] 编辑头部：高度 56px
- [ ] "查看详情"按钮：bg-[#F5F0F0], rounded 8px
- [ ] 保存按钮：bg-[#E8944A]

#### Node: E4IoS (`待办任务_详情编辑`)
- [ ] 简化编辑抽屉：宽度 560px
- [ ] 单栏布局
- [ ] 底部按钮栏

### 颜色规范
- 主色调橙色：`#E8944A`
- 深色背景：`#1A1D2E`
- 浅色背景：`#F5F0F0`
- 成功绿色：`#4CAF50`
- 边框颜色：`rgba(26, 29, 46, 0.06)`
- 遮罩颜色：`rgba(26, 29, 46, 0.27)`
- 半透明背景：`rgba(26, 29, 46, 0.04)`

### 尺寸规范
- 任务列表卡片圆角：16px
- Tab 栏圆角：14px
- 卡片/面板圆角：16px
- 属性块圆角：12px
- 按钮圆角：10px（主要）、8px（次要）
- 标签/徽章圆角：10px
- 抽屉宽度：560px（标准）、614px（详情）、900px（双栏）
