# Spec: Testing

## Overview
本规范定义了项目的自动化测试标准，确保代码质量可通过测试验证。

## ADDED Requirements

### Requirement: 单元测试覆盖
系统 SHALL 为所有工具函数和 React 组件提供单元测试。

#### Scenario: 工具函数测试
- **WHEN** 工具函数代码变更
- **THEN** 必须添加或更新对应的单元测试
- **AND** 单元测试使用 Vitest 运行
- **AND** 测试文件位于 `tests/unit/` 目录

#### Scenario: 组件交互测试
- **WHEN** React 组件包含用户交互（点击、输入、提交）
- **THEN** 必须添加交互行为测试
- **AND** 使用 `@testing-library/react` 进行测试

#### Scenario: 工具函数测试覆盖
- **WHEN** 工具函数包含条件分支
- **THEN** 每个分支必须有对应的测试用例
- **AND** 测试覆盖率为 100% 分支覆盖

---

### Requirement: API 集成测试
系统 SHALL 为所有 API 路由提供集成测试，覆盖成功和失败场景。

#### Scenario: API 成功响应测试
- **WHEN** API 收到有效请求
- **THEN** 集成测试验证响应状态码和数据格式

#### Scenario: API 错误处理测试
- **WHEN** API 收到无效请求
- **THEN** 集成测试验证错误响应格式和状态码

#### Scenario: API 认证测试
- **WHEN** API 需要认证
- **THEN** 集成测试验证未认证请求被拒绝

---

### Requirement: E2E 用户流程测试
系统 SHALL 为关键用户流程提供 E2E 测试。

#### Scenario: 完整登录流程测试
- **WHEN** 用户访问首页并完成登录
- **AND** E2E 测试验证页面跳转和用户状态

#### Scenario: 核心业务路径测试
- **WHEN** 用户执行核心操作（创建任务、项目）
- **THEN** E2E 测试验证数据持久化和 UI 反馈

#### Scenario: E2E 测试工作区独立
- **WHEN** E2E 测试位于 `apps/e2e/` 工作区
- **THEN** 可通过 `pnpm --filter e2e test` 运行
- **AND** E2E 测试与 web 应用代码分离

#### Scenario: 多应用测试支持
- **WHEN** E2E 测试配置多个应用
- **THEN** 可分别测试 web (`web`) 和 docs (`docs`) 应用
- **AND** 使用 `projects` 配置区分测试目标

---

### Requirement: 测试验证门禁
系统 SHALL 确保所有变更实施后通过测试验证。

#### Scenario: 变更完成条件
- **WHEN** 变更实施完成
- **THEN** 必须运行对应测试套件
- **AND** 所有测试通过后才能标记变更完成
- **AND** 失败的测试必须修复代码直至通过

#### Scenario: 测试失败处理
- **WHEN** 测试运行失败
- **THEN** 阻止变更标记为完成
- **AND** 显示失败的测试详情
- **AND** 开发者必须修复代码后重新运行测试

---

### Requirement: 测试运行命令
系统 SHALL 提供统一的测试运行命令。

#### Scenario: E2E 测试运行（独立工作区）
- **WHEN** 运行 `pnpm --filter e2e test`
- **THEN** 执行 `apps/e2e/tests/` 目录下所有 Playwright 测试

#### Scenario: E2E Web 应用测试
- **WHEN** 运行 `pnpm --filter e2e test:web`
- **THEN** 使用 web 项目配置测试 web 应用

#### Scenario: E2E Docs 应用测试
- **WHEN** 运行 `pnpm --filter e2e test:docs`
- **THEN** 使用 docs 项目配置测试文档站

#### Scenario: 单元测试运行
- **WHEN** 运行 `pnpm test:unit`
- **THEN** 执行 `tests/unit/` 目录下所有测试

#### Scenario: 集成测试运行
- **WHEN** 运行 `pnpm test:integration`
- **THEN** 执行 `tests/integration/` 目录下所有测试

#### Scenario: 全部测试运行
- **WHEN** 运行 `pnpm test` 或 `pnpm test:all`
- **THEN** 执行所有测试套件（单元 + 集成 + E2E）

---

### Requirement: 测试工具函数
系统 SHALL 提供统一的测试工具函数。

#### Scenario: Mock Next.js 导航
- **WHEN** 测试组件使用 useRouter
- **THEN** 使用 vitest-setup.ts 中的 mock 配置

#### Scenario: Mock 数据库
- **WHEN** 测试需要数据库操作
- **THEN** 使用 mock 或测试数据库进行隔离测试

#### Scenario: 自定义断言
- **WHEN** 需要自定义断言逻辑
- **THEN** 在 `tests/` 目录创建工具函数

---

## Coverage Standards

| 代码类型 | 最低覆盖要求 | 测试类型 | 测试位置 |
|---------|-------------|---------|---------|
| 工具函数 | 100% 分支 | 单元测试 | `tests/unit/**/*.test.ts` |
| 组件交互 | 关键路径 | 单元测试 | `tests/unit/**/*.test.tsx` |
| API 路由 | 成功/失败场景 | 集成测试 | `tests/integration/**/*.test.ts` |
| 认证流程 | 全路径 | E2E 测试 | `apps/e2e/tests/**/*.spec.ts` |
| 关键用户路径 | 端到端验证 | E2E 测试 | `apps/e2e/tests/**/*.spec.ts` |

## Best Practices

1. **测试隔离**：每个测试独立运行，不依赖其他测试
2. **测试描述**：使用中文描述测试用例
3. **Mock 外部依赖**：API、数据库等使用 mock
4. **快速反馈**：单元测试应在毫秒级完成
5. **保持稳定**：避免 flaky test
