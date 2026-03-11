#!/usr/bin/env node
/**
 * Playwright MCP Server
 * 
 * 为 AI 提供浏览器自动化和 E2E 测试能力
 * - 浏览器控制（启动、导航、截图）
 * - 页面交互（点击、输入、滚动）
 * - E2E 测试执行
 * - 验证和调试
 */

const { chromium, firefox, webkit } = require('playwright');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

// 配置
const PORT = process.env.PORT || 3003;
const MCP_TRANSPORT = process.env.MCP_TRANSPORT || 'stdio';
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || './screenshots';

// 浏览器实例管理
const browserInstances = new Map();
const pageInstances = new Map();
let instanceId = 0;

// 确保截图目录存在
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

/**
 * MCP 工具定义
 */
const TOOLS = [
  {
    name: 'playwright_launch',
    description: '启动浏览器实例',
    inputSchema: {
      type: 'object',
      properties: {
        browserType: {
          type: 'string',
          enum: ['chromium', 'firefox', 'webkit'],
          default: 'chromium',
          description: '浏览器类型'
        },
        headless: {
          type: 'boolean',
          default: true,
          description: '是否无头模式'
        },
        viewport: {
          type: 'object',
          properties: {
            width: { type: 'number', default: 1280 },
            height: { type: 'number', default: 720 }
          }
        }
      }
    }
  },
  {
    name: 'playwright_navigate',
    description: '导航到指定 URL',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: {
          type: 'string',
          description: '页面实例 ID'
        },
        url: {
          type: 'string',
          description: '目标 URL'
        },
        waitUntil: {
          type: 'string',
          enum: ['load', 'domcontentloaded', 'networkidle', 'commit'],
          default: 'load'
        }
      },
      required: ['pageId', 'url']
    }
  },
  {
    name: 'playwright_click',
    description: '点击页面元素',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: '页面实例 ID' },
        selector: { type: 'string', description: '元素选择器' },
        timeout: { type: 'number', default: 5000, description: '超时时间(ms)' }
      },
      required: ['pageId', 'selector']
    }
  },
  {
    name: 'playwright_fill',
    description: '在输入框中填写内容',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: '页面实例 ID' },
        selector: { type: 'string', description: '输入框选择器' },
        value: { type: 'string', description: '要填写的内容' },
        clear: { type: 'boolean', default: true, description: '是否先清空' }
      },
      required: ['pageId', 'selector', 'value']
    }
  },
  {
    name: 'playwright_screenshot',
    description: '截取页面或元素截图',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: '页面实例 ID' },
        selector: { type: 'string', description: '元素选择器（可选，为空则截取全页）' },
        filename: { type: 'string', description: '文件名' },
        fullPage: { type: 'boolean', default: false, description: '是否截取全页' }
      },
      required: ['pageId']
    }
  },
  {
    name: 'playwright_waitForSelector',
    description: '等待元素出现',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: '页面实例 ID' },
        selector: { type: 'string', description: '元素选择器' },
        timeout: { type: 'number', default: 5000 }
      },
      required: ['pageId', 'selector']
    }
  },
  {
    name: 'playwright_getText',
    description: '获取元素文本内容',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: '页面实例 ID' },
        selector: { type: 'string', description: '元素选择器' }
      },
      required: ['pageId', 'selector']
    }
  },
  {
    name: 'playwright_evaluate',
    description: '在页面中执行 JavaScript',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: '页面实例 ID' },
        script: { type: 'string', description: 'JavaScript 代码' }
      },
      required: ['pageId', 'script']
    }
  },
  {
    name: 'playwright_runE2ETest',
    description: '运行 E2E 测试',
    inputSchema: {
      type: 'object',
      properties: {
        testFile: { type: 'string', description: '测试文件路径（相对于 apps/e2e）' },
        project: { type: 'string', default: 'functional', description: '测试项目' },
        headed: { type: 'boolean', default: false, description: '是否显示浏览器' },
        timeout: { type: 'number', default: 60000 }
      },
      required: ['testFile']
    }
  },
  {
    name: 'playwright_runE2ESuite',
    description: '运行完整 E2E 测试套件',
    inputSchema: {
      type: 'object',
      properties: {
        projects: {
          type: 'array',
          items: { type: 'string' },
          default: ['functional'],
          description: '要运行的测试项目'
        },
        timeout: { type: 'number', default: 300000 }
      }
    }
  },
  {
    name: 'playwright_checkAccessibility',
    description: '运行可访问性检查',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: '页面实例 ID' },
        url: { type: 'string', description: '要检查的 URL（如果不提供 pageId）' }
      }
    }
  },
  {
    name: 'playwright_close',
    description: '关闭浏览器实例',
    inputSchema: {
      type: 'object',
      properties: {
        browserId: { type: 'string', description: '浏览器实例 ID' }
      }
    }
  },
  {
    name: 'playwright_getPageInfo',
    description: '获取页面信息（URL、标题、元素数量等）',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: '页面实例 ID' }
      },
      required: ['pageId']
    }
  },
  {
    name: 'playwright_findElements',
    description: '查找页面元素并返回信息',
    inputSchema: {
      type: 'object',
      properties: {
        pageId: { type: 'string', description: '页面实例 ID' },
        selector: { type: 'string', description: 'CSS 选择器' }
      },
      required: ['pageId', 'selector']
    }
  }
];

/**
 * 工具实现
 */
async function playwrightLaunch(args) {
  const { browserType = 'chromium', headless = true, viewport = { width: 1280, height: 720 } } = args;
  
  const browserLauncher = { chromium, firefox, webkit }[browserType];
  if (!browserLauncher) {
    throw new Error(`不支持的浏览器类型: ${browserType}`);
  }
  
  const browser = await browserLauncher.launch({ headless });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  
  const browserId = `browser-${++instanceId}`;
  const pageId = `page-${instanceId}`;
  
  browserInstances.set(browserId, { browser, context });
  pageInstances.set(pageId, { page, browserId });
  
  console.log(`[Playwright MCP] 启动浏览器: ${browserId}, 页面: ${pageId}`);
  
  return {
    success: true,
    browserId,
    pageId,
    browserType,
    viewport
  };
}

async function playwrightNavigate(args) {
  const { pageId, url, waitUntil = 'load' } = args;
  
  const pageData = pageInstances.get(pageId);
  if (!pageData) {
    throw new Error(`页面实例不存在: ${pageId}`);
  }
  
  const { page } = pageData;
  await page.goto(url, { waitUntil });
  
  console.log(`[Playwright MCP] 导航到: ${url}`);
  
  return {
    success: true,
    url: page.url(),
    title: await page.title()
  };
}

async function playwrightClick(args) {
  const { pageId, selector, timeout = 5000 } = args;
  
  const pageData = pageInstances.get(pageId);
  if (!pageData) {
    throw new Error(`页面实例不存在: ${pageId}`);
  }
  
  const { page } = pageData;
  await page.click(selector, { timeout });
  
  console.log(`[Playwright MCP] 点击元素: ${selector}`);
  
  return { success: true, selector };
}

async function playwrightFill(args) {
  const { pageId, selector, value, clear = true } = args;
  
  const pageData = pageInstances.get(pageId);
  if (!pageData) {
    throw new Error(`页面实例不存在: ${pageId}`);
  }
  
  const { page } = pageData;
  
  if (clear) {
    await page.fill(selector, '');
  }
  await page.fill(selector, value);
  
  console.log(`[Playwright MCP] 填写输入框: ${selector}`);
  
  return { success: true, selector, value };
}

async function playwrightScreenshot(args) {
  const { pageId, selector, filename, fullPage = false } = args;
  
  const pageData = pageInstances.get(pageId);
  if (!pageData) {
    throw new Error(`页面实例不存在: ${pageId}`);
  }
  
  const { page } = pageData;
  const timestamp = Date.now();
  const screenshotName = filename || `screenshot-${timestamp}.png`;
  const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
  
  if (selector) {
    const element = await page.locator(selector);
    await element.screenshot({ path: screenshotPath });
  } else {
    await page.screenshot({ path: screenshotPath, fullPage });
  }
  
  console.log(`[Playwright MCP] 截图保存: ${screenshotPath}`);
  
  return {
    success: true,
    path: screenshotPath,
    filename: screenshotName
  };
}

async function playwrightWaitForSelector(args) {
  const { pageId, selector, timeout = 5000 } = args;
  
  const pageData = pageInstances.get(pageId);
  if (!pageData) {
    throw new Error(`页面实例不存在: ${pageId}`);
  }
  
  const { page } = pageData;
  await page.waitForSelector(selector, { timeout });
  
  return { success: true, selector, found: true };
}

async function playwrightGetText(args) {
  const { pageId, selector } = args;
  
  const pageData = pageInstances.get(pageId);
  if (!pageData) {
    throw new Error(`页面实例不存在: ${pageId}`);
  }
  
  const { page } = pageData;
  const text = await page.locator(selector).textContent();
  
  return { success: true, selector, text };
}

async function playwrightEvaluate(args) {
  const { pageId, script } = args;
  
  const pageData = pageInstances.get(pageId);
  if (!pageData) {
    throw new Error(`页面实例不存在: ${pageId}`);
  }
  
  const { page } = pageData;
  const result = await page.evaluate((code) => eval(code), script);
  
  return { success: true, result };
}

async function playwrightRunE2ETest(args) {
  const { testFile, project = 'functional', headed = false, timeout = 60000 } = args;
  
  const e2eDir = path.join(process.cwd(), 'apps/e2e');
  const testPath = path.join(e2eDir, testFile);
  
  if (!fs.existsSync(testPath)) {
    throw new Error(`测试文件不存在: ${testPath}`);
  }
  
  const headedFlag = headed ? '--headed' : '';
  const command = `cd ${e2eDir} && npx playwright test ${testFile} --project=${project} ${headedFlag} --reporter=json`;
  
  console.log(`[Playwright MCP] 运行 E2E 测试: ${testFile}`);
  
  try {
    const { stdout, stderr } = await execAsync(command, { timeout });
    const results = JSON.parse(stdout);
    
    return {
      success: results.stats.expected === results.stats.passed,
      stats: results.stats,
      tests: results.suites.flatMap(s => s.specs.map(p => ({
        title: p.title,
        status: p.ok ? 'passed' : 'failed'
      })))
    };
  } catch (error) {
    // 测试失败时捕获结果
    const output = error.stdout || error.message;
    let results;
    try {
      results = JSON.parse(output);
    } catch {
      results = { error: output };
    }
    
    return {
      success: false,
      error: '测试执行失败',
      output: results
    };
  }
}

async function playwrightRunE2ESuite(args) {
  const { projects = ['functional'], timeout = 300000 } = args;
  
  const e2eDir = path.join(process.cwd(), 'apps/e2e');
  const projectArgs = projects.map(p => `--project=${p}`).join(' ');
  const command = `cd ${e2eDir} && npx playwright test ${projectArgs} --reporter=json`;
  
  console.log(`[Playwright MCP] 运行 E2E 测试套件: ${projects.join(', ')}`);
  
  try {
    const { stdout } = await execAsync(command, { timeout });
    const results = JSON.parse(stdout);
    
    return {
      success: results.stats.expected === results.stats.passed,
      stats: results.stats,
      duration: results.stats.duration
    };
  } catch (error) {
    return {
      success: false,
      error: '测试套件执行失败',
      output: error.stdout || error.message
    };
  }
}

async function playwrightCheckAccessibility(args) {
  const { pageId, url } = args;
  
  let page;
  let shouldClose = false;
  
  if (pageId) {
    const pageData = pageInstances.get(pageId);
    if (!pageData) {
      throw new Error(`页面实例不存在: ${pageId}`);
    }
    page = pageData.page;
  } else if (url) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto(url);
    shouldClose = true;
  } else {
    throw new Error('需要提供 pageId 或 url');
  }
  
  // 注入 axe-core 并运行检查
  const axeScript = `
    async function runAxe() {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      return await axe.run();
    }
    return runAxe();
  `;
  
  const results = await page.evaluate(axeScript);
  
  if (shouldClose) {
    await page.context().browser().close();
  }
  
  return {
    success: results.violations.length === 0,
    score: 100 - (results.violations.length * 5),
    violations: results.violations,
    passes: results.passes.length
  };
}

async function playwrightClose(args) {
  const { browserId } = args;
  
  if (browserId) {
    const browserData = browserInstances.get(browserId);
    if (browserData) {
      await browserData.browser.close();
      browserInstances.delete(browserId);
      
      // 清理关联的页面
      for (const [pageId, pageData] of pageInstances.entries()) {
        if (pageData.browserId === browserId) {
          pageInstances.delete(pageId);
        }
      }
      
      return { success: true, browserId, closed: true };
    }
    throw new Error(`浏览器实例不存在: ${browserId}`);
  } else {
    // 关闭所有浏览器
    for (const [id, data] of browserInstances.entries()) {
      await data.browser.close();
    }
    browserInstances.clear();
    pageInstances.clear();
    
    return { success: true, closed: 'all' };
  }
}

async function playwrightGetPageInfo(args) {
  const { pageId } = args;
  
  const pageData = pageInstances.get(pageId);
  if (!pageData) {
    throw new Error(`页面实例不存在: ${pageId}`);
  }
  
  const { page } = pageData;
  
  const info = await page.evaluate(() => ({
    url: window.location.href,
    title: document.title,
    elementCount: document.querySelectorAll('*').length,
    interactiveElements: {
      buttons: document.querySelectorAll('button').length,
      links: document.querySelectorAll('a').length,
      inputs: document.querySelectorAll('input, textarea, select').length
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }));
  
  return { success: true, pageId, info };
}

async function playwrightFindElements(args) {
  const { pageId, selector } = args;
  
  const pageData = pageInstances.get(pageId);
  if (!pageData) {
    throw new Error(`页面实例不存在: ${pageId}`);
  }
  
  const { page } = pageData;
  const elements = await page.locator(selector).all();
  
  const elementInfo = await Promise.all(
    elements.map(async (el, index) => {
      const bbox = await el.boundingBox();
      const text = await el.textContent().catch(() => '');
      const isVisible = await el.isVisible().catch(() => false);
      
      return {
        index,
        text: text?.substring(0, 100),
        isVisible,
        boundingBox: bbox,
        tagName: await el.evaluate(el => el.tagName.toLowerCase())
      };
    })
  );
  
  return {
    success: true,
    selector,
    count: elements.length,
    elements: elementInfo
  };
}

/**
 * MCP Server 实现
 */
async function main() {
  const server = new Server(
    {
      name: 'playwright-mcp-server',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );
  
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });
  
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      let result;
      
      switch (name) {
        case 'playwright_launch':
          result = await playwrightLaunch(args);
          break;
        case 'playwright_navigate':
          result = await playwrightNavigate(args);
          break;
        case 'playwright_click':
          result = await playwrightClick(args);
          break;
        case 'playwright_fill':
          result = await playwrightFill(args);
          break;
        case 'playwright_screenshot':
          result = await playwrightScreenshot(args);
          break;
        case 'playwright_waitForSelector':
          result = await playwrightWaitForSelector(args);
          break;
        case 'playwright_getText':
          result = await playwrightGetText(args);
          break;
        case 'playwright_evaluate':
          result = await playwrightEvaluate(args);
          break;
        case 'playwright_runE2ETest':
          result = await playwrightRunE2ETest(args);
          break;
        case 'playwright_runE2ESuite':
          result = await playwrightRunE2ESuite(args);
          break;
        case 'playwright_checkAccessibility':
          result = await playwrightCheckAccessibility(args);
          break;
        case 'playwright_close':
          result = await playwrightClose(args);
          break;
        case 'playwright_getPageInfo':
          result = await playwrightGetPageInfo(args);
          break;
        case 'playwright_findElements':
          result = await playwrightFindElements(args);
          break;
        default:
          throw new Error(`未知工具: ${name}`);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  });
  
  // 进程退出时清理资源
  process.on('exit', async () => {
    for (const [id, data] of browserInstances.entries()) {
      await data.browser.close().catch(() => {});
    }
  });
  
  if (MCP_TRANSPORT === 'sse') {
    const app = express();
    let transport = null;
    
    app.get('/sse', async (req, res) => {
      transport = new SSEServerTransport('/messages', res);
      await server.connect(transport);
    });
    
    app.post('/messages', async (req, res) => {
      if (transport) {
        await transport.handlePostMessage(req, res);
      }
    });
    
    app.listen(PORT, () => {
      console.log(`[Playwright MCP] SSE Server running on port ${PORT}`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log('[Playwright MCP] Stdio Server running');
  }
}

main().catch(console.error);
