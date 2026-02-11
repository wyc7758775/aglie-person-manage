# project-management Specification

## Purpose
TBD - created by archiving change enhance-project-management. Update Purpose after archive.
## Requirements
### Requirement: 项目数据模型定义
系统 SHALL 定义 Project 数据模型，包含项目基本信息、类型、状态、优先级、目标和标签。

#### Scenario: Project 核心字段
- **GIVEN** 系统初始化完成
- **WHEN** 查询 Project 类型定义
- **THEN** Project 类型包含以下字段：
  - `id: string` - 项目唯一标识
  - `name: string` - 项目名称
  - `description: string` - 项目描述
  - `type: ProjectType` - 项目类型（life 或 code）
  - `status: ProjectStatus` - 项目状态
  - `priority: ProjectPriority` - 项目优先级
  - `goals: string[]` - 目标列表
  - `tags: string[]` - 标签列表
  - `startDate: string` - 开始日期
  - `endDate: string | null` - 结束日期
  - `progress: number` - 进度百分比（0-100）
  - `createdAt: string` - 创建时间
  - `updatedAt: string` - 更新时间

#### Scenario: ProjectType 类型定义
- **WHEN** 定义 ProjectType
- **THEN** ProjectType 为联合类型 `'life' | 'code'`
- **AND** `'life'` 表示生活项目
- **AND** `'code'` 表示代码项目

#### Scenario: ProjectStatus 类型定义
- **WHEN** 定义 ProjectStatus
- **THEN** ProjectStatus 为联合类型 `'active' | 'completed' | 'paused' | 'planning'`
- **AND** `'active'` 表示进行中
- **AND** `'completed'` 表示已完成
- **AND** `'paused'` 表示暂停
- **AND** `'planning'` 表示规划中

#### Scenario: ProjectPriority 类型定义
- **WHEN** 定义 ProjectPriority
- **THEN** ProjectPriority 为联合类型 `'high' | 'medium' | 'low'`

---

### Requirement: 项目列表 API
系统 SHALL 提供获取项目列表的 API 接口。

#### Scenario: 获取所有项目
- **WHEN** 客户端发送 `GET /api/projects` 请求
- **THEN** 系统返回所有项目列表
- **AND** 响应格式为 `{ success: true, projects: Project[] }`

#### Scenario: 按状态筛选项目
- **WHEN** 客户端发送 `GET /api/projects?status=active` 请求
- **THEN** 系统只返回状态为 `active` 的项目

#### Scenario: 按类型筛选项目
- **WHEN** 客户端发送 `GET /api/projects?type=code` 请求
- **THEN** 系统只返回类型为 `code` 的项目

#### Scenario: 按优先级筛选项目
- **WHEN** 客户端发送 `GET /api/projects?priority=high` 请求
- **THEN** 系统只返回优先级为 `high` 的项目

#### Scenario: 组合筛选条件
- **WHEN** 客户端发送 `GET /api/projects?status=active&type=code` 请求
- **THEN** 系统返回状态为 `active` 且类型为 `code` 的项目

---

### Requirement: 创建项目 API
系统 SHALL 提供创建新项目的 API 接口。

#### Scenario: 创建项目成功
- **GIVEN** 客户端已登录
- **WHEN** 客户端发送 `POST /api/projects` 请求，请求体包含有效的项目数据
- **THEN** 系统创建新项目
- **AND** 系统为项目生成唯一 ID
- **AND** 系统设置 `progress` 为 0
- **AND** 系统设置 `createdAt` 和 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 项目名称验证
- **WHEN** 客户端发送 `POST /api/projects` 请求，但 `name` 字段为空
- **THEN** 系统返回 `{ success: false, message: '项目名称不能为空' }`
- **AND** HTTP 状态码为 400

#### Scenario: 项目名称长度验证
- **WHEN** 客户端发送 `POST /api/projects` 请求，但 `name` 字段超过 100 字符
- **THEN** 系统返回 `{ success: false, message: '项目名称不能超过100个字符' }`
- **AND** HTTP 状态码为 400

#### Scenario: 项目类型验证
- **WHEN** 客户端发送 `POST /api/projects` 请求，但 `type` 字段不是 `'life'` 或 `'code'`
- **THEN** 系统返回 `{ success: false, message: '无效的项目类型' }`
- **AND** HTTP 状态码为 400

#### Scenario: 开始日期验证
- **WHEN** 客户端发送 `POST /api/projects` 请求，但 `startDate` 字段缺失
- **THEN** 系统返回 `{ success: false, message: '开始日期不能为空' }`
- **AND** HTTP 状态码为 400

#### Scenario: 结束日期验证
- **WHEN** 客户端发送 `POST /api/projects` 请求，但 `endDate` 早于 `startDate`
- **THEN** 系统返回 `{ success: false, message: '结束日期不能早于开始日期' }`
- **AND** HTTP 状态码为 400

---

### Requirement: 项目详情 API
系统 SHALL 提供获取单个项目详情的 API 接口。

#### Scenario: 获取项目详情成功
- **WHEN** 客户端发送 `GET /api/projects/proj-1` 请求
- **THEN** 系统返回 ID 为 `proj-1` 的项目完整信息
- **AND** 响应格式为 `{ success: true, project: Project }`

#### Scenario: 项目不存在
- **WHEN** 客户端发送 `GET /api/projects/nonexistent-id` 请求
- **THEN** 系统返回 `{ success: false, message: '项目不存在' }`
- **AND** HTTP 状态码为 404

---

### Requirement: 更新项目 API
系统 SHALL 提供更新项目信息的 API 接口。

#### Scenario: 更新项目名称
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，请求体包含 `{ name: '新名称' }`
- **THEN** 系统更新项目的 `name` 字段
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 更新项目状态
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，请求体包含 `{ status: 'completed' }`
- **THEN** 系统更新项目的 `status` 字段为 `'completed'`
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 更新项目进度
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，请求体包含 `{ progress: 75 }`
- **THEN** 系统更新项目的 `progress` 字段为 75
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 更新项目目标
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，请求体包含 `{ goals: ['目标1', '目标2'] }`
- **THEN** 系统更新项目的 `goals` 字段
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 更新项目标签
- **WHEN** 客户端发送 `PUT /api/projects/proj-1` 请求，请求体包含 `{ tags: ['标签1', '标签2'] }`
- **THEN** 系统更新项目的 `tags` 字段
- **AND** 系统更新 `updatedAt` 为当前时间
- **AND** 系统返回 `{ success: true, project: Project }`

#### Scenario: 更新不存在的项目
- **WHEN** 客户端发送 `PUT /api/projects/nonexistent-id` 请求
- **THEN** 系统返回 `{ success: false, message: '项目不存在' }`
- **AND** HTTP 状态码为 404

---

### Requirement: 删除项目 API
系统 SHALL 提供删除项目的 API 接口。

#### Scenario: 删除项目成功
- **WHEN** 客户端发送 `DELETE /api/projects/proj-1` 请求
- **THEN** 系统删除 ID 为 `proj-1` 的项目
- **AND** 系统返回 `{ success: true, message: '项目已删除' }`

#### Scenario: 删除不存在的项目
- **WHEN** 客户端发送 `DELETE /api/projects/nonexistent-id` 请求
- **THEN** 系统返回 `{ success: false, message: '项目不存在' }`
- **AND** HTTP 状态码为 404

---

### Requirement: 项目列表页面 UI
系统 SHALL 提供项目列表页面，显示所有项目并支持筛选和操作。

#### Scenario: 显示项目列表
- **GIVEN** 用户已登录
- **WHEN** 用户访问 `/dashboard/project` 页面
- **THEN** 系统显示所有项目的卡片列表
- **AND** 每个项目卡片显示项目名称、描述、类型、状态、优先级和进度

#### Scenario: 筛选项目
- **GIVEN** 用户在项目列表页面
- **WHEN** 用户点击状态筛选器（如"进行中"）
- **THEN** 系统只显示状态为"进行中"的项目

#### Scenario: 显示加载状态
- **WHEN** 项目列表正在加载
- **THEN** 系统显示加载动画或提示

#### Scenario: 显示错误状态
- **WHEN** 项目列表加载失败
- **THEN** 系统显示错误提示信息

#### Scenario: 显示空状态
- **WHEN** 没有符合条件的项目
- **THEN** 系统显示"没有找到符合条件的项目"提示

---

### Requirement: 项目卡片 UI
系统 SHALL 提供项目卡片组件，展示项目基本信息。

#### Scenario: 显示项目基本信息
- **WHEN** 项目卡片渲染
- **THEN** 卡片显示项目名称
- **AND** 卡片显示项目描述
- **AND** 卡片显示项目类型标签（life 或 code）
- **AND** 卡片显示项目状态标签
- **AND** 卡片显示项目优先级标签

#### Scenario: 显示项目进度
- **WHEN** 项目卡片渲染
- **THEN** 卡片显示进度条
- **AND** 进度条长度对应 `progress` 字段的百分比
- **AND** 显示进度百分比数字

#### Scenario: 项目类型视觉区分
- **WHEN** 项目类型为 `'code'`
- **THEN** 项目卡片显示代码相关图标或颜色
- **WHEN** 项目类型为 `'life'`
- **THEN** 项目卡片显示生活相关图标或颜色

#### Scenario: 项目卡片操作菜单
- **WHEN** 用户点击项目卡片上的菜单按钮
- **THEN** 系统显示操作菜单
- **AND** 菜单包含"编辑"选项
- **AND** 菜单包含"删除"选项

---

### Requirement: 项目表单 UI
系统 SHALL 提供项目表单组件，用于创建和编辑项目。

#### Scenario: 显示表单字段
- **WHEN** 项目表单打开
- **THEN** 表单显示项目名称输入框
- **AND** 表单显示项目描述输入框
- **AND** 表单显示项目类型选择器（life/code）
- **AND** 表单显示项目状态选择器
- **AND** 表单显示项目优先级选择器
- **AND** 表单显示开始日期选择器
- **AND** 表单显示结束日期选择器

#### Scenario: 目标列表管理
- **WHEN** 项目表单打开
- **THEN** 表单显示目标列表
- **AND** 提供"添加目标"按钮
- **AND** 每个目标旁边有"删除"按钮

#### Scenario: 标签列表管理
- **WHEN** 项目表单打开
- **THEN** 表单显示标签列表
- **AND** 提供"添加标签"按钮
- **AND** 每个标签旁边有"删除"按钮

#### Scenario: 表单验证错误提示
- **WHEN** 用户提交无效表单（如项目名称为空）
- **THEN** 系统在相应字段旁显示错误提示
- **AND** 系统不提交表单

#### Scenario: 创建模式
- **WHEN** 项目表单在创建模式下打开
- **THEN** 表单字段为空
- **AND** 提交按钮显示"创建"

#### Scenario: 编辑模式
- **WHEN** 项目表单在编辑模式下打开
- **THEN** 表单字段预填充项目当前数据
- **AND** 提交按钮显示"保存"

---

### Requirement: 项目详情弹窗 UI
系统 SHALL 提供项目详情弹窗，展示项目完整信息。

#### Scenario: 显示项目完整信息
- **WHEN** 用户点击项目卡片
- **THEN** 系统打开详情弹窗
- **AND** 系统显示项目名称
- **AND** 系统显示项目描述
- **AND** 系统显示项目类型、状态、优先级
- **AND** 系统显示开始日期和结束日期
- **AND** 系统显示项目进度

#### Scenario: 显示项目目标
- **WHEN** 项目详情弹窗打开
- **THEN** 系统显示目标列表
- **AND** 每个目标以列表项形式显示

#### Scenario: 显示项目标签
- **WHEN** 项目详情弹窗打开
- **THEN** 系统显示标签列表
- **AND** 每个标签以标签形式显示

#### Scenario: 提供操作按钮
- **WHEN** 项目详情弹窗打开
- **THEN** 系统显示"编辑"按钮
- **AND** 系统显示"删除"按钮

#### Scenario: 编辑按钮行为
- **WHEN** 用户在详情弹窗中点击"编辑"按钮
- **THEN** 系统关闭详情弹窗
- **AND** 系统打开编辑弹窗
- **AND** 编辑弹窗预填充项目数据

#### Scenario: 关闭详情弹窗
- **WHEN** 用户点击详情弹窗的关闭按钮
- **THEN** 系统关闭详情弹窗
- **WHEN** 用户按 ESC 键
- **THEN** 系统关闭详情弹窗
- **WHEN** 用户点击弹窗外的遮罩层
- **THEN** 系统关闭详情弹窗

---

### Requirement: 项目国际化支持
系统 SHALL 为项目功能提供中英文国际化支持。

#### Scenario: 中文界面显示
- **GIVEN** 当前语言为中文
- **WHEN** 用户访问项目相关页面
- **THEN** 所有文本显示为中文
- **AND** 包括项目类型（生活、代码）
- **AND** 包括项目状态（进行中、已完成、暂停、规划中）
- **AND** 包括项目优先级（高、中、低）
- **AND** 包括表单标签和按钮

#### Scenario: 英文界面显示
- **GIVEN** 当前语言为英文
- **WHEN** 用户访问项目相关页面
- **THEN** 所有文本显示为英文
- **AND** 包括项目类型（Life、Code）
- **AND** 包括项目状态（Active、Completed、Paused、Planning）
- **AND** 包括项目优先级（High、Medium、Low）
- **AND** 包括表单标签和按钮

#### Scenario: 语言切换
- **WHEN** 用户在设置中切换语言
- **THEN** 项目相关页面立即更新为新语言
- **AND** 所有项目文本正确显示

---

### Requirement: 项目数据持久化
系统 SHALL 使用内存数据库存储项目数据。

#### Scenario: 创建项目持久化
- **WHEN** 用户创建新项目
- **THEN** 项目数据保存到内存数据库
- **AND** 刷新页面后项目仍然存在

#### Scenario: 更新项目持久化
- **WHEN** 用户更新项目信息
- **THEN** 更新后的数据保存到内存数据库
- **AND** 刷新页面后更新仍然生效

#### Scenario: 删除项目持久化
- **WHEN** 用户删除项目
- **THEN** 项目从内存数据库中移除
- **AND** 刷新页面后项目不再显示

#### Scenario: 服务器重启数据重置
- **WHEN** 服务器重启
- **THEN** 所有项目数据重置为初始示例数据

---

### Requirement: 项目表单对话框
系统 SHALL 使用对话框形式展示项目表单。

#### Scenario: 打开创建对话框
- **WHEN** 用户点击项目列表页的"添加项目"按钮
- **THEN** 系统打开项目表单对话框
- **AND** 对话框以模态形式居中显示
- **AND** 显示项目表单（创建模式）

#### Scenario: 打开编辑对话框
- **WHEN** 用户点击项目卡片的"编辑"选项
- **THEN** 系统打开项目表单对话框
- **AND** 对话框以模态形式居中显示
- **AND** 显示项目表单（编辑模式）
- **AND** 表单预填充项目数据

#### Scenario: 关闭对话框
- **WHEN** 用户点击对话框的"取消"按钮
- **THEN** 系统关闭对话框
- **WHEN** 用户按 ESC 键
- **THEN** 系统关闭对话框
- **WHEN** 用户点击对话框外的遮罩层
- **THEN** 系统关闭对话框

#### Scenario: 提交成功后关闭对话框
- **WHEN** 用户成功提交表单
- **THEN** 系统关闭对话框
- **AND** 系统刷新项目列表

---

### Requirement: 项目删除确认
系统 SHALL 在删除项目前显示确认对话框。

#### Scenario: 显示删除确认
- **WHEN** 用户点击项目卡片的"删除"选项
- **THEN** 系统显示确认对话框
- **AND** 对话框显示"确定要删除此项目吗？"提示

#### Scenario: 确认删除
- **WHEN** 用户点击确认对话框的"确定"按钮
- **THEN** 系统调用删除 API
- **AND** 系统刷新项目列表

#### Scenario: 取消删除
- **WHEN** 用户点击确认对话框的"取消"按钮
- **THEN** 系统关闭确认对话框
- **AND** 系统不执行删除操作

---

### Requirement: 项目筛选器
系统 SHALL 提供项目筛选功能，支持按状态和类型筛选。

#### Scenario: 按状态筛选
- **WHEN** 用户点击"进行中"筛选器
- **THEN** 系统只显示状态为 `active` 的项目
- **WHEN** 用户点击"已完成"筛选器
- **THEN** 系统只显示状态为 `completed` 的项目
- **WHEN** 用户点击"暂停"筛选器
- **THEN** 系统只显示状态为 `paused` 的项目
- **WHEN** 用户点击"规划中"筛选器
- **THEN** 系统只显示状态为 `planning` 的项目

#### Scenario: 按类型筛选
- **WHEN** 用户点击"生活"筛选器
- **THEN** 系统只显示类型为 `life` 的项目
- **WHEN** 用户点击"代码"筛选器
- **THEN** 系统只显示类型为 `code` 的项目

#### Scenario: 显示全部项目
- **WHEN** 用户点击"全部"筛选器
- **THEN** 系统显示所有项目
- **AND** 不应用任何筛选条件

#### Scenario: 筛选器高亮
- **WHEN** 某个筛选器被激活
- **THEN** 该筛选器按钮高亮显示
- **AND** 其他筛选器按钮显示为普通状态

