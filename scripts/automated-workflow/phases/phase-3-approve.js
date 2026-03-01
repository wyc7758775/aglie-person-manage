#!/usr/bin/env node
/**
 * 阶段 3: 等待/设置提案审批状态
 * 
 * 输入: change-id
 * 操作: 标记提案为已批准
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
  header: (msg) => {
    console.log(`${colors.blue}────────────────────────────────────────────────────────────${colors.reset}`);
    console.log(`${colors.cyan}${msg}${colors.reset}`);
    console.log(`${colors.blue}────────────────────────────────────────────────────────────${colors.reset}`);
  }
};

// 检查提案状态
function checkProposalStatus(changeId) {
  const proposalPath = path.join(process.cwd(), 'openspec/changes', changeId, 'proposal.md');
  
  if (!fs.existsSync(proposalPath)) {
    throw new Error(`提案不存在: ${changeId}`);
  }
  
  const content = fs.readFileSync(proposalPath, 'utf-8');
  const isApproved = content.includes('Status: APPROVED');
  
  return { proposalPath, content, isApproved };
}

// 标记提案为已批准
function approveProposal(proposalPath, content) {
  const approvalBlock = `

<!-- WORKFLOW METADATA -->
Status: APPROVED
Approved At: ${new Date().toISOString()}
Approved By: ${require('child_process').execSync('git config user.name', { encoding: 'utf-8' }).trim()}
`;
  
  fs.writeFileSync(proposalPath, content + approvalBlock);
  log.success('提案已标记为 APPROVED');
}

// 显示提案摘要
function showProposalSummary(changeId) {
  const changeDir = path.join(process.cwd(), 'openspec/changes', changeId);
  
  log.header('📋 提案摘要');
  
  // 读取 proposal.md
  const proposalPath = path.join(changeDir, 'proposal.md');
  const proposal = fs.readFileSync(proposalPath, 'utf-8');
  
  // 提取标题
  const titleMatch = proposal.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    console.log(`\n标题: ${colors.cyan}${titleMatch[1]}${colors.reset}`);
  }
  
  // 读取 tasks.md
  const tasksPath = path.join(changeDir, 'tasks.md');
  if (fs.existsSync(tasksPath)) {
    const tasks = fs.readFileSync(tasksPath, 'utf-8');
    const pendingTasks = tasks.match(/- \[ ]/g);
    const completedTasks = tasks.match(/- \[x]/g);
    
    console.log(`\n任务状态:`);
    console.log(`  已完成: ${completedTasks ? completedTasks.length : 0}`);
    console.log(`  待完成: ${pendingTasks ? pendingTasks.length : 0}`);
  }
  
  // 检查测试文件
  const e2eDir = path.join(process.cwd(), 'apps/e2e/tests');
  const hasTests = fs.existsSync(path.join(e2eDir, 'functional', changeId));
  if (hasTests) {
    console.log(`\n测试文件: ${colors.green}已生成${colors.reset}`);
  }
  
  console.log('\n文件位置:');
  console.log(`  📄 ${path.relative(process.cwd(), proposalPath)}`);
  console.log(`  📄 ${path.relative(process.cwd(), tasksPath)}`);
}

// 交互式确认
function confirmApproval() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`\n${colors.yellow}确认批准此提案? [y/N]: ${colors.reset}`, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// 主函数
async function main() {
  const changeId = process.argv[2];
  const autoApprove = process.argv.includes('--auto') || process.argv.includes('-y');
  
  if (!changeId) {
    log.error('请提供 change-id');
    console.log('\n用法: node phase-3-approve.js <change-id> [--auto|-y]');
    process.exit(1);
  }
  
  log.header('✅ 阶段 3: 提案审批');
  
  try {
    // 检查状态
    const { proposalPath, content, isApproved } = checkProposalStatus(changeId);
    
    if (isApproved) {
      log.success('提案已经批准');
      showProposalSummary(changeId);
      console.log(`\n${colors.green}可以开始实现代码${colors.reset}`);
      console.log(`运行: node scripts/automated-workflow/phases/phase-4-implement.js ${changeId}`);
      return;
    }
    
    // 显示摘要
    showProposalSummary(changeId);
    
    // 确认或自动批准
    let shouldApprove = autoApprove;
    if (!autoApprove) {
      shouldApprove = await confirmApproval();
    }
    
    if (shouldApprove) {
      approveProposal(proposalPath, content);
      
      log.header('✅ 阶段 3 完成');
      console.log(`\n${colors.green}提案已批准，可以开始实现代码${colors.reset}`);
      console.log(`\n${colors.cyan}下一步:${colors.reset}`);
      console.log(`  node scripts/automated-workflow/phases/phase-4-implement.js ${changeId}`);
    } else {
      log.warning('审批已取消');
      console.log('请修改提案后重新运行');
    }
    
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }
}

main();
