#!/usr/bin/env node
/**
 * 阶段 1: 解析 PRD 文件并生成 OpenSpec 提案
 * 
 * 输入: PRD Markdown 文件路径
 * 输出: openspec/changes/<change-id>/ 目录结构
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

// 解析 PRD 文件
function parsePRD(prdPath) {
  log.step(1, '解析 PRD 文件');
  
  const content = fs.readFileSync(prdPath, 'utf-8');
  const basename = path.basename(prdPath, '.md');
  
  // 提取关键信息
  const title = extractTitle(content) || basename;
  const description = extractDescription(content);
  const requirements = extractRequirements(content);
  const scenarios = extractScenarios(content);
  const capabilities = extractCapabilities(content, requirements);
  
  log.success(`解析完成: ${title}`);
  log.info(`- 需求数: ${requirements.length}`);
  log.info(`- 场景数: ${scenarios.length}`);
  log.info(`- 能力域: ${capabilities.join(', ')}`);
  
  return {
    title,
    description,
    requirements,
    scenarios,
    capabilities,
    content,
    basename
  };
}

// 提取标题
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

// 提取描述
function extractDescription(content) {
  // 提取第一个段落作为描述
  const match = content.match(/^##[^#]|^([^#\n].+\n)+/m);
  return match ? match[0].trim().substring(0, 200) + '...' : '';
}

// 提取需求列表
function extractRequirements(content) {
  const requirements = [];
  const reqRegex = /(?:^##+\s*|^[-*]\s*|^\d+\.\s*)需求[：:]?\s*(.+)$/gim;
  let match;
  
  while ((match = reqRegex.exec(content)) !== null) {
    requirements.push({
      title: match[1].trim(),
      description: extractRequirementDetails(content, match.index)
    });
  }
  
  // 如果没有找到需求标题，尝试提取功能点
  if (requirements.length === 0) {
    const featureRegex = /(?:^##+\s*|^[-*]\s*)(.+功能|.+管理|.+模块)/gim;
    while ((match = featureRegex.exec(content)) !== null) {
      requirements.push({
        title: match[1].trim(),
        description: ''
      });
    }
  }
  
  return requirements;
}

// 提取需求详情
function extractRequirementDetails(content, startIndex) {
  const endIndex = content.indexOf('\n##', startIndex + 1);
  const section = content.substring(startIndex, endIndex > 0 ? endIndex : undefined);
  return section.split('\n').slice(1).join('\n').trim();
}

// 提取场景
function extractScenarios(content) {
  const scenarios = [];
  const scenarioRegex = /(?:场景|用例|Scenario)[：:]?\s*(.+)/gi;
  let match;
  
  while ((match = scenarioRegex.exec(content)) !== null) {
    const scenarioTitle = match[1].trim();
    const contextStart = match.index;
    const contextEnd = content.indexOf('\n##', contextStart + 1);
    const context = content.substring(contextStart, contextEnd > 0 ? contextEnd : contextStart + 500);
    
    // 提取 WHEN/THEN
    const whenMatch = context.match(/(?:WHEN|当)[：:]?\s*(.+)/i);
    const thenMatch = context.match(/(?:THEN|那么|则)[：:]?\s*(.+)/i);
    
    scenarios.push({
      title: scenarioTitle,
      when: whenMatch ? whenMatch[1].trim() : '用户执行相关操作',
      then: thenMatch ? thenMatch[1].trim() : '系统正确响应'
    });
  }
  
  return scenarios;
}

// 提取能力域
function extractCapabilities(content, requirements) {
  const capabilities = new Set();
  
  // 基于关键词识别能力域
  const capabilityKeywords = {
    'auth': ['登录', '注册', '认证', '密码', 'token', 'session', '授权', 'Auth'],
    'user-management': ['用户', '账号', 'Profile', '个人资料', 'User'],
    'project-management': ['项目', 'Project', 'sprint', '迭代'],
    'task-management': ['任务', 'Task', '待办', 'todo'],
    'requirement-management': ['需求', 'Requirement', 'PRD'],
    'defect-management': ['缺陷', 'Bug', '问题', 'Defect'],
    'ui-components': ['组件', 'UI', '界面', '样式', 'Component'],
    'i18n': ['国际化', '多语言', 'i18n', '翻译'],
    'testing': ['测试', 'Test', 'E2E', '单元测试']
  };
  
  for (const [capability, keywords] of Object.entries(capabilityKeywords)) {
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        capabilities.add(capability);
        break;
      }
    }
  }
  
  // 默认能力域
  if (capabilities.size === 0) {
    capabilities.add('feature');
  }
  
  return Array.from(capabilities);
}

// 生成 change-id
function generateChangeId(basename) {
  const clean = basename
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  
  // 确保以动词开头
  const verbs = ['add', 'update', 'remove', 'refactor', 'fix', 'enhance', 'optimize'];
  for (const verb of verbs) {
    if (clean.startsWith(verb)) return clean;
  }
  
  return `add-${clean}`;
}

// 生成 OpenSpec 提案
function generateOpenSpecProposal(prdData, changeId) {
  log.step(2, '生成 OpenSpec 提案');
  
  const rootDir = process.cwd();
  const changeDir = path.join(rootDir, 'openspec/changes', changeId);
  
  // 创建目录结构
  fs.mkdirSync(changeDir, { recursive: true });
  
  for (const capability of prdData.capabilities) {
    fs.mkdirSync(path.join(changeDir, 'specs', capability), { recursive: true });
  }
  
  // 生成 proposal.md
  const proposalContent = generateProposalMd(prdData, changeId);
  fs.writeFileSync(path.join(changeDir, 'proposal.md'), proposalContent);
  
  // 生成 tasks.md
  const tasksContent = generateTasksMd(prdData);
  fs.writeFileSync(path.join(changeDir, 'tasks.md'), tasksContent);
  
  // 为每个能力域生成 spec.md
  for (const capability of prdData.capabilities) {
    const specContent = generateSpecMd(prdData, capability);
    fs.writeFileSync(
      path.join(changeDir, 'specs', capability, 'spec.md'),
      specContent
    );
  }
  
  log.success(`提案已创建: openspec/changes/${changeId}/`);
  
  return changeDir;
}

// 生成 proposal.md 内容
function generateProposalMd(prdData, changeId) {
  return `# Change: ${prdData.title}

## Why
${prdData.description}

## What Changes
${prdData.requirements.map(r => `- ${r.title}`).join('\n')}

## Impact
- Affected specs: ${prdData.capabilities.join(', ')}
- Affected code: apps/web/app/

## Test Coverage
- [ ] 单元测试
- [ ] 集成测试  
- [ ] E2E 测试

## Checklist
- [ ] 代码实现
- [ ] 测试通过
- [ ] 文档更新
`;
}

// 生成 tasks.md 内容
function generateTasksMd(prdData) {
  const tasks = prdData.requirements.map((req, i) => 
    `- [ ] ${i + 1}.${i + 1} ${req.title}`
  ).join('\n');
  
  return `## 1. Implementation
${tasks}

## 2. Testing
- [ ] 2.1 编写单元测试
- [ ] 2.2 编写集成测试
- [ ] 2.3 编写 E2E 测试
- [ ] 2.4 运行测试套件

## 3. Verification
- [ ] 3.1 代码审查
- [ ] 3.2 功能验证
- [ ] 3.3 性能检查
`;
}

// 生成 spec.md 内容
function generateSpecMd(prdData, capability) {
  const relevantReqs = prdData.requirements.filter(req => 
    req.title.toLowerCase().includes(capability) ||
    capability.includes(req.title.toLowerCase())
  );
  
  const reqsToUse = relevantReqs.length > 0 ? relevantReqs : prdData.requirements;
  
  let specContent = `## ADDED Requirements\n\n`;
  
  for (const req of reqsToUse) {
    specContent += `### Requirement: ${req.title}\n`;
    specContent += `系统 SHALL 提供${req.title}功能\n\n`;
    
    // 添加场景
    for (const scenario of prdData.scenarios.slice(0, 3)) {
      specContent += `#### Scenario: ${scenario.title}\n`;
      specContent += `- **WHEN** ${scenario.when}\n`;
      specContent += `- **THEN** ${scenario.then}\n\n`;
    }
    
    if (prdData.scenarios.length === 0) {
      specContent += `#### Scenario: 基本功能\n`;
      specContent += `- **WHEN** 用户访问${req.title}功能\n`;
      specContent += `- **THEN** 系统正确响应\n\n`;
    }
  }
  
  return specContent;
}

// 验证提案
function validateProposal(changeId) {
  log.step(3, '验证提案');
  
  try {
    const result = execSync(`openspec validate ${changeId} --strict`, {
      encoding: 'utf-8',
      cwd: process.cwd()
    });
    log.success('提案验证通过');
    return true;
  } catch (error) {
    log.warning('提案验证发现问题，请手动修复:');
    log.info(error.stdout || error.message);
    return false;
  }
}

// 主函数
function main() {
  const prdPath = process.argv[2];
  
  if (!prdPath) {
    log.error('请提供 PRD 文件路径');
    console.log('\n用法: node phase-1-parse-prd.js <prd-file.md>');
    process.exit(1);
  }
  
  if (!fs.existsSync(prdPath)) {
    log.error(`文件不存在: ${prdPath}`);
    process.exit(1);
  }
  
  log.header('🚀 阶段 1: 解析 PRD 并生成 OpenSpec 提案');
  
  try {
    // 解析 PRD
    const prdData = parsePRD(prdPath);
    
    // 生成 change-id
    const changeId = generateChangeId(prdData.basename);
    log.info(`Change ID: ${changeId}`);
    
    // 检查是否已存在
    const changeDir = path.join(process.cwd(), 'openspec/changes', changeId);
    if (fs.existsSync(changeDir)) {
      log.warning(`提案已存在: ${changeId}`);
      log.info('将更新现有提案');
    }
    
    // 生成提案
    generateOpenSpecProposal(prdData, changeId);
    
    // 验证提案
    validateProposal(changeId);
    
    log.header('✅ 阶段 1 完成');
    console.log(`\n${colors.cyan}提案位置:${colors.reset} openspec/changes/${changeId}/`);
    console.log(`${colors.cyan}查看提案:${colors.reset} openspec/changes/${changeId}/proposal.md`);
    console.log(`${colors.yellow}下一步:${colors.reset} 请审阅提案，确认后运行阶段 2 生成测试用例`);
    
    // 输出状态信息供脚本使用
    console.log(`\n[WORKFLOW_STATE] change_id=${changeId}`);
    console.log(`[WORKFLOW_STATE] capabilities=${prdData.capabilities.join(',')}`);
    
  } catch (error) {
    log.error('处理失败:');
    console.error(error);
    process.exit(1);
  }
}

main();
