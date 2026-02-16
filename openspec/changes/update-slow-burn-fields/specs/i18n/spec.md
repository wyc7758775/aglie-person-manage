## MODIFIED Requirements

### Requirement: 翻译字典结构规范
系统 SHALL 采用统一的翻译字典结构组织翻译文本，支持项目类型和积累指标的国际化。

#### Scenario: 项目类型翻译键
- **WHEN** 添加项目类型翻译
- **THEN** 使用 `modal.project.type.sprint-project` 和 `modal.project.type.slow-burn`
- **AND** 中文值分别为"⚡ 冲刺项目"和"🌱 慢燃项目"
- **AND** 英文值分别为"⚡ Sprint Project"和"🌱 Slow-burn Project"

#### Scenario: 积累指标翻译键
- **WHEN** 添加积累指标相关翻译
- **THEN** 使用 `modal.project.indicators` 命名空间
- **AND** 包含以下键：
  - `modal.project.indicators.title` - "积累指标" / "Accumulation Indicators"
  - `modal.project.indicators.add` - "添加指标" / "Add Indicator"
  - `modal.project.indicators.remove` - "删除" / "Remove"
  - `modal.project.indicators.name` - "指标名称" / "Indicator Name"
  - `modal.project.indicators.current` - "当前值" / "Current"
  - `modal.project.indicators.target` - "目标值" / "Target"
  - `modal.project.indicators.weight` - "权重" / "Weight"
  - `modal.project.indicators.totalWeight` - "总权重" / "Total Weight"
  - `modal.project.indicators.progress` - "当前进度" / "Current Progress"

#### Scenario: 指标校验翻译键
- **WHEN** 添加指标校验错误翻译
- **THEN** 使用 `validation.project.indicator` 命名空间
- **AND** 包含以下键：
  - `validation.project.indicator.name.required`
  - `validation.project.indicator.target.required`
  - `validation.project.indicator.weight.required`
  - `validation.project.indicator.weight.sum`

---

### Requirement: 项目国际化支持
系统 SHALL 为项目功能提供中英文国际化支持，包括新的 slow-burn 类型和积累指标功能。

#### Scenario: 中文界面显示 slow-burn
- **GIVEN** 当前语言为中文
- **WHEN** 用户访问项目相关页面
- **THEN** slow-burn 项目类型显示为"🌱 慢燃项目"
- **AND** "积累指标"区域标题显示为"积累指标"
- **AND** 指标字段标签显示为"指标名称"、"当前值"、"目标值"、"权重"

#### Scenario: 英文界面显示 slow-burn
- **GIVEN** 当前语言为英文
- **WHEN** 用户访问项目相关页面
- **THEN** slow-burn 项目类型显示为"🌱 Slow-burn Project"
- **AND** "积累指标"区域标题显示为"Accumulation Indicators"
- **AND** 指标字段标签显示为"Indicator Name"、"Current"、"Target"、"Weight"

#### Scenario: 时间格式本地化
- **GIVEN** 当前语言为中文
- **WHEN** 项目卡片显示日期
- **THEN** 日期格式为"2026/02/16"
- **GIVEN** 当前语言为英文
- **WHEN** 项目卡片显示日期
- **THEN** 日期格式为"02/16/2026"

---

## ADDED Requirements

### Requirement: 富文本编辑器国际化
系统 SHALL 为 Markdown 富文本编辑器提供国际化支持。

#### Scenario: 编辑器工具栏翻译
- **GIVEN** 当前语言为中文
- **WHEN** Markdown 编辑器显示
- **THEN** 工具栏按钮显示中文标签：
  - "粗体" / "Bold"
  - "斜体" / "Italic"
  - "删除线" / "Strikethrough"
  - "标题 1" / "Heading 1"
  - "无序列表" / "Bullet List"
  - "任务列表" / "Task List"
  - "代码块" / "Code Block"
  - "Mermaid 图表" / "Mermaid Diagram"

#### Scenario: 编辑器占位符翻译
- **GIVEN** 当前语言为中文
- **WHEN** Markdown 编辑器输入框为空
- **THEN** 占位符显示"输入 Markdown 内容..."
- **GIVEN** 当前语言为英文
- **WHEN** Markdown 编辑器输入框为空
- **THEN** 占位符显示"Enter Markdown content..."

#### Scenario: 编辑器状态栏翻译
- **WHEN** Markdown 编辑器显示
- **THEN** 状态栏显示：
  - 中文："支持 Markdown 语法 · 字数: {count}"
  - 英文："Markdown supported · Word count: {count}"
