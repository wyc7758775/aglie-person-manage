# 用户与项目数据持久化 - 设计说明

## Context

- 当前用户认证层使用 `app/lib/db-memory.ts`（进程内内存数组 + bcrypt 哈希），从 placeholder 初始化，重启后数据丢失。
- 项目数据使用 `app/lib/projects.ts` 内存数组，无 `userId`，API 未按当前用户过滤。
- `openspec/project.md` 已约定「用户与项目使用真实数据库（PostgreSQL）」，并列为外部依赖（`POSTGRES_URL`）。

## Goals / Non-Goals

- **Goals**：用户与项目数据持久化到 PostgreSQL；项目按当前用户维度查询与操作；重启后数据不丢失。
- **Non-Goals**：任务、需求、缺陷、奖励等模块仍使用内存数据；不包含自动化测试、性能压测。

## Decisions

- **用户表**：字段含 `id`、`nickname`、`password_hash`、`role` 等；昵称唯一索引；密码仅存哈希（bcrypt），禁止明文。
- **项目表**：在现有 Project 字段基础上增加 `userId`（或 `ownerId`）；与用户表逻辑或外键关联。
- **认证与鉴权**：登录成功后写入 Cookie/Token（沿用现有机制）；项目相关 API 从请求解析当前用户（如 `getCurrentUser`）；未登录访问项目接口返回 401；操作非本人项目返回 403 或 404。
- **数据层策略**：新增或切换为 PostgreSQL 驱动层（如基于 `POSTGRES_URL` 的 `db-pg` 或条件分支）；保留 init-db/seed 能力，用于创建超级管理员等初始用户。

## Risks / Trade-offs

- **迁移**：既有内存数据无自动迁移；可通过 seed 或 init-db 创建默认用户与示例数据；回滚可保留旧实现开关或文档说明。
- **兼容性**：与现有 Next.js、App Router、API 路由风格一致；类型定义在 `app/lib/definitions.ts` 可扩展 `userId` 等字段。

## Migration Plan

1. 提供 DB 表创建脚本（users、projects）。
2. 提供可选 seed（含超级管理员等默认用户）。
3. 部署顺序：建表 → 执行 seed（可选）→ 切换代码到真实 DB。
4. 回滚：可保留环境变量或开关回退到内存实现（仅作应急）。

## 建表与初始化

- 表结构由 `app/lib/db.ts` 的 `initializeDatabase()` 创建（users 含 role，projects 含 user_id）。
- 首次使用：设置 `POSTGRES_URL` 后，调用 `POST /api/init-db` 创建默认用户（含超级管理员），或通过注册/登录触发 `initializeDatabase()` 建表。
- 无独立 SQL 文件；需变更表结构时在 `initializeDatabase()` 中增加 `CREATE TABLE IF NOT EXISTS` 或 `ALTER TABLE`。

## Open Questions

- 无。表结构与 API 行为以 PRD 与本文档为准。
