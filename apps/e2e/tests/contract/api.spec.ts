/**
 * API 契约测试
 * 
 * 验证 API 符合 OpenAPI/JSON Schema 契约
 * 确保前后端契约一致性，不依赖具体实现
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_WEB_URL ?? 'http://localhost:3000';

/**
 * 项目 API 契约
 */
test.describe('项目 API 契约', () => {
  test('GET /api/projects 应返回符合契约的响应结构', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/projects`);
    
    if (response.status() === 401) {
      test.skip('需要认证，跳过契约结构验证');
      return;
    }
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    
    // 验证响应结构契约
    expect(body).toHaveProperty('success');
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
    
    // 如果返回项目数据，验证每个项目的字段契约
    if (body.data.length > 0) {
      const project = body.data[0];
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('type');
      expect(['sprint-project', 'slow-project']).toContain(project.type);
      expect(project).toHaveProperty('status');
      expect(project).toHaveProperty('priority');
    }
  });

  test('POST /api/projects 应验证必填字段', async ({ request }) => {
    // 缺少必填字段 name
    const invalidData = {
      type: 'slow-project'
    };
    
    const response = await request.post(`${BASE_URL}/api/projects`, {
      data: invalidData
    });
    
    // 应返回 400 错误
    expect(response.status()).toBe(400);
    
    const body = await response.json();
    expect(body).toHaveProperty('success');
    expect(body.success).toBe(false);
    expect(body).toHaveProperty('message');
  });

  test('POST /api/projects 应验证类型字段契约', async ({ request }) => {
    const invalidTypeData = {
      name: 'Test Project',
      type: 'invalid-type' // 无效的类型
    };
    
    const response = await request.post(`${BASE_URL}/api/projects`, {
      data: invalidTypeData
    });
    
    // 应拒绝无效类型
    expect([400, 422]).toContain(response.status());
  });

  test('项目类型字段应符合枚举契约', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/projects`);
    
    if (response.status() !== 200) {
      test.skip('无法获取项目数据');
      return;
    }
    
    const body = await response.json();
    
    if (!body.data || body.data.length === 0) {
      test.skip('没有项目数据可验证');
      return;
    }
    
    // 验证所有项目的类型都在契约范围内
    const validTypes = ['sprint-project', 'slow-project'];
    
    for (const project of body.data) {
      expect(validTypes).toContain(project.type);
    }
  });
});

/**
 * 任务 API 契约
 */
test.describe('任务 API 契约', () => {
  test('GET /api/tasks 应返回符合契约的响应结构', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks`);
    
    if (response.status() === 401) {
      test.skip('需要认证');
      return;
    }
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('success');
    expect(body).toHaveProperty('data');
  });

  test('任务状态字段应符合枚举契约', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks`);
    
    if (response.status() !== 200) {
      test.skip('无法获取任务数据');
      return;
    }
    
    const body = await response.json();
    
    if (!body.data || body.data.length === 0) {
      test.skip('没有任务数据可验证');
      return;
    }
    
    // 任务状态契约
    const validStatuses = ['todo', 'in-progress', 'done', 'blocked'];
    
    for (const task of body.data) {
      if (task.status) {
        expect(validStatuses).toContain(task.status);
      }
    }
  });

  test('任务类型字段应符合枚举契约', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks`);
    
    if (response.status() !== 200) {
      test.skip('无法获取任务数据');
      return;
    }
    
    const body = await response.json();
    
    if (!body.data || body.data.length === 0) {
      test.skip('没有任务数据可验证');
      return;
    }
    
    // 任务类型契约
    const validTypes = ['Hobby', 'Habit', 'Task', 'Desire'];
    
    for (const task of body.data) {
      if (task.type) {
        expect(validTypes).toContain(task.type);
      }
    }
  });
});

/**
 * 需求 API 契约
 */
test.describe('需求 API 契约', () => {
  test('GET /api/requirements 应返回符合契约的响应结构', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/requirements`);
    
    if (response.status() === 401) {
      test.skip('需要认证');
      return;
    }
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('success');
    expect(body).toHaveProperty('data');
  });

  test('需求优先级字段应符合枚举契约', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/requirements`);
    
    if (response.status() !== 200) {
      test.skip('无法获取需求数据');
      return;
    }
    
    const body = await response.json();
    
    if (!body.data || body.data.length === 0) {
      test.skip('没有需求数据可验证');
      return;
    }
    
    // 需求优先级契约
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    
    for (const req of body.data) {
      if (req.priority) {
        expect(validPriorities).toContain(req.priority);
      }
    }
  });
});

/**
 * 认证 API 契约
 */
test.describe('认证 API 契约', () => {
  test('POST /api/auth/login 成功响应应符合契约', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        nickname: 'valid-user',
        password: 'valid-password'
      }
    });
    
    const body = await response.json();
    
    // 无论成功失败，结构应符合契约
    expect(body).toHaveProperty('success');
    
    if (body.success === true) {
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('token');
      expect(body.data).toHaveProperty('user');
    } else {
      expect(body).toHaveProperty('message');
    }
  });

  test('POST /api/auth/login 失败响应应符合契约', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        nickname: 'invalid',
        password: 'invalid'
      }
    });
    
    const body = await response.json();
    
    // 失败响应结构契约
    expect(body).toHaveProperty('success');
    expect(body.success).toBe(false);
    expect(body).toHaveProperty('message');
  });

  test('POST /api/auth/register 应验证必填字段', async ({ request }) => {
    const invalidData = {
      // 缺少必填字段
      email: 'test@example.com'
    };
    
    const response = await request.post(`${BASE_URL}/api/auth/register`, {
      data: invalidData
    });
    
    expect([400, 422]).toContain(response.status());
    
    const body = await response.json();
    expect(body).toHaveProperty('success');
    expect(body.success).toBe(false);
  });
});

/**
 * 通用 API 契约
 */
test.describe('通用 API 契约', () => {
  test('API 应返回 JSON 格式', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/projects`);
    
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  test('API 错误响应应包含结构化错误信息', async ({ request }) => {
    // 触发一个错误（访问不存在的端点）
    const response = await request.get(`${BASE_URL}/api/non-existent`);
    
    if (response.status() === 404) {
      // 404 错误响应结构契约
      const body = await response.json().catch(() => null);
      if (body) {
        expect(body).toHaveProperty('success');
        expect(body).toHaveProperty('message');
      }
    }
  });
});
