# points-system Specification

## Purpose
实现积分系统，支持项目和需求完成时自动累加积分到用户总积分，提供用户总积分查询功能。

## ADDED Requirements

### Requirement: 用户积分数据模型
系统 SHALL 在 User 数据模型中包含总积分字段。

#### Scenario: User 总积分字段
- **GIVEN** 系统初始化完成
- **WHEN** 查询 User 类型定义
- **THEN** User 类型包含 `totalPoints: number` 字段
- **AND** `totalPoints` 表示用户累计获得的总积分
- **AND** `totalPoints` 默认值为 0
- **AND** `totalPoints` 必须为非负数

---

### Requirement: 项目完成积分累加
系统 SHALL 在项目状态变更为 `completed` 时，自动将项目积分累加到用户总积分。

#### Scenario: 项目完成时累加积分
- **GIVEN** 项目当前状态为 `'active'`，积分为 20
- **AND** 当前登录用户总积分为 100
- **WHEN** 客户端更新项目状态为 `'completed'`
- **THEN** 系统将项目的 `points` 值（20）累加到用户总积分
- **AND** 用户总积分更新为 120

#### Scenario: 项目完成时不会重复累加
- **GIVEN** 项目当前状态为 `'completed'`，积分为 20
- **AND** 用户总积分为 100
- **WHEN** 客户端再次更新项目状态为 `'completed'`
- **THEN** 系统不重复累加积分
- **AND** 用户总积分仍为 100

#### Scenario: 项目状态从已完成变更为其他状态
- **GIVEN** 项目当前状态为 `'completed'`，积分为 20
- **AND** 用户总积分为 100（已包含该项目的 20 积分）
- **WHEN** 客户端更新项目状态为 `'active'`
- **THEN** 系统不扣除积分
- **AND** 用户总积分仍为 100

---

### Requirement: 需求完成积分累加
系统 SHALL 在需求状态变更为 `completed` 时，自动将需求积分累加到用户总积分。

#### Scenario: 需求完成时累加积分
- **GIVEN** 需求当前状态为 `'development'`，积分为 10
- **AND** 当前登录用户总积分为 100
- **WHEN** 客户端更新需求状态为 `'completed'`
- **THEN** 系统将需求的 `points` 值（10）累加到用户总积分
- **AND** 用户总积分更新为 110

#### Scenario: 需求完成时不会重复累加
- **GIVEN** 需求当前状态为 `'completed'`，积分为 10
- **AND** 用户总积分为 100
- **WHEN** 客户端再次更新需求状态为 `'completed'`
- **THEN** 系统不重复累加积分
- **AND** 用户总积分仍为 100

#### Scenario: 需求状态从已完成变更为其他状态
- **GIVEN** 需求当前状态为 `'completed'`，积分为 10
- **AND** 用户总积分为 100（已包含该需求的 10 积分）
- **WHEN** 客户端更新需求状态为 `'rejected'`
- **THEN** 系统不扣除积分
- **AND** 用户总积分仍为 100

---

### Requirement: 用户总积分查询
系统 SHALL 提供查询用户总积分的功能。

#### Scenario: 获取用户总积分
- **GIVEN** 用户已登录
- **WHEN** 系统查询当前用户信息
- **THEN** 用户信息包含 `totalPoints` 字段
- **AND** `totalPoints` 值为用户累计获得的总积分

#### Scenario: 用户总积分初始值
- **GIVEN** 新用户注册完成
- **WHEN** 系统查询该用户信息
- **THEN** 用户 `totalPoints` 字段值为 0

---

### Requirement: 积分自动计算规则
系统 SHALL 支持根据优先级自动计算项目和需求的积分值。

#### Scenario: 项目积分自动计算
- **WHEN** 系统根据项目优先级自动计算积分
- **THEN** 计算规则如下：
  - `priority: 'high'` → `points: 20`
  - `priority: 'medium'` → `points: 10`
  - `priority: 'low'` → `points: 5`

#### Scenario: 需求积分自动计算
- **WHEN** 系统根据需求优先级自动计算积分
- **THEN** 计算规则如下：
  - `priority: 'critical'` → `points: 15`
  - `priority: 'high'` → `points: 10`
  - `priority: 'medium'` → `points: 5`
  - `priority: 'low'` → `points: 2`

---

### Requirement: 积分字段验证
系统 SHALL 验证积分字段的有效性。

#### Scenario: 积分不能为负数
- **WHEN** 客户端在创建或更新项目/需求时，提供负数积分值
- **THEN** 系统返回错误响应
- **AND** 错误消息为"积分不能为负数"
- **AND** HTTP 状态码为 400

#### Scenario: 积分默认值
- **WHEN** 客户端在创建项目/需求时，未提供积分值
- **THEN** 系统设置积分默认值为 0
