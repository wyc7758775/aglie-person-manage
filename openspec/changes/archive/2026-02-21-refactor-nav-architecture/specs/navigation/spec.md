## ADDED Requirements

### Requirement: 一级导航结构
系统 SHALL 在 Dashboard 侧边栏仅显示概览、项目、奖励、通知、设置五项一级导航，需求、任务、缺陷从一级导航移除。

#### Scenario: 侧边栏主导航项
- **WHEN** 用户进入 Dashboard
- **THEN** 侧边栏主导航仅显示：概览、项目、奖励
- **AND** 选项菜单显示：通知、设置
- **AND** 不显示需求、任务、缺陷作为一级导航项

#### Scenario: 点击项目导航
- **WHEN** 用户点击侧边栏「项目」项
- **THEN** 跳转至 `/dashboard/project`（项目列表页）

#### Scenario: 旧路径重定向
- **WHEN** 用户直接访问 `/dashboard/requirement`、`/dashboard/task` 或 `/dashboard/defect`
- **THEN** 系统重定向至 `/dashboard/project`
- **AND** 用户最终看到项目列表页
