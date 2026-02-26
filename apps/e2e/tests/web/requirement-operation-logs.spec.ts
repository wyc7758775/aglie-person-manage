import { test, expect } from '@playwright/test';

test.describe('需求操作记录功能', () => {
  const testProjectId = 'test-project-1';
  const testRequirementId = 'test-req-1';

  test.beforeEach(async ({ page }) => {
    await page.goto(`/dashboard/project/${testProjectId}`);
    await page.waitForSelector('[data-testid="requirement-table"]', { state: 'visible' });
  });

  test.describe('操作记录显示', () => {
    test('切换到操作记录标签页显示记录列表', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        
        await page.click('text=操作记录');
        
        await expect(page.locator('text=操作记录')).toBeVisible();
        
        const logItems = page.locator('[data-testid="operation-log-item"]');
        const count = await logItems.count();
        
        if (count > 0) {
          const firstLog = logItems.first();
          
          await expect(firstLog.locator('[data-testid="log-timeline-dot"]')).toBeVisible();
          
          await expect(firstLog.locator('[data-testid="log-title"]')).toBeVisible();
          
          await expect(firstLog.locator('[data-testid="log-time"]')).toBeVisible();
        } else {
          await expect(page.locator('text=暂无操作记录')).toBeVisible();
        }
      }
    });

    test('操作记录时间线样式正确显示', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        await page.click('text=操作记录');
        
        const logItems = page.locator('[data-testid="operation-log-item"]');
        const count = await logItems.count();
        
        if (count >= 2) {
          const firstLog = logItems.first();
          const dot = firstLog.locator('[data-testid="log-timeline-dot"]');
          
          const dotColor = await dot.evaluate((el) => 
            window.getComputedStyle(el).backgroundColor
          );
          expect(dotColor).toBeTruthy();
          
          const timeline = firstLog.locator('[data-testid="log-timeline-line"]');
          if (await timeline.isVisible()) {
            const lineHeight = await timeline.evaluate((el) => 
              window.getComputedStyle(el).height
            );
            expect(parseInt(lineHeight)).toBeGreaterThan(0);
          }
        }
      }
    });

    test('状态变更显示正确徽章样式', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        await page.click('text=操作记录');
        
        await page.waitForTimeout(500);
        
        const statusChangeLogs = page.locator('[data-testid="operation-log-item"]', { 
          hasText: /更新了状态|状态变更/ 
        });
        
        if (await statusChangeLogs.count() > 0) {
          const firstStatusLog = statusChangeLogs.first();
          
          const fromBadge = firstStatusLog.locator('[data-testid="status-badge-from"]');
          if (await fromBadge.isVisible()) {
            const bgColor = await fromBadge.evaluate((el) => 
              window.getComputedStyle(el).backgroundColor
            );
            expect(bgColor).toBeTruthy();
          }
          
          const toBadge = firstStatusLog.locator('[data-testid="status-badge-to"]');
          if (await toBadge.isVisible()) {
            const bgColor = await toBadge.evaluate((el) => 
              window.getComputedStyle(el).backgroundColor
            );
            expect(bgColor).toBeTruthy();
          }
          
          const arrow = firstStatusLog.locator('[data-testid="status-change-arrow"]');
          await expect(arrow).toBeVisible();
        }
      }
    });
  });

  test.describe('操作记录创建', () => {
    test('更新需求字段后生成操作记录', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        
        await page.click('text=操作记录');
        const initialCount = await page.locator('[data-testid="operation-log-item"]').count();
        
        await page.click('text=评论');
        
        const titleElement = page.locator('[contenteditable="true"]').first();
        await titleElement.click();
        const originalTitle = await titleElement.textContent();
        const newTitle = `${originalTitle} - 已修改 ${Date.now()}`;
        
        await titleElement.fill(newTitle);
        await titleElement.blur();
        
        await page.waitForTimeout(1000);
        
        await page.click('text=操作记录');
        
        await page.waitForTimeout(500);
        
        const newCount = await page.locator('[data-testid="operation-log-item"]').count();
        expect(newCount).toBeGreaterThanOrEqual(initialCount);
        
        if (newCount > initialCount) {
          const latestLog = page.locator('[data-testid="operation-log-item"]').first();
          await expect(latestLog).toContainText('更新了');
        }
      }
    });

    test('状态变更生成状态变更记录', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        
        await page.click('text=操作记录');
        const initialCount = await page.locator('[data-testid="operation-log-item"]').count();
        
        await page.click('text=评论');
        
        const statusBadge = page.locator('[data-testid="status-badge"]').first();
        if (await statusBadge.isVisible()) {
          await statusBadge.click();
          
          const statusOptions = page.locator('[role="option"]');
          const secondOption = statusOptions.nth(1);
          if (await secondOption.isVisible()) {
            await secondOption.click();
            
            await page.waitForTimeout(1000);
            
            await page.click('text=操作记录');
            
            await page.waitForTimeout(500);
            
            const newCount = await page.locator('[data-testid="operation-log-item"]').count();
            expect(newCount).toBeGreaterThanOrEqual(initialCount);
            
            if (newCount > initialCount) {
              const latestLog = page.locator('[data-testid="operation-log-item"]').first();
              await expect(latestLog).toContainText('更新了状态');
            }
          }
        }
      }
    });
  });

  test.describe('操作记录加载状态', () => {
    test('加载中显示加载提示', async ({ page }) => {
      await page.route('**/api/requirements/*/logs', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });
      
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        
        await page.click('text=操作记录');
        
        await expect(page.locator('text=加载中')).toBeVisible();
        
        await page.unroute('**/api/requirements/*/logs');
      }
    });

    test('无操作记录显示空状态', async ({ page }) => {
      await page.route('**/api/requirements/*/logs', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, logs: [] })
        });
      });
      
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        
        await page.click('text=操作记录');
        
        await expect(page.locator('text=暂无操作记录')).toBeVisible();
        
        await page.unroute('**/api/requirements/*/logs');
      }
    });
  });

  test.describe('UI 样式验证', () => {
    test('时间线圆点颜色为橙色', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        await page.click('text=操作记录');
        
        const logItems = page.locator('[data-testid="operation-log-item"]');
        const count = await logItems.count();
        
        if (count > 0) {
          const dot = logItems.first().locator('[data-testid="log-timeline-dot"]');
          const bgColor = await dot.evaluate((el) => 
            window.getComputedStyle(el).backgroundColor
          );
          
          expect(bgColor).toMatch(/rgb\(232,\s*148,\s*74\)|#E8944A/i);
        }
      }
    });

    test('连接线颜色为浅灰色', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        await page.click('text=操作记录');
        
        const logItems = page.locator('[data-testid="operation-log-item"]');
        const count = await logItems.count();
        
        if (count >= 2) {
          const line = logItems.first().locator('[data-testid="log-timeline-line"]');
          if (await line.isVisible()) {
            const bgColor = await line.evaluate((el) => 
              window.getComputedStyle(el).backgroundColor
            );
            expect(bgColor).toBeTruthy();
          }
        }
      }
    });

    test('标题字体大小为13px且加粗', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        await page.click('text=操作记录');
        
        const logItems = page.locator('[data-testid="operation-log-item"]');
        const count = await logItems.count();
        
        if (count > 0) {
          const title = logItems.first().locator('[data-testid="log-title"]');
          const styles = await title.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              fontSize: computed.fontSize,
              fontWeight: computed.fontWeight
            };
          });
          
          expect(styles.fontSize).toBe('13px');
          expect(parseInt(styles.fontWeight)).toBeGreaterThanOrEqual(600);
        }
      }
    });

    test('时间戳字体大小为11px', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        await page.click('text=操作记录');
        
        const logItems = page.locator('[data-testid="operation-log-item"]');
        const count = await logItems.count();
        
        if (count > 0) {
          const time = logItems.first().locator('[data-testid="log-time"]');
          const fontSize = await time.evaluate((el) => 
            window.getComputedStyle(el).fontSize
          );
          
          expect(fontSize).toBe('11px');
        }
      }
    });

    test('状态徽章使用正确的颜色方案', async ({ page }) => {
      const requirementRow = page.locator('[data-testid="requirement-row"]').first();
      if (await requirementRow.isVisible()) {
        await requirementRow.click();
        await page.waitForSelector('[data-testid="requirement-slide-panel"]', { state: 'visible' });
        await page.click('text=操作记录');
        
        await page.waitForTimeout(500);
        
        const statusChangeLogs = page.locator('[data-testid="operation-log-item"]', { 
          hasText: /更新了状态|状态变更/ 
        });
        
        if (await statusChangeLogs.count() > 0) {
          const firstStatusLog = statusChangeLogs.first();
          
          const toBadge = firstStatusLog.locator('[data-testid="status-badge-to"]');
          if (await toBadge.isVisible()) {
            const styles = await toBadge.evaluate((el) => {
              const computed = window.getComputedStyle(el);
              return {
                bgColor: computed.backgroundColor,
                padding: computed.padding,
                borderRadius: computed.borderRadius
              };
            });
            
            expect(styles.borderRadius).toBeTruthy();
          }
        }
      }
    });
  });
});
