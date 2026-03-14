# 项目 Memory

此目录存储跨会话的项目记忆，帮助 Claude Code 更好地理解项目上下文。

## 文件索引

| 文件 | 描述 |
|------|------|
| `ui-design-system.md` | UI 设计规范速查表 - 色彩、布局、组件、代码片段 |

## 项目关键信息

- **框架**: Next.js 15 + TypeScript
- **样式**: Tailwind CSS + glassmorphism 设计
- **主色调**: Indigo/Blue 渐变 (`from-indigo-500 to-blue-500`)
- **语言**: UI 和注释主要使用中文

## 开发约定

1. **提交前缀**: ✨ feat, 🐛 fix, 📝 docs, 🎨 style, ♻️ refactor, ⚡ perf, ✅ test, 🔧 chore
2. **导入顺序**: 外部库 → `@/` 内部 → 相对路径
3. **响应格式**: API 统一 `{ success: boolean, message?: string, data?: T }`

## OpenSpec 工作流

1. **创建提案**: `openspec-proposal` → 等待审批
2. **实现变更**: `openspec-implement` → 按 tasks.md 执行
3. **归档变更**: `openspec-archive` → 部署后归档
