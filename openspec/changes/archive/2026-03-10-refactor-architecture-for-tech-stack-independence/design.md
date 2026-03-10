# 架构设计：技术栈无关的分层架构

## Context

当前系统采用 Next.js + PostgreSQL 技术栈，但代码与这些技术深度耦合：
- API Routes 直接使用 Next.js 特有的 `NextRequest`/`NextResponse`
- 数据库操作直接嵌入 SQL 语句，与 `postgres` 驱动绑定
- 类型定义混合领域模型和框架类型
- PRD 文档充斥技术实现细节

**约束**：
1. 保持现有功能不变（E2E 测试契约必须继续通过）
2. 逐步重构，不能一次性重写所有代码
3. 需要支持未来可能的技术栈迁移
4. PRD 必须是纯业务描述，AI 可直接阅读实现

**利益相关者**：
- AI 开发者：需要通过 PRD 理解要构建什么
- 未来维护者：需要清晰的架构边界
- 产品负责人：需要可验证的业务契约

## Goals / Non-Goals

### Goals
- 创建清晰的**分层架构**，各层职责明确
- 实现**技术栈无关的领域层**（核心业务逻辑）
- 定义**抽象的 Repository 接口**，隔离数据存储细节
- 重构所有 PRD 为**纯业务需求描述**
- 保持**向后兼容性**，所有现有接口继续工作

### Non-Goals
- 更换当前技术栈（Next.js/PostgreSQL 继续保留）
- 重写所有 UI 组件
- 引入新的框架或库
- 修改业务规则或数据模型
- 一次性完成所有重构（允许渐进式迁移）

## Architecture Decisions

### Decision 1: 分层架构模式

**决策**：采用经典的分层架构
```
┌─────────────────────────────────────────┐
│  Presentation Layer (UI/API Routes)    │  ← Next.js specific
├─────────────────────────────────────────┤
│  Application Layer (Use Cases)         │  ← Orchestration
├─────────────────────────────────────────┤
│  Domain Layer (Business Logic)         │  ← Framework agnostic
├─────────────────────────────────────────┤
│  Data Access Layer (Repositories)      │  ← Abstract interface
├─────────────────────────────────────────┤
│  Infrastructure Layer (DB/External)    │  ← PostgreSQL specific
└─────────────────────────────────────────┘
```

**原因**：
- 清晰的职责分离，便于理解和维护
- 领域层可以完全独立于框架
- 符合领域驱动设计（DDD）原则
- 支持渐进式重构

**替代方案考虑**：
- Hexagonal Architecture（端口适配器）：过于复杂，当前项目不需要
- Clean Architecture：类似，但我们的分层更简化

### Decision 2: Repository Pattern for Data Access

**决策**：所有数据访问通过 Repository 接口

**接口定义**：
```typescript
// 技术栈无关的 Repository 接口
interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(filters?: FilterOptions): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: ID, updates: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}

// 具体 Repository 扩展业务查询
interface ProjectRepository extends Repository<Project, string> {
  findByUserId(userId: string): Promise<Project[]>;
  findByStatus(status: ProjectStatus): Promise<Project[]>;
  updateProgress(id: string, progress: number): Promise<Project>;
}
```

**原因**：
- 隔离数据存储实现（SQL/MongoDB/内存都可以）
- 便于测试（可以 mock Repository）
- 业务逻辑不依赖具体数据库技术
- 支持未来更换存储方案

**实现策略**：
- 创建 `repositories/interfaces/` 存放接口定义
- 创建 `repositories/postgresql/` 存放具体实现
- 业务逻辑通过接口使用，不直接实例化实现类

### Decision 3: 领域模型净化

**决策**：领域模型使用纯 TypeScript 类型，无框架依赖

**之前**（有技术耦合）：
```typescript
// ❌ 包含技术细节
export type Project = {
  id: string;
  name: string;
  // ...
  createdAt: string;  // 数据库格式
  updatedAt: string;  // 数据库格式
};
```

**之后**（净化后）：
```typescript
// ✅ 纯领域模型
export interface Project {
  id: ProjectId;
  name: ProjectName;
  description: Description;
  type: ProjectType;
  status: ProjectStatus;
  // ...
  createdAt: DateTime;
  updatedAt: DateTime;
}

// 值对象增加类型安全
export type ProjectId = string & { readonly __brand: 'ProjectId' };
export type ProjectName = string & { readonly __brand: 'ProjectName' };
```

**原因**：
- 类型安全增强（不会混淆不同实体ID）
- 清晰的领域概念（使用业务术语而非技术术语）
- 便于在不同技术栈间移植

**权衡**：
- 需要额外的类型定义代码
- 需要适配层转换值对象

### Decision 4: API契约抽象

**决策**：定义技术栈无关的 API 契约

**契约定义**：
```typescript
// API 契约独立于实现
interface AuthApiContract {
  // 登录
  login(credentials: LoginCredentials): Promise<AuthResult>;
  
  // 登出
  logout(): Promise<void>;
  
  // 获取当前用户
  getCurrentUser(): Promise<User | null>;
}

// HTTP 实现适配器
class NextJsAuthApi implements AuthApiContract {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return response.json();
  }
  // ...
}
```

**原因**：
- API 契约可以在 PRD 中清晰描述
- 不同框架可以实现相同的契约
- 便于测试和 mock

### Decision 5: PRD 技术无关化规范

**决策**：PRD 文档禁止使用技术实现词汇

**禁止在 Spec 中出现**：
- 具体框架名称（React, Next.js, Vue, Angular）
- 具体存储技术（PostgreSQL, MongoDB, Redis）
- 具体样式方案（Tailwind CSS, CSS Modules, SCSS）
- HTTP 状态码（用业务错误描述替代）
- SQL 语句或数据库操作
- 组件实现细节（props, state, hooks）

**推荐使用的描述方式**：
- 用"系统 SHALL" 而非 "API SHALL"
- 用"显示"而非 "渲染"
- 用"用户界面"而非 "UI组件"
- 用"数据存储"而非 "数据库"
- 用"成功响应"而非 "200 OK"

**示例对比**：

之前（技术化）：
```markdown
WHEN 客户端发送 GET /api/projects 请求
THEN 系统返回所有项目列表
AND 响应格式为 { success: true, projects: Project[] }
```

之后（业务化）：
```markdown
WHEN 用户请求查看所有项目
THEN 系统展示项目列表
AND 每个项目显示名称、描述、类型、状态和优先级
```

## Risks / Trade-offs

### Risk 1: 过度工程化
**风险**：Repository 模式和分层架构可能对小项目过于复杂
**缓解**：
- 保持接口简单，只包含必要的 CRUD + 业务查询
- 不引入 ORM 或查询构建器，保持 SQL 控制
- 允许渐进式采用，不强制一次性重构所有模块

### Risk 2: 性能影响
**风险**：额外的抽象层可能带来性能开销
**缓解**：
- Repository 实现保持高效（直接 SQL 查询）
- 不引入不必要的对象映射
- 在关键路径上保持简单

### Risk 3: 开发体验下降
**风险**：更多文件和抽象可能降低开发速度
**缓解**：
- 清晰的目录结构
- 完善的类型推断
- 提供脚手架工具快速创建新模块

### Risk 4: 团队学习成本
**风险**：新的架构模式需要团队学习
**缓解**：
- 提供清晰的示例代码
- 保持与现有代码的兼容性
- 逐步推广而非强制切换

## Migration Plan

### 阶段 1: 基础设施（当前变更）
1. 创建 Repository 接口和基础实现
2. 重构 definitions.ts 为纯领域模型
3. 创建第一个示例模块（Projects）的完整实现
4. 验证 E2E 测试通过

### 阶段 2: 逐步迁移
1. 逐个模块迁移到 Repository 模式
2. 每迁移一个模块，更新对应 Spec
3. 保持新旧代码并存，逐步切换

### 阶段 3: 清理
1. 移除旧的直接数据库访问代码
2. 统一所有模块使用新架构
3. 更新文档和开发指南

### 回滚策略
- 所有变更保持向后兼容
- 保留旧的 db.ts 作为备选
- 通过功能开关控制切换

## Open Questions

1. 是否需要引入依赖注入容器？
   - 初步决定：不需要，保持简单，手动传入 Repository 实例

2. 事务管理如何处理？
   - 初步决定：在 Repository 层提供事务支持，业务逻辑层不显式处理

3. 缓存层是否需要抽象？
   - 初步决定：第二阶段考虑，当前聚焦数据访问抽象

4. 前端状态管理是否需要变化？
   - 初步决定：不需要，当前状态管理已足够，与后端架构解耦
