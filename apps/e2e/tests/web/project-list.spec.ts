import { test, expect } from '@playwright/test';

test.describe('项目列表交互优化', () => {
  // 辅助函数：等待列表加载完成
  const waitForListLoaded = async (page) => {
    await page.waitForSelector('[data-testid="project-list"]', { state: 'visible' });
  };

  // 辅助函数：获取项目卡片
  const getProjectCards = async (page) => {
    return await page.locator('[data-testid="project-card"]').all();
  };

  test.describe('局部刷新功能', () => {
    test('编辑项目后流畅的用户体验', async ({ page }) => {
      // 1. 登录并访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 记录初始状态：项目 A 和 B 的内容
      const cards = await getProjectCards(page);
      test.skip(cards.length < 2, '需要至少 2 个项目来测试局部刷新');

      const projectA = cards[0];
      const projectB = cards[1];
      
      const projectANameBefore = await projectA.locator('[data-testid="project-name"]').textContent();
      const projectBNameBefore = await projectB.locator('[data-testid="project-name"]').textContent();
      const projectBPosition = await projectB.boundingBox();

      // 3. 编辑项目 A
      await projectA.locator('[data-testid="project-menu"]').click();
      await page.click('text=编辑');
      
      // 4. 修改名称
      const newName = `测试项目-${Date.now()}`;
      await page.locator('[data-testid="project-name-input"]').fill(newName);
      
      // 5. 保存
      await page.click('text=保存');
      await page.waitForTimeout(500);

      // 6. 验证：项目 A 显示新名称
      const projectANameAfter = await projectA.locator('[data-testid="project-name"]').textContent();
      expect(projectANameAfter).toBe(newName);

      // 7. 验证：项目 B 的内容未变
      const projectBNameAfter = await projectB.locator('[data-testid="project-name"]').textContent();
      expect(projectBNameAfter).toBe(projectBNameBefore);

      // 8. 验证：项目 B 的位置未变（无重新渲染/闪烁）
      const projectBPositionAfter = await projectB.boundingBox();
      expect(projectBPositionAfter?.y).toBe(projectBPosition?.y);
    });

    test('创建项目后无缝添加到列表', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 记录初始项目数量
      const cardsBefore = await getProjectCards(page);
      const initialCount = cardsBefore.length;

      // 3. 点击创建按钮
      await page.click('[data-testid="add-project-button"]');

      // 4. 填写项目名称
      const newProjectName = `新项目-${Date.now()}`;
      await page.locator('[data-testid="project-name-input"]').fill(newProjectName);
      await page.locator('[data-testid="project-name-input"]').blur();

      // 5. 保存
      await page.click('text=创建');
      await page.waitForTimeout(1000);

      // 6. 验证：新项目出现在列表中
      const cardsAfter = await getProjectCards(page);
      expect(cardsAfter.length).toBe(initialCount + 1);

      // 7. 验证：原有项目仍然存在
      const newProject = cardsAfter.find(async (card) => {
        const name = await card.locator('[data-testid="project-name"]').textContent();
        return name === newProjectName;
      });
      expect(newProject).toBeTruthy();
    });

    test('删除项目后平滑移除', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 记录初始项目列表
      const cardsBefore = await getProjectCards(page);
      test.skip(cardsBefore.length === 0, '需要至少 1 个项目来测试删除');

      const firstProjectName = await cardsBefore[0].locator('[data-testid="project-name"]').textContent();

      // 3. 删除第一个项目
      await cardsBefore[0].locator('[data-testid="project-menu"]').click();
      await page.click('text=删除');
      
      // 4. 确认删除（如果有确认对话框）
      const confirmDialog = page.locator('text=确定要删除');
      if (await confirmDialog.isVisible().catch(() => false)) {
        await page.click('text=确定');
      }

      await page.waitForTimeout(500);

      // 5. 验证：被删除的项目不再显示
      const cardsAfter = await getProjectCards(page);
      const deletedProject = cardsAfter.find(async (card) => {
        const name = await card.locator('[data-testid="project-name"]').textContent();
        return name === firstProjectName;
      });
      expect(deletedProject).toBeFalsy();
    });
  });

  test.describe('缓存和加载体验', () => {
    test('从项目详情返回时的即时响应', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 记录第一个项目的名称
      const cards = await getProjectCards(page);
      test.skip(cards.length === 0, '需要至少 1 个项目');
      
      const firstProjectName = await cards[0].locator('[data-testid="project-name"]').textContent();

      // 3. 点击进入第一个项目详情
      await cards[0].click();
      await page.waitForURL(/\/dashboard\/project\/\w+/);

      // 4. 点击返回按钮
      const startTime = Date.now();
      await page.goBack();
      
      // 5. 验证：列表立即显示（无明显加载等待）
      await waitForListLoaded(page);
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(1000); // 应该在 1 秒内显示

      // 6. 验证：内容与离开前一致
      const cardsAfter = await getProjectCards(page);
      const firstCardName = await cardsAfter[0].locator('[data-testid="project-name"]').textContent();
      expect(firstCardName).toBe(firstProjectName);
    });

    test('网络较慢时的优雅降级', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 模拟慢速网络
      await page.context().setOffline(false);
      await page.route('**/api/projects**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 延迟 5 秒
        await route.continue();
      });

      // 3. 触发刷新
      await page.click('[data-testid="refresh-button"]');

      // 4. 验证：用户仍能看到列表（显示缓存数据）
      const cards = await getProjectCards(page);
      expect(cards.length).toBeGreaterThan(0);

      // 5. 验证：可以进行操作
      await expect(cards[0]).toBeVisible();

      // 清理路由拦截
      await page.unroute('**/api/projects**');
    });

    test('首次加载的加载体验', async ({ page }) => {
      // 1. 清除缓存（模拟首次访问）
      await page.context().clearCookies();

      // 2. 拦截 API 请求延迟响应
      await page.route('**/api/projects**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 延迟 2 秒
        await route.continue();
      });

      // 3. 访问列表页
      await page.goto('/dashboard/project');

      // 4. 验证：显示加载占位符（骨架屏）
      const skeleton = page.locator('[data-testid="project-skeleton"]');
      await expect(skeleton.first()).toBeVisible();

      // 5. 等待数据加载完成
      await waitForListLoaded(page);

      // 6. 验证：显示真实内容
      const cards = await getProjectCards(page);
      expect(cards.length).toBeGreaterThan(0);

      // 清理路由拦截
      await page.unroute('**/api/projects**');
    });

    test('手动刷新获取最新数据', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 点击刷新按钮
      await page.click('[data-testid="refresh-button"]');

      // 3. 验证：显示加载状态
      const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
      await expect(loadingIndicator).toBeVisible();

      // 4. 验证：更新后的数据显示
      await waitForListLoaded(page);
      const cards = await getProjectCards(page);
      expect(cards.length).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('未保存确认功能', () => {
    test('防止未保存数据的意外丢失', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 打开编辑抽屉
      const cards = await getProjectCards(page);
      test.skip(cards.length === 0, '需要至少 1 个项目');

      await cards[0].locator('[data-testid="project-menu"]').click();
      await page.click('text=编辑');

      // 3. 修改字段
      await page.locator('[data-testid="project-name-input"]').fill('修改后的名称');

      // 4. 尝试关闭抽屉
      await page.click('[data-testid="drawer-close-button"]');

      // 5. 验证：显示确认对话框
      const dialog = page.locator('[data-testid="unsaved-changes-dialog"]');
      await expect(dialog).toBeVisible();

      // 6. 验证：包含三个选项
      await expect(dialog.locator('text=保存并关闭')).toBeVisible();
      await expect(dialog.locator('text=放弃更改')).toBeVisible();
      await expect(dialog.locator('text=取消')).toBeVisible();
    });

    test('保存并关闭编辑的数据持久化', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 打开编辑
      const cards = await getProjectCards(page);
      test.skip(cards.length === 0, '需要至少 1 个项目');

      await cards[0].locator('[data-testid="project-menu"]').click();
      await page.click('text=编辑');

      // 3. 修改名称
      const newName = `持久化测试-${Date.now()}`;
      await page.locator('[data-testid="project-name-input"]').fill(newName);

      // 4. 触发关闭并选择"保存并关闭"
      await page.click('[data-testid="drawer-close-button"]');
      await page.click('text=保存并关闭');

      // 5. 验证：抽屉关闭
      await expect(page.locator('[data-testid="project-drawer"]')).not.toBeVisible();

      // 6. 验证：列表显示新名称
      await page.waitForTimeout(500);
      const updatedCard = page.locator('[data-testid="project-card"]').first();
      await expect(updatedCard.locator('[data-testid="project-name"]')).toContainText(newName);

      // 7. 刷新页面验证持久化
      await page.reload();
      await waitForListLoaded(page);
      
      const cardAfterReload = page.locator('[data-testid="project-card"]').first();
      await expect(cardAfterReload.locator('[data-testid="project-name"]')).toContainText(newName);
    });

    test('放弃更改后的数据回滚', async ({ page }) => {
      // 1. 访问项目列表并记录原始名称
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      const cards = await getProjectCards(page);
      test.skip(cards.length === 0, '需要至少 1 个项目');

      const originalName = await cards[0].locator('[data-testid="project-name"]').textContent();

      // 2. 打开编辑并修改
      await cards[0].locator('[data-testid="project-menu"]').click();
      await page.click('text=编辑');
      await page.locator('[data-testid="project-name-input"]').fill('临时修改名称');

      // 3. 触发关闭并选择"放弃更改"
      await page.click('[data-testid="drawer-close-button"]');
      await page.click('text=放弃更改');

      // 4. 验证：抽屉关闭
      await expect(page.locator('[data-testid="project-drawer"]')).not.toBeVisible();

      // 5. 验证：列表显示原始名称
      await page.waitForTimeout(500);
      const card = page.locator('[data-testid="project-card"]').first();
      const currentName = await card.locator('[data-testid="project-name"]').textContent();
      expect(currentName).toBe(originalName);

      // 6. 重新打开编辑验证显示原始数据
      await card.locator('[data-testid="project-menu"]').click();
      await page.click('text=编辑');
      const inputValue = await page.locator('[data-testid="project-name-input"]').inputValue();
      expect(inputValue).toBe(originalName);
    });

    test('取消关闭后继续编辑', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 打开编辑并修改
      const cards = await getProjectCards(page);
      test.skip(cards.length === 0, '需要至少 1 个项目');

      await cards[0].locator('[data-testid="project-menu"]').click();
      await page.click('text=编辑');

      const modifiedName = '取消测试修改';
      await page.locator('[data-testid="project-name-input"]').fill(modifiedName);

      // 3. 触发关闭并选择"取消"
      await page.click('[data-testid="drawer-close-button"]');
      await page.click('text=取消');

      // 4. 验证：确认对话框消失
      await expect(page.locator('[data-testid="unsaved-changes-dialog"]')).not.toBeVisible();

      // 5. 验证：抽屉保持打开
      await expect(page.locator('[data-testid="project-drawer"]')).toBeVisible();

      // 6. 验证：修改的内容仍在
      const inputValue = await page.locator('[data-testid="project-name-input"]').inputValue();
      expect(inputValue).toBe(modifiedName);
    });

    test('无修改时的流畅关闭', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 打开编辑但不修改
      const cards = await getProjectCards(page);
      test.skip(cards.length === 0, '需要至少 1 个项目');

      await cards[0].locator('[data-testid="project-menu"]').click();
      await page.click('text=编辑');

      // 3. 直接关闭
      await page.click('[data-testid="drawer-close-button"]');

      // 4. 验证：抽屉立即关闭（不显示确认对话框）
      await expect(page.locator('[data-testid="unsaved-changes-dialog"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="project-drawer"]')).not.toBeVisible();

      // 5. 重新打开编辑
      await cards[0].locator('[data-testid="project-menu"]').click();
      await page.click('text=编辑');

      // 6. 验证：显示原始数据
      const inputValue = await page.locator('[data-testid="project-name-input"]').inputValue();
      expect(inputValue).toBeTruthy();
    });

    test('二次打开创建弹窗时表单正确重置', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      // 2. 第一次打开创建弹窗
      await page.click('[data-testid="add-project-button"]');
      await page.waitForSelector('[data-testid="project-drawer"]', { state: 'visible' });

      // 3. 填写表单字段
      await page.locator('[data-testid="project-name-input"]').fill('第一次测试项目');
      await page.locator('[data-testid="project-description-input"]').fill('这是第一次测试的描述');

      // 4. 放弃更改关闭弹窗
      await page.click('[data-testid="drawer-close-button"]');
      await page.click('text=放弃更改');
      await expect(page.locator('[data-testid="project-drawer"]')).not.toBeVisible();

      // 5. 第二次打开创建弹窗
      await page.click('[data-testid="add-project-button"]');
      await page.waitForSelector('[data-testid="project-drawer"]', { state: 'visible' });

      // 6. 验证：所有字段已重置为默认值
      const nameInput = page.locator('[data-testid="project-name-input"]');
      await expect(nameInput).toHaveValue('');
      
      const descriptionInput = page.locator('[data-testid="project-description-input"]');
      await expect(descriptionInput).toHaveValue('');
      
      // 验证其他字段是否为默认值
      const typeSelect = page.locator('[data-testid="project-type-select"]');
      await expect(typeSelect).toHaveValue('sprint-project');
      
      const prioritySelect = page.locator('[data-testid="project-priority-select"]');
      await expect(prioritySelect).toHaveValue('medium');
      
      // 验证富文本编辑器内容已清空
      const editorContent = page.locator('[data-testid="markdown-editor-content"]');
      await expect(editorContent).toHaveText('');
    });
  });

  test.describe('边界情况', () => {
    test('快速连续编辑的稳定性', async ({ page }) => {
      // 1. 访问项目列表
      await page.goto('/dashboard/project');
      await waitForListLoaded(page);

      const cards = await getProjectCards(page);
      test.skip(cards.length < 2, '需要至少 2 个项目');

      // 2. 快速连续编辑多个项目
      for (let i = 0; i < Math.min(3, cards.length); i++) {
        await cards[i].locator('[data-testid="project-menu"]').click();
        await page.click('text=编辑');
        
        await page.locator('[data-testid="project-name-input"]').fill(`快速编辑-${i}-${Date.now()}`);
        
        // 保存并关闭
        await page.click('[data-testid="drawer-close-button"]');
        const dialog = page.locator('[data-testid="unsaved-changes-dialog"]');
        if (await dialog.isVisible().catch(() => false)) {
          await page.click('text=保存并关闭');
        }
        
        await page.waitForTimeout(300);
      }

      // 3. 验证：列表状态保持一致
      const cardsAfter = await getProjectCards(page);
      expect(cardsAfter.length).toBe(cards.length);
    });
  });
});
