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

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server

# Testing
node test-api.js  # Run API integration tests (manual test script)
```

## Project Structure

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS with custom theme
- **Package Manager**: pnpm
- **Database**: In-memory placeholder data (see `app/lib/placeholder-data.ts`)

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

// Internal imports with @ alias
import { User } from '@/app/lib/definitions';
import { findUserByNickname } from '@/app/lib/auth';
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
- Current implementation uses in-memory data
- Data structures defined in `definitions.ts`
- Use placeholder data for development
- Database operations in `app/lib/` directory

### Authentication
- Custom auth implementation (not NextAuth)
- User validation in `app/lib/auth.ts`
- Password handling (currently plaintext - should be hashed in production)
- Session management via tokens/cookies

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
- Manual API testing via `test-api.js`
- No automated test framework currently set up
- Test API endpoints before deployment
- Verify authentication flows

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
- This is a development/demo application
- Database is in-memory and resets on restart
- Authentication is simplified for demo purposes
- Production deployment requires security hardening
