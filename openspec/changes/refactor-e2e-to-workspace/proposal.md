# Change: 将 E2E 测试重构为独立工作区包

## 为什么
当前 E2E 测试位于 `apps/web/e2e/`，与 web 应用耦合。将其独立为 `apps/e2e/` 工作区包可以实现：
- **职责分离**：E2E 测试作为独立产品，而非 web 的附属
- **跨应用测试**：可同时测试 web、docs 等多个应用的用户流程
- **独立演进**：E2E 框架配置、依赖可独立升级
- **AI 友好**：测试代码与实现代码更清晰分离

## 什么变更
- 创建 `apps/e2e/` 作为独立 pnpm workspace
- E2E 测试作为独立包，测试所有应用的用户流程
- 更新 `pnpm-workspace.yaml` 包含新工作区
- 调整 `apps/web/` 移除 E2E 相关配置

## 影响
- 受影响的规范：testing（更新）、architecture（新增）
- 受影响的目录：`apps/web/e2e/` → `apps/e2e/`
- 新增文件：`apps/e2e/package.json`、`apps/e2e/playwright.config.ts`
- 工作区：`apps/*` → `apps/e2e/` 独立
