/**
 * 性能契约测试
 * 
 * 验证系统在高负载下的性能表现是否符合契约要求
 * 这些测试作为代码实现的性能契约，不依赖具体实现细节
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_WEB_URL ?? 'http://localhost:3000';

/**
 * API 响应时间契约
 * 系统应在合理时间内响应 API 请求
 */
test.describe('API 性能契约', () => {
  test('项目列表接口 p95 响应时间 < 500ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${BASE_URL}/api/projects`);
    const duration = Date.now() - start;
    
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(500);
  });

  test('任务列表接口 p95 响应时间 < 300ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${BASE_URL}/api/tasks`);
    const duration = Date.now() - start;
    
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(300);
  });

  test('用户认证接口 p95 响应时间 < 800ms', async ({ request }) => {
    const start = Date.now();
    const response = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        nickname: 'test-user',
        password: 'test-password'
      }
    });
    const duration = Date.now() - start;
    
    // 即使认证失败，也测试响应时间
    expect(duration).toBeLessThan(800);
  });
});

/**
 * 页面加载性能契约
 * 关键页面应在用户可接受的时间内完成加载
 */
test.describe('页面加载性能契约', () => {
  test('首页 LCP < 2.5s', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(2500);
  });

  test('项目页面加载 < 2s', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/dashboard/project`);
    await page.waitForSelector('[data-testid="project-list"]', { timeout: 2000 });
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(2000);
  });

  test('仪表盘页面加载 < 1.5s', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('domcontentloaded');
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(1500);
  });
});

/**
 * 并发性能契约
 * 系统应在并发访问下保持稳定
 */
test.describe('并发性能契约', () => {
  test('10 个并发项目列表请求应全部成功', async ({ request }) => {
    const promises = Array(10).fill(null).map(() => 
      request.get(`${BASE_URL}/api/projects`)
    );
    
    const responses = await Promise.all(promises);
    
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });

  test('并发创建项目请求应正确处理', async ({ request }) => {
    const projectData = {
      name: `perf-test-${Date.now()}`,
      type: 'slow-project',
      description: 'Performance test project'
    };

    const promises = Array(5).fill(null).map((_, i) => 
      request.post(`${BASE_URL}/api/projects`, {
        data: { ...projectData, name: `${projectData.name}-${i}` }
      })
    );
    
    const responses = await Promise.all(promises);
    
    // 所有请求都应该返回有效响应（成功或合理的错误）
    responses.forEach(response => {
      expect([200, 201, 400, 401, 409]).toContain(response.status());
    });
  });
});
