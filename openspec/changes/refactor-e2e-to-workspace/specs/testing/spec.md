## MODIFIED Requirements

### Requirement: E2E 测试运行命令
系统 SHALL 通过独立工作区运行 E2E 测试。

#### Scenario: 工作区运行 E2E 测试
- **WHEN** 运行 `pnpm --filter e2e test`
- **THEN** 执行 `apps/e2e/` 目录下所有 Playwright 测试

#### Scenario: 独立目录运行 E2E 测试
- **WHEN** 在 `apps/e2e/` 目录运行 `pnpm test`
- **THEN** 执行当前目录下的 Playwright 测试

---

### Requirement: E2E 测试多应用支持
系统 SHALL 支持 E2E 测试验证多个应用的用户流程。

#### Scenario: 测试 Web 应用
- **WHEN** E2E 测试配置 baseURL 指向 web 应用
- **THEN** 测试验证 web 应用的页面和交互

#### Scenario: 测试 Docs 应用
- **WHEN** E2E 测试配置 baseURL 指向 docs 应用
- **THEN** 测试验证 docs 应用的文档站点
