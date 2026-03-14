# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

个人敏捷项目管理系统 (Agile Person Manage) — a full-stack personal project management app with gamification. Built on a "Contract-Driven Development" philosophy: docs (input contract) + tests (output contract) define the system; code is a replaceable implementation.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript (strict)
- **Monorepo**: pnpm workspaces (apps/web, apps/docs, apps/e2e, packages/product-designs)
- **Database**: PostgreSQL via `postgres` driver (direct SQL, no ORM)
- **Auth**: JWT cookie-based (bcrypt, HTTP-only cookies `auth_access_token`/`auth_refresh_token`); NextAuth v5 available
- **Styling**: Tailwind CSS 3 + @tailwindcss/forms, glassmorphism design
- **Data Fetching**: SWR
- **Rich Text**: TipTap editor with extensions (tables, code blocks, task lists)
- **i18n**: Custom dictionary-based system at `app/lib/i18n/` (zh/en/ja)
- **Testing**: Vitest (unit/integration) + Playwright (E2E, six-dimension)
- **Docs**: VitePress consuming PRDs from `packages/product-designs/`

## Common Commands

```bash
# Development
pnpm dev                          # Start web app (localhost:3000)
pnpm dev:turbo                    # Start with Turbopack
pnpm dev:docs                     # Start docs (VitePress)
pnpm build                        # Build web app (standalone output)

# Quality checks
pnpm lint                         # Run ESLint
pnpm lint:fix                     # Fix lint issues
pnpm format                       # Format with Prettier
pnpm typecheck                    # TypeScript check
pnpm check                        # Full check (typecheck + lint + format)

# Database
docker-compose up -d postgres     # Start PostgreSQL
# Then visit /seed or call /api/init-db to initialize tables

# Testing
pnpm --filter web test            # Run all unit/integration tests
pnpm --filter web test:unit       # Unit tests only
pnpm --filter web test:integration # Integration tests only
pnpm --filter web test:watch      # Watch mode
pnpm --filter e2e test            # All E2E tests (6 dimensions)
pnpm --filter e2e test --project=functional  # Specific E2E dimension

# Single test file
pnpm --filter web vitest run tests/unit/utils.test.ts

# OpenSpec (change management)
openspec list                     # List active changes
openspec list --specs             # List specifications
openspec validate <change> --strict # Validate a change
openspec archive <change> --yes   # Archive after deployment
```

## Architecture

### API Layer
RESTful routes at `apps/web/app/api/`. Pattern: `app/api/{resource}/route.ts` and `app/api/{resource}/[id]/route.ts`. All responses follow `{ success: boolean, message?: string, data?: T }`.

### Database
All SQL in `apps/web/app/lib/db.ts` (large file, 1000+ lines). Direct SQL via tagged template literals with the `postgres` driver. Tables: users, projects, tasks, requirements, defects, todos, task_history, habit_records. Custom string IDs for tasks (`TASK-*`), requirements (`REQ-*`); UUIDs for users and projects. Heavy use of JSONB columns for flexible data (tags, sub_tasks, comments, history).

Database files:
- `db.ts` — Main database operations (production)
- `db-backend.ts` — Backend-specific DB utilities
- `db-memory.ts` — In-memory fallback (deprecated; do not use)

### Auth
Split across: `lib/auth.ts` (validation), `lib/auth-db.ts` (DB ops), `lib/auth-cookie.ts` (cookie mgmt), `lib/auth-storage.ts` (session). `middleware.ts` protects `/dashboard/*` routes.

### i18n
Dictionary-based internationalization at `app/lib/i18n/`. Supported locales: zh (default), en, ja. Entry point: `i18n/index.ts`. API messages separated in `api-messages.ts`.

### Type Definitions
All types in `apps/web/app/lib/definitions.ts`. Import with `@/app/lib/definitions`.

### UI Components
- `app/ui/` — Domain-specific components (tasks/, habits/, dashboard/)
- `app/components/ui/` — Shared base components
- Path alias: `@/*` maps to `apps/web/*`

### Business Modules
Projects (sprint-project / slow-burn) → Tasks (hobby/habit/task/desire types) → Requirements → Defects. Gamification layer: points, streaks, badges, levels, farming visualization.

### E2E Testing (apps/e2e/)
Six dimensions: functional, performance, security, accessibility, contract, chaos. Each is a Playwright project defined in `apps/e2e/playwright.config.ts`.

### OpenSpec (openspec/)
Spec-driven change management system. Specs in `openspec/specs/`, changes in `openspec/changes/`. Full workflow documented in `openspec/AGENTS.md`.
- **Creating**: Scaffold proposal.md, tasks.md, optional design.md, and spec deltas
- **Implementing**: Follow tasks.md checklist sequentially
- **Archiving**: Move to `changes/archive/YYYY-MM-DD-<change-id>/`

### MCP Servers
Development tools in `mcp-servers/`:
- `pencil-mcp/` — Design tool integration
- `chrome-devtools-mcp/` — Chrome DevTools integration

## Key Conventions

- **Language**: UI, docs, and comments are primarily in Chinese
- **Commit prefixes**: ✨ feat, 🐛 fix, 📝 docs, 🎨 style, ♻️ refactor, ⚡ perf, ✅ test, 🔧 chore
- **Import order**: external libs → `@/` internal → relative
- **Design tokens**: Indigo/Blue primary gradient, glassmorphism (`bg-white/90 backdrop-blur-md`), 4px grid
- **Fonts**: Noto Sans SC, Poppins, JetBrains Mono (via next/font/google)

## Environment Variables

Required: `POSTGRES_URL` (PostgreSQL connection string), `AUTH_SECRET` (JWT secret). See `.env.example`.
