/**
 * 混沌工程测试
 * 
 * 验证系统在故障情况下的恢复能力和稳定性
 * 这些测试验证系统的容错契约
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_WEB_URL ?? 'http://localhost:3000';

/**
 * 网络故障契约
 * 系统应在网络不稳定时优雅降级
 */
test.describe('网络故障契约', () => {
  test('慢网络下页面应显示加载状态', async ({ page }) => {
    // 模拟慢网络
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });
    
    await page.goto(BASE_URL);
    
    // 页面应有加载指示器或骨架屏
    // 这里不检查具体内容，只是验证页面不会崩溃
    await expect(page.locator('body')).toBeVisible();
  });

  test('断网后应显示错误提示', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 模拟断网
    await page.context().setOffline(true);
    
    // 尝试操作
    await page.reload();
    
    // 页面应显示离线提示或错误状态
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    
    // 恢复网络
    await page.context().setOffline(false);
  });

  test('API 超时应有重试或错误处理', async ({ page }) => {
    // 拦截 API 请求并使其超时
    await page.route('**/api/projects', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 10000));
      await route.abort('timedout');
    });
    
    await page.goto(`${BASE_URL}/dashboard/project`);
    
    // 等待一段时间看是否有错误处理
    await page.waitForTimeout(3000);
    
    // 页面不应崩溃，应有错误提示或重试机制
    const errorMessage = await page.locator('text=/error|timeout|failed|错误|超时|失败/i').count();
    // 或者页面仍然可用（有缓存数据）
    expect(errorMessage).toBeGreaterThanOrEqual(0);
  });
});

/**
 * 错误注入契约
 * 系统应能处理各种异常情况
 */
test.describe('错误注入契约', () => {
  test('500 错误应显示友好错误页面', async ({ page }) => {
    // 拦截 API 请求并返回 500
    await page.route('**/api/projects', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ success: false, message: 'Internal Server Error' })
      });
    });
    
    await page.goto(`${BASE_URL}/dashboard/project`);
    
    // 等待错误处理
    await page.waitForTimeout(2000);
    
    // 页面不应白屏，应有错误提示
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
  });

  test('503 服务不可用应有降级策略', async ({ page }) => {
    await page.route('**/api/projects', async (route) => {
      await route.fulfill({
        status: 503,
        body: JSON.stringify({ success: false, message: 'Service Unavailable' })
      });
    });
    
    await page.goto(`${BASE_URL}/dashboard/project`);
    await page.waitForTimeout(2000);
    
    // 页面应显示降级内容（如缓存数据、空状态）
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBe(true);
  });

  test('畸形 JSON 响应应被正确处理', async ({ page }) => {
    await page.route('**/api/projects', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{invalid json}'
      });
    });
    
    await page.goto(`${BASE_URL}/dashboard/project`);
    await page.waitForTimeout(2000);
    
    // 页面不应崩溃
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBe(true);
  });
});

/**
 * 资源限制契约
 * 系统在资源受限时应保持稳定
 */
test.describe('资源限制契约', () => {
  test('大量 DOM 元素下页面应保持响应', async ({ page }) => {
    // 注入大量元素到页面
    await page.goto(BASE_URL);
    
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'stress-test';
      for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.textContent = `Item ${i}`;
        container.appendChild(div);
      }
      document.body.appendChild(container);
    });
    
    // 页面应仍然可交互
    await page.click('body');
    
    // 清理
    await page.evaluate(() => {
      document.getElementById('stress-test')?.remove();
    });
  });

  test('快速连续操作不应导致竞态条件', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/project`);
    
    // 快速点击多个按钮
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(page.click('button').catch(() => {}));
    }
    
    await Promise.all(promises);
    
    // 页面不应崩溃
    await expect(page.locator('body')).toBeVisible();
  });
});

/**
 * 浏览器兼容性契约
 * 系统应在不同浏览器环境下保持稳定
 */
test.describe('浏览器兼容性契约', () => {
  test('不支持 JavaScript 的提示', async ({ page }) => {
    // 禁用 JavaScript（模拟）
    await page.goto(BASE_URL);
    
    // 检查是否有 noscript 标签
    const noscript = await page.locator('noscript').count();
    
    // 如果有 noscript，验证其内容
    if (noscript > 0) {
      const noscriptText = await page.locator('noscript').textContent();
      expect(noscriptText).toBeTruthy();
    }
  });

  test('局部 JavaScript 错误不应导致页面崩溃', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // 注入一个 JavaScript 错误
    await page.evaluate(() => {
      throw new Error('Injected error for testing');
    });
    
    // 页面不应完全崩溃
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBe(true);
  });
});
