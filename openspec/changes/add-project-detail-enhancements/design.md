# 项目管理详情增强 - 设计文档

## Context

基于 `product-designs/项目管理增强-20260201/prd.md` 与 `i18n.md`，对现有项目管理模块进行增强。当前实现使用 planning/active/paused/completed 四值状态、textarea 描述、开始日期/结束日期标签，详情抽屉底部有删除按钮和「修改后自动保存」提示。

## Goals / Non-Goals

- **Goals**：提升描述编辑体验（Markdown）、简化状态语义（三值）、统一时间字段命名、精简详情界面
- **Non-Goals**：项目列表筛选逻辑的完整重构、描述字段的图片上传/@提及、纯时间选择（不含日期）

## Decisions

### 1. ProjectStatus 枚举变更

- **Decision**：将 `'active' | 'completed' | 'paused' | 'planning'` 改为 `'normal' | 'at_risk' | 'out_of_control'`
- **Rationale**：用户反馈希望状态更直观反映项目健康度
- **Data**：不兼容历史数据，直接删除现有项目并新增 7 个示例项目

### 2. 描述编辑器选型

- **Decision**：使用 Tiptap 及其 Markdown 扩展
- **Alternatives**：React-Markdown（仅渲染）、Slate、Lexical
- **Rationale**：Tiptap 基于 ProseMirror，生态成熟，支持 Markdown 扩展，与现有 React 栈兼容

### 3. 时间字段命名

- **Decision**：后端字段名保持 `startDate`、`endDate`（ISO 8601），仅前端 i18n 与 UI 标签改为「开始时间」「截止时间」
- **Rationale**：最小化 API 变更，与现有数据结构兼容

### 4. 删除入口

- **Decision**：从 ProjectDrawer 底部移除删除按钮，保留项目卡片「更多」菜单中的删除选项
- **Rationale**：减少详情界面的干扰性操作，降低误删风险

### 5. 日文支持

- **Decision**：新增 `ja-JP` 日文语言支持，创建 `dictionary.ja.ts` 并提供项目管理相关翻译
- **Rationale**：i18n.md 已定义日文翻译，满足多语言用户需求

### 6. 示例数据

- **Decision**：删除现有项目数据，新增 7 个示例项目，使用新状态值（normal/at_risk/out_of_control）
- **Rationale**：不兼容历史数据，直接重置以简化实现
- **7 个项目建议**：
  1. 敏捷人员管理系统（code, normal, high）
  2. 健身计划（life, normal, medium）
  3. 学习英语（life, at_risk, medium）
  4. 个人博客（code, at_risk, low）
  5. 读书计划（life, normal, high）
  6. 开源贡献（code, out_of_control, high）
  7. 冥想习惯（life, normal, low）

## Risks / Trade-offs

- **Tiptap 包体积**：首次加载可能增加 bundle 体积，需监控 2s 内完成加载（PRD 非功能需求）

## Implementation Plan

1. 更新 ProjectStatus 类型定义
2. 删除现有项目数据，新增 7 个示例项目
3. 更新 API 校验逻辑
4. 更新前端组件与 i18n（含日文）
5. 验证构建与手动测试
