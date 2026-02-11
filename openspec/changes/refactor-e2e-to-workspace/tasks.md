## 1. 创建 E2E 工作区结构
- [x] 1.1 创建 `apps/e2e/` 目录
- [x] 1.2 创建 `apps/e2e/package.json`（独立依赖）
- [x] 1.3 创建 `apps/e2e/playwright.config.ts`

## 2. 迁移测试文件
- [x] 2.1 移动 `apps/web/e2e/*.spec.ts` 到 `apps/e2e/tests/web/`
- [x] 2.2 清理 `apps/web/e2e/` 目录

## 3. 更新工作区配置
- [x] 3.1 `pnpm-workspace.yaml` 已包含 `apps/*`
- [x] 3.2 验证 workspace 识别成功

## 4. 验证与文档
- [x] 4.1 运行 `pnpm --filter e2e list` 验证配置
- [x] 4.2 更新 `openspec/specs/testing/spec.md`
- [x] 4.3 更新 AGENTS.md 添加 e2e 运行命令
