# Monorepo 结构调整设计

## Context

- 当前：单仓库，根目录为 Next.js 应用（`app/`、`package.json` 等），`product-designs/` 为 Markdown 形态的 PRD/i18n 文档。
- 目标：monorepo，明确「产品设计」与「代码实现」两个子应用的边界；你提到「或者有其他的什么建议吗？」，本设计给出推荐与替代方案。

## Goals / Non-Goals

- **Goals**：用 pnpm workspace 形成 monorepo；主应用迁至 `apps/*`；product-designs 在结构上独立成「子应用」或「包」；构建、开发、部署路径清晰；文档与脚本更新一致。
- **Non-Goals**：不改变现有 Next.js 技术栈与业务功能；不改变 product-designs 的 Markdown 内容格式与目录约定。

## 方案对比与建议

### 方案 A：两个「可运行」子应用（apps/web + apps/product-designs）

- **apps/web**：现有 Next.js 应用整体迁入，为主应用。
- **apps/product-designs**：独立应用，用于展示产品设计（例如 Next.js 静态导出、或简单 MDX 文档站），可单独 `pnpm dev` / 部署。
- **优点**：产品设计与主应用完全对等，可独立部署、独立访问；适合需要对外或对内展示 PRD 的场景。
- **缺点**：需为 product-designs 维护一套构建/部署；当前 product-designs 仅为 Markdown，若不做文档站则存在「空壳应用」的可能。

### 方案 B + 独立站（已采纳）：主应用 + 内容包 + VitePress 文档站

- **apps/web**：现有 Next.js 应用迁入，主应用。
- **packages/product-designs**：迁移现有 `product-designs/` 内容（目录与 README 约定保持不变），作为「内容包」供文档站消费。
- **apps/docs**：产品设计独立站，使用 **VitePress** 将 `packages/product-designs` 的 Markdown 渲染为静态站点；支持 **Docker 构建与运行**，便于在 NAS 上部署后通过浏览器直接打开访问。
- **优点**：内容与展示分离；VitePress 轻量、Markdown 友好；独立 Docker 镜像便于 NAS/内网部署，与主应用互不干扰。

## Decisions

- **Monorepo 工具**：pnpm workspace。理由：项目已用 pnpm，无需引入 Turborepo/Nx 等，除非后续有缓存/编排需求再考虑。
- **主应用路径**：`apps/web`。理由：命名通用；若后续有更多 app，可继续放在 `apps/`。
- **产品设计内容位置**：`packages/product-designs`，保留现有子目录命名（`{需求名}-{YYYYMMDD}`）与 README 约定。
- **产品设计独立站**：`apps/docs`，使用 **VitePress**。理由：与 Vue 生态一致、Markdown 与 frontmatter 支持好、静态导出简单，适合文档型站点；可依赖 workspace 包 `product-designs` 作为内容源（通过配置或符号链接引用）。
- **文档站部署**：为 `apps/docs` 提供独立 **Dockerfile**，构建 VitePress 静态产物并用 Nginx（或同类）提供 HTTP 服务；可选在仓库根或 `apps/docs` 下提供 **docker-compose** 片段，便于在 NAS 上一键构建、运行并暴露端口（如 8080），从而通过 NAS 内网地址直接打开。
- **Dockerfile 位置**：各应用的 Dockerfile 放在**该应用目录内**（`apps/web/Dockerfile`、`apps/docs/Dockerfile`），根目录不再保留主应用 Dockerfile。理由：与 docs 一致、归属清晰、根目录只保留 workspace 与可选 docker-compose；构建时从根目录指定上下文，例如 `docker build -f apps/web/Dockerfile .`。
- **UI 自动化测试（E2E）**：放在 **apps/web 内**（如 `apps/web/e2e/`），**仅针对 web 应用**，不单独新建 app，不覆盖 apps/docs。理由：被测对象即 web，就近维护；运行方式简单（如 `pnpm --filter web test:e2e`）；框架（Playwright/Cypress）作为 web 的 devDependencies 即可。
- **根 package.json**：仅保留 workspace 声明、根级脚本（如 `pnpm --filter web build`、`pnpm --filter docs build`）及不需要放入子包的工具配置；不重复声明业务依赖。

## 前端 UI 规范与设计系统放置建议

以下为建议，不强制写入本变更的 tasks；若采纳可在后续单独落地。

| 内容类型 | 建议位置 | 说明 |
|----------|----------|------|
| **UI 规范文档**（Button/Input 设计规范、主题色规范、间距与圆角等**设计决策**） | **packages/product-designs**（如 `设计系统-YYYYMMDD/` 或 `设计系统/` 下 prd.md、tokens.md） | 与 PRD、i18n 同源，版本化、可在 docs 站展示；作为「设计契约」单源，产品/设计可维护。 |
| **AI 按规范写 UI** | **Skill**（薄层） | Skill 中不复制整份规范，仅引用「实现 UI 时遵循 `packages/product-designs/设计系统-xxx` 或 AGENTS.md 中的设计系统章节」；规范正文仍在 product-designs，避免双份维护。 |
| **可被代码消费的 token**（主题色、间距、字体等**数值/变量**） | **仅 web 用 → apps/web**（Tailwind theme、CSS 变量、或 `app/lib/theme.ts`）；**多端共用 → packages/design-tokens** | 单应用时放 web 即可；若未来 docs 或其它 app 要共用一套主题，再抽成 `packages/design-tokens` 导出 CSS 变量或 TS 常量供 web 消费。 |
| **已实现的组件**（Button、Input 等代码） | **apps/web**（如 `app/ui/`） | 实现与业务同仓，直接使用上述 token；不推荐在 package 里再做一套 React 组件库，除非有明确多应用复用需求。 |
| **仅有设计大纲、尚未实现的组件** | **packages/product-designs**（在设计系统文档中列「组件清单」与状态：已实现/仅设计）；或 **packages/design-system** 的 `spec/`（仅 Markdown 规范，无组件代码） | 设计稿与规范放在 product-designs 或独立 design-system 包的 spec；web 按 spec 在 `apps/web/app/ui/` 实现。若采用 **packages/design-system**：可只放 token 代码 + 各组件 spec（markdown），由 web 消费 token 并按 spec 实现组件，避免「只设计未实现」的组件以代码形式占位。 |

**小结**：规范文档以 **product-designs** 为主、Skill 只做引用；token 与实现以 **web** 为主，多端再考虑 **packages/design-tokens** 或 **packages/design-system**（spec + token，组件实现仍在 web）。

## 目录结构（方案 B + 独立站目标）

```
/
├── pnpm-workspace.yaml
├── package.json                 # workspace 根
├── openspec/
├── apps/
│   ├── web/                     # Next.js 主应用（原根目录应用）
│   │   ├── app/
│   │   ├── public/
│   │   ├── e2e/                 # UI 自动化测试（Playwright/Cypress）
│   │   ├── Dockerfile           # 主应用镜像，构建上下文可为仓库根
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── ...
│   └── docs/                    # 产品设计独立站（VitePress）
│       ├── package.json
│       ├── vitepress.config.ts
│       ├── docs/                # VitePress 源（可引用 packages/product-designs）
│       ├── Dockerfile           # 静态构建 + Nginx，便于 NAS 部署
│       └── ...
├── packages/
│   └── product-designs/         # PRD/i18n 等内容（被 apps/docs 消费）
│       ├── README.md
│       └── {需求名}-{YYYYMMDD}/
│           ├── prd.md
│           └── i18n.md
└── ...                          # 根目录无 Dockerfile，可选 docker-compose.yml
```

## Risks / Trade-offs

- **路径与引用**：所有脚本、CI、Docker、文档中的路径需从「根即应用」改为「根为 monorepo、应用在 apps/web」。风险：遗漏处导致构建或文档错误。缓解：tasks 中逐项列出并验证。
- **openspec 位置**：保留在根目录，与 apps/packages 平级，便于全仓库共享；AGENTS.md 与 project.md 中路径需更新为「主应用在 apps/web」。

## Migration Plan

1. 在根目录添加 `pnpm-workspace.yaml`，定义 `apps/*`、`packages/*`。
2. 新建 `apps/web`，将当前 Next 应用相关文件与配置迁移过去；根 `package.json` 改为 workspace 根。
3. 新建 `packages/product-designs`，将 `product-designs/` 下所有内容迁移过去；删除根目录 `product-designs/`。
4. 新建 `apps/docs`：初始化 VitePress 项目，配置内容源指向或引用 `packages/product-designs`（如 theme 侧栏、Markdown 路径）；实现索引与各需求子目录的展示。
5. 为 `apps/docs` 编写 Dockerfile：多阶段构建（pnpm 安装 → VitePress build → 静态文件 + Nginx）；可选提供 docker-compose 或说明，便于 NAS 上暴露端口访问。
6. 将主应用 Dockerfile 置于 `apps/web/Dockerfile`（从根目录迁移或新建），构建上下文为仓库根；若有根级 docker-compose、CI，改为引用 `-f apps/web/Dockerfile` 与 `-f apps/docs/Dockerfile`；文档站单独镜像/服务。
7. 更新 README、AGENTS.md、openspec/project.md：说明 monorepo 结构、`apps/web`、`apps/docs`、`packages/product-designs` 及 NAS 部署方式。
8. 验证：`pnpm install`、`pnpm --filter web build`、`pnpm --filter docs build`，以及文档站 Docker 构建并运行后可通过浏览器访问。
