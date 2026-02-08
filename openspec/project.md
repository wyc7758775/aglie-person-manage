# 项目背景

## 目的
这个是一个可以提供个人用户使用的项目管理的系统，基于敏捷开发，将自己生活中的所有要做的事情产品化。以符合《人人都是产品经理》这本书的理念。

核心功能模块包括：
- **奖励展示**: 通过种田游戏来展示自己通过完成任务或者需求得到的能量，可以日渐扩大自己的农田和农庄
- **任务管理**：爱好、习惯、任务、欲望四种任务类型
- **项目管理**：支持 life | code 两种项目类型，包含目标与标签
- **需求管理**：描述功能、用户角色、优先级、开始时间、截止时间、子需求
- **缺陷管理**：针对代码项目，记录标题、严重程度、状态、关联仓库信息
- **奖励机制**：基于积分、徽章、等级、兑换的激励系统

## 技术栈
- next
- react
- TypeScript

## 项目规范

### 代码风格
- **TypeScript**：严格模式，类型定义放在 `app/lib/definitions.ts`
- **导入顺序**：外部库 → 内部 @ 别名导入 → 相对路径导入
- **文件命名**：组件 PascalCase，工具类 camelCase，页面 lowercase with hyphens
- **样式规范**：Tailwind CSS 优先
- **错误处理**：统一格式 `{ success: boolean; message: string }`

### 架构模式
- **Monorepo**：pnpm workspace；主应用 `apps/web`，产品设计文档站 `apps/docs`（VitePress），产品设计内容 `packages/product-designs`；各应用 Dockerfile 位于对应 app 目录（如 `apps/web/Dockerfile`），文档站支持 Docker 部署（如 NAS）。
- **App Router**：Next.js App Router 使用 `app/` 目录结构（主应用在 `apps/web/app/`）
- **API 路由**：RESTful 风格，位于 `app/api/[resource]/route.ts`
- **组件组织**：公共组件在 `app/ui/`，仪表盘组件在 `app/ui/dashboard/`
- **数据层**：工具函数在 `app/lib/`，类型定义在 `app/lib/definitions.ts`

### 测试策略
- **手动测试**：通过 `node test-api.js` 进行 API 测试
- **构建验证**：部署前运行 `pnpm build`

### Git 工作流
- **分支策略**：`main`（生产）、`feature/*`（新功能）、`fix/*`（修复）
- **提交格式**：`type(scope): description`

## 领域知识
- **任务类型**：爱好 (Hobby)、习惯 (Habit)、任务 (Task)、欲望 (Desire)
- **项目类型**：生活 (life)、代码 (code)
- **积分规则**：日常任务 +1分/个(上限6分)、番茄钟 +1分/个(上限4分)、连续打卡7天 +5分、30天 +20分、周完成率≥60% +3分
- **奖励设计**：积分(成长值)、徽章(里程碑)、等级(每100分升1段)、兑换(奖赏清单)

## 数据层约定
- **全部业务数据**：用户、项目、任务、需求、缺陷、用户积分均使用 PostgreSQL 持久化；需在 `.env` 中配置 `POSTGRES_URL`，未配置或数据库不可用时接口将返回明确错误（如 503），不再使用内存回退。
- **placeholder-data**：仅作为种子数据定义（如 seed 路由或示例），运行时不得作为数据源。

## 重要约束
- 用户密码必须哈希存储（如 bcrypt），禁止明文落库
- 未配置自动化测试

## 外部依赖
- **PostgreSQL**：数据库（通过 `POSTGRES_URL` 配置）
- **Heroicons**：图标库 (`@heroicons/react`)
- **Zod**：运行时验证
- **bcrypt**：密码哈希（已安装）
- **NextAuth**：认证（v5.0.0-beta.25 可用）
