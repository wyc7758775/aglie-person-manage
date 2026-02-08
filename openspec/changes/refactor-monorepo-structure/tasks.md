# 实施任务（方案 B + 独立站：apps/web + packages/product-designs + apps/docs）

## 1. 初始化 Monorepo

- [x] 1.1 在仓库根目录新增 `pnpm-workspace.yaml`，定义 `apps/*` 与 `packages/*`。
- [x] 1.2 备份或记录当前根目录 `package.json` 的 scripts、dependencies、devDependencies；准备拆分为根 package（仅 workspace 脚本）与 `apps/web` 的 package。

## 2. 迁移主应用至 apps/web

- [x] 2.1 创建 `apps/web` 目录。
- [x] 2.2 将 `app/`、`public/`、`next.config.ts`、`tsconfig.json`、`tailwind.config.ts`、`postcss.config.*`、`manifest.json` 等 Next 应用相关文件与目录移入 `apps/web/`。
- [x] 2.3 在 `apps/web/` 下创建 `package.json`，使用与当前项目一致的 name（或 `web`），迁移依赖与脚本（build、dev、start 等）；确保 `apps/web` 可独立 `pnpm install` 与 `pnpm build`。
- [x] 2.4 调整 `apps/web` 内 tsconfig 的路径与 include（如有引用根目录的，改为相对或 workspace 引用）。
- [x] 2.5 将**根目录现有 Dockerfile** 迁入 `apps/web/Dockerfile`（或新建 `apps/web/Dockerfile`，内容以构建 apps/web 为准，构建上下文为仓库根）；从根目录删除已迁移的文件与目录（保留 openspec、.cursor、.gitignore、docker-compose 等根级资产，根目录不再保留主应用 Dockerfile）。

## 3. 根 package.json 与脚本

- [x] 3.1 将根目录 `package.json` 改为 workspace 根：保留 `private: true`、`scripts` 中通过 `pnpm --filter web` 或 `-r` 调用的命令，移除业务依赖。
- [x] 3.2 确保根目录执行 `pnpm dev` 或 `pnpm build` 能正确委托到 `apps/web`（或通过 `pnpm --filter web dev` 等）。

## 4. 迁移产品设计至 packages/product-designs

- [x] 4.1 创建 `packages/product-designs` 目录。
- [x] 4.2 将现有 `product-designs/` 下所有内容（README.md、各需求子目录）移入 `packages/product-designs/`。
- [x] 4.3 删除根目录下的 `product-designs/`。

## 5. 产品设计独立站 apps/docs（VitePress + Docker）

- [x] 5.1 创建 `apps/docs` 目录，使用 pnpm 在 workspace 内初始化 VitePress 项目（`pnpm create vitepress` 或手动搭骨架），`package.json` 的 name 为 `docs`，依赖 workspace 根安装。
- [x] 5.2 配置 VitePress（`vitepress.config.ts`）：将文档内容源指向 `packages/product-designs`（如通过 `srcDir`、`contentDir` 或符号链接/复制到 `apps/docs/docs`），使 PRD/i18n 的 Markdown 被渲染；配置侧栏与导航，形成按「需求名-日期」的索引与子页。
- [x] 5.3 在 `apps/docs` 下添加 **Dockerfile**：多阶段构建——安装依赖（pnpm）、执行 `pnpm build`（VitePress 静态导出）、使用 Nginx（或 Node 静态服务）镜像提供对 `dist` 的 HTTP 服务；暴露端口（如 80 或 4173）。
- [x] 5.4 可选：在 `apps/docs` 或根目录提供 **docker-compose** 片段（或文档说明），便于在 NAS 上执行 `docker compose up` 后通过内网地址（如 `http://nas:8080`）打开产品设计站。
- [x] 5.5 根 `package.json` 中增加对 docs 的脚本（如 `pnpm --filter docs dev`、`pnpm --filter docs build`）；验证本地 `pnpm --filter docs build` 与 `docker build -f apps/docs/Dockerfile .` 成功。

## 6. Docker 与 CI（主应用 + 文档站）

- [x] 6.1 主应用使用 `apps/web/Dockerfile`（已在 2.5 迁入或新建）；构建时从仓库根执行，例如 `docker build -f apps/web/Dockerfile .`，确保镜像内能执行 pnpm workspace 安装及 `pnpm --filter web build`（或等效）。
- [x] 6.2 若有 `docker-compose.yml` 或 CI 配置（如 GitHub Actions），更新为使用 `-f apps/web/Dockerfile` 与 `-f apps/docs/Dockerfile`；如需在 CI 或 NAS 上同时构建文档站，增加对 `apps/docs` 的 Docker 构建或 `pnpm --filter docs build`。
- [x] 6.3 验证主应用 `docker build -f apps/web/Dockerfile .`（及 compose/CI）能成功构建并运行；验证文档站镜像可在 NAS 上运行并通过浏览器访问。

## 7. 文档与规范

- [x] 7.1 更新根目录 `README.md`：说明 monorepo 结构、`apps/web`、`packages/product-designs`、`apps/docs`（VitePress 产品设计站）的用途，以及如何安装依赖、开发/构建主应用与文档站，及 NAS 上通过 Docker 部署文档站的方式。
- [x] 7.2 更新 `AGENTS.md`（及 `.cursor` 下相关规则）：将「主应用在根目录」改为「主应用在 `apps/web`」，并更新构建/开发命令（如 `pnpm --filter web dev`、`pnpm --filter docs dev`）。
- [x] 7.3 更新 `openspec/project.md`：在项目规范或架构描述中反映 monorepo、`apps/web`、`apps/docs`、`packages/product-designs` 的布局及文档站 Docker 部署。
- [x] 7.4 更新 `packages/product-designs/README.md` 的路径说明（若其中有指向根目录的链接），使其在包内仍正确；可补充「由 `apps/docs` 渲染并在 NAS 上通过 Docker 访问」的说明。

## 8. UI 自动化测试（apps/web）

- [x] 8.1 在 `apps/web` 内引入 E2E 框架（推荐 Playwright 或 Cypress），作为 devDependencies；在 `apps/web` 下建立 `e2e/`（或 `tests/e2e/`）目录存放用例与配置。
- [x] 8.2 在 `apps/web/package.json` 中增加脚本（如 `test:e2e`），并确保可从根目录通过 `pnpm --filter web test:e2e` 运行；若有 CI，增加对 web E2E 的步骤（需先启动或指向已运行的主应用）。

## 9. 验证

- [x] 9.1 在根目录执行 `pnpm install`，确认无依赖错误。
- [x] 9.2 执行主应用构建（如 `pnpm --filter web build`），确认通过。
- [x] 9.3 执行主应用开发启动（如 `pnpm --filter web dev`），确认首页、登录、仪表盘及关键 API（如 `/api/init-db`）可用。
- [x] 9.4 执行文档站构建（`pnpm --filter docs build`）及文档站 Docker 构建并运行，确认可通过浏览器打开产品设计站（本地或 NAS 环境）。
- [x] 9.5 运行 `openspec validate refactor-monorepo-structure --strict`，确认本 change 通过校验。
