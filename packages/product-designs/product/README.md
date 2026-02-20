# 产品需求文档重构工具

## 简介

此工具将 packages/product-designs/ 中的 PRD 文件从**时间维度**重构为**业务功能模块维度**，生成 apps/docs/product/ 下的结构化文档。

## 为什么要重构？

原始 PRD 按日期组织：
```
packages/product-designs/
├── 项目管理增强-20260201/prd.md
├── 导航架构调整-20260202/prd.md
├── 用户与项目数据持久化-20260204/prd.md
└── ...
```

重构后按业务模块组织（一层路由）：
```
apps/docs/product/
├── index.md         # 文档总览
├── 01-project/      # 项目管理模块
│   ├── index.md     # 模块概览
│   └── module.md    # 详细功能
├── 02-auth/         # 用户认证模块
│   ├── index.md
│   └── module.md
└── ...
```

**好处：**
- 按业务模块查看所有相关需求，而非分散在不同日期的文档中
- 追踪功能的完整演进历史
- 便于理解和实现特定模块

## 快速开始

### 1. 重构文档

```bash
pnpm docs:reorganize
```

### 2. 查看重构后的文档

```bash
pnpm dev:docs
```

然后访问 http://localhost:5173/product/

## 生成的文档结构

### 总览页
- URL: `/product/`
- 显示所有模块的统计信息
- 快速导航链接
- 最近更新列表

### 模块概览页
- URL: `/product/01-project/`, `/product/02-auth/` 等
- 模块核心概念说明
- 相关 PRD 列表（按时间倒序）
- 功能清单（合并去重）

### 详细功能页
- URL: `/product/01-project/module`, `/product/02-auth/module` 等
- 按时间倒序列出所有相关 PRD 的完整内容
- 保留原始需求的验收标准

## 模块列表

| 模块 | 说明 | 相关 PRD 数 |
|------|------|------------|
| 项目管理 | 项目 CRUD、类型、状态、详情 | 4 |
| 用户认证 | 注册、登录、数据持久化 | 1 |
| 导航架构 | 侧边栏、项目详情页、路由 | - |
| 任务管理 | 爱好、习惯、任务、欲望 | - |
| 需求管理 | 需求看板 | - |
| 缺陷管理 | Bug 跟踪 | - |
| 积分奖励 | 积分、徽章、等级 | - |
| 设计系统 | UI、色彩、字体、动效 | 2 |

## 工作流程

### 新增 PRD 后的流程

1. 在 `packages/product-designs/{需求名}-{日期}/` 创建新的 PRD
2. 运行 `pnpm docs:reorganize`
3. 新 PRD 的内容会自动合并到对应模块
4. 启动 `pnpm dev:docs` 查看更新

### 修改分类规则

如果需要调整 PRD 的分类规则：

1. 编辑 `.opencode/skills/reorganize-prd/reorganize.js`
2. 修改 `MODULE_RULES` 对象
3. 重新运行 `pnpm docs:reorganize`

## 技术细节

### 分类算法

脚本通过关键词匹配对 PRD 进行分类：
- 计算每个模块关键词在 PRD 中的出现次数
- 选择得分最高的模块作为主模块
- 得分 ≥3 的其他模块作为次要模块

### 文件位置

- **Skill 目录**: `.opencode/skills/reorganize-prd/`
- **源文件**: `packages/product-designs/*/prd.md`
- **输出目录**: `apps/docs/product/`

## 注意事项

1. **保留历史**: 详细功能页保留所有 PRD 的原始内容
2. **自动合并**: 相同功能在不同 PRD 中会合并显示
3. **增量更新**: 重新运行时会更新已有文档，不会删除
4. **Git 追踪**: 建议将生成的文档提交到版本控制

## 常见问题

### Q: 新增 PRD 后文档没有更新？
A: 确保运行了 `pnpm docs:reorganize`，然后刷新文档页面

### Q: PRD 被分到了错误的模块？
A: 调整 `reorganize.js` 中的关键词规则，或手动修改生成的文档

### Q: 可以在生成的文档中直接编辑吗？
A: 可以，但下次运行重构脚本时会覆盖。建议在 PRD 源文件中修改

## 相关文件

- Skill 说明: `.opencode/skills/reorganize-prd/README.md`
- Skill 定义: `.opencode/skills/reorganize-prd/SKILL.md`
- 重构脚本: `.opencode/skills/reorganize-prd/reorganize.js`
- 文档配置: `apps/docs/.vitepress/config.mts`
