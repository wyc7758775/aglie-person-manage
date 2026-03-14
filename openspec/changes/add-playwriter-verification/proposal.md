# Change: 添加 Playwriter 验证到 OpenSpec 工作流

## Why

当前 OpenSpec 工作流缺少快速功能验证环节：
- 开发时验证效率低，每次都要启动新浏览器、重新登录
- tasks.md 完成后缺少即时验证手段
- PRD 功能点逐项验证困难

## What Changes

- 在 OpenSpec change 目录中添加 `verify.mjs` 验证脚本
- 更新 AGENTS.md 添加 Stage 2.5: Verification 阶段
- 创建验证脚本模板 `openspec/templates/verify.mjs`

## Impact

- Affected specs: 无（这是工具链改进）
- Affected code:
  - `openspec/AGENTS.md`
  - `openspec/templates/verify.mjs`（新建）

## Benefits

1. **开发效率提升** - 复用已登录 Chrome，无需重复登录
2. **即时反馈** - 实现后立即验证，快速发现问题
3. **验证可追溯** - verify.mjs 记录验证场景，可重复执行
4. **双轨验证** - Playwriter（开发时）+ Playwright（CI/CD）
