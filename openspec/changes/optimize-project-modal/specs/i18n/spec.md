## ADDED Requirements

### Requirement: 项目弹窗国际化翻译
系统 SHALL 提供项目弹窗相关 UI 文本的多语言翻译支持。

#### Scenario: 弹窗标题翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户打开创建项目弹窗
- **THEN** 弹窗标题显示「创建项目」
- **AND** 切换为英文后显示 "Create Project"
- **AND** 切换为日文后显示「プロジェクトを作成」

#### Scenario: 弹窗标题翻译 - 编辑态
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户打开编辑项目弹窗
- **THEN** 弹窗标题显示「编辑项目」
- **AND** 切换为英文后显示 "Edit Project"
- **AND** 切换为日文后显示「プロジェクトを編集」

#### Scenario: 表单字段标签翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户查看项目弹窗表单
- **THEN** 字段标签显示对应中文：项目名称、项目类型、积分、优先级、开始时间、截止时间、项目描述、项目状态
- **AND** 切换为英文后显示对应英文：Project Name、Project Type、Points、Priority、Start Time、End Time、Description、Status
- **AND** 切换为日文后显示对应日文

#### Scenario: 项目类型选项翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户查看项目类型选择器
- **THEN** sprint-project 显示为 ⚡ 冲刺项目
- **AND** slow-project 显示为 🌱 长期项目
- **AND** 切换为英文后 sprint-project 显示为 ⚡ Sprint Project
- **AND** slow-project 显示为 🌱 Long-term Project

#### Scenario: 自动计算单选框标签翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户查看积分设置区域
- **THEN** 单选框标签显示「根据优先级自动计算」
- **AND** 切换为英文后显示 "Auto-calculate by priority"
- **AND** 切换为日文后显示「優先度に応じて自動計算」

#### Scenario: 按钮文本翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户查看项目弹窗底部按钮
- **THEN** 创建按钮显示「创建项目」
- **AND** 保存按钮显示「保存」
- **AND** 取消按钮显示「取消」
- **AND** 切换为英文后分别显示 "Create Project"、"Save"、"Cancel"

---

### Requirement: 确认对话框国际化翻译
系统 SHALL 提供确认对话框文本的多语言翻译支持。

#### Scenario: 未保存修改确认对话框翻译
- **GIVEN** 当前语言设置为中文
- **AND** 用户在编辑态按下 ESC 键
- **WHEN** 确认对话框显示
- **THEN** 标题显示「确认关闭」
- **AND** 消息显示「有未保存的修改，确定要关闭吗？」
- **AND** 确定按钮显示「确定」
- **AND** 取消按钮显示「取消」
- **AND** 切换为英文后分别显示 "Confirm Close"、"You have unsaved changes. Are you sure you want to close?"、"Confirm"、"Cancel"

---

### Requirement: 表单校验错误国际化
系统 SHALL 提供表单校验错误消息的多语言翻译支持。

#### Scenario: 项目名称校验错误翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户未填写项目名称提交表单
- **THEN** 错误提示显示「请输入项目名称」
- **AND** 当名称超过 200 字符时显示「名称不能超过 200 个字符」
- **AND** 切换为英文后分别显示 "Please enter project name"、"Name cannot exceed 200 characters"

#### Scenario: 项目类型校验错误翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户未选择项目类型提交表单
- **THEN** 错误提示显示「请选择项目类型」
- **AND** 切换为英文后显示 "Please select project type"

#### Scenario: 积分校验错误翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户未填写积分值（手动输入模式）
- **THEN** 错误提示显示「请输入积分值」
- **AND** 当输入非正整数时显示「积分必须为正整数」
- **AND** 切换为英文后分别显示 "Please enter points value"、"Points must be a positive integer"

#### Scenario: 时间校验错误翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户设置的截止时间早于开始时间
- **THEN** 错误提示显示「截止时间不能早于开始时间」
- **AND** 切换为英文后显示 "End time cannot be earlier than start time"

---

### Requirement: 项目类型帮助文本国际化
系统 SHALL 提供项目类型说明帮助文本的多语言翻译支持。

#### Scenario: 冲刺项目帮助文本翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户查看冲刺项目类型说明
- **THEN** 帮助文本显示「短期、高强度、快速迭代的项目」
- **AND** 切换为英文后显示 "Short-term, high-intensity, fast-iteration projects"
- **AND** 切换为日文后显示「短期的、高強度、高速イテレーションのプロジェクト」

#### Scenario: 长期项目帮助文本翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户查看长期项目类型说明
- **THEN** 帮助文本显示「长期、持续、稳步推进的项目」
- **AND** 切换为英文后显示 "Long-term, continuous, steadily-progressing projects"
- **AND** 切换为日文后显示「長期的、継続的、着実に進めるプロジェクト」

---

## MODIFIED Requirements

### Requirement: Dashboard页面国际化
系统 SHALL 更新 Dashboard 页面的国际化翻译，支持项目类型新定义。

#### Scenario: 导航菜单翻译更新
- **WHEN** Dashboard页面加载
- **THEN** 左侧导航菜单项显示为对应语言
- **AND** 包含项目类型相关翻译键

#### Scenario: 项目类型筛选翻译
- **GIVEN** 当前语言设置为中文
- **WHEN** 用户在项目列表页面查看类型筛选器
- **THEN** 筛选选项显示新的项目类型：⚡ 冲刺项目、🌱 长期项目
- **AND** 切换为英文后显示 ⚡ Sprint Project、🌱 Long-term Project
