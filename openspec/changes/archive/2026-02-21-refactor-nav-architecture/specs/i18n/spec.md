## ADDED Requirements

### Requirement: 项目详情页国际化
系统 SHALL 为项目详情页提供 `projectDetail` 模块翻译，支持中文、英文、日文。

#### Scenario: 项目详情页顶部栏翻译
- **WHEN** 用户访问项目详情页且当前语言为中文
- **THEN** `projectDetail.backToProjectList` 显示为「返回项目列表」
- **AND** `projectDetail.switchProject` 显示为「切换项目」
- **AND** `projectDetail.currentProject` 显示为「当前项目」

#### Scenario: 项目详情页顶部栏英文翻译
- **WHEN** 用户访问项目详情页且当前语言为英文
- **THEN** `projectDetail.backToProjectList` 显示为「Back to Project List」
- **AND** `projectDetail.switchProject` 显示为「Switch Project」

#### Scenario: 项目详情页顶部栏日文翻译
- **WHEN** 用户访问项目详情页且当前语言为日文
- **THEN** `projectDetail.backToProjectList` 显示为「プロジェクト一覧に戻る」
- **AND** `projectDetail.switchProject` 显示为「プロジェクトを切り替え」

#### Scenario: Tab 标签复用
- **WHEN** 项目详情页显示需求/任务/缺陷 Tab
- **THEN** Tab 标签使用 `dashboard.nav.requirement`、`dashboard.nav.task`、`dashboard.nav.defect`
- **AND** 与一级导航翻译保持一致

#### Scenario: 提示与消息翻译
- **WHEN** 项目详情页显示提示或错误消息
- **THEN** `projectDetail.projectNotFound` 显示为「项目不存在」（中文）或对应语言
- **AND** `projectDetail.defectOnlyForCode` 显示为「仅代码项目有缺陷」（中文）或对应语言
- **AND** `projectDetail.emptyRequirement`、`projectDetail.emptyTask`、`projectDetail.emptyDefect` 分别显示空状态文案
- **AND** `projectDetail.loadFailed` 显示加载失败文案

#### Scenario: 项目下拉菜单翻译
- **WHEN** 项目名下拉菜单展开
- **THEN** `projectDetail.dropdown.backToProjectList` 显示为「返回项目列表」或对应语言
- **AND** `projectDetail.dropdown.switchProject` 显示为「切换项目」或对应语言
- **AND** `projectDetail.dropdown.noProjects` 显示为「暂无其他项目」或对应语言（当项目列表为空时）
