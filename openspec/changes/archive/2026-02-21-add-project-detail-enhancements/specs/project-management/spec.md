## MODIFIED Requirements

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
  - `startDate: string` - 开始时间（存储 ISO 8601）
  - `endDate: string | null` - 截止时间（存储 ISO 8601）
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
- **THEN** ProjectStatus 为联合类型 `'normal' | 'at_risk' | 'out_of_control'`
- **AND** `'normal'` 表示正常
- **AND** `'at_risk'` 表示有风险
- **AND** `'out_of_control'` 表示失控

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
- **WHEN** 客户端发送 `GET /api/projects?status=normal` 请求
- **THEN** 系统只返回状态为 `normal` 的项目

#### Scenario: 按类型筛选项目
- **WHEN** 客户端发送 `GET /api/projects?type=code` 请求
- **THEN** 系统只返回类型为 `code` 的项目

#### Scenario: 按优先级筛选项目
- **WHEN** 客户端发送 `GET /api/projects?priority=high` 请求
- **THEN** 系统只返回优先级为 `high` 的项目

#### Scenario: 组合筛选条件
- **WHEN** 客户端发送 `GET /api/projects?status=normal&type=code` 请求
- **THEN** 系统返回状态为 `normal` 且类型为 `code` 的项目

---

### Requirement: 项目表单 UI
系统 SHALL 提供项目表单组件，用于创建和编辑项目。

#### Scenario: 显示表单字段
- **WHEN** 项目表单打开
- **THEN** 表单显示项目名称输入框
- **AND** 表单显示项目描述 Markdown 编辑器
- **AND** 表单显示项目类型选择器（life/code）
- **AND** 表单显示项目状态选择器（正常、有风险、失控）
- **AND** 表单显示项目优先级选择器
- **AND** 表单显示开始时间选择器
- **AND** 表单显示截止时间选择器

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

#### Scenario: 截止时间早于开始时间校验
- **WHEN** 用户填写截止时间早于开始时间
- **THEN** 系统显示「截止时间不能早于开始时间」错误提示
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
系统 SHALL 提供项目详情抽屉（ProjectDrawer），展示项目完整信息并支持内联编辑。

#### Scenario: 显示项目完整信息
- **WHEN** 用户点击项目卡片
- **THEN** 系统打开详情抽屉
- **AND** 系统显示项目名称
- **AND** 系统显示项目描述（支持 Markdown 渲染）
- **AND** 系统显示项目类型、状态、优先级
- **AND** 系统显示开始时间和截止时间
- **AND** 系统显示项目进度

#### Scenario: 显示项目目标
- **WHEN** 项目详情抽屉打开
- **THEN** 系统显示目标列表
- **AND** 每个目标以列表项形式显示

#### Scenario: 显示项目标签
- **WHEN** 项目详情抽屉打开
- **THEN** 系统显示标签列表
- **AND** 每个标签以标签形式显示

#### Scenario: 详情抽屉底部不显示删除按钮
- **WHEN** 项目详情抽屉在编辑模式下打开
- **THEN** 抽屉底部不显示删除按钮
- **AND** 删除仍通过项目卡片的「更多」菜单触发

#### Scenario: 详情抽屉底部不显示自动保存提示
- **WHEN** 项目详情抽屉在编辑模式下打开
- **THEN** 抽屉底部不显示「修改后自动保存」文字
- **AND** 自动保存逻辑不变，SaveStatusIndicator 仍显示保存状态

#### Scenario: 编辑按钮行为
- **WHEN** 用户在详情抽屉中点击"编辑"选项（通过卡片菜单）
- **THEN** 系统打开编辑模式
- **AND** 表单预填充项目数据

#### Scenario: 关闭详情抽屉
- **WHEN** 用户点击抽屉的关闭按钮
- **THEN** 系统关闭详情抽屉
- **WHEN** 用户按 ESC 键
- **THEN** 系统关闭详情抽屉
- **WHEN** 用户点击抽屉外的遮罩层
- **THEN** 系统关闭详情抽屉

---

### Requirement: 项目国际化支持
系统 SHALL 为项目功能提供中英文国际化支持。

#### Scenario: 中文界面显示
- **GIVEN** 当前语言为中文
- **WHEN** 用户访问项目相关页面
- **THEN** 所有文本显示为中文
- **AND** 包括项目类型（生活、代码）
- **AND** 包括项目状态（正常、有风险、失控）
- **AND** 包括项目优先级（高、中、低）
- **AND** 包括时间字段标签（开始时间、截止时间）
- **AND** 包括表单标签和按钮

#### Scenario: 英文界面显示
- **GIVEN** 当前语言为英文
- **WHEN** 用户访问项目相关页面
- **THEN** 所有文本显示为英文
- **AND** 包括项目类型（Life、Code）
- **AND** 包括项目状态（Normal、At Risk、Out of Control）
- **AND** 包括项目优先级（High、Medium、Low）
- **AND** 包括时间字段标签（Start Time、Deadline）
- **AND** 包括表单标签和按钮

#### Scenario: 语言切换
- **WHEN** 用户在设置中切换语言
- **THEN** 项目相关页面立即更新为新语言
- **AND** 所有项目文本正确显示

#### Scenario: 日文界面显示
- **GIVEN** 当前语言为日文（ja-JP）
- **WHEN** 用户访问项目相关页面
- **THEN** 项目状态显示为「正常」「リスクあり」「制御不能」
- **AND** 时间字段标签显示为「開始日時」「締切日時」

---

### Requirement: 项目筛选器
系统 SHALL 提供项目筛选功能，支持按状态和类型筛选。

#### Scenario: 按状态筛选
- **WHEN** 用户点击"正常"筛选器
- **THEN** 系统只显示状态为 `normal` 的项目
- **WHEN** 用户点击"有风险"筛选器
- **THEN** 系统只显示状态为 `at_risk` 的项目
- **WHEN** 用户点击"失控"筛选器
- **THEN** 系统只显示状态为 `out_of_control` 的项目

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

---

## ADDED Requirements

### Requirement: 项目描述 Markdown 编辑器
系统 SHALL 在项目详情抽屉中提供基于 Tiptap 的 Markdown 编辑器，用于编辑项目描述。

#### Scenario: 描述区域展示 Markdown 编辑器
- **WHEN** 用户打开项目详情抽屉并聚焦描述字段
- **THEN** 系统展示 Tiptap Markdown 编辑器
- **AND** 支持标题、列表、粗体、链接等常用格式
- **AND** 空描述时显示占位符（如「支持 Markdown 格式」）

#### Scenario: 描述失焦自动保存
- **WHEN** 用户在描述区域编辑内容后失焦
- **THEN** 系统调用保存 API
- **AND** 更新 SaveStatusIndicator 显示保存状态
- **AND** 存储格式为 Markdown 字符串，与现有 description 字段兼容

#### Scenario: 描述保存失败
- **WHEN** 描述保存 API 调用失败
- **THEN** 系统显示错误提示
- **AND** 保留用户本地输入内容

#### Scenario: 描述 XSS 安全
- **WHEN** 用户输入或渲染描述内容
- **THEN** 系统对内容进行 XSS 过滤（Tiptap 默认处理）
- **AND** 不执行恶意脚本
