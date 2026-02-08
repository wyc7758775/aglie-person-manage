## ADDED Requirements

### Requirement: 迭代数据模型定义
系统 SHALL 定义迭代（Iteration）数据模型，归属项目，包含名称、目标、起止日期与状态。

#### Scenario: Iteration 核心字段
- **GIVEN** 系统已提供迭代能力
- **WHEN** 查询 Iteration 类型定义
- **THEN** Iteration 类型包含以下字段：
  - `id: string` — 迭代唯一标识
  - `projectId: string` — 所属项目 id
  - `name: string` — 迭代名称
  - `goal: string` — 迭代目标（可选）
  - `startDate: string` — 开始日期
  - `endDate: string` — 结束日期
  - `status: IterationStatus` — 迭代状态
  - 以及创建/更新时间等审计字段

#### Scenario: IterationStatus 类型定义
- **WHEN** 定义 IterationStatus
- **THEN** IterationStatus 为联合类型，至少包含 `planning`（规划中）、`active`（进行中）、`closed`（已结束）
- **AND** 用于列表筛选与展示

---

### Requirement: 迭代列表与筛选 API
系统 SHALL 提供按项目获取迭代列表的 API，并支持创建迭代。

#### Scenario: 按 projectId 获取迭代列表
- **WHEN** 客户端发送 `GET /api/iterations?projectId=xxx` 请求
- **THEN** 系统仅返回 projectId 匹配的迭代列表
- **AND** 响应格式为 `{ success: true, iterations: Iteration[] }`

#### Scenario: 创建迭代必填 projectId
- **WHEN** 客户端发送 `POST /api/iterations` 请求
- **THEN** 请求体必须包含 `projectId` 及 name、startDate、endDate、status 等必填字段
- **AND** 新建迭代与指定项目关联
- **AND** 响应格式为 `{ success: true, iteration: Iteration }`

---

### Requirement: 迭代详情与更新删除 API
系统 SHALL 提供单个迭代的获取、更新与删除接口。

#### Scenario: 获取单个迭代
- **WHEN** 客户端发送 `GET /api/iterations/[id]` 请求
- **THEN** 系统返回该 id 的迭代
- **AND** 响应格式为 `{ success: true, iteration: Iteration }`

#### Scenario: 更新迭代
- **WHEN** 客户端发送 `PUT /api/iterations/[id]` 请求且请求体合法
- **THEN** 系统更新该迭代并返回更新后的对象
- **AND** 响应格式为 `{ success: true, iteration: Iteration }`

#### Scenario: 删除迭代
- **WHEN** 客户端发送 `DELETE /api/iterations/[id]` 请求
- **THEN** 系统删除该迭代
- **AND** 返回成功标识（如 `{ success: true }`）

---

### Requirement: 项目详情页迭代 Tab 内容
系统 SHALL 在项目详情页的「迭代」Tab 中展示当前项目的迭代列表，并支持创建、编辑、删除迭代。

#### Scenario: 选中迭代 Tab 时加载列表
- **WHEN** 用户在项目详情页选中「迭代」Tab
- **THEN** 请求 `GET /api/iterations?projectId=[当前项目 id]`
- **AND** 展示该项目的迭代列表（卡片或表格）

#### Scenario: 在迭代 Tab 内创建迭代
- **WHEN** 用户在迭代 Tab 内触发「新建迭代」并提交表单
- **THEN** 调用 `POST /api/iterations` 并传入当前 projectId 与表单数据
- **AND** 创建成功后刷新迭代列表或跳转至新迭代

#### Scenario: 在迭代 Tab 内编辑与删除迭代
- **WHEN** 用户对某条迭代执行编辑或删除
- **THEN** 调用 `PUT /api/iterations/[id]` 或 `DELETE /api/iterations/[id]`
- **AND** 操作成功后刷新列表或关闭编辑态
