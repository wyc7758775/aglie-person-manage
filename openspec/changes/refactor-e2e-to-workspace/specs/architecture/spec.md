## ADDED Requirements

### Requirement: E2E 工作区独立性
系统 SHALL 将 E2E 测试作为独立 pnpm workspace。

#### Scenario: 工作区结构
- **WHEN** 查看项目结构
- **THEN** E2E 测试位于 `apps/e2e/` 目录
- **AND** E2E 具有独立的 `package.json`
- **AND** E2E 可通过 `pnpm --filter e2e` 访问

#### Scenario: 独立依赖管理
- **WHEN** E2E 包的依赖更新
- **THEN** 不影响其他应用（web、docs）的依赖版本

#### Scenario: 独立配置
- **WHEN** E2E 测试配置变更
- **THEN** 仅影响 `apps/e2e/playwright.config.ts`

---

### Requirement: E2E 测试作为契约
系统 SHALL 将 E2E 测试作为用户行为的验收标准。

#### Scenario: 测试与实现分离
- **WHEN** 应用代码重构
- **THEN** E2E 测试无需修改（验证行为一致性）
- **AND** E2E 测试作为活文档描述用户流程

#### Scenario: 跨应用测试
- **WHEN** 需要验证多个应用的用户流程
- **THEN** E2E 测试可配置不同 baseURL
- **AND** 测试用例描述用户目标而非实现细节
