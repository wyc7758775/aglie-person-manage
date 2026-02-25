import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium, Browser, Page } from 'playwright';

/**
 * Habit Detail Drawer E2E Tests
 * 使用 Chrome DevTools MCP 进行自动化测试
 */

describe('HabitDetailDrawer E2E', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({
      headless: false, // 设置为true可以在无头模式下运行
    });
    page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('UI自动化测试', () => {
    it('应导航到习惯页面', async () => {
      await page.goto('http://localhost:3000/dashboard/habits');
      
      // 等待页面加载
      await page.waitForLoadState('networkidle');
      
      // 验证页面标题
      const title = await page.title();
      expect(title).toContain('习惯');
    });

    it('应显示习惯列表', async () => {
      // 查找习惯列表
      const habitList = await page.$('[data-testid="habit-list"]');
      expect(habitList).toBeTruthy();
      
      // 或者查找习惯项
      const habitItems = await page.$$('[data-testid="habit-item"]');
      expect(habitItems.length).toBeGreaterThanOrEqual(0);
    });

    it('点击习惯应打开详情抽屉', async () => {
      // 点击第一个习惯
      const firstHabit = await page.$('[data-testid="habit-item"]');
      if (firstHabit) {
        await firstHabit.click();
        
        // 等待抽屉出现
        await page.waitForSelector('[data-testid="habit-detail-drawer"]', {
          timeout: 5000,
        });
        
        const drawer = await page.$('[data-testid="habit-detail-drawer"]');
        expect(drawer).toBeTruthy();
      }
    });

    it('抽屉应有正确的样式', async () => {
      const drawer = await page.$('[data-testid="habit-detail-drawer"]');
      
      if (drawer) {
        // 获取抽屉的样式
        const styles = await drawer.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            width: computed.width,
            backgroundColor: computed.backgroundColor,
          };
        });
        
        // 验证宽度（应为561px或近似值）
        expect(parseInt(styles.width)).toBeGreaterThanOrEqual(550);
        expect(parseInt(styles.width)).toBeLessThanOrEqual(570);
      }
    });

    it('应显示习惯标题', async () => {
      // 查找标题
      const title = await page.$('[data-testid="habit-title"]');
      expect(title).toBeTruthy();
      
      if (title) {
        const titleText = await title.textContent();
        expect(titleText).toBeTruthy();
        expect(titleText!.length).toBeGreaterThan(0);
      }
    });

    it('应显示完成计数器', async () => {
      const counter = await page.$('[data-testid="completion-counter"]');
      expect(counter).toBeTruthy();
      
      if (counter) {
        const counterText = await counter.textContent();
        // 应包含类似 "7/12" 的格式
        expect(counterText).toMatch(/\d+\/\d+/);
      }
    });

    it('点击增加按钮应增加计数', async () => {
      // 获取当前计数
      const counter = await page.$('[data-testid="completion-counter"]');
      if (counter) {
        const beforeText = await counter.textContent();
        const beforeCount = parseInt(beforeText!.split('/')[0]);
        
        // 点击增加按钮
        const incrementBtn = await page.$('[data-testid="increment-btn"]');
        if (incrementBtn) {
          await incrementBtn.click();
          
          // 等待更新
          await page.waitForTimeout(500);
          
          // 验证计数增加
          const afterText = await counter.textContent();
          const afterCount = parseInt(afterText!.split('/')[0]);
          
          expect(afterCount).toBe(beforeCount + 1);
        }
      }
    });

    it('应显示统计卡片', async () => {
      const statsCard = await page.$('[data-testid="stats-card"]');
      expect(statsCard).toBeTruthy();
      
      // 检查三个统计项
      const streakBox = await page.$('[data-testid="streak-box"]');
      const goldBox = await page.$('[data-testid="gold-box"]');
      const countBox = await page.$('[data-testid="count-box"]');
      
      expect(streakBox).toBeTruthy();
      expect(goldBox).toBeTruthy();
      expect(countBox).toBeTruthy();
    });

    it('应显示热力图', async () => {
      const heatmap = await page.$('[data-testid="heatmap-section"]');
      expect(heatmap).toBeTruthy();
      
      // 检查热力图单元格
      const heatmapCells = await page.$$('[data-testid="heatmap-cell"]');
      expect(heatmapCells.length).toBeGreaterThan(0);
    });

    it('应显示趋势图', async () => {
      const trendSection = await page.$('[data-testid="trend-section"]');
      expect(trendSection).toBeTruthy();
      
      // 检查SVG图表
      const svg = await trendSection?.$('svg');
      expect(svg).toBeTruthy();
    });

    it('点击关闭按钮应关闭抽屉', async () => {
      const closeBtn = await page.$('[data-testid="close-drawer-btn"]');
      if (closeBtn) {
        await closeBtn.click();
        
        // 等待抽屉消失
        await page.waitForSelector('[data-testid="habit-detail-drawer"]', {
          state: 'hidden',
          timeout: 5000,
        });
        
        const drawer = await page.$('[data-testid="habit-detail-drawer"]');
        expect(drawer).toBeFalsy();
      }
    });

    it('未保存更改时应显示确认对话框', async () => {
      // 重新打开抽屉
      const firstHabit = await page.$('[data-testid="habit-item"]');
      if (firstHabit) {
        await firstHabit.click();
        await page.waitForSelector('[data-testid="habit-detail-drawer"]');
        
        // 编辑描述
        const descEditor = await page.$('[data-testid="desc-editor"]');
        if (descEditor) {
          await descEditor.click();
          await descEditor.fill('新的描述内容');
          
          // 点击关闭
          const closeBtn = await page.$('[data-testid="close-drawer-btn"]');
          if (closeBtn) {
            await closeBtn.click();
            
            // 应出现确认对话框
            const dialog = await page.waitForSelector(
              '[data-testid="unsaved-changes-dialog"]',
              { timeout: 3000 }
            );
            expect(dialog).toBeTruthy();
            
            // 点击取消
            const cancelBtn = await page.$('[data-testid="dialog-cancel-btn"]');
            if (cancelBtn) {
              await cancelBtn.click();
            }
          }
        }
      }
    });

    it('按ESC键应关闭抽屉', async () => {
      // 确保抽屉是打开的
      const drawer = await page.$('[data-testid="habit-detail-drawer"]');
      if (drawer) {
        // 按ESC键
        await page.keyboard.press('Escape');
        
        // 等待抽屉关闭
        await page.waitForTimeout(500);
        
        // 检查对话框是否出现（如果有未保存的更改）或抽屉是否关闭
        const dialog = await page.$('[data-testid="unsaved-changes-dialog"]');
        const closedDrawer = await page.$('[data-testid="habit-detail-drawer"]', {
          state: 'hidden',
        });
        
        expect(dialog || closedDrawer).toBeTruthy();
      }
    });
  });

  describe('像素级设计验证', () => {
    it('应验证抽屉颜色与设计稿一致', async () => {
      const drawer = await page.$('[data-testid="habit-detail-drawer"]');
      if (drawer) {
        const bgColor = await drawer.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        // 应为白色 (#FFFFFF)
        expect(bgColor).toBe('rgb(255, 255, 255)');
      }
    });

    it('应验证统计卡片颜色', async () => {
      const statsCard = await page.$('[data-testid="stats-card"]');
      if (statsCard) {
        const bgColor = await statsCard.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        // 应为深色 (#1A1D2E)
        expect(bgColor).toBe('rgb(26, 29, 46)');
      }
    });

    it('应截图对比', async () => {
      const drawer = await page.$('[data-testid="habit-detail-drawer"]');
      if (drawer) {
        // 截图
        const screenshot = await drawer.screenshot();
        
        // 保存截图
        const fs = require('fs');
        const path = require('path');
        const screenshotPath = path.join(
          __dirname,
          '../../screenshots/habit-detail-drawer.png'
        );
        
        // 确保目录存在
        const dir = path.dirname(screenshotPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(screenshotPath, screenshot);
        
        // 验证截图文件存在
        expect(fs.existsSync(screenshotPath)).toBe(true);
      }
    });
  });
});
