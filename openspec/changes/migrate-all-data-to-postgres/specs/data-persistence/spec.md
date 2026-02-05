## ADDED Requirements

### Requirement: 任务数据仅存于 PostgreSQL
系统 SHALL 将任务的增删改查全部通过 PostgreSQL 完成；SHALL NOT 在运行时使用内存数组或 placeholder-data 作为任务数据源。

#### Scenario: 任务列表来自数据库
- **WHEN** 客户端请求任务列表（含可选 projectId/status/priority 过滤）
- **THEN** 系统从 PostgreSQL 的 tasks 表查询并返回
- **AND** 服务重启后任务数据仍然存在

#### Scenario: 任务创建与更新落库
- **WHEN** 用户创建或更新任务
- **THEN** 数据写入 PostgreSQL
- **AND** 后续查询可立即得到最新结果

---

### Requirement: 需求数据仅存于 PostgreSQL
系统 SHALL 将需求的增删改查全部通过 PostgreSQL 完成；SHALL NOT 在运行时使用内存数组或 placeholder-data 作为需求数据源。

#### Scenario: 需求列表来自数据库
- **WHEN** 客户端请求需求列表（含可选 projectId/status/priority/type 过滤）
- **THEN** 系统从 PostgreSQL 的 requirements 表查询并返回
- **AND** 服务重启后需求数据仍然存在

#### Scenario: 需求完成时积分写入数据库
- **WHEN** 需求状态变更为已完成
- **THEN** 系统将对应积分累加到对应用户的 total_points（持久化于 users 表）
- **AND** 不依赖内存中的用户积分

---

### Requirement: 缺陷数据仅存于 PostgreSQL
系统 SHALL 将缺陷的增删改查全部通过 PostgreSQL 完成；SHALL NOT 在运行时使用内存数组或 placeholder-data 作为缺陷数据源。

#### Scenario: 缺陷列表来自数据库
- **WHEN** 客户端请求缺陷列表（含可选 projectId/status/severity/type 过滤）
- **THEN** 系统从 PostgreSQL 的 defects 表查询并返回
- **AND** 服务重启后缺陷数据仍然存在

#### Scenario: 缺陷创建与更新落库
- **WHEN** 用户创建或更新缺陷
- **THEN** 数据写入 PostgreSQL
- **AND** 后续查询可立即得到最新结果

---

### Requirement: 项目数据仅使用 PostgreSQL
系统 SHALL 将项目的增删改查全部通过 PostgreSQL 完成；SHALL NOT 在未配置数据库或连接失败时回退到内存中的项目列表。

#### Scenario: 项目列表来自数据库
- **WHEN** 已登录用户请求项目列表
- **THEN** 系统从 PostgreSQL 的 projects 表按 user_id 查询并返回
- **AND** 无 POSTGRES_URL 或连接失败时返回明确错误而非内存数据

#### Scenario: 项目持久化
- **WHEN** 用户创建、更新或删除项目
- **THEN** 操作仅针对 PostgreSQL
- **AND** 服务重启后项目数据仍然存在
