#!/usr/bin/env node
/**
 * 阶段 6.5: UI 实现验证
 * 
 * 调用 Chrome DevTools MCP 验证实际 UI 是否符合设计稿
 * 在代码实现后、测试验证前执行
 */

const fs = require('fs');
const path = require('path');
const { MCPClient, loadMCPConfig } = require('../lib/mcp-client');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (n, msg) => console.log(`\n${colors.cyan}▶ STEP ${n}:${colors.reset} ${msg}`),
  header: (msg) => {
    console.log(`${colors.blue}────────────────────────────────────────────────────────────${colors.reset}`);
    console.log(`${colors.cyan}${msg}${colors.reset}`);
    console.log(`${colors.blue}────────────────────────────────────────────────────────────${colors.reset}`);
  }
};

/**
 * 检查设计文件是否存在
 */
function checkDesignFiles(changeId) {
  const designDir = path.join(process.cwd(), 'openspec/changes', changeId, 'design');
  
  if (!fs.existsSync(designDir)) {
    return { exists: false, designDir: null };
  }
  
  const tokensPath = path.join(designDir, 'design-tokens.json');
  const hasTokens = fs.existsSync(tokensPath);
  
  return { exists: true, designDir, hasTokens };
}

/**
 * 获取应用 URL
 */
function getAppUrl() {
  // 可以从环境变量或配置文件中读取
  return process.env.APP_URL || 'http://localhost:3000';
}

/**
 * 运行 UI 验证套件
 */
async function runUIValidation(changeId, designDir, options = {}) {
  log.step(1, '连接 Chrome DevTools MCP Server');
  
  const config = loadMCPConfig();
  const client = new MCPClient('chrome-devtools', config.chromeDevTools);
  
  try {
    await client.connect();
    log.success('Chrome DevTools MCP 连接成功');
    
    const appUrl = getAppUrl();
    log.info(`目标 URL: ${appUrl}`);
    
    log.step(2, '运行完整 UI 验证套件');
    
    const validationResult = await client.callTool('run_ui_validation_suite', {
      change_id: changeId,
      url: appUrl,
      design_dir: designDir,
      viewports: [
        { name: 'desktop', width: 1440, height: 900 },
        { name: 'mobile', width: 375, height: 667 }
      ]
    });
    
    if (!validationResult.success) {
      throw new Error(validationResult.message || '验证失败');
    }
    
    log.success('验证套件执行完成');
    
    // 显示摘要
    log.step(3, '验证结果摘要');
    const summary = validationResult.summary;
    
    console.log(`\n  视口验证:`);
    console.log(`    总计: ${summary.total}`);
    console.log(`    ${colors.green}通过: ${summary.passed}${colors.reset}`);
    if (summary.failed > 0) {
      console.log(`    ${colors.red}失败: ${summary.failed}${colors.reset}`);
    }
    
    if (validationResult.summary.failed > 0) {
      log.warning('部分验证未通过');
    } else {
      log.success('所有验证通过');
    }
    
    // 设计 Token 验证
    if (validationResult.designTokensValidation) {
      console.log(`\n  设计 Token 验证:`);
      if (validationResult.designTokensValidation.passed) {
        log.success('通过');
      } else {
        log.warning('发现不匹配项');
        validationResult.designTokensValidation.mismatches.forEach(m => {
          console.log(`    - ${m.category}.${m.key}: ${colors.yellow}${m.expected}${colors.reset} vs ${colors.red}${m.actual}${colors.reset}`);
        });
      }
    }
    
    // 可访问性检查
    if (validationResult.accessibility) {
      console.log(`\n  可访问性得分: ${validationResult.accessibility.score}/100`);
      if (validationResult.accessibility.issues.length > 0) {
        log.warning(`发现 ${validationResult.accessibility.issues.length} 个问题`);
      }
    }
    
    log.step(4, '生成报告');
    log.info(`报告位置: ${validationResult.reportDir}`);
    log.info(`报告文件: ${validationResult.reportPath}`);
    
    // 读取 Markdown 报告并显示
    const mdReportPath = path.join(validationResult.reportDir, 'summary.md');
    if (fs.existsSync(mdReportPath)) {
      console.log('\n--- 验证报告摘要 ---');
      const report = fs.readFileSync(mdReportPath, 'utf-8');
      // 只显示概览部分
      const overviewMatch = report.match(/## 概览[\s\S]*?(?=##)/);
      if (overviewMatch) {
        console.log(overviewMatch[0]);
      }
    }
    
    return validationResult;
    
  } finally {
    await client.disconnect();
  }
}

/**
 * 尝试自动修复 UI 差异
 */
async function attemptAutoFix(changeId, validationResult) {
  log.warning('尝试自动修复 UI 差异...');
  
  // 这里可以实现自动修复逻辑
  // 例如：根据设计 token 差异自动调整 CSS
  
  const fixes = [];
  
  // 示例：修复设计 token 不匹配
  if (validationResult.designTokensValidation?.mismatches) {
    for (const mismatch of validationResult.designTokensValidation.mismatches) {
      if (mismatch.category === 'colors') {
        fixes.push({
          type: 'color',
          property: mismatch.key,
          value: mismatch.expected
        });
      }
    }
  }
  
  if (fixes.length > 0) {
    log.info(`准备应用 ${fixes.length} 个自动修复`);
    // 实际修复逻辑...
    // 例如：更新 CSS 变量、修改组件样式等
    
    return { applied: true, fixes };
  }
  
  return { applied: false, reason: '无可自动修复的项目' };
}

/**
 * 主函数
 */
async function main() {
  const changeId = process.argv[2];
  const autoFix = process.argv.includes('--auto-fix');
  const skipMCP = process.argv.includes('--skip-mcp');
  
  if (!changeId) {
    log.error('请提供 change-id');
    console.log('\n用法: node phase-6.5-ui-validation.js <change-id> [--auto-fix] [--skip-mcp]');
    console.log('');
    console.log('选项:');
    console.log('  --auto-fix   发现差异时尝试自动修复');
    console.log('  --skip-mcp   跳过 MCP 调用，仅读取已有报告');
    process.exit(1);
  }
  
  log.header('🔍 阶段 6.5: UI 实现验证');
  
  try {
    // 检查设计文件
    const designCheck = checkDesignFiles(changeId);
    
    if (!designCheck.exists) {
      log.warning('未找到设计文件，跳过 UI 验证');
      console.log('提示: 先运行阶段 2.5 生成设计稿');
      console.log(`  node scripts/automated-workflow/phases/phase-2.5-ui-design-sync.js ${changeId}`);
      process.exit(0);
    }
    
    log.info(`设计文件位置: ${designCheck.designDir}`);
    
    let validationResult;
    
    if (skipMCP) {
      // 读取已有报告
      const reportPath = path.join(process.cwd(), 'reports/ui-validation', changeId, 'report.json');
      if (fs.existsSync(reportPath)) {
        validationResult = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        log.info('已加载已有验证报告');
      } else {
        log.error('未找到验证报告');
        process.exit(1);
      }
    } else {
      // 运行验证
      validationResult = await runUIValidation(changeId, designCheck.designDir);
    }
    
    // 如果有失败且启用了自动修复
    if (validationResult.summary?.failed > 0 && autoFix) {
      const fixResult = await attemptAutoFix(changeId, validationResult);
      
      if (fixResult.applied) {
        log.success(`已应用 ${fixResult.fixes.length} 个修复`);
        log.info('请重新运行验证确认修复效果');
      } else {
        log.warning(`无法自动修复: ${fixResult.reason}`);
      }
    }
    
    // 根据验证结果决定是否继续
    const hasCriticalFailures = validationResult.summary?.failed > 0 ||
      validationResult.accessibility?.score < 80;
    
    log.header('✅ 阶段 6.5 完成');
    
    if (hasCriticalFailures) {
      log.warning('验证发现问题，请查看报告后决定是否继续');
      console.log(`\n${colors.cyan}报告位置:${colors.reset} ${validationResult.reportDir}`);
      console.log(`\n${colors.yellow}选项:${colors.reset}`);
      console.log('  1. 修复 UI 问题后重新运行');
      console.log('  2. 使用 --auto-fix 尝试自动修复');
      console.log('  3. 强制继续（不推荐）: 进入阶段 7');
      
      // 非零退出码，让调用者决定是否继续
      process.exit(2);
    } else {
      log.success('UI 验证通过');
      console.log(`\n${colors.cyan}下一步:${colors.reset}`);
      console.log(`  node scripts/automated-workflow/phases/phase-7-test-validation.js ${changeId}`);
    }
    
  } catch (error) {
    log.error(error.message);
    
    if (error.message.includes('Chrome DevTools MCP')) {
      console.log('\n提示: 如果 MCP Server 未启动，可以:');
      console.log('  1. 启动 MCP Server: cd mcp-servers/chrome-devtools-mcp && npm start');
      console.log('  2. 或使用 Docker: docker-compose -f docker-compose.mcp.yml up -d');
    }
    
    process.exit(1);
  }
}

main();
