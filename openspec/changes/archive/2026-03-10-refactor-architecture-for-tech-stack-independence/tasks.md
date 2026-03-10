# 重构任务清单：技术栈无关的架构优化

## 1. 创建抽象架构层

### 1.1 数据访问层抽象 (Repository Pattern)
- [ ] 1.1.1 创建 `app/lib/repositories/` 目录结构
- [ ] 1.1.2 定义 Repository 接口基类 (`base-repository.ts`)
- [ ] 1.1.3 创建 User Repository 接口
- [ ] 1.1.4 创建 Project Repository 接口
- [ ] 1.1.5 创建 Task Repository 接口
- [ ] 1.1.6 创建 Requirement Repository 接口
- [ ] 1.1.7 创建 Defect Repository 接口
- [ ] 1.1.8 创建 Todo Repository 接口
- [ ] 1.1.9 实现 PostgreSQL Repository 适配器

### 1.2 API契约层
- [ ] 1.2.1 创建 `app/lib/contracts/` 目录
- [ ] 1.2.2 定义通用 API 响应格式契约
- [ ] 1.2.3 定义认证 API 契约
- [ ] 1.2.4 定义项目 API 契约
- [ ] 1.2.5 定义任务 API 契约
- [ ] 1.2.6 定义需求 API 契约
- [ ] 1.2.7 定义缺陷 API 契约
- [ ] 1.2.8 定义待办 API 契约

### 1.3 领域模型层
- [ ] 1.3.1 重构 `app/lib/definitions.ts`
  - [ ] 移除框架特定类型
  - [ ] 分离 Entity（领域实体）和 DTO（数据传输对象）
  - [ ] 定义值对象（Value Objects）
- [ ] 1.3.2 创建领域服务层 `app/lib/services/`

## 2. 重构核心业务逻辑

### 2.1 认证模块
- [ ] 2.1.1 重构 `app/lib/auth.ts` - 纯业务逻辑
- [ ] 2.1.2 重构 `app/lib/auth-db.ts` - 使用Repository模式
- [ ] 2.1.3 更新认证 API routes 适配新架构

### 2.2 项目管理模块
- [ ] 2.2.1 重构 `app/lib/projects.ts` - 纯业务逻辑
- [ ] 2.2.2 更新项目 API routes 适配新架构

### 2.3 任务管理模块
- [ ] 2.3.1 重构 `app/lib/tasks.ts` - 纯业务逻辑
- [ ] 2.3.2 更新任务 API routes 适配新架构

### 2.4 需求管理模块
- [ ] 2.4.1 重构 `app/lib/requirements.ts` - 纯业务逻辑
- [ ] 2.4.2 更新需求 API routes 适配新架构

### 2.5 待办事项模块
- [ ] 2.5.1 重构待办相关逻辑 - 使用Repository模式
- [ ] 2.5.2 更新待办 API routes 适配新架构

## 3. 更新PRD文档为技术栈无关版本

### 3.1 认证模块 Spec
- [ ] 3.1.1 重写 `specs/auth/spec.md`
  - [ ] 移除技术实现细节
  - [ ] 聚焦认证行为和业务规则
  - [ ] 使用通用术语而非框架术语

### 3.2 项目管理模块 Spec
- [ ] 3.2.1 重写 `specs/project-management/spec.md`
  - [ ] 移除 Next.js、Tailwind 等技术细节
  - [ ] 描述项目管理的业务概念和行为
  - [ ] 定义清晰的领域边界

### 3.3 任务管理模块 Spec
- [ ] 3.3.1 重写 `specs/task-management/spec.md`
  - [ ] 抽象任务类型、状态、优先级等业务概念
  - [ ] 描述任务生命周期和状态流转
  - [ ] 定义任务积分计算规则

### 3.4 需求管理模块 Spec
- [ ] 3.4.1 重写 `specs/requirement-management/spec.md`
  - [ ] 描述需求状态机和流转规则
  - [ ] 定义需求优先级和类型
  - [ ] 说明子需求关系

### 3.5 缺陷管理模块 Spec
- [ ] 3.5.1 重写 `specs/defect-management/spec.md`
  - [ ] 描述缺陷生命周期
  - [ ] 定义严重程度分类
  - [ ] 说明缺陷类型

### 3.6 待办事项模块 Spec
- [ ] 3.6.1 重写 `specs/todo-management/spec.md`
  - [ ] 描述待办状态和行为
  - [ ] 定义子任务规则
  - [ ] 说明任务关联类型

### 3.7 积分奖励系统 Spec
- [ ] 3.7.1 新建/更新 `specs/reward-system/spec.md`
  - [ ] 定义积分计算规则
  - [ ] 描述徽章授予条件
  - [ ] 说明等级晋升机制

### 3.8 国际化模块 Spec
- [ ] 3.8.1 重写 `specs/i18n/spec.md`
  - [ ] 描述国际化能力需求
  - [ ] 定义语言切换行为

### 3.9 UI组件模块 Spec
- [ ] 3.9.1 重写 `specs/ui-components/spec.md`
  - [ ] 描述组件行为而非样式
  - [ ] 定义交互规范
  - [ ] 说明可访问性要求

## 4. 创建技术实现指南

### 4.1 架构设计文档
- [ ] 4.1.1 创建 `changes/refactor-architecture/design.md`
  - [ ] 描述 Repository Pattern 设计
  - [ ] 说明分层架构
  - [ ] 定义各层职责边界

### 4.2 迁移指南
- [ ] 4.2.1 创建代码迁移指南
  - [ ] 说明如何从旧代码迁移
  - [ ] 提供重构示例

## 5. 验证与测试

### 5.1 验证代码变更
- [ ] 5.1.1 运行 TypeScript 类型检查
- [ ] 5.1.2 运行 ESLint 检查
- [ ] 5.1.3 运行单元测试

### 5.2 验证PRD文档
- [ ] 5.2.1 使用 openspec validate 验证所有 specs
- [ ] 5.2.2 确保所有 specs 通过严格验证

### 5.3 E2E测试
- [ ] 5.3.1 运行功能契约测试
- [ ] 5.3.2 运行 API 契约测试
- [ ] 5.3.3 确保所有测试通过

## 6. 文档与归档

### 6.1 更新项目文档
- [ ] 6.1.1 更新 README.md 中的架构说明
- [ ] 6.1.2 更新 AGENTS.md 中的开发指南

### 6.2 归档变更
- [ ] 6.2.1 完成任务清单所有项后归档变更
