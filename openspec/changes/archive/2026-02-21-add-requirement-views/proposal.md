# Change: 添加需求管理功能与视图切换

## Why

当前需求管理页面（`app/dashboard/requirement/page.tsx`）仅提供基础的卡片列表视图，缺少：
1. 完整的需求管理功能（数据模型、API、CRUD操作）
2. 看板视图，无法直观地按状态或优先级查看需求流转
3. 视图切换功能，用户无法在不同视图间灵活切换

根据 `project.md` 的要求，需求管理应支持描述功能、用户角色、优先级、开始时间、截止时间、子需求等功能。同时，提供列表和看板两种视图可以满足不同场景下的查看需求。

## What Changes

- **数据层**：
  - 在 `app/lib/definitions.ts` 中添加 Requirement 相关类型定义
  - 在 `app/lib/placeholder-data.ts` 中添加需求数据管理函数
  - 创建需求数据访问层（CRUD操作）

- **API 层**：
  - `GET /api/requirements` - 获取需求列表
  - `POST /api/requirements` - 创建新需求
  - `GET /api/requirements/[id]` - 获取需求详情
  - `PUT /api/requirements/[id]` - 更新需求
  - `DELETE /api/requirements/[id]` - 删除需求

- **UI 层**：
  - 重构需求页面，支持列表视图和看板视图
  - 添加视图切换控件（位于页面顶部标题区域）
  - 实现看板视图组件（支持按状态和按优先级两种分组方式）
  - 优化列表视图（保留现有卡片布局）
  - 添加需求创建/编辑功能
  - 集成国际化支持

- **功能特性**：
  - 需求状态管理（draft, review, approved, development, testing, completed, rejected）
  - 需求优先级管理（critical, high, medium, low）
  - 需求类型管理（feature, enhancement, bugfix, research）
  - 视图切换（列表视图 ↔ 看板视图）
  - 看板分组切换（按状态 ↔ 按优先级）
  - 需求筛选功能（保留现有筛选器）

## Impact

- **新增规范**：`specs/requirement-management/spec.md` - 需求管理功能规范
- **受影响代码**：
  - `app/dashboard/requirement/page.tsx` - 重构为支持视图切换
  - `app/lib/definitions.ts` - 添加 Requirement 类型
  - `app/lib/placeholder-data.ts` - 添加需求数据管理
  - `app/api/requirements/route.ts` - 新增 API 路由
  - `app/api/requirements/[id]/route.ts` - 新增详情 API 路由
  - `app/ui/dashboard/` - 新增看板视图组件
  - `app/lib/i18n/` - 添加需求管理相关翻译
