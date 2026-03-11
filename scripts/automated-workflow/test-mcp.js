#!/usr/bin/env node
/**
 * MCP 集成测试脚本
 * 
 * 测试 Pencil MCP 和 Chrome DevTools MCP 的连接和功能
 */

const { MCPClient, loadMCPConfig } = require('./lib/mcp-client');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const icons = {
    info: `${colors.cyan}ℹ${colors.reset}`,
    success: `${colors.green}✓${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`
  };
  console.log(`${icons[type]} ${message}`);
}

async function testPencilMCP() {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('测试 Pencil MCP Server');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  const config = loadMCPConfig();
  const client = new MCPClient('pencil', config.pencil);
  
  try {
    log('连接到 Pencil MCP...');
    await client.connect();
    log('连接成功', 'success');
    
    log(`可用工具: ${client.tools.length} 个`);
    client.tools.forEach(tool => {
      console.log(`  • ${tool.name}`);
    });
    
    log('测试工具调用...');
    const result = await client.callTool('generate_ui_design', {
      change_id: 'test-change',
      prd_content: '# Test PRD\n\n这是一个测试 PRD，包含一个按钮组件。',
      viewports: [{ name: 'desktop', width: 1440, height: 900 }]
    });
    
    if (result.success) {
      log('工具调用成功', 'success');
      console.log(`  生成: ${result.outputs.mockups.length} 个视口`);
    } else {
      log('工具调用失败', 'error');
    }
    
    await client.disconnect();
    return true;
    
  } catch (error) {
    log(`连接失败: ${error.message}`, 'error');
    return false;
  }
}

async function testChromeDevToolsMCP() {
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('测试 Chrome DevTools MCP Server');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const config = loadMCPConfig();
  const client = new MCPClient('chrome-devtools', config.chromeDevTools);

  try {
    log('连接到 Chrome DevTools MCP...');
    await client.connect();
    log('连接成功', 'success');

    log(`可用工具: ${client.tools.length} 个`);
    client.tools.forEach(tool => {
      console.log(`  • ${tool.name}`);
    });

    log('测试工具调用...');
    const result = await client.callTool('check_accessibility', {
      url: 'https://example.com'
    });

    if (result.success) {
      log('工具调用成功', 'success');
      console.log(`  可访问性得分: ${result.score}/100`);
    } else {
      log('工具调用失败', 'error');
    }

    await client.disconnect();
    return true;

  } catch (error) {
    log(`连接失败: ${error.message}`, 'error');
    return false;
  }
}

async function testPlaywrightMCP() {
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('测试 Playwright MCP Server');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const config = loadMCPConfig();
  const client = new MCPClient('playwright', config.playwright);

  try {
    log('连接到 Playwright MCP...');
    await client.connect();
    log('连接成功', 'success');

    log(`可用工具: ${client.tools.length} 个`);
    client.tools.forEach(tool => {
      console.log(`  • ${tool.name}`);
    });

    log('测试启动浏览器...');
    const launchResult = await client.callTool('playwright_launch', {
      browserType: 'chromium',
      headless: true,
      viewport: { width: 1280, height: 720 }
    });

    if (!launchResult.success) {
      throw new Error('浏览器启动失败');
    }

    const pageId = launchResult.pageId;
    log(`浏览器启动成功: ${launchResult.browserId}`, 'success');

    log('测试导航...');
    const navResult = await client.callTool('playwright_navigate', {
      pageId: pageId,
      url: 'https://example.com'
    });

    if (navResult.success) {
      log(`导航成功: ${navResult.title}`, 'success');
    }

    log('测试截图...');
    const screenshotResult = await client.callTool('playwright_screenshot', {
      pageId: pageId,
      filename: 'test-screenshot.png',
      fullPage: true
    });

    if (screenshotResult.success) {
      log(`截图成功: ${screenshotResult.filename}`, 'success');
    }

    log('测试获取页面信息...');
    const infoResult = await client.callTool('playwright_getPageInfo', {
      pageId: pageId
    });

    if (infoResult.success) {
      log(`页面信息获取成功`, 'success');
      console.log(`  URL: ${infoResult.info.url}`);
      console.log(`  元素数量: ${infoResult.info.elementCount}`);
    }

    log('关闭浏览器...');
    await client.callTool('playwright_close', {
      browserId: launchResult.browserId
    });
    log('浏览器已关闭', 'success');

    await client.disconnect();
    return true;

  } catch (error) {
    log(`连接失败: ${error.message}`, 'error');
    return false;
  }
}

async function main() {
  console.log(`${colors.cyan}`);
  console.log('╔════════════════════════════════════════╗');
  console.log('║     MCP 集成测试工具                   ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`${colors.reset}`);

  const args = process.argv.slice(2);
  const testAll = !args.length || args.includes('--all');

  let pencilOk = false;
  let devtoolsOk = false;
  let playwrightOk = false;

  if (testAll || args.includes('--pencil')) {
    pencilOk = await testPencilMCP();
  }

  if (testAll || args.includes('--devtools')) {
    devtoolsOk = await testChromeDevToolsMCP();
  }

  if (testAll || args.includes('--playwright')) {
    playwrightOk = await testPlaywrightMCP();
  }

  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log('测试结果摘要');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  if (testAll || args.includes('--pencil')) {
    console.log(`Pencil MCP: ${pencilOk ? colors.green + '✓ 通过' : colors.red + '✗ 失败'}${colors.reset}`);
  }

  if (testAll || args.includes('--devtools')) {
    console.log(`Chrome DevTools MCP: ${devtoolsOk ? colors.green + '✓ 通过' : colors.red + '✗ 失败'}${colors.reset}`);
  }

  if (testAll || args.includes('--playwright')) {
    console.log(`Playwright MCP: ${playwrightOk ? colors.green + '✓ 通过' : colors.red + '✗ 失败'}${colors.reset}`);
  }

  console.log('');

  const allPassed = (testAll && pencilOk && devtoolsOk && playwrightOk) ||
                    (args.includes('--pencil') && pencilOk) ||
                    (args.includes('--devtools') && devtoolsOk) ||
                    (args.includes('--playwright') && playwrightOk);

  if (allPassed) {
    console.log(`${colors.green}所有测试通过！${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.yellow}部分测试未通过，请检查配置${colors.reset}`);
    console.log('\n排查步骤:');
    console.log('  1. 如果使用 stdio 模式，确保已安装依赖: cd mcp-servers/*/ && npm install');
    console.log('  2. 如果使用 sse 模式，确保 Docker 服务已启动: docker-compose -f docker-compose.mcp.yml up -d');
    console.log('  3. 检查 .mcp-config.json 配置');
    process.exit(1);
  }
}

main().catch(console.error);
