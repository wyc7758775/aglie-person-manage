## ADDED Requirements

### Requirement: 项目管理增强国际化
系统 SHALL 为项目管理增强功能提供翻译键，包括状态、时间字段、描述占位符和校验错误提示。

#### Scenario: 项目状态翻译
- **WHEN** 用户访问项目相关页面且当前语言为中文
- **THEN** 状态 `normal` 显示为「正常」
- **AND** 状态 `at_risk` 显示为「有风险」
- **AND** 状态 `out_of_control` 显示为「失控」

#### Scenario: 项目状态英文翻译
- **WHEN** 用户访问项目相关页面且当前语言为英文
- **THEN** 状态 `normal` 显示为「Normal」
- **AND** 状态 `at_risk` 显示为「At Risk」
- **AND** 状态 `out_of_control` 显示为「Out of Control」

#### Scenario: 时间字段翻译
- **WHEN** 项目表单或详情显示时间字段
- **THEN** 开始时间标签使用 `project.startTime`（中文「开始时间」、英文「Start Time」）
- **AND** 截止时间标签使用 `project.deadline`（中文「截止时间」、英文「Deadline」）

#### Scenario: 描述编辑器占位符
- **WHEN** 项目描述 Markdown 编辑器为空
- **THEN** 占位符使用 `project.form.descriptionPlaceholder`（如「支持 Markdown 格式」）

#### Scenario: 截止时间校验错误提示
- **WHEN** 用户填写截止时间早于开始时间且校验失败
- **THEN** 系统显示 `project.deadlineBeforeStart` 翻译（中文「截止时间不能早于开始时间」、英文「Deadline cannot be earlier than start time」、日文「締切は開始日時より前には設定できません」）

#### Scenario: 日文界面显示
- **GIVEN** 当前语言为日文（ja-JP）
- **WHEN** 用户访问项目相关页面
- **THEN** 状态显示为「正常」「リスクあり」「制御不能」
- **AND** 时间字段标签显示为「開始日時」「締切日時」
- **AND** 描述占位符显示为「Markdown 対応」
