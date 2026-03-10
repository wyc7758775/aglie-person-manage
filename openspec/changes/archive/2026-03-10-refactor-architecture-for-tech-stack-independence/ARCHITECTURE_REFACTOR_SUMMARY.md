# 架构重构总结：技术栈无关的契约驱动设计

## 变更概述

本次重构的核心目标是将系统从**技术实现耦合**转向**契约驱动架构**，使 PRD 文档成为技术栈无关的"唯一真相来源"。

## 已完成的工作

### 1. OpenSpec 变更提案

创建了完整的变更提案 `refactor-architecture-for-tech-stack-independence`，包含：

- **proposal.md** - 变更目的、范围和影响分析
- **tasks.md** - 52 项具体任务清单
- **design.md** - 架构设计决策文档

### 2. 技术栈无关的 PRD 文档

重写了 9 个核心能力域的 Spec，移除所有技术实现细节：

| 能力域 | 状态 | 变更类型 |
|-------|------|---------|
| auth | ✅ | MODIFIED - 聚焦认证行为和权限管理 |
| project-management | ✅ | MODIFIED - 描述项目管理业务概念 |
| task-management | ✅ | ADDED - 任务生命周期和习惯追踪 |
| requirement-management | ✅ | ADDED - 需求状态机和工作流 |
| defect-management | ✅ | ADDED - 缺陷生命周期管理 |
| todo-management | ✅ | ADDED - 待办事项和子任务管理 |
| reward-system | ✅ | ADDED - 积分、徽章、等级系统 |
| i18n | ✅ | MODIFIED - 多语言支持需求 |
| ui-components | ✅ | MODIFIED - 组件行为而非实现 |

**重写原则**：
- ❌ 移除：HTTP 状态码、API 路径、React/Vue/Angular 术语、SQL、CSS 类名
- ✅ 保留：业务术语、用户行为、状态流转、业务规则

### 3. Repository 模式实现

创建了抽象的数据访问层，实现技术栈解耦：

```
app/lib/repositories/
├── interfaces/
│   ├── base-repository.ts      # 基础 CRUD 接口
│   ├── user-repository.ts      # 用户数据访问
│   ├── project-repository.ts   # 项目数据访问
│   ├── task-repository.ts      # 任务数据访问
│   ├── requirement-repository.ts # 需求数据访问
│   ├── defect-repository.ts    # 缺陷数据访问
│   ├── todo-repository.ts      # 待办数据访问
│   └── index.ts                # 统一导出
├── postgresql/
│   ├── base-postgres-repository.ts # PostgreSQL 基类
│   ├── user-repository.ts      # User Repository 实现
│   ├── project-repository.ts   # Project Repository 实现
│   └── (其他实现待完成)
└── factory.ts                  # Repository 工厂
```

**核心特性**：
- 纯 TypeScript 接口定义，无框架依赖
- 领域模型与存储模型分离
- 支持未来更换存储实现（MySQL、MongoDB、内存等）
- 工厂模式便于依赖注入和测试

## 架构对比

### 重构前（紧耦合）

```
业务逻辑 → 直接 SQL → PostgreSQL
     ↓
Next.js API Routes
     ↓
React + Tailwind
```

**问题**：
- 业务逻辑嵌入框架代码
- 无法更换技术栈
- PRD 充斥技术细节

### 重构后（分层架构）

```
┌─────────────────────────────────────────┐
│  用户界面层 (Presentation)              │  ← Next.js / React / Vue / Angular
├─────────────────────────────────────────┤
│  API 适配层 (API Contract)              │  ← HTTP / GraphQL / gRPC
├─────────────────────────────────────────┤
│  应用服务层 (Application)               │  ← 用例编排
├─────────────────────────────────────────┤
│  领域层 (Domain)                        │  ← 纯业务逻辑 ✨技术栈无关
├─────────────────────────────────────────┤
│  数据访问层 (Repository)                │  ← 抽象接口 ✨技术栈无关
├─────────────────────────────────────────┤
│  基础设施层 (Infrastructure)            │  ← PostgreSQL / MySQL / MongoDB
└─────────────────────────────────────────┘
```

**优势**：
- 领域层和技术无关
- 可独立测试业务逻辑
- PRD 描述纯粹的业务需求
- 支持渐进式技术栈迁移

## 给 AI 的 PRD 文档示例

### 重构前（技术化描述）

```markdown
### Requirement: 项目列表 API
系统 SHALL 提供获取项目列表的 API 接口。

#### Scenario: 获取所有项目
- **WHEN** 客户端发送 `GET /api/projects` 请求
- **THEN** 系统返回所有项目列表
- **AND** 响应格式为 `{ success: true, projects: Project[] }`

#### Scenario: 按状态筛选项目
- **WHEN** 客户端发送 `GET /api/projects?status=active` 请求
- **THEN** 系统只返回状态为 `active` 的项目
```

### 重构后（业务化描述）

```markdown
### Requirement: 项目列表展示
系统 SHALL 提供项目列表视图，帮助用户管理和查看项目。

#### Scenario: 查看所有项目
- **GIVEN** 用户已登录
- **WHEN** 用户请求查看所有项目
- **THEN** 系统展示项目列表
- **AND** 每个项目显示名称、描述、类型、状态和优先级

#### Scenario: 按状态筛选项目
- **GIVEN** 用户在查看项目列表
- **WHEN** 用户选择按状态筛选
- **THEN** 系统仅显示符合所选状态的项目
```

**关键差异**：
- 移除 HTTP 路径和方法
- 移除 JSON 响应格式
- 聚焦用户行为而非技术实现
- 使用通用业务术语

## 后续工作

### 1. 完成 Repository 实现

当前已完成：
- ✅ User Repository（含密码哈希）
- ✅ Project Repository（含指标管理）

待完成：
- ⏳ Task Repository
- ⏳ Requirement Repository
- ⏳ Defect Repository
- ⏳ Todo Repository

### 2. 迁移现有代码

逐步将 `app/lib/db.ts` 和 `app/lib/*.ts` 中的直接数据库访问迁移到 Repository 模式：

```typescript
// 迁移前
currentUser = await getUserById(userId);

// 迁移后
const userRepo = getUserRepository();
currentUser = await userRepo.findById(userId);
```

### 3. 更新 API Routes

在 API Routes 中使用 Repository 而不是直接 SQL：

```typescript
// app/api/projects/route.ts
import { getProjectRepository } from '@/app/lib/repositories';

const projectRepo = getProjectRepository();

export async function GET() {
  const projects = await projectRepo.findByUserId(userId);
  return Response.json({ success: true, projects });
}
```

### 4. 完善 Spec 验证

运行 E2E 测试确保行为契约未改变：

```bash
pnpm --filter e2e test
```

## 技术决策记录

### 决策 1：不使用 ORM

**原因**：
- 保持对 SQL 的完全控制
- 避免 ORM 带来的学习成本
- Repository 模式已提供足够抽象

### 决策 2：值对象使用 TypeScript 品牌类型

```typescript
export type ProjectId = string & { readonly __brand: 'ProjectId' };
```

**原因**：
- 编译时类型安全
- 防止 ID 混淆（不会把 UserId 传给需要 ProjectId 的函数）
- 零运行时开销

### 决策 3：Repository 返回完整实体

**原因**：
- 简化调用方代码
- 避免部分加载导致的 bug
- 缓存友好

### 决策 4：延迟加载其他 Repository 实现

**原因**：
- 优先实现核心功能
- 允许渐进式迁移
- 不影响现有代码运行

## 如何验证

### 验证 Spec 格式

```bash
npx openspec validate refactor-architecture-for-tech-stack-independence --strict
```

### 验证类型正确性

```bash
cd apps/web && pnpm typecheck
```

### 运行测试

```bash
# E2E 契约测试
pnpm --filter e2e test

# 单元测试
pnpm --filter web test:unit
```

## 总结

本次重构完成了从"技术实现驱动"到"契约驱动"的转变：

1. **PRD 成为技术栈无关的契约** - AI 可以直接阅读并理解要构建什么功能
2. **架构分层清晰** - 领域逻辑与基础设施解耦
3. **Repository 模式提供抽象** - 支持未来更换存储技术
4. **向后兼容** - 现有代码继续工作，可以渐进式迁移

**下一步**：完成剩余 Repository 实现，并逐步迁移现有代码。
