# [模块/功能名称] i18n 国际化翻译

> 基于 [对应 PRD 文档] 生成，供开发接入 `app/lib/i18n/` 字典使用。

## Key 规范

- 格式：`模块.自定义key`，如 `project.name`、`auth.login.submit`
- 模块名与 PRD 功能模块对应，key 使用 camelCase
- 支持嵌套语义：`project.form.name`、`project.form.namePlaceholder`

## 翻译表

| Key | 中文 | English | 日本語 |
|-----|------|---------|--------|
| module.title | 模块标题 | Module Title | モジュールタイトル |
| module.form.submit | 提交 | Submit | 送信 |
| module.form.cancel | 取消 | Cancel | キャンセル |
| module.message.success | 操作成功 | Operation successful | 操作が成功しました |
| module.message.error | 操作失败 | Operation failed | 操作に失敗しました |

## 分类说明

按界面区域或功能分组，便于开发查找：

### 表单与按钮

| Key | 中文 | English | 日本語 |
|-----|------|---------|--------|
| | | | |

### 提示与消息

| Key | 中文 | English | 日本語 |
|-----|------|---------|--------|
| | | | |

### 标签与占位符

| Key | 中文 | English | 日本語 |
|-----|------|---------|--------|
| | | | |

## 生成说明

- **中文**：以 PRD 中的原文为准
- **English**：符合英文表达习惯，非逐字直译
- **日本語**：符合日语敬体/常体习惯，注意敬语使用场景
