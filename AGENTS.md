<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Agent Instructions

This file contains guidelines for AI agents working in this repository.

## Project Context

### Purpose
Be.run（Agile Person Manage）是一个个人敏捷项目管理系统，基于《人人都是产品经理》理念，将生活中所有事务产品化管理。

核心功能模块包括：
- **任务管理**：支持习惯(Habit)、日常任务(Daily)、待办事项(Todo)三种任务类型
- **项目管理**：支持 sprint-project | slow-burn 两种项目类型，包含目标、标签、指标追踪
- **需求管理**：描述功能、用户角色、优先级、截止时间、故事点
- **缺陷管理**：针对代码项目，记录标题、严重程度、状态、关联仓库信息
- **奖励机制**：基于积分、徽章、等级、兑换的激励系统

### 架构哲学：契约驱动开发（Contract-Driven Development）

本项目采用**极端契约驱动**的架构模式，代码实现极度黑盒化，通过**输入契约**（产品需求）和**输出契约**（E2E 测试）来定义系统：

```
📥 输入契约 (apps/docs)  →  🔄 实现层 (apps/web)  →  📤 输出契约 (apps/e2e)
   OpenSpec PRD            AI 生成/可替换代码        六维 E2E 测试验证
```

**六维 E2E 契约体系**：
| 维度 | 目录 | 验证目标 |
|:---:|:---|:---|
| 🎯 functional | `e2e/tests/functional/` | 用户场景、业务流程 |
| ⚡ performance | `e2e/tests/performance/` | 响应时间、并发能力 |
| 🔒 security | `e2e/tests/security/` | SQL 注入、XSS、认证安全 |
| ♿ accessibility | `e2e/tests/accessibility/` | WCAG 标准、无障碍 |
| 📋 contract | `e2e/tests/contract/` | API Schema、类型验证 |
| 💥 chaos | `e2e/tests/chaos/` | 故障注入、容错恢复 |

## Technology Stack

### 核心框架
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.7 (strict mode enabled)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4
- **Package Manager**: pnpm (workspace monorepo)

### 数据库与存储
- **Database**: PostgreSQL 16 (via `postgres` npm package)
- **Session**: Cookie-based JWT tokens
- **File Storage**: Local filesystem (uploads)

### 编辑器与富文本
- **Rich Text**: TipTap editor with extensions
  - `@tiptap/starter-kit`
  - `@tiptap/extension-table`
  - `@tiptap/extension-task-list`
  - `@tiptap/extension-placeholder`
  - `@tiptap/extension-code-block-lowlight`

### 测试框架
- **Unit/Integration**: Vitest 4.x with jsdom
- **E2E**: Playwright 1.49
- **Testing Library**: `@testing-library/react` + `@testing-library/jest-dom`

### 其他依赖
- **Authentication**: bcrypt (password hashing) + custom JWT implementation
- **Validation**: Zod
- **Data Fetching**: SWR
- **Icons**: @heroicons/react
- **Forms**: @tailwindcss/forms

## Project Structure

```
├── apps/
│   ├── web/                  # Next.js 15 主应用（App Router）
│   │   ├── app/
│   │   │   ├── api/          # API Routes (Route Handlers)
│   │   │   │   ├── auth/     # 认证相关 API
│   │   │   │   ├── projects/ # 项目管理 API
│   │   │   │   ├── tasks/    # 任务管理 API
│   │   │   │   ├── requirements/ # 需求管理 API
│   │   │   │   ├── defects/  # 缺陷管理 API
│   │   │   │   ├── todos/    # 待办事项 API
│   │   │   │   ├── habits/   # 习惯管理 API
│   │   │   │   ├── daily-tasks/ # 日常任务 API
│   │   │   │   └── init-db/  # 数据库初始化 API
│   │   │   ├── dashboard/    # 仪表盘页面路由
│   │   │   │   ├── overview/     # 概览页
│   │   │   │   ├── project/      # 项目详情
│   │   │   │   ├── task/         # 任务管理
│   │   │   │   ├── tasks/        # 任务列表
│   │   │   │   ├── habits/       # 习惯管理
│   │   │   │   ├── dailies/      # 日常任务
│   │   │   │   ├── todos/        # 待办事项
│   │   │   │   ├── requirement/  # 需求管理
│   │   │   │   ├── defect/       # 缺陷管理
│   │   │   │   ├── rewards/      # 奖励系统
│   │   │   │   └── setting/      # 设置
│   │   │   ├── lib/          # 工具函数与数据操作
│   │   │   │   ├── db.ts         # 数据库操作（核心）
│   │   │   │   ├── definitions.ts # TypeScript 类型定义
│   │   │   │   ├── auth.ts       # 认证逻辑（纯函数）
│   │   │   │   ├── auth-db.ts    # 认证数据库操作
│   │   │   │   ├── auth-cookie.ts # Cookie 操作
│   │   │   │   ├── tasks.ts      # 任务业务逻辑
│   │   │   │   ├── projects.ts   # 项目业务逻辑
│   │   │   │   ├── requirements.ts # 需求业务逻辑
│   │   │   │   └── i18n/         # 国际化
│   │   │   ├── ui/           # UI 组件库
│   │   │   │   ├── dashboard/    # 仪表盘专用组件
│   │   │   │   ├── habits/       # 习惯相关组件
│   │   │   │   ├── tasks/        # 任务相关组件
│   │   │   │   └── icons/        # 图标组件
│   │   │   ├── layout.tsx    # 根布局
│   │   │   └── page.tsx      # 登录页
│   │   ├── tests/
│   │   │   ├── unit/         # 单元测试
│   │   │   ├── integration/  # 集成测试
│   │   │   ├── e2e/          # E2E 测试（Playwright）
│   │   │   ├── utils.tsx     # 测试工具函数
│   │   │   └── vitest-setup.ts # 测试初始化
│   │   ├── e2e/              # Playwright E2E 测试目录
│   │   ├── public/           # 静态资源
│   │   ├── middleware.ts     # Next.js 中间件（路由保护）
│   │   ├── next.config.ts    # Next.js 配置
│   │   ├── tailwind.config.ts # Tailwind 配置
│   │   ├── vitest.config.ts  # Vitest 配置
│   │   ├── playwright.config.ts # Playwright 配置
│   │   └── UI_DESIGN_SPEC.md # UI 设计规范文档
│   │
│   ├── docs/                 # VitePress 产品设计文档站
│   │   ├── .vitepress/       # VitePress 配置
│   │   └── (Markdown PRD 文件)
│   │
│   └── e2e/                  # 独立 E2E 测试工作区
│       ├── tests/
│       │   ├── functional/   # 功能测试
│       │   ├── performance/  # 性能测试
│       │   ├── security/     # 安全测试
│       │   ├── accessibility/# 无障碍测试
│       │   ├── contract/     # API 契约测试
│       │   └── chaos/        # 混沌测试
│       └── playwright.config.ts
│
├── packages/
│   └── product-designs/      # PRD、i18n 等产品设计内容
│       ├── product/          # 产品需求文档
│       └── (日期命名的变更目录)
│
├── openspec/                 # OpenSpec 规范目录
│   ├── project.md            # 项目规范
│   ├── changes/              # 活跃变更
│   ├── specs/                # 能力规格
│   └── AGENTS.md             # OpenSpec 专用指南
│
├── docker-compose.yml        # PostgreSQL 服务定义
├── pnpm-workspace.yaml       # pnpm workspace 配置
└── package.json              # 根 package.json（脚本委托）
```

## Build & Development Commands

### 根目录命令（pnpm workspace）

```bash
# 开发服务器
pnpm dev              # 启动 web 应用开发服务器 (带 4GB Node 内存限制)
pnpm dev:turbo        # 使用 Turbopack 启动开发服务器
pnpm dev:docs         # 启动文档站开发服务器
pnpm dev:all          # 同时启动 web + Chrome DevTools

# 构建
pnpm build            # 构建主应用（委托到 apps/web）
pnpm build:docs       # 构建文档站

# 生产运行
pnpm start            # 启动主应用生产服务

# 其他
pnpm docker-build     # Docker 构建
pnpm docs:reorganize  # 重组 PRD 文档
```

### apps/web 专用命令

```bash
# 开发
pnpm --filter web dev
pnpm --filter web dev:turbo

# 构建与启动
pnpm --filter web build
pnpm --filter web start

# 测试
pnpm --filter web test              # 运行所有 Vitest 测试
pnpm --filter web test:unit         # 仅单元测试
pnpm --filter web test:integration  # 仅集成测试
pnpm --filter web test:e2e          # Playwright E2E 测试
pnpm --filter web test:all          # Vitest + Playwright
pnpm --filter web test:watch        # 监听模式
```

### apps/e2e 专用命令

```bash
pnpm --filter e2e test              # 运行所有 E2E 测试
pnpm --filter e2e test:web          # 仅测试 web 应用
pnpm --filter e2e test:docs         # 仅测试 docs 应用
pnpm --filter e2e test:install      # 安装 Playwright 浏览器
```

### 验证命令（OpenSpec）

```bash
pnpm verify             # 验证当前变更
pnpm verify:ui          # UI 模式验证
pnpm verify:all         # 验证所有
pnpm verify:incremental # 增量验证
pnpm verify:full        # 完整验证
pnpm verify:list        # 列出待验证项
```

### 代码质量检查（Lint & TypeCheck）

apps/web 项目已配置 ESLint 和 Prettier，每次文件修改后会自动运行检查：

```bash
# 手动运行代码检查
pnpm --filter web lint          # ESLint 检查
pnpm --filter web lint:fix      # ESLint 自动修复
pnpm --filter web typecheck     # TypeScript 类型检查
pnpm --filter web format        # Prettier 格式化
pnpm --filter web check         # 运行所有检查

# 根目录快捷命令
pnpm lint                       # 检查 apps/web
pnpm lint:fix                   # 自动修复 apps/web
pnpm typecheck                  # 类型检查 apps/web
```

**自动代码质量检查**:  
项目配置了 opencode plugin（`.opencode/plugins/post-edit-hook-lite.ts`），每次文件修改后会自动运行：
- 代码格式化 (Prettier)
- Lint 检查 (ESLint)
- TypeScript 类型检查

如果发现问题，会自动尝试修复。需要手动修复的问题会在终端显示。

## Environment Setup

### 必需环境变量

创建 `.env` 文件于项目根目录：

```bash
# PostgreSQL 数据库连接（必需）
# 本地 Docker 使用：
POSTGRES_URL=postgresql://agile_user:agile_password@localhost:5432/agile_person_manage

# 认证密钥（生成：openssl rand -base64 32）
AUTH_SECRET=your-secret-key-here
AUTH_URL=http://localhost:3000/api/auth
```

### 启动 PostgreSQL（Docker）

```bash
docker-compose up -d postgres
```

### 数据库初始化

首次启动需要初始化数据库表：

```bash
# 访问初始化端点
curl http://localhost:3000/api/init-db
```

或使用提供的 seed 数据：
```bash
curl http://localhost:3000/api/seed
```

## Code Style Guidelines

### TypeScript & Types
- 使用 strict TypeScript 配置
- 类型定义统一放在 `app/lib/definitions.ts`
- 使用 Zod 进行运行时验证
- 函数优先使用显式返回类型

### Import Organization
```typescript
// 1. 外部库
import { NextRequest, NextResponse } from 'next/server';
import Link from 'next/link';

// 2. 内部导入（使用 @ 别名，指向 apps/web 根目录）
import { User } from '@/app/lib/definitions';
import { findUserByNickname } from '@/app/lib/auth-db';
import { Button } from '@/app/ui/button';
```

### File Naming
- **Components**: PascalCase (e.g., `SideNav.tsx`, `TaskCard.tsx`)
- **Utilities**: camelCase (e.g., `auth.ts`, `db.ts`)
- **API Routes**: `route.ts` 放在对应目录结构下
- **Pages**: Next.js 约定（`page.tsx`, `layout.tsx`）

### Component Patterns
- 使用函数组件 + React Hooks
- 页面/组件默认导出
- 使用 TypeScript props 接口
- Tailwind CSS 优先（utility-first）

### API Route Structure
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 1. 参数验证
    // 2. 业务逻辑
    // 3. 返回响应
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
```

### Styling Guidelines
- 使用 Tailwind CSS 工具类（参考 `UI_DESIGN_SPEC.md`）
- 自定义颜色在 `tailwind.config.ts` 定义
- 响应式设计采用移动优先
- 使用语义化 HTML 元素

**核心设计规范**：
- 主色调：Indigo/Blue 渐变 (`from-indigo-500 to-blue-500`)
- 状态色：Emerald（正常）、Amber（有风险）、Rose（失控）
- 容器圆角：`rounded-2xl`
- 容器阴影：`shadow-lg shadow-slate-200/50`
- 动画时长：300-500ms

### Error Handling
- API 路由使用 try-catch 块
- 统一错误响应格式：`{ success: false, message: string }`
- 记录错误日志用于调试
- 处理前验证输入参数

### Database & Data
- 所有业务数据持久化于 PostgreSQL
- 数据库操作集中在 `app/lib/db.ts`
- 无内存回退；数据库不可用时返回 503 错误
- 使用 `postgres` 包进行原始 SQL 操作

### Authentication
- 自定义认证实现（非 NextAuth）
- 密码使用 bcrypt 哈希
- Session 通过 JWT token + Cookie 管理
- 受保护路由在 `middleware.ts` 中配置

## Testing Guidelines

### 测试分层

| 类型 | 目录 | 工具 | 目标 |
|:---|:---|:---|:---|
| 单元测试 | `tests/unit/` | Vitest | 工具函数、纯逻辑 |
| 集成测试 | `tests/integration/` | Vitest | 组件交互、API 组合 |
| E2E 测试 | `apps/e2e/tests/` | Playwright | 完整用户流程 |

### 单元测试示例

```typescript
import { describe, it, expect } from 'vitest';
import { validateNickname } from '@/app/lib/auth';

describe('auth.ts', () => {
  describe('validateNickname', () => {
    it('应拒绝空昵称', () => {
      expect(validateNickname('').valid).toBe(false);
    });
    
    it('应接受有效中文昵称', () => {
      expect(validateNickname('测试用户').valid).toBe(true);
    });
  });
});
```

### 组件测试示例

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/app/ui/button';

describe('Button', () => {
  it('应正确渲染按钮文字', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });
});
```

### E2E 测试类别

- **functional/**: 用户场景、业务流程
- **performance/**: 加载时间、响应指标
- **security/**: 认证绕过、注入攻击、XSS
- **accessibility/**: 键盘导航、ARIA 标签、对比度
- **contract/**: API 响应格式、类型一致性
- **chaos/**: 网络故障、超时处理

### 测试工具函数

`tests/utils.tsx` 提供：
- `simulateInput` - 模拟输入
- `simulateClick` - 模拟点击
- `simulateKeyPress` - 模拟按键
- `waitForLoadingToFinish` - 等待加载完成
- `mockApiResponse` / `mockApiError` - Mock API

### 测试配置

- Vitest: `vitest.config.ts`
- Playwright (web): `playwright.config.ts` (apps/web)
- Playwright (e2e): `apps/e2e/playwright.config.ts`
- 测试初始化: `tests/vitest-setup.ts`

### 运行测试前

```bash
# 安装 Playwright 浏览器（首次）
pnpm exec playwright install chromium

# 确保数据库运行
docker-compose up -d postgres
```

## OpenSpec Workflow

本项目使用 OpenSpec 进行规范驱动开发。

### 何时创建提案

**需要提案**：
- 添加新功能
- 破坏性变更
- 架构调整
- 性能优化
- 安全更新

**跳过提案**：
- Bug 修复
- 错别字/格式
- 依赖更新
- 配置调整
- 测试

### 三阶段工作流

1. **创建提案** (`openspec/changes/<change-id>/`)
   - `proposal.md` - 变更描述
   - `tasks.md` - 实现清单
   - `design.md` - 技术设计（可选）
   - `specs/<capability>/` - delta 规格文件

2. **实现变更**（需用户审批后）
   - 按 tasks.md 顺序实现
   - 完成后标记 `- [x]`

3. **归档变更**（部署后）
   ```bash
   openspec archive <change-id> --yes
   ```

### 常用命令

```bash
openspec list                   # 活跃变更列表
openspec list --specs           # 规格列表
openspec show <item>            # 查看详情
openspec validate <id> --strict # 严格验证
openspec archive <id> --yes     # 归档变更
```

## Language & Localization

- UI 和错误消息使用中文
- 代码注释使用中文
- UTF-8 编码
- 国际化配置在 `app/lib/i18n/`

## Security Considerations

- 不在代码中提交敏感数据
- 使用环境变量管理密钥
- 生产环境密码使用 bcrypt 哈希
- 验证所有用户输入
- SQL 使用参数化查询（`postgres` 包自动处理）
- 受保护路由在 middleware 中统一处理

## Performance Notes

- 使用 Next.js 内置优化
- 图片使用 Next.js Image 组件
- 考虑大数据列表的虚拟滚动
- API 响应使用适当缓存策略
- 数据库查询添加索引（如需）

## Docker Support

### Web 应用

```bash
# 构建镜像
pnpm docker-build

# 或使用 Dockerfile
docker build -f apps/web/Dockerfile -t agile-web .
```

### 文档站

```bash
docker build -f apps/docs/Dockerfile -t agile-docs .
docker run -p 8080:80 agile-docs
```

## Important Notes

1. **数据库必需**: 必须配置 `POSTGRES_URL` 才能运行应用
2. **初始化**: 首次访问需要调用 `/api/init-db` 创建表
3. **认证**: 默认访问 `/dashboard` 需要登录
4. **测试**: 所有变更必须通过测试验证
5. **E2E**: E2E 测试会启动独立 web 服务器，确保端口 3000 可用
6. **自动代码质量检查**: 项目配置了 opencode plugin，每次文件修改后会自动运行：
   - 代码格式化 (Prettier)
   - Lint 检查 (ESLint)
   - TypeScript 类型检查
   - 详见 `.opencode/plugins/post-edit-hook-lite.ts`
