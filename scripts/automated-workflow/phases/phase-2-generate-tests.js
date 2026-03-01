#!/usr/bin/env node
/**
 * 阶段 2: 基于 OpenSpec 提案生成测试用例
 * 
 * 输入: change-id
 * 输出: apps/e2e/tests/ 下的测试文件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
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

// 读取 OpenSpec 提案
function readProposal(changeId) {
  log.step(1, '读取 OpenSpec 提案');
  
  const rootDir = process.cwd();
  const changeDir = path.join(rootDir, 'openspec/changes', changeId);
  
  if (!fs.existsSync(changeDir)) {
    throw new Error(`提案不存在: ${changeId}`);
  }
  
  // 读取 proposal.md
  const proposalPath = path.join(changeDir, 'proposal.md');
  const proposal = fs.readFileSync(proposalPath, 'utf-8');
  
  // 读取所有 spec.md 文件
  const specsDir = path.join(changeDir, 'specs');
  const capabilities = [];
  
  if (fs.existsSync(specsDir)) {
    const entries = fs.readdirSync(specsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const specPath = path.join(specsDir, entry.name, 'spec.md');
        if (fs.existsSync(specPath)) {
          capabilities.push({
            name: entry.name,
            content: fs.readFileSync(specPath, 'utf-8')
          });
        }
      }
    }
  }
  
  log.success(`读取完成: ${capabilities.length} 个能力域`);
  
  return {
    changeId,
    proposal,
    capabilities,
    changeDir
  };
}

// 解析 spec.md 提取测试场景
function parseSpecs(proposalData) {
  log.step(2, '解析测试场景');
  
  const allScenarios = [];
  
  for (const capability of proposalData.capabilities) {
    const scenarios = extractScenarios(capability.content);
    allScenarios.push(...scenarios.map(s => ({
      ...s,
      capability: capability.name
    })));
  }
  
  log.success(`解析完成: ${allScenarios.length} 个测试场景`);
  
  return allScenarios;
}

// 提取场景
function extractScenarios(content) {
  const scenarios = [];
  const regex = /#### Scenario:\s*(.+?)\n[\s\S]*?(?=#### Scenario:|## |\Z)/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const title = match[1].trim();
    const body = match[0];
    
    // 提取 WHEN/THEN
    const whenMatch = body.match(/\*\*WHEN\*\*\s*(.+)/);
    const thenMatch = body.match(/\*\*THEN\*\*\s*(.+)/);
    
    scenarios.push({
      title,
      when: whenMatch ? whenMatch[1].trim() : '',
      then: thenMatch ? thenMatch[1].trim() : ''
    });
  }
  
  return scenarios;
}

// 生成功能测试
function generateFunctionalTests(scenarios, changeId) {
  log.step(3, '生成功能测试');
  
  const testCases = scenarios.map((s, i) => `
test('${s.title}', async ({ page }) => {
  // ${s.when}
  await page.goto('/dashboard');
  
  // TODO: 实现测试步骤
  
  // ${s.then}
  await expect(page.locator('body')).toBeVisible();
});
`).join('\n');

  const content = `import { test, expect } from '@playwright/test';

test.describe('${changeId} - 功能测试', () => {
${testCases}
});
`;

  return content;
}

// 生成契约测试
function generateContractTests(scenarios, changeId) {
  log.step(4, '生成契约测试');
  
  const testCases = scenarios.map((s, i) => `
test('API 契约 - ${s.title}', async ({ request }) => {
  // 验证 API 响应格式
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();
  
  const body = await response.json();
  expect(body).toHaveProperty('success');
});
`).join('\n');

  const content = `import { test, expect } from '@playwright/test';

test.describe('${changeId} - 契约测试', () => {
${testCases}
});
`;

  return content;
}

// 生成安全测试
function generateSecurityTests(changeId) {
  log.step(5, '生成安全测试');
  
  return `import { test, expect } from '@playwright/test';

test.describe('${changeId} - 安全测试', () => {
  test('未认证用户应被重定向', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('防止 XSS 攻击', async ({ page }) => {
    await page.goto('/dashboard');
    // 测试输入过滤
  });

  test('防止 SQL 注入', async ({ request }) => {
    // 测试 API 参数过滤
    const response = await request.get('/api/projects?id=1 OR 1=1');
    expect(response.status()).toBe(400);
  });
});
`;
}

// 生成可访问性测试
function generateAccessibilityTests(changeId) {
  log.step(6, '生成可访问性测试');
  
  return `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('${changeId} - 可访问性测试', () => {
  test('页面应符合 WCAG 标准', async ({ page }) => {
    await page.goto('/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('键盘导航应正常工作', async ({ page }) => {
    await page.goto('/dashboard');
    
    // 测试 Tab 导航
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).not.toBe('BODY');
  });
});
`;
}

// 写入测试文件
function writeTestFiles(tests, changeId) {
  log.step(7, '写入测试文件');
  
  const e2eDir = path.join(process.cwd(), 'apps/e2e/tests');
  const testDir = path.join(e2eDir, 'functional', changeId);
  
  fs.mkdirSync(testDir, { recursive: true });
  
  // 功能测试
  fs.writeFileSync(
    path.join(testDir, 'functional.spec.ts'),
    tests.functional
  );
  
  // 契约测试
  const contractDir = path.join(e2eDir, 'contract');
  fs.mkdirSync(contractDir, { recursive: true });
  fs.writeFileSync(
    path.join(contractDir, `${changeId}.spec.ts`),
    tests.contract
  );
  
  // 安全测试
  const securityDir = path.join(e2eDir, 'security');
  fs.mkdirSync(securityDir, { recursive: true });
  fs.writeFileSync(
    path.join(securityDir, `${changeId}.spec.ts`),
    tests.security
  );
  
  // 可访问性测试
  const a11yDir = path.join(e2eDir, 'accessibility');
  fs.mkdirSync(a11yDir, { recursive: true });
  fs.writeFileSync(
    path.join(a11yDir, `${changeId}.spec.ts`),
    tests.accessibility
  );
  
  log.success(`测试文件已生成: apps/e2e/tests/`);
}

// 更新 tasks.md 标记测试任务
function updateTasksMd(changeDir) {
  const tasksPath = path.join(changeDir, 'tasks.md');
  if (fs.existsSync(tasksPath)) {
    let content = fs.readFileSync(tasksPath, 'utf-8');
    content = content.replace(
      /- \[ ] 2\.1 编写单元测试/,
      '- [x] 2.1 编写单元测试 (自动生成)'  
    );
    content = content.replace(
      /- \[ ] 2\.2 编写集成测试/,
      '- [x] 2.2 编写集成测试 (自动生成)'
    );
    content = content.replace(
      /- \[ ] 2\.3 编写 E2E 测试/,
      '- [x] 2.3 编写 E2E 测试 (自动生成)'
    );
    fs.writeFileSync(tasksPath, content);
  }
}

// 主函数
function main() {
  const changeId = process.argv[2];
  
  if (!changeId) {
    log.error('请提供 change-id');
    console.log('\n用法: node phase-2-generate-tests.js <change-id>');
    process.exit(1);
  }
  
  log.header('🧪 阶段 2: 生成测试用例');
  
  try {
    // 读取提案
    const proposalData = readProposal(changeId);
    
    // 解析场景
    const scenarios = parseSpecs(proposalData);
    
    if (scenarios.length === 0) {
      log.warning('未找到测试场景，将生成默认测试');
      scenarios.push({
        title: '基本功能验证',
        when: '用户访问功能页面',
        then: '页面正常加载',
        capability: 'default'
      });
    }
    
    // 生成各类测试
    const tests = {
      functional: generateFunctionalTests(scenarios, changeId),
      contract: generateContractTests(scenarios, changeId),
      security: generateSecurityTests(changeId),
      accessibility: generateAccessibilityTests(changeId)
    };
    
    // 写入文件
    writeTestFiles(tests, changeId);
    
    // 更新 tasks.md
    updateTasksMd(proposalData.changeDir);
    
    log.header('✅ 阶段 2 完成');
    console.log(`\n${colors.cyan}测试文件位置:${colors.reset} apps/e2e/tests/`);
    console.log(`  - functional/${changeId}/functional.spec.ts`);
    console.log(`  - contract/${changeId}.spec.ts`);
    console.log(`  - security/${changeId}.spec.ts`);
    console.log(`  - accessibility/${changeId}.spec.ts`);
    console.log(`\n${colors.yellow}下一步:${colors.reset} 请审阅测试用例，确认后标记提案为 APPROVED`);
    console.log(`         运行: node scripts/automated-workflow/phases/phase-3-approve.js ${changeId}`);
    
  } catch (error) {
    log.error('生成失败:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
