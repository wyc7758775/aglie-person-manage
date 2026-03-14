# Tasks: 添加 Playwriter 验证到 OpenSpec 工作流

## 1. Implementation

- [x] 1.1 创建 `openspec/templates/verify.mjs` 验证脚本模板
- [x] 1.2 更新 `openspec/AGENTS.md` 添加 Stage 2.5: Verification
- [x] 1.3 创建示例 change `add-playwriter-verification`
- [x] 1.4 创建 `scripts/create-change.sh` 自动化脚本
- [x] 1.5 更新 `package.json` 添加 `create:change` 命令

## 2. Verification

- [ ] 2.1 运行 Playwriter 验证
- [ ] 2.2 所有场景通过

## Notes

- 使用 `pnpm create:change <id> -- --with-verify` 创建带验证的 change
- verify.mjs 使用 .mjs 扩展名以支持 ES Module 语法
- 验证脚本不是测试，而是快速功能验证
- 主要用于开发时的即时反馈，不替代 CI/CD 中的 Playwright 测试
