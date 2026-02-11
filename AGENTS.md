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

# 任何回答和生成的文档都使用中文回复我

# Agent Instructions

This file contains guidelines for AI agents working in this repository.

## Project Context

### Purpose
这个是一个可以提供个人用户使用的项目管理的系统，基于敏捷开发，将自己生活中的所有要做的事情产品化。以符合《人人都是产品经理》这本书的理念。

核心功能模块包括：
- **任务管理**：爱好、习惯、任务、欲望四种任务类型
- **项目管理**：支持 life | code 两种项目类型，包含目标与标签
- **需求管理**：描述功能、用户角色、优先级、截止时间
- **缺陷管理**：针对代码项目，记录标题、严重程度、状态、关联仓库信息
- **奖励机制**：基于积分、徽章、等级、兑换的激励系统

### Tech Stack
- next
- react
- TypeScript

## Build & Development Commands

本仓库为 **pnpm workspace** 的 monorepo：主应用在 `apps/web`，产品设计文档站在 `apps/docs`，产品设计内容在 `packages/product-designs`。

```bash
# 在仓库根目录
pnpm install      # 安装所有 workspace 依赖
pnpm dev          # 启动主应用开发服务器（委托到 apps/web）
pnpm build        # 构建主应用
pnpm start        # 启动主应用生产服务

pnpm dev:docs     # 启动产品设计文档站（VitePress）
pnpm build:docs   # 构建产品设计文档站

# 仅主应用
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web test:e2e  # E2E 仅测 web

# Testing
node test-api.js  # API 手动测试（需在 apps/web 或根目录配置）
```

## Project Structure

- **apps/web**：Next.js 15 主应用（App Router），业务代码与 E2E 测试（`e2e/`）在此。
- **apps/docs**：VitePress 产品设计文档站，消费 `packages/product-designs`，可 Docker 部署（如 NAS）。
- **packages/product-designs**：PRD、i18n 等 Markdown 内容，目录约定 `{需求名}-{YYYYMMDD}`。
- **Framework**: Next.js 15 with App Router（主应用）
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS with custom theme
- **Package Manager**: pnpm (workspace)
- **Database**: PostgreSQL；需配置 `POSTGRES_URL`，所有业务数据持久化于数据库（见 `apps/web/app/lib/db.ts`）

## Code Style Guidelines

### TypeScript & Types
- Use strict TypeScript configuration
- Define types in `app/lib/definitions.ts`
- Use Zod for runtime validation when needed
- Prefer explicit return types for functions

### Import Organization
```typescript
// External libraries first
import { NextRequest, NextResponse } from 'next/server';
import Link from 'next/link';

// Internal imports with @ alias（主应用在 apps/web 内，@ 指向 apps/web 根）
import { User } from '@/app/lib/definitions';
import { findUserByNickname } from '@/app/lib/auth-db';
```

### File Naming
- Components: PascalCase (e.g., `SideNav.tsx`)
- Utilities: camelCase (e.g., `auth.ts`)
- Pages: lowercase with hyphens (Next.js convention)
- API routes: `route.ts` in directory structure

### Component Patterns
- Use functional components with React hooks
- Export as default for pages/components
- Use proper TypeScript props interfaces
- Follow Tailwind CSS utility-first approach

### API Route Structure
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validation logic
    // Business logic
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
```

### Error Handling
- Use try-catch blocks in API routes
- Return consistent error response format
- Log errors for debugging
- Validate inputs before processing

### Styling Guidelines
- Use Tailwind CSS utilities exclusively
- Custom colors defined in `tailwind.config.ts`
- Responsive design with mobile-first approach
- Use semantic HTML elements

### Database & Data
- All business data (users, projects, tasks, requirements, defects, user points) persisted in PostgreSQL; configure `POSTGRES_URL` in `.env`
- Data structures defined in `definitions.ts`; database operations in `app/lib/db.ts`
- No in-memory fallback; unconfigured or unavailable DB returns explicit errors (e.g. 503)

### Authentication
- Custom auth implementation (not NextAuth)
- User lookup and registration in `app/lib/auth-db.ts` (database); pure helpers in `app/lib/auth.ts`
- Passwords hashed with bcrypt; session via tokens/cookies

## Language & Localization
- Chinese language support in UI and error messages
- UTF-8 encoding for Chinese characters
- Font optimization for Chinese text in `global.css`

## Security Notes
- Never commit sensitive data
- Use environment variables for secrets
- Implement proper password hashing in production
- Validate all user inputs

## Testing

本项目使用 **Vitest** 进行单元测试和集成测试，**Playwright** 进行 E2E 测试。

### 测试命令
```bash
# E2E 测试（独立工作区）
pnpm --filter e2e test          # 运行所有 E2E 测试
pnpm --filter e2e test:web      # 只测试 web 应用
pnpm --filter e2e test:docs     # 只测试 docs 应用

# 单元测试（web 应用）
pnpm test:unit                  # 运行所有单元测试
pnpm test:watch                 # 监听模式运行单元测试
pnpm test:integration           # 运行集成测试

# 全部测试
pnpm test                       # 运行所有测试（单元+集成）
```

### 测试目录结构
- **单元测试**: `apps/web/tests/unit/**/*.test.{ts,tsx}`
- **集成测试**: `apps/web/tests/integration/**/*.test.{ts,tsx}`
- **E2E 测试**: `apps/e2e/tests/**/*.spec.{ts,tsx}`

### 测试规范
- 所有工具函数需 100% 分支覆盖
- 组件需测试关键交互路径
- API 需覆盖成功和失败场景
- 关键用户流程需 E2E 测试

### 测试配置
- Vitest 配置: `vitest.config.ts`
- 测试初始化: `tests/vitest-setup.ts`
- 测试工具: `tests/utils.tsx`
- 测试指南: `apps/web/TESTING_GUIDE.md`

### 变更验证
- 所有变更实施后必须通过测试验证
- 测试失败时阻止变更标记为完成
- 失败的测试必须修复代码直至通过

### E2E 浏览器安装
```bash
pnpm exec playwright install chromium
```

## Performance
- Use Next.js built-in optimizations
- Implement proper caching strategies
- Optimize images and assets
- Consider code splitting for large applications

## Development Workflow
1. Create feature branch
2. Implement changes following style guidelines
3. Test manually with `test-api.js`
4. Build verification with `pnpm build`
5. Deploy and verify in production

## Important Notes
- Requires PostgreSQL; set `POSTGRES_URL` before running (e.g. via docker-compose)
- Run `/api/init-db` or seed to create tables and optional default users
- Production deployment requires security hardening
