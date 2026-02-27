# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

个人敏捷项目管理系统 (Agile Person Manage) — a full-stack personal project management app with gamification. Built on a "Contract-Driven Development" philosophy: docs (input contract) + tests (output contract) define the system; code is a replaceable implementation.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript (strict)
- **Monorepo**: pnpm workspaces (apps/web, apps/docs, apps/e2e, packages/product-designs)
- **Database**: PostgreSQL via `postgres` driver (direct SQL, no ORM)
- **Auth**: JWT cookie-based (bcrypt, HTTP-only cookies `auth_access_token`/`auth_refresh_token`)
- **Styling**: Tailwind CSS 3 + @tailwindcss/forms, glassmorphism design
- **Data Fetching**: SWR
- **Testing**: Vitest (unit/integration) + Playwright (E2E, six-dimension)
- **Docs**: VitePress consuming PRDs from `packages/product-designs/`

## Common Commands

```bash
# Development
pnpm dev                          # Start web app (localhost:3000)
pnpm dev:turbo                    # Start with Turbopack
pnpm dev:docs                     # Start docs (VitePress)
pnpm build                        # Build web app (standalone output)

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
```

## Architecture

### API Layer
RESTful routes at `apps/web/app/api/`. Pattern: `app/api/{resource}/route.ts` and `app/api/{resource}/[id]/route.ts`. All responses follow `{ success: boolean, message?: string, data?: T }`.

### Database
All SQL in `apps/web/app/lib/db.ts` (large file). Direct SQL via tagged template literals with the `postgres` driver. Tables: users, projects, tasks, requirements, defects, todos, task_history, habit_records. Custom string IDs for tasks (`TASK-*`), requirements (`REQ-*`); UUIDs for users and projects. Heavy use of JSONB columns for flexible data (tags, sub_tasks, comments, history).

### Auth
Split across: `lib/auth.ts` (validation), `lib/auth-db.ts` (DB ops), `lib/auth-cookie.ts` (cookie mgmt), `lib/auth-storage.ts` (session). `middleware.ts` protects `/dashboard/*` routes.

### Type Definitions
All types in `apps/web/app/lib/definitions.ts`. Import with `@/app/lib/definitions`.

### UI Components
- `app/ui/` — Domain-specific components (tasks/, habits/, dashboard/)
- `app/components/ui/` — Shared base components
- Path alias: `@/*` maps to `apps/web/*`

### Business Modules
Projects (sprint-project / slow-burn) → Tasks (hobby/habit/task/desire types) → Requirements → Defects. Gamification layer: points, streaks, badges, levels, farming visualization.

### E2E Testing (apps/e2e/)
Six dimensions: functional, performance, security, accessibility, contract, chaos. Each is a Playwright project.

### OpenSpec (openspec/)
Change management system. Specs in `openspec/specs/`, changes in `openspec/changes/`. Workflow: create → draft proposal → write deltas → validate → implement → archive.

## Key Conventions

- **Language**: UI, docs, and comments are primarily in Chinese
- **Commit prefixes**: ✨ feat, 🐛 fix, 📝 docs, 🎨 style, ♻️ refactor, ⚡ perf, ✅ test, 🔧 chore
- **Import order**: external libs → `@/` internal → relative
- **Design tokens**: Indigo/Blue primary gradient, glassmorphism (`bg-white/90 backdrop-blur-md`), 4px grid
- **Fonts**: Noto Sans SC, Poppins, JetBrains Mono (via next/font/google)

## Environment Variables

Required: `POSTGRES_URL` (PostgreSQL connection string), `AUTH_SECRET` (JWT secret). See `.env.example`.
