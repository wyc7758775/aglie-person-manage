import { test, expect } from '@playwright/test'

test.describe('首页', () => {
  test('应能打开首页', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Agile|敏捷|Person Manage/i)
  })
})
