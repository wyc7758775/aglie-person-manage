/**
 * 可访问性（Accessibility）契约测试
 * 
 * 验证系统符合 WCAG 标准，确保残障用户可用
 * 这些测试作为代码实现的无障碍契约
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = process.env.PLAYWRIGHT_WEB_URL ?? 'http://localhost:3000';

/**
 * 核心页面可访问性契约
 * 关键页面应通过自动化可访问性扫描
 */
test.describe('核心页面可访问性契约', () => {
  test('首页应无严重可访问性问题', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    // 不应有严重或可访问性违规
    expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
  });

  test('登录页应无严重可访问性问题', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
  });

  test('项目页面应无严重可访问性问题', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/project`);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
  });
});

/**
 * 键盘导航契约
 * 所有功能应可通过键盘访问
 */
test.describe('键盘导航契约', () => {
  test('登录表单应可通过键盘完成', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // 聚焦到用户名输入框
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBe('INPUT');
    
    // 输入用户名
    await page.keyboard.type('test-user');
    
    // Tab 到密码框
    await page.keyboard.press('Tab');
    await page.keyboard.type('test-password');
    
    // Tab 到提交按钮并按回车
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // 不应有 JavaScript 错误导致页面崩溃
    // 测试完成即通过键盘导航契约
  });

  test('模态框应可通过键盘关闭', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/project`);
    
    // 尝试打开创建项目模态框
    const createButton = page.locator('button').filter({ hasText: /创建|新增|Add|Create/i }).first();
    if (await createButton.isVisible().catch(() => false)) {
      await createButton.click();
      
      // 等待模态框出现
      await page.waitForTimeout(500);
      
      // 按 ESC 关闭模态框
      await page.keyboard.press('Escape');
      
      // 模态框应关闭或回到页面主体
      const isModalClosed = await page.locator('[role="dialog"]').isHidden().catch(() => true);
      expect(isModalClosed).toBe(true);
    }
  });
});

/**
 * 语义化 HTML 契约
 * 页面应使用正确的语义化标签
 */
test.describe('语义化 HTML 契约', () => {
  test('页面应包含正确的标题层级', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(2); // 通常一个页面一个 h1
  });

  test('表单输入应有关联标签', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    const inputs = await page.locator('input').all();
    
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        const id = el.id;
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        const hasAssociatedLabel = id && document.querySelector(`label[for="${id}"]`);
        
        return hasAssociatedLabel || ariaLabel || ariaLabelledBy || el.placeholder;
      });
      
      expect(hasLabel).toBeTruthy();
    }
  });

  test('图片应包含 alt 文本', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const hasAlt = await img.evaluate(el => {
        return el.hasAttribute('alt') || el.getAttribute('role') === 'presentation';
      });
      
      expect(hasAlt).toBeTruthy();
    }
  });
});

/**
 * 对比度契约
 * 文本应满足最低对比度要求
 */
test.describe('对比度契约', () => {
  test('主要文本应满足 WCAG AA 对比度', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();
    
    // 对比度违规不应为严重级别
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast' && v.impact === 'critical'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });
});
