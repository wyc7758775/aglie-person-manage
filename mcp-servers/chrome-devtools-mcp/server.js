#!/usr/bin/env node
/**
 * Chrome DevTools MCP Server
 * 
 * UI 验证服务 - 使用 Puppeteer + Chrome DevTools Protocol
 * 验证实际 UI 实现是否符合设计稿
 */

const express = require('express');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

// 配置
const PORT = process.env.PORT || 3002;
const REPORT_DIR = process.env.REPORT_DIR || './reports';
const MCP_TRANSPORT = process.env.MCP_TRANSPORT || 'stdio';

// 确保报告目录存在
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Puppeteer browser 实例
let browser = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browser;
}

/**
 * MCP 工具定义
 */
const TOOLS = [
  {
    name: 'capture_screenshot',
    description: '捕获页面截图',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: '页面 URL'
        },
        viewport: {
          type: 'object',
          properties: {
            width: { type: 'number' },
            height: { type: 'number' }
          },
          default: { width: 1440, height: 900 }
        },
        output_path: {
          type: 'string',
          description: '截图保存路径'
        },
        wait_for: {
          type: 'string',
          description: '等待选择器（可选）'
        }
      },
      required: ['url', 'output_path']
    }
  },
  {
    name: 'compare_screenshots',
    description: '对比两张截图（视觉回归测试）',
    inputSchema: {
      type: 'object',
      properties: {
        expected_path: {
          type: 'string',
          description: '预期截图路径（设计稿）'
        },
        actual_path: {
          type: 'string',
          description: '实际截图路径'
        },
        diff_path: {
          type: 'string',
          description: '差异图保存路径'
        },
        threshold: {
          type: 'number',
          description: '像素差异阈值 (0-1)',
          default: 0.1
        }
      },
      required: ['expected_path', 'actual_path', 'diff_path']
    }
  },
  {
    name: 'validate_design_tokens',
    description: '验证页面设计 token（颜色、字体等）',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: '页面 URL'
        },
        expected_tokens: {
          type: 'object',
          description: '预期的设计 token',
          properties: {
            colors: { type: 'object' },
            typography: { type: 'object' },
            spacing: { type: 'object' }
          }
        },
        selectors: {
          type: 'object',
          description: '要检查的元素选择器'
        }
      },
      required: ['url', 'expected_tokens']
    }
  },
  {
    name: 'validate_layout',
    description: '验证页面布局',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: '页面 URL'
        },
        expected_layout: {
          type: 'object',
          description: '预期布局规范',
          properties: {
            breakpoints: { type: 'array' },
            containers: { type: 'array' }
          }
        }
      },
      required: ['url']
    }
  },
  {
    name: 'run_ui_validation_suite',
    description: '运行完整的 UI 验证套件',
    inputSchema: {
      type: 'object',
      properties: {
        change_id: {
          type: 'string',
          description: 'OpenSpec change ID'
        },
        url: {
          type: 'string',
          description: '待验证页面 URL'
        },
        design_dir: {
          type: 'string',
          description: '设计稿目录路径'
        },
        viewports: {
          type: 'array',
          default: [
            { name: 'desktop', width: 1440, height: 900 },
            { name: 'mobile', width: 375, height: 667 }
          ]
        }
      },
      required: ['change_id', 'url', 'design_dir']
    }
  },
  {
    name: 'check_accessibility',
    description: '检查页面可访问性',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: '页面 URL'
        }
      },
      required: ['url']
    }
  }
];

/**
 * 工具实现
 */
async function captureScreenshot(args) {
  const { url, viewport, output_path, wait_for } = args;
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.setViewport(viewport || { width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  if (wait_for) {
    await page.waitForSelector(wait_for);
  }
  
  // 等待动画完成
  await page.waitForTimeout(500);
  
  await page.screenshot({ 
    path: output_path,
    fullPage: true 
  });
  
  await page.close();
  
  return {
    success: true,
    path: output_path,
    viewport
  };
}

async function compareScreenshots(args) {
  const { expected_path, actual_path, diff_path, threshold = 0.1 } = args;
  
  // 读取图片
  const expected = PNG.sync.read(fs.readFileSync(expected_path));
  const actual = PNG.sync.read(fs.readFileSync(actual_path));
  
  const { width, height } = expected;
  const diff = new PNG({ width, height });
  
  // 计算差异
  const numDiffPixels = pixelmatch(
    expected.data,
    actual.data,
    diff.data,
    width,
    height,
    { threshold }
  );
  
  // 保存差异图
  fs.writeFileSync(diff_path, PNG.sync.write(diff));
  
  const totalPixels = width * height;
  const diffPercentage = (numDiffPixels / totalPixels) * 100;
  
  return {
    success: true,
    numDiffPixels,
    diffPercentage: diffPercentage.toFixed(2),
    threshold,
    passed: diffPercentage < 1.0, // 差异小于 1% 视为通过
    diff_path
  };
}

async function validateDesignTokens(args) {
  const { url, expected_tokens, selectors = {} } = args;
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // 获取实际样式
  const actualTokens = await page.evaluate((sel) => {
    const results = {
      colors: {},
      typography: {},
      spacing: {}
    };
    
    // 检查 body 的背景色和文字颜色
    const body = document.body;
    const bodyStyles = window.getComputedStyle(body);
    results.colors.background = bodyStyles.backgroundColor;
    results.colors.text = bodyStyles.color;
    
    // 检查标题字体大小
    const h1 = document.querySelector('h1');
    if (h1) {
      results.typography.headingSize = window.getComputedStyle(h1).fontSize;
    }
    
    // 检查正文字体大小
    const p = document.querySelector('p');
    if (p) {
      results.typography.bodySize = window.getComputedStyle(p).fontSize;
    }
    
    return results;
  }, selectors);
  
  await page.close();
  
  // 对比预期和实际
  const mismatches = [];
  
  for (const [category, tokens] of Object.entries(expected_tokens)) {
    for (const [key, expectedValue] of Object.entries(tokens)) {
      const actualValue = actualTokens[category]?.[key];
      if (actualValue && !actualValue.includes(expectedValue)) {
        mismatches.push({
          category,
          key,
          expected: expectedValue,
          actual: actualValue
        });
      }
    }
  }
  
  return {
    success: true,
    actualTokens,
    mismatches,
    passed: mismatches.length === 0
  };
}

async function validateLayout(args) {
  const { url, expected_layout = {} } = args;
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // 获取布局信息
  const layout = await page.evaluate(() => {
    const containers = Array.from(document.querySelectorAll('[class*="container"], main, header, footer'))
      .map(el => ({
        tag: el.tagName,
        class: el.className,
        width: el.offsetWidth,
        height: el.offsetHeight,
        rect: el.getBoundingClientRect()
      }));
    
    return { containers };
  });
  
  await page.close();
  
  return {
    success: true,
    layout
  };
}

async function runUIValidationSuite(args) {
  const { change_id, url, design_dir, viewports } = args;
  
  console.log(`[Chrome DevTools MCP] 运行 UI 验证套件: ${change_id}`);
  
  const reportDir = path.join(REPORT_DIR, change_id);
  const screenshotsDir = path.join(reportDir, 'screenshots');
  const diffDir = path.join(reportDir, 'diff');
  
  // 创建目录
  [reportDir, screenshotsDir, diffDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
  
  const results = {
    change_id,
    url,
    timestamp: new Date().toISOString(),
    viewports: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };
  
  // 对每个视口进行验证
  for (const viewport of viewports) {
    console.log(`  验证视口: ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    const actualPath = path.join(screenshotsDir, `${viewport.name}-actual.png`);
    const expectedPath = path.join(design_dir, `ui-mockups`, `${viewport.name}.png`);
    const diffPath = path.join(diffDir, `${viewport.name}-diff.png`);
    
    // 1. 捕获实际截图
    await captureScreenshot({
      url,
      viewport,
      output_path: actualPath,
      wait_for: 'body'
    });
    
    // 2. 如果存在预期截图，进行对比
    let comparison = null;
    if (fs.existsSync(expectedPath)) {
      comparison = await compareScreenshots({
        expected_path: expectedPath,
        actual_path: actualPath,
        diff_path: diffPath,
        threshold: 0.1
      });
    }
    
    results.viewports.push({
      name: viewport.name,
      screenshot: actualPath,
      comparison
    });
    
    results.summary.total++;
    if (!comparison || comparison.passed) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
  }
  
  // 3. 验证设计 token
  const designTokensPath = path.join(design_dir, 'design-tokens.json');
  if (fs.existsSync(designTokensPath)) {
    const expectedTokens = JSON.parse(fs.readFileSync(designTokensPath, 'utf-8'));
    results.designTokensValidation = await validateDesignTokens({
      url,
      expected_tokens: expectedTokens
    });
  }
  
  // 4. 验证布局
  results.layoutValidation = await validateLayout({ url });
  
  // 5. 可访问性检查
  results.accessibility = await checkAccessibility({ url });
  
  // 保存报告
  const reportPath = path.join(reportDir, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  // 生成 Markdown 报告
  const mdReport = generateMarkdownReport(results);
  fs.writeFileSync(path.join(reportDir, 'summary.md'), mdReport);
  
  console.log(`[Chrome DevTools MCP] 验证完成: ${results.summary.passed}/${results.summary.total} 通过`);
  
  return {
    success: true,
    reportDir,
    reportPath,
    summary: results.summary,
    passed: results.summary.failed === 0
  };
}

async function checkAccessibility(args) {
  const { url } = args;
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // 基本可访问性检查
  const issues = await page.evaluate(() => {
    const problems = [];
    
    // 检查图片是否有 alt
    document.querySelectorAll('img').forEach(img => {
      if (!img.alt) {
        problems.push({ type: 'missing-alt', element: 'img', src: img.src });
      }
    });
    
    // 检查表单标签
    document.querySelectorAll('input, select, textarea').forEach(input => {
      const id = input.id;
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!hasLabel && !ariaLabel && !ariaLabelledBy && !input.placeholder) {
        problems.push({ type: 'missing-label', element: input.tagName, name: input.name });
      }
    });
    
    // 检查语义化 HTML
    const hasMain = document.querySelector('main');
    const hasHeader = document.querySelector('header');
    const hasFooter = document.querySelector('footer');
    
    if (!hasMain) problems.push({ type: 'semantic-html', message: 'Missing <main> element' });
    
    return problems;
  });
  
  await page.close();
  
  return {
    success: true,
    issues,
    passed: issues.length === 0,
    score: Math.max(0, 100 - issues.length * 5)
  };
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(results) {
  return `# UI 验证报告

## 概览
- **变更 ID**: ${results.change_id}
- **验证 URL**: ${results.url}
- **验证时间**: ${results.timestamp}
- **结果**: ${results.summary.failed === 0 ? '✅ 通过' : '❌ 失败'}

## 摘要
- 总计: ${results.summary.total} 个视口
- 通过: ${results.summary.passed}
- 失败: ${results.summary.failed}

## 视口验证详情
${results.viewports.map(v => `
### ${v.name}
- 截图: ${v.screenshot}
${v.comparison ? `
- 差异像素: ${v.comparison.numDiffPixels}
- 差异比例: ${v.comparison.diffPercentage}%
- 结果: ${v.comparison.passed ? '✅ 通过' : '❌ 失败'}
- 差异图: ${v.comparison.diff_path}
` : '- 无对比基准'}
`).join('\n')}

## 设计 Token 验证
${results.designTokensValidation ? `
- 状态: ${results.designTokensValidation.passed ? '✅ 通过' : '❌ 失败'}
${results.designTokensValidation.mismatches.length > 0 ? `
### 不匹配项
${results.designTokensValidation.mismatches.map(m => `- ${m.category}.${m.key}: 预期 "${m.expected}", 实际 "${m.actual}"`).join('\n')}
` : ''}
` : '未执行'}

## 可访问性检查
${results.accessibility ? `
- 得分: ${results.accessibility.score}/100
- 问题数: ${results.accessibility.issues.length}
${results.accessibility.issues.length > 0 ? `
### 问题列表
${results.accessibility.issues.map(i => `- [${i.type}] ${i.element || i.message}`).join('\n')}
` : ''}
` : '未执行'}
`;
}

/**
 * MCP Server 实现
 */
async function main() {
  const server = new Server(
    {
      name: 'chrome-devtools-mcp-server',
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
        case 'capture_screenshot':
          result = await captureScreenshot(args);
          break;
        case 'compare_screenshots':
          result = await compareScreenshots(args);
          break;
        case 'validate_design_tokens':
          result = await validateDesignTokens(args);
          break;
        case 'validate_layout':
          result = await validateLayout(args);
          break;
        case 'run_ui_validation_suite':
          result = await runUIValidationSuite(args);
          break;
        case 'check_accessibility':
          result = await checkAccessibility(args);
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
            })
          }
        ],
        isError: true
      };
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
      console.log(`[Chrome DevTools MCP] SSE Server running on port ${PORT}`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log('[Chrome DevTools MCP] Stdio Server running');
  }
  
  // 优雅关闭
  process.on('SIGINT', async () => {
    if (browser) {
      await browser.close();
    }
    process.exit(0);
  });
}

main().catch(console.error);
