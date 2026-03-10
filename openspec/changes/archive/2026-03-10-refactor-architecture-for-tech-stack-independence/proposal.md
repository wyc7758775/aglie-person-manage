# Change: 重构架构实现技术栈无关性

## Why

当前代码与特定技术栈（Next.js、PostgreSQL、Tailwind CSS）深度耦合，导致：
1. **技术债务累积** - 无法在不重写大部分代码的情况下更换技术栈
2. **AI生成代码质量受限** - 耦合的架构使得AI难以理解业务意图
3. **维护成本高** - 修改一处可能影响多处，缺乏清晰的抽象边界
4. **PRD文档技术化** - 现有specs包含大量技术实现细节，而非纯粹的业务需求

**目标**：通过抽象分层，使PRD文档成为技术栈无关的"契约"，任何技术栈（React/Vue/Angular + Node/Go/Rust + PostgreSQL/MySQL/MongoDB）都能实现相同功能。

## What Changes

### 架构层面
1. **数据层抽象** - 引入 Repository Pattern，分离业务逻辑与数据存储实现
2. **API层标准化** - 定义通用API契约，与具体框架解耦
3. **领域模型净化** - 移除类型定义中的框架特定代码
4. **PRD文档重构** - 将所有specs重写为技术栈无关的业务需求描述

### 具体变更
- **新增** Repository层抽象接口
- **新增** 技术栈无关的API契约定义
- **修改** 所有specs，移除技术实现细节，聚焦业务行为
- **修改** 数据模型定义，使用纯领域模型
- **移除** 框架特定的代码注释和实现暗示

### **BREAKING**
- 数据库访问方式将从直接SQL改为Repository模式
- API响应结构将标准化（所有接口统一返回格式）
- 部分类型定义将移动到新位置

## Impact

### Affected Specs
- `auth` - 重写为纯认证需求描述
- `project-management` - 移除UI框架细节，聚焦项目管理行为
- `task-management` - 抽象任务管理核心逻辑
- `requirement-management` - 标准化需求生命周期描述
- `defect-management` - 缺陷管理流程抽象
- `todo-management` - 待办事项管理需求
- `reward-system` - 积分奖励系统业务规则
- `i18n` - 国际化能力抽象描述
- `ui-components` - 组件行为而非实现细节

### Affected Code
- `apps/web/app/lib/db.ts` - 将拆分为 Repository 接口 + 实现
- `apps/web/app/lib/definitions.ts` - 净化为纯领域模型
- 所有 API routes - 增加适配层
- 所有业务逻辑文件 - 通过Repository访问数据

### New Capabilities
- `data-access-layer` - 数据访问抽象层
- `api-contract` - API契约定义

## Success Criteria
1. 任何AI阅读PRD后，无需看代码即可理解要实现什么功能
2. 代码中的技术细节（SQL、HTTP状态码、CSS类名）不出现在PRD中
3. 可以用完全不同的技术栈重新实现所有功能（验证契约有效性）
4. 所有现有E2E测试继续通过（行为契约不变）
