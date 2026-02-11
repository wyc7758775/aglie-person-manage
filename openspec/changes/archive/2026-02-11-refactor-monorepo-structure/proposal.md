# Change: 将工程改为 Monorepo 结构，拆出产品设计与代码实现

## Why

当前仓库为单一体结构：Next.js 应用与产品设计文档（`product-designs/`）同处根目录，职责混在一起。希望把「产品设计」与「代码实现」在结构上分离，便于独立演进、权限与工具链区分，并符合「设计先行、实现跟进」的协作方式。改为 monorepo 后，可明确两个子应用的边界，并为后续可能的产品设计文档站点或设计系统预留扩展空间。

## What Changes

- 引入 **pnpm workspace** 作为 monorepo 管理方式，与现有 pnpm 使用一致。
- **应用层**：将现有 Next.js 应用迁入 `apps/web`，作为主应用「代码实现」；新增 **产品设计独立站** `apps/docs`，使用 **VitePress** 展示 `packages/product-designs` 的 PRD/i18n，支持 **Docker 部署**，便于在 NAS 上直接打开访问。
- **产品设计**：采用 **方案 B + 独立站**：内容放在 `packages/product-designs`（保留现有 Markdown 结构），由 `apps/docs`（VitePress）消费并生成静态站点；`apps/docs` 提供独立 Dockerfile（及可选 docker-compose），可在 NAS 等环境一键构建与运行。
- **根目录**：保留 `openspec/`、根级配置文件（如 `pnpm-workspace.yaml`）、Docker/CI 等；根 `package.json` 仅作 workspace 编排与根级脚本。
- **BREAKING**：仓库目录结构变更，所有基于根目录的路径（脚本、CI、文档中的路径）需同步更新。

## Impact

- **Affected specs**: 无既有功能 spec 直接依赖目录结构；新增能力 `repo-structure` 用于约定 monorepo 布局及产品设计独立站（VitePress + Docker）。
- **Affected code**: 全仓库路径与引用；`package.json`、`tsconfig.json`、Next 配置、Docker/CI、AGENTS.md；新增 `apps/docs`（VitePress 项目）及其 Dockerfile（可选 docker-compose 便于 NAS）。
- **Affected docs**: README、AGENTS.md、openspec/project.md 中关于项目结构、`apps/docs` 与 NAS 部署的说明。
