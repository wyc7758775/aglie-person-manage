## 上下文
当前 E2E 测试与 web 应用耦合（`apps/web/e2e/`），不符合"测试作为契约"的理念。需要将其独立为工作区包。

## 目标 / 非目标
- 目标：E2E 测试独立为 `apps/e2e/` workspace
- 目标：支持测试多个应用（web、docs）
- 目标：测试配置独立演进
- 非目标：改变测试用例代码（复用现有测试）
- 非目标：改变测试编写风格

## 决策

### 工作区结构
```
apps/
├── web/          # Next.js 主应用
├── docs/         # VitePress 文档站
└── e2e/          # Playwright E2E 测试套件 ⭐ 独立工作区
```

### 依赖关系
- `apps/e2e` 依赖 `@playwright/test`
- `apps/e2e` 通过 `baseURL` 测试 `apps/web`、`apps/docs`
- `apps/e2e` 可独立运行 `pnpm test`

### 运行命令
```bash
# 在 e2e 目录运行
cd apps/e2e && pnpm test

# 或通过 workspace 运行
pnpm --filter e2e test
```

## 迁移步骤
1. 创建 `apps/e2e/` 目录结构
2. 移动 `apps/web/e2e/*` 到 `apps/e2e/`
3. 创建 `apps/e2e/package.json`（独立依赖）
4. 更新 `playwright.config.ts`（支持多应用测试）
5. 更新 `pnpm-workspace.yaml`
6. 移除 `apps/web/e2e/` 目录

## 风险 / 权衡
- **风险**：初期配置复杂 → 缓解：复用现有配置
- **风险**：依赖重复安装 → 缓解：pnpm 优化共享
