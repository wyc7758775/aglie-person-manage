#!/usr/bin/env node
/**
 * Playwright MCP 工具库
 *
 * 提供在自动化工作流中使用 Playwright MCP 的便捷函数
 */

const { MCPClient, loadMCPConfig } = require('./lib/mcp-client');

class PlaywrightMCPHelper {
  constructor() {
    this.client = null;
    this.pageId = null;
    this.browserId = null;
  }

  /**
   * 连接到 Playwright MCP Server
   */
  async connect() {
    const config = loadMCPConfig();
    this.client = new MCPClient('playwright', config.playwright);
    await this.client.connect();
    return this;
  }

  /**
   * 断开连接
   */
  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
  }

  /**
   * 启动浏览器
   */
  async launchBrowser(options = {}) {
    const result = await this.client.callTool('playwright_launch', {
      browserType: options.browserType || 'chromium',
      headless: options.headless !== false,
      viewport: options.viewport || { width: 1280, height: 720 }
    });

    if (!result.success) {
      throw new Error('浏览器启动失败: ' + result.error);
    }

    this.browserId = result.browserId;
    this.pageId = result.pageId;

    return result;
  }

  /**
   * 导航到页面
   */
  async navigate(url, waitUntil = 'load') {
    if (!this.pageId) {
      throw new Error('浏览器未启动，请先调用 launchBrowser()');
    }

    return await this.client.callTool('playwright_navigate', {
      pageId: this.pageId,
      url,
      waitUntil
    });
  }

  /**
   * 点击元素
   */
  async click(selector, timeout = 5000) {
    if (!this.pageId) throw new Error('浏览器未启动');

    return await this.client.callTool('playwright_click', {
      pageId: this.pageId,
      selector,
      timeout
    });
  }

  /**
   * 填写输入框
   */
  async fill(selector, value, clear = true) {
    if (!this.pageId) throw new Error('浏览器未启动');

    return await this.client.callTool('playwright_fill', {
      pageId: this.pageId,
      selector,
      value,
      clear
    });
  }

  /**
   * 截取屏幕截图
   */
  async screenshot(options = {}) {
    if (!this.pageId) throw new Error('浏览器未启动');

    return await this.client.callTool('playwright_screenshot', {
      pageId: this.pageId,
      selector: options.selector,
      filename: options.filename,
      fullPage: options.fullPage || false
    });
  }

  /**
   * 等待元素出现
   */
  async waitForSelector(selector, timeout = 5000) {
    if (!this.pageId) throw new Error('浏览器未启动');

    return await this.client.callTool('playwright_waitForSelector', {
      pageId: this.pageId,
      selector,
      timeout
    });
  }

  /**
   * 获取元素文本
   */
  async getText(selector) {
    if (!this.pageId) throw new Error('浏览器未启动');

    return await this.client.callTool('playwright_getText', {
      pageId: this.pageId,
      selector
    });
  }

  /**
   * 执行 JavaScript
   */
  async evaluate(script) {
    if (!this.pageId) throw new Error('浏览器未启动');

    return await this.client.callTool('playwright_evaluate', {
      pageId: this.pageId,
      script
    });
  }

  /**
   * 获取页面信息
   */
  async getPageInfo() {
    if (!this.pageId) throw new Error('浏览器未启动');

    return await this.client.callTool('playwright_getPageInfo', {
      pageId: this.pageId
    });
  }

  /**
   * 查找元素
   */
  async findElements(selector) {
    if (!this.pageId) throw new Error('浏览器未启动');

    return await this.client.callTool('playwright_findElements', {
      pageId: this.pageId,
      selector
    });
  }

  /**
   * 运行 E2E 测试文件
   */
  async runE2ETest(testFile, options = {}) {
    return await this.client.callTool('playwright_runE2ETest', {
      testFile,
      project: options.project || 'functional',
      headed: options.headed || false,
      timeout: options.timeout || 60000
    });
  }

  /**
   * 运行 E2E 测试套件
   */
  async runE2ESuite(projects = ['functional'], timeout = 300000) {
    return await this.client.callTool('playwright_runE2ESuite', {
      projects,
      timeout
    });
  }

  /**
   * 运行可访问性检查
   */
  async checkAccessibility() {
    if (!this.pageId) throw new Error('浏览器未启动');

    return await this.client.callTool('playwright_checkAccessibility', {
      pageId: this.pageId
    });
  }

  /**
   * 关闭浏览器
   */
  async closeBrowser() {
    if (this.browserId) {
      await this.client.callTool('playwright_close', {
        browserId: this.browserId
      });
      this.browserId = null;
      this.pageId = null;
    }
  }

  /**
   * 执行完整用户流程测试
   * 示例: login -> navigate -> interact -> verify
   */
  async runUserFlow(steps, options = {}) {
    const results = [];

    try {
      await this.launchBrowser(options);

      for (const step of steps) {
        const { action, params, description } = step;
        const stepResult = { action, description, success: false };

        try {
          switch (action) {
            case 'navigate':
              stepResult.result = await this.navigate(params.url, params.waitUntil);
              break;
            case 'click':
              stepResult.result = await this.click(params.selector, params.timeout);
              break;
            case 'fill':
              stepResult.result = await this.fill(params.selector, params.value, params.clear);
              break;
            case 'waitFor':
              stepResult.result = await this.waitForSelector(params.selector, params.timeout);
              break;
            case 'screenshot':
              stepResult.result = await this.screenshot(params);
              break;
            case 'getText':
              stepResult.result = await this.getText(params.selector);
              break;
            case 'evaluate':
              stepResult.result = await this.evaluate(params.script);
              break;
            case 'verify':
              stepResult.result = await this.evaluate(params.assertion);
              break;
            default:
              throw new Error(`未知操作: ${action}`);
          }
          stepResult.success = true;
        } catch (error) {
          stepResult.error = error.message;
          if (!step.continueOnError) {
            throw error;
          }
        }

        results.push(stepResult);
      }

      return {
        success: results.every(r => r.success),
        results
      };
    } finally {
      await this.closeBrowser();
    }
  }
}

module.exports = { PlaywrightMCPHelper };

// 如果直接运行，测试基本功能
if (require.main === module) {
  async function test() {
    const helper = new PlaywrightMCPHelper();

    try {
      console.log('测试 Playwright MCP Helper...');
      await helper.connect();

      console.log('\n测试用户流程...');
      const result = await helper.runUserFlow([
        {
          action: 'navigate',
          params: { url: 'https://example.com' },
          description: '导航到示例页面'
        },
        {
          action: 'screenshot',
          params: { filename: 'example-test.png', fullPage: true },
          description: '截取页面截图'
        },
        {
          action: 'getText',
          params: { selector: 'h1' },
          description: '获取页面标题'
        }
      ]);

      console.log('\n流程执行结果:');
      result.results.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.description}: ${r.success ? '✓' : '✗'}`);
        if (r.result) {
          console.log(`     结果:`, JSON.stringify(r.result, null, 2).substring(0, 200));
        }
      });

      console.log(`\n总体结果: ${result.success ? '✓ 通过' : '✗ 失败'}`);

    } finally {
      await helper.disconnect();
    }
  }

  test().catch(console.error);
}
