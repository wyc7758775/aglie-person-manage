#!/usr/bin/env node
/**
 * 工作流状态查看工具
 * 
 * 显示当前所有工作流的状态
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

// 阶段名称
const PHASES = [
  '解析 PRD',
  '生成测试',
  '提案审批',
  '代码实现',
  '验证提交'
];

// 状态图标
const STATUS_ICONS = {
  pending: `${colors.gray}○${colors.reset}`,
  in_progress: `${colors.yellow}◐${colors.reset}`,
  completed: `${colors.green}●${colors.reset}`,
  failed: `${colors.red}✗${colors.reset}`
};

/**
 * 获取所有活跃提案
 */
function getActiveProposals() {
  const changesDir = path.join(process.cwd(), 'openspec/changes');
  
  if (!fs.existsSync(changesDir)) {
    return [];
  }
  
  const proposals = [];
  const entries = fs.readdirSync(changesDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'archive') {
      const changeId = entry.name;
      const proposalPath = path.join(changesDir, changeId, 'proposal.md');
      
      if (fs.existsSync(proposalPath)) {
        const content = fs.readFileSync(proposalPath, 'utf-8');
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const isApproved = content.includes('Status: APPROVED');
        
        proposals.push({
          id: changeId,
          title: titleMatch ? titleMatch[1] : changeId,
          isApproved,
          hasTests: hasTests(changeId),
          isImplemented: isImplemented(changeId)
        });
      }
    }
  }
  
  return proposals;
}

/**
 * 检查是否有测试文件
 */
function hasTests(changeId) {
  const testDirs = [
    `apps/e2e/tests/functional/${changeId}`,
    `apps/e2e/tests/contract/${changeId}.spec.ts`,
    `apps/e2e/tests/security/${changeId}.spec.ts`,
    `apps/e2e/tests/accessibility/${changeId}.spec.ts`
  ];
  
  return testDirs.some(dir => fs.existsSync(path.join(process.cwd(), dir)));
}

/**
 * 检查是否已实现
 */
function isImplemented(changeId) {
  const tasksPath = path.join(process.cwd(), 'openspec/changes', changeId, 'tasks.md');
  
  if (!fs.existsSync(tasksPath)) {
    return false;
  }
  
  const content = fs.readFileSync(tasksPath, 'utf-8');
  const pendingTasks = content.match(/- \[ ] /g);
  return !pendingTasks || pendingTasks.length === 0;
}

/**
 * 获取提案当前阶段
 */
function getCurrentPhase(proposal) {
  if (!proposal.isApproved) {
    return proposal.hasTests ? 2 : 1;
  }
  
  if (!proposal.isImplemented) {
    return 3;
  }
  
  return 4;
}

/**
 * 渲染进度条
 */
function renderProgressBar(phase, total = 5) {
  const filled = '█'.repeat(phase);
  const empty = '░'.repeat(total - phase);
  return `${colors.green}${filled}${colors.gray}${empty}${colors.reset}`;
}

/**
 * 显示工作流状态
 */
function showStatus() {
  console.log(`\n${colors.bright}${colors.cyan}🔄 工作流状态监控${colors.reset}\n`);
  
  const proposals = getActiveProposals();
  
  if (proposals.length === 0) {
    console.log(`${colors.yellow}暂无活跃提案${colors.reset}`);
    console.log(`\n创建新提案:`);
    console.log(`  ${colors.cyan}./scripts/automated-workflow/start-workflow.sh <prd-file.md>${colors.reset}`);
    return;
  }
  
  console.log(`找到 ${colors.bright}${proposals.length}${colors.reset} 个活跃提案:\n`);
  
  for (const proposal of proposals) {
    const currentPhase = getCurrentPhase(proposal);
    const progress = renderProgressBar(currentPhase);
    
    console.log(`${colors.bright}${proposal.title}${colors.reset}`);
    console.log(`  ID: ${colors.gray}${proposal.id}${colors.reset}`);
    console.log(`  进度: ${progress} ${currentPhase}/${PHASES.length}`);
    console.log(`  当前阶段: ${colors.cyan}${PHASES[currentPhase - 1]}${colors.reset}`);
    
    // 显示各阶段状态
    const phaseStatus = [
      `${STATUS_ICONS.completed} 解析 PRD`,
      proposal.hasTests ? `${STATUS_ICONS.completed} 生成测试` : `${STATUS_ICONS.pending} 生成测试`,
      proposal.isApproved ? `${STATUS_ICONS.completed} 提案审批` : `${STATUS_ICONS.in_progress} 提案审批`,
      proposal.isImplemented ? `${STATUS_ICONS.completed} 代码实现` : `${STATUS_ICONS.pending} 代码实现`,
      `${STATUS_ICONS.pending} 验证提交`
    ];
    
    console.log(`  阶段: ${phaseStatus.join(' → ')}`);
    console.log();
  }
  
  // 显示快捷命令
  console.log(`${colors.bright}快捷命令:${colors.reset}`);
  proposals.forEach(p => {
    const phase = getCurrentPhase(p);
    console.log(`  ${colors.gray}# ${p.id.substring(0, 30)}...${colors.reset}`);
    
    if (phase === 2) {
      console.log(`  ${colors.cyan}node scripts/automated-workflow/phases/phase-2-generate-tests.js ${p.id}${colors.reset}`);
    } else if (phase === 3) {
      console.log(`  ${colors.cyan}node scripts/automated-workflow/phases/phase-3-approve.js ${p.id}${colors.reset}`);
    } else if (phase === 4) {
      console.log(`  ${colors.cyan}node scripts/automated-workflow/phases/phase-5-verify-and-commit.js ${p.id}${colors.reset}`);
    }
    console.log();
  });
}

/**
 * 显示归档提案
 */
function showArchive() {
  const archiveDir = path.join(process.cwd(), 'openspec/changes/archive');
  
  if (!fs.existsSync(archiveDir)) {
    console.log(`\n${colors.yellow}暂无归档提案${colors.reset}`);
    return;
  }
  
  const entries = fs.readdirSync(archiveDir, { withFileTypes: true });
  const archives = entries
    .filter(e => e.isDirectory())
    .map(e => {
      const dateMatch = e.name.match(/^(\d{4}-\d{2}-\d{2})/);
      return {
        name: e.name,
        date: dateMatch ? dateMatch[1] : 'unknown'
      };
    })
    .sort((a, b) => b.name.localeCompare(a.name));
  
  console.log(`\n${colors.bright}${colors.cyan}📦 归档提案 (${archives.length})${colors.reset}\n`);
  
  archives.slice(0, 10).forEach(a => {
    console.log(`  ${colors.gray}${a.date}${colors.reset} ${a.name.replace(/^\d{4}-\d{2}-\d{2}-/, '')}`);
  });
  
  if (archives.length > 10) {
    console.log(`  ${colors.gray}... 还有 ${archives.length - 10} 个${colors.reset}`);
  }
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--archive') || args.includes('-a')) {
    showArchive();
  } else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
工作流状态查看工具

用法: node workflow-status.js [选项]

选项:
  --archive, -a    显示归档提案
  --help, -h       显示帮助

示例:
  node workflow-status.js
  node workflow-status.js --archive
`);
  } else {
    showStatus();
  }
}

main();
