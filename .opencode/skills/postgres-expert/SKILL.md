---
name: postgres-expert
description: PostgreSQL 数据库专家，专注于直接 SQL 开发（无 ORM）、JSONB、性能优化、事务管理。用于数据库查询优化、schema 设计、复杂 SQL 编写、数据迁移等场景。
voice:
  - 数据库优化
  - SQL 查询
  - PostgreSQL
  - 数据库设计
  - JSONB 查询
license: MIT
compatibility: opencode
metadata:
  author: user
  version: "1.0.0"
---

# PostgreSQL Expert

你是一名 PostgreSQL 数据库专家，专门帮助开发者使用直接的 SQL（不使用 ORM）进行数据库开发。

## 何时使用

在以下情况下使用此 skill：
- 编写复杂的 SQL 查询
- 优化数据库性能
- 设计数据库 schema
- 处理 JSONB 数据类型
- 编写数据库迁移脚本
- 调试 SQL 查询问题
- 实现事务和并发控制

## 项目特定配置

本项目使用 `postgres` 驱动直接执行 SQL：
- 数据库文件：`apps/web/app/lib/db.ts`
- 使用 tagged template literals 执行 SQL
- 连接字符串：`POSTGRES_URL` 环境变量

## 核心能力

### 1. SQL 查询优化

```sql
-- 使用 EXPLAIN ANALYZE 分析查询
EXPLAIN ANALYZE SELECT * FROM tasks WHERE project_id = $1;

-- 检查索引使用情况
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'tasks';

-- 查看表统计信息
SELECT * FROM pg_stat_user_tables WHERE relname = 'tasks';
```

### 2. JSONB 操作

本项目大量使用 JSONB 存储灵活数据：

```sql
-- 查询 JSONB 字段
SELECT * FROM tasks WHERE tags @> '["urgent"]';

-- 更新 JSONB 数组
UPDATE tasks
SET tags = tags || '["new-tag"]'::jsonb
WHERE id = $1;

-- 提取 JSONB 值
SELECT data->>'name' as name, data->'count' as count
FROM tasks WHERE id = $1;

-- JSONB 路径查询
SELECT * FROM tasks
WHERE data @? '$.sub_tasks[*] ? (@.completed == true)';
```

### 3. 事务管理

```typescript
// 使用 postgres 驱动的事务
await sql.begin(async (tx) => {
  await tx`INSERT INTO tasks (id, title) VALUES (${id}, ${title})`;
  await tx`INSERT INTO task_history (task_id, action) VALUES (${id}, 'created')`;
});
```

### 4. 性能优化模式

#### 索引策略
```sql
-- 为常用查询创建索引
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- JSONB 字段索引
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);

-- 复合索引
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
```

#### 批量操作
```sql
-- 批量插入（优于循环插入）
INSERT INTO tasks (id, title, project_id)
SELECT * FROM UNNEST($1::text[], $2::text[], $3::uuid[])
AS t(id, title, project_id);
```

### 5. 数据库表结构

本项目的核心表：

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| users | 用户 | id (UUID), email, password_hash |
| projects | 项目 | id (UUID), name, type (sprint-project/slow-burn) |
| tasks | 任务 | id (TASK-*), type (hobby/habit/task/desire), tags (JSONB) |
| requirements | 需求 | id (REQ-*), priority, sub_requirements (JSONB) |
| defects | 缺陷 | id, severity, repository_info (JSONB) |
| todos | 待办 | id, completed, task_id |
| task_history | 任务历史 | id, task_id, action, changes (JSONB) |
| habit_records | 习惯记录 | id, habit_id, completed_date |

## 常见问题解决

### N+1 查询问题
```sql
-- 错误：循环查询
-- for task in tasks: select * from requirements where task_id = task.id

-- 正确：使用 JOIN 或子查询
SELECT t.*, json_agg(r.*) as requirements
FROM tasks t
LEFT JOIN requirements r ON r.task_id = t.id
WHERE t.project_id = $1
GROUP BY t.id;
```

### 分页优化
```sql
-- 使用 keyset pagination（大数据集更高效）
SELECT * FROM tasks
WHERE created_at < $1
ORDER BY created_at DESC
LIMIT 20;
```

### 全文搜索
```sql
-- 创建全文搜索索引
CREATE INDEX idx_tasks_search ON tasks
USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- 执行搜索
SELECT * FROM tasks
WHERE to_tsvector('english', title || ' ' || COALESCE(description, ''))
      @@ to_tsquery('english', $1);
```

## 调试技巧

```sql
-- 查看活动连接
SELECT * FROM pg_stat_activity WHERE datname = 'agile_person_manage';

-- 终止长时间运行的查询
SELECT pg_cancel_backend(pid);

-- 查看锁等待
SELECT * FROM pg_locks WHERE NOT granted;
```

## 最佳实践

1. **始终使用参数化查询** - 防止 SQL 注入
2. **合理使用索引** - 过多索引影响写入性能
3. **批量操作优于循环** - 减少数据库往返
4. **使用事务保证一致性** - 相关操作放在同一事务
5. **定期 VACUUM** - 清理死元组
6. **监控慢查询** - 使用 pg_stat_statements
