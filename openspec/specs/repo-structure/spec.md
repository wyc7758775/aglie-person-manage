# repo-structure Specification

## Purpose
TBD - created by archiving change refactor-monorepo-structure. Update Purpose after archive.
## Requirements
### Requirement: Monorepo 布局约定

仓库 SHALL 使用 pnpm workspace 组织为 monorepo：根目录为 workspace 根，可运行应用位于 `apps/` 下，共享或仅内容型资产位于 `packages/` 下；主业务应用（Next.js）SHALL 位于 `apps/web`，产品设计文档内容 SHALL 位于 `packages/product-designs`，且根目录 SHALL 保留 `openspec/`、根级 `package.json` 与 `pnpm-workspace.yaml`。

#### Scenario: 根目录为 workspace 根

- **GIVEN** 仓库已按本变更完成迁移
- **WHEN** 在根目录执行 `pnpm install`
- **THEN** 根据 `pnpm-workspace.yaml` 正确安装 `apps/*` 与 `packages/*` 的依赖，且根 `package.json` 不包含主应用的业务依赖

#### Scenario: 主应用位于 apps/web

- **GIVEN** 仓库为 monorepo 布局
- **WHEN** 开发者或 CI 需要构建或运行主 Next.js 应用
- **THEN** 通过 `pnpm --filter web build` 或进入 `apps/web` 执行 `pnpm build` 可成功构建，且构建产物对应主应用

#### Scenario: 产品设计内容位于 packages/product-designs

- **GIVEN** 仓库为 monorepo 布局
- **WHEN** 需要查阅或维护 PRD/i18n 等产品设计文档
- **THEN** 内容位于 `packages/product-designs/` 下，子目录命名遵循既有约定（如 `{需求名}-{YYYYMMDD}`），且该包不要求单独构建或运行

### Requirement: 产品设计独立站（VitePress + Docker）

产品设计文档 SHALL 通过独立站点对外提供浏览；该站点 SHALL 使用 VitePress 构建，消费 `packages/product-designs` 的 Markdown 内容，并 SHALL 提供基于 Docker 的构建与运行方式，以便在 NAS 等环境部署后通过浏览器直接打开访问。

#### Scenario: 文档站使用 VitePress 并消费 product-designs

- **GIVEN** 仓库已包含 `apps/docs` 与 `packages/product-designs`
- **WHEN** 在 monorepo 根目录执行 `pnpm --filter docs build`
- **THEN** VitePress 成功构建静态站点，且站点内容来源于或引用 `packages/product-designs` 下的 PRD/i18n Markdown

#### Scenario: 文档站支持 Docker 部署以便 NAS 访问

- **GIVEN** 存在 `apps/docs` 的 Dockerfile（及可选 docker-compose）
- **WHEN** 在 NAS 或本机执行该镜像的构建与运行（如 `docker build -f apps/docs/Dockerfile .` 后 `docker run`，或 `docker compose up`）
- **THEN** 容器内提供对 VitePress 静态产物的 HTTP 服务，用户可通过浏览器访问（如内网地址加端口）并浏览产品设计文档

