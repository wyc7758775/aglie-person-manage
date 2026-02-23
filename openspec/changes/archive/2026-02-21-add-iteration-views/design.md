# Design: 迭代界面与数据模型

## Context

- 项目详情页已有需求、任务、缺陷三个 Tab，数据均按 `projectId` 归属项目。
- 敏捷中迭代（Sprint/Iteration）通常有：名称、目标、开始/结束日期、状态（如规划中、进行中、已结束）。
- 需求与任务在后续可关联到迭代（如 `iterationId`），本阶段先实现迭代自身 CRUD 与列表视图，关联可在后续 change 中补充。

## Goals / Non-Goals

- **Goals**：在同一层级（项目详情页 Tab）增加「迭代」入口；迭代归属项目；支持迭代的增删改查与列表展示；URL 与现有 Tab 一致（`?tab=iteration`）。
- **Non-Goals**：本阶段不强制要求需求/任务与迭代的关联（不修改 Requirement/Task 的 `iterationId`）；不实现迭代内需求/任务的自动筛选（可后续做）。

## Decisions

- **迭代归属项目**：迭代仅隶属于项目，通过 `projectId` 关联；所有迭代 API 支持且推荐按 `projectId` 筛选。
- **迭代状态**：采用简单状态模型，如 `planning | active | closed`，便于列表筛选与展示。
- **Tab 位置**：迭代 Tab 放在「缺陷」Tab 之前或之后均可，与需求、任务、缺陷同级展示。
- **默认 Tab**：保持进入项目详情页时默认「需求」Tab；从 URL `?tab=iteration` 进入时直接显示迭代 Tab。

## Risks / Trade-offs

- **需求/任务未关联迭代**：首版仅展示迭代列表，不展示「某迭代下的需求/任务」。若需该能力，后续通过 Requirement/Task 增加 `iterationId` 及筛选实现。

## Migration Plan

- 新增迭代表与 API，无数据迁移；现有需求/任务/缺陷不受影响。
- 若后续为需求/任务增加 `iterationId`，需数据库迁移与可选回填，留待后续 change。

## Open Questions

- 无。迭代名称与日期、状态的字段以 definitions 与 API 实现为准，本设计不锁定具体枚举值。
