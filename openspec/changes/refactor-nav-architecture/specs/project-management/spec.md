## ADDED Requirements

### Requirement: 项目列表页点击行为
系统 SHALL 在项目列表页中，点击项目卡片跳转至项目详情页，而非打开详情抽屉。

#### Scenario: 点击项目卡片进入详情页
- **WHEN** 用户在项目列表页点击某项目卡片
- **THEN** 跳转至 `/dashboard/project/[projectId]`
- **AND** 默认选中「需求」Tab
- **AND** 不打开 ProjectDrawer

#### Scenario: 通过更多菜单编辑项目
- **WHEN** 用户点击项目卡片的「更多」菜单并选择「编辑」
- **THEN** 打开 ProjectDrawer 进行编辑
- **AND** 不跳转至项目详情页

#### Scenario: 无项目时显示空状态
- **WHEN** 项目列表为空
- **THEN** 显示空状态文案
- **AND** 提供新建项目引导

---

### Requirement: 项目详情页顶部栏
系统 SHALL 在项目详情页顶部展示项目上下文栏，包含文件夹图标、面包屑、项目名、下拉菜单及需求/任务/缺陷 Tab。

#### Scenario: 顶部栏布局
- **WHEN** 用户进入项目详情页
- **THEN** 顶部栏自左至右显示：文件夹图标、右箭头、项目名、下拉箭头、竖线分隔、需求 Tab、任务 Tab、缺陷 Tab
- **AND** 默认选中「需求」Tab

#### Scenario: 点击文件夹图标返回项目列表
- **WHEN** 用户点击顶部栏文件夹图标
- **THEN** 跳转至 `/dashboard/project`
- **AND** 显示项目列表页

#### Scenario: 项目名下拉菜单
- **WHEN** 用户点击项目名或下拉箭头
- **THEN** 展开下拉菜单
- **AND** 菜单展示项目列表及「返回项目列表」选项

#### Scenario: 下拉菜单切换项目
- **WHEN** 用户在下拉菜单中点击某项目
- **THEN** 更新 URL 为 `/dashboard/project/[newProjectId]`
- **AND** Tab 状态保持当前选中（如任务 Tab 仍为任务 Tab）
- **AND** 内容区刷新为新项目的需求/任务/缺陷

#### Scenario: 下拉菜单返回项目列表
- **WHEN** 用户在下拉菜单中点击「返回项目列表」
- **THEN** 跳转至 `/dashboard/project`

#### Scenario: Tab 切换
- **WHEN** 用户点击「需求」「任务」或「缺陷」Tab
- **THEN** 切换 Tab 高亮
- **AND** 展示对应内容区
- **AND** URL 可带 query 如 `?tab=requirement|task|defect`

---

### Requirement: 项目详情页 Tab 内容
系统 SHALL 在项目详情页的需求、任务、缺陷 Tab 中分别展示当前项目下的对应内容，按 projectId 筛选。

#### Scenario: 需求 Tab 内容
- **WHEN** 用户选中需求 Tab
- **THEN** 请求 `GET /api/requirements?projectId=[projectId]`
- **AND** 展示该项目的需求列表/看板
- **AND** 复用 RequirementKanban 等现有组件

#### Scenario: 任务 Tab 内容
- **WHEN** 用户选中任务 Tab
- **THEN** 请求任务 API 并传入 projectId 筛选
- **AND** 展示该项目的任务列表
- **AND** 复用 TaskCard 等现有组件

#### Scenario: 缺陷 Tab 内容
- **WHEN** 用户选中缺陷 Tab 且当前项目为 code 类型
- **THEN** 请求缺陷 API 并传入 projectId 筛选
- **AND** 展示该项目的缺陷列表

#### Scenario: 缺陷 Tab 对 life 项目
- **WHEN** 当前项目为 life 类型
- **THEN** 隐藏缺陷 Tab 或显示「仅代码项目有缺陷」提示

#### Scenario: 无效 projectId
- **WHEN** 访问的 projectId 不存在或已删除
- **THEN** 重定向至 `/dashboard/project`
- **AND** 显示「项目不存在」提示
