## 1. Vitest 环境搭建
- [x] 1.1 安装 Vitest 和相关依赖
- [x] 1.2 创建 `vitest.config.ts` 配置文件
- [x] 1.3 创建 `tests/vitest-setup.ts` 测试初始化文件
- [x] 1.4 在 `package.json` 添加测试脚本

## 2. 测试目录结构
- [x] 2.1 创建 `tests/unit/` 目录存放单元测试
- [x] 2.2 创建 `tests/integration/` 目录存放集成测试
- [x] 2.3 创建示例测试文件（util、component）

## 3. 测试规范定义
- [x] 3.1 在 `openspec/specs/testing/spec.md` 定义测试标准
- [x] 3.2 创建测试工具函数（mock、assertion helpers）

## 4. OpenSpec 流程集成
- [ ] 4.1 更新变更任务模板，添加测试验证步骤
- [ ] 4.2 创建测试验证脚本（在变更目录下运行测试）

## 5. 现有功能测试补齐（第一批）
- [ ] 5.1 登录表单组件测试
- [ ] 5.2 认证 API 测试
- [ ] 5.3 数据库工具函数测试

## 6. 验证与文档
- [x] 6.1 运行单元测试确保通过（11 tests passed）
- [x] 6.2 编写测试编写指南（`apps/web/TESTING_GUIDE.md`）
- [x] 6.3 更新 AGENTS.md 添加测试规范
