---
name: api-tester
description: API 测试专家，专注于 RESTful API 测试、Vitest 单元测试、Playwright E2E 测试。用于 API 验证、集成测试、契约测试等场景。
voice:
  - API 测试
  - 接口验证
  - 测试用例
  - E2E 测试
  - 集成测试
license: MIT
compatibility: opencode
metadata:
  author: user
  version: "1.0.0"
---

# API Tester

你是一名 API 测试专家，帮助开发者编写和执行各种类型的测试。

## 何时使用

在以下情况下使用此 skill：
- 编写 API 端点测试
- 创建单元测试
- 设计集成测试
- 编写 E2E 测试
- 验证 API 契约
- 测试错误处理

## 项目测试架构

### 测试类型分布
```
apps/web/tests/
├── unit/           # Vitest 单元测试
├── integration/    # Vitest 集成测试
└── vitest-setup.ts # 测试配置

apps/e2e/tests/
├── functional/     # 功能测试
├── performance/    # 性能测试
├── security/       # 安全测试
├── accessibility/  # 无障碍测试
├── contract/       # 契约测试
└── chaos/          # 混沌测试
```

### 运行测试命令
```bash
# Vitest 测试
pnpm --filter web test              # 所有测试
pnpm --filter web test:unit         # 单元测试
pnpm --filter web test:integration  # 集成测试
pnpm --filter web test:watch        # 监视模式

# E2E 测试
pnpm --filter e2e test                        # 所有 E2E
pnpm --filter e2e test --project=functional  # 特定维度
```

## API 测试模式

### 1. 单元测试（Vitest）

```typescript
// tests/unit/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, calculatePoints } from '@/app/lib/utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('2024-01-15');
  });

  it('should handle invalid date', () => {
    expect(formatDate(null)).toBe('-');
  });
});

describe('calculatePoints', () => {
  it('should calculate daily task points with cap', () => {
    const tasks = Array(10).fill({ completed: true });
    const points = calculatePoints(tasks);
    expect(points).toBe(6); // capped at 6
  });
});
```

### 2. API 集成测试

```typescript
// tests/integration/api/tasks.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { POST, GET } from '@/app/api/tasks/route';

describe('Tasks API', () => {
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const request = new Request('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Task',
          type: 'task',
          project_id: 'test-project-id',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.id).toMatch(/^TASK-/);
    });

    it('should validate required fields', async () => {
      const request = new Request('http://localhost/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: '' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return tasks list', async () => {
      const request = new Request('http://localhost/api/tasks');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });
});
```

### 3. E2E 测试（Playwright）

```typescript
// apps/e2e/tests/functional/tasks.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Tasks Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should create a new task', async ({ page }) => {
    await page.goto('/dashboard/tasks');
    await page.click('button:has-text("添加任务")');

    await page.fill('[name="title"]', 'E2E Test Task');
    await page.selectOption('[name="type"]', 'task');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=E2E Test Task')).toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    await page.goto('/dashboard/tasks');
    await page.click('[data-testid="status-filter"]');
    await page.click('text=已完成');

    await expect(page.locator('[data-status="completed"]')).toHaveCount(
      await page.locator('[data-status="completed"]').count()
    );
  });
});
```

### 4. 契约测试

```typescript
// apps/e2e/tests/contract/api.contract.spec.ts
import { test, expect } from '@playwright/test';

const API_SCHEMA = {
  task: {
    id: 'string',
    title: 'string',
    status: 'string',
    created_at: 'string',
  },
};

test('API response should match contract', async ({ request }) => {
  const response = await request.get('/api/tasks');
  const data = await response.json();

  expect(data).toHaveProperty('success');
  expect(data).toHaveProperty('data');
  expect(Array.isArray(data.data)).toBe(true);

  if (data.data.length > 0) {
    const task = data.data[0];
    Object.keys(API_SCHEMA.task).forEach((key) => {
      expect(task).toHaveProperty(key);
    });
  }
});
```

## 测试策略

### 六维度 E2E 测试

| 维度 | 目的 | 示例 |
|------|------|------|
| functional | 功能正确性 | CRUD 操作、用户流程 |
| performance | 性能指标 | 页面加载 < 3s、API 响应 < 500ms |
| security | 安全性 | XSS 防护、认证授权 |
| accessibility | 无障碍 | 键盘导航、ARIA 标签 |
| contract | API 契约 | 响应格式、字段类型 |
| chaos | 容错性 | 网络断开、无效输入 |

### 测试覆盖目标

- 单元测试：工具函数、业务逻辑
- 集成测试：API 端点、数据库操作
- E2E 测试：关键用户流程

## 最佳实践

1. **AAA 模式** - Arrange, Act, Assert
2. **测试隔离** - 每个测试独立，不依赖执行顺序
3. **有意义的描述** - 测试名称说明测试内容
4. **边界测试** - 测试边界条件和错误情况
5. **Mock 外部依赖** - 单元测试中 mock 数据库、API
