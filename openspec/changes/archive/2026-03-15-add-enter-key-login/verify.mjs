/**
 * Playwriter 验证脚本 - add-enter-key-login
 * 验证登录/注册表单的回车键提交功能
 */

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  changeId: 'add-enter-key-login',
}

const scenarios = [
  {
    name: '场景1: 登录模式下回车键提交',
    steps: [
      { action: 'goto', url: `${CONFIG.baseUrl}` },
      { action: 'waitForSelector', selector: 'input[placeholder*="账号"], input[placeholder*="昵称"]' },
      // 填写账号
      { action: 'fill', selector: 'input[type="text"]', value: 'wuyucun' },
      // 填写密码
      { action: 'fill', selector: 'input[type="password"]', value: 'wyc7758775' },
      // 在密码框按回车
      { action: 'press', selector: 'input[type="password"]', key: 'Enter' },
      // 等待跳转到 dashboard
      { action: 'waitForURL', timeout: 5000 },
    ],
    expect: '应自动跳转到 dashboard 页面',
    verify: async (page) => {
      const url = page.url()
      return url.includes('/dashboard')
    }
  },
  {
    name: '场景2: 验证按钮 type 属性',
    steps: [
      { action: 'goto', url: `${CONFIG.baseUrl}` },
      { action: 'waitForSelector', selector: 'button[type="submit"]' },
    ],
    expect: '登录按钮应有 type="submit" 属性',
    verify: async (page) => {
      const button = await page.$('button[type="submit"]')
      return button !== null
    }
  },
  {
    name: '场景3: 空账号时回车键不提交（显示错误）',
    steps: [
      { action: 'goto', url: `${CONFIG.baseUrl}` },
      { action: 'waitForSelector', selector: 'input[type="text"]' },
      // 清空账号输入框
      { action: 'fill', selector: 'input[type="text"]', value: '' },
      // 填写密码
      { action: 'fill', selector: 'input[type="password"]', value: 'test123' },
      // 在密码框按回车
      { action: 'press', selector: 'input[type="password"]', key: 'Enter' },
      // 等待 toast 提示
      { action: 'waitForTimeout', timeout: 1000 },
    ],
    expect: '应显示账号必填的错误提示，不跳转',
    verify: async (page) => {
      const url = page.url()
      // 应该还在登录页面
      return !url.includes('/dashboard')
    }
  },
]

export { CONFIG, scenarios }
