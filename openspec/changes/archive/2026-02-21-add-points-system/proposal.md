# Change: 添加积分系统

## Why
为了激励用户完成项目和需求，需要引入积分系统。当项目或需求完成时，用户可以获得相应的积分，这些积分会累加到用户的总积分中，形成正向激励循环。

## What Changes
- **BREAKING**: 在 Project 数据模型中添加 `points: number` 字段
- **BREAKING**: 在 Requirement 数据模型中添加 `points: number` 字段
- **BREAKING**: 在 User 数据模型中添加 `totalPoints: number` 字段
- 支持在创建/编辑项目和需求时手动设置积分值
- 支持根据优先级自动计算积分（可选功能）
- 当项目状态变更为 `completed` 时，自动将项目积分累加到用户总积分
- 当需求状态变更为 `completed` 时，自动将需求积分累加到用户总积分
- 提供获取用户总积分的 API 接口
- 更新相关 API 接口以支持积分字段

## Impact
- **受影响规范**：
  - `project-management` - 需要添加积分字段和相关逻辑
  - `requirement-management` - 需要添加积分字段和相关逻辑
  - `points-system` - 新增积分系统规范
- **受影响代码**：
  - `app/lib/definitions.ts` - 类型定义
  - `app/lib/placeholder-data.ts` - 数据初始化
  - `app/api/projects/route.ts` - 项目 API
  - `app/api/projects/[id]/route.ts` - 项目详情 API
  - `app/api/requirements/route.ts` - 需求 API
  - `app/api/requirements/[id]/route.ts` - 需求详情 API
  - `app/lib/projects.ts` - 项目业务逻辑
  - `app/lib/requirements.ts` - 需求业务逻辑
  - 项目表单组件 - 添加积分输入字段
  - 需求表单组件 - 添加积分输入字段
  - 用户相关 API - 添加总积分字段
