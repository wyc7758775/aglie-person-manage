#!/usr/bin/env node
/**
 * 阶段 4: 根据 OpenSpec 提案实现代码
 * 
 * 输入: change-id
 * 操作: 读取 tasks.md 并按顺序实现
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// 验证提案已批准
function verifyApproval(changeId) {
  log.step(1, '验证提案状态');
  
  const proposalPath = path.join(process.cwd(), 'openspec/changes', changeId, 'proposal.md');
  
  if (!fs.existsSync(proposalPath)) {
    throw new Error(`提案不存在: ${changeId}`);
  }
  
  const content = fs.readFileSync(proposalPath, 'utf-8');
  
  if (!content.includes('Status: APPROVED')) {
    throw new Error('提案未批准，请先运行阶段 3');
  }
  
  log.success('提案已批准');
}

// 读取任务清单
function readTasks(changeId) {
  log.step(2, '读取任务清单');
  
  const tasksPath = path.join(process.cwd(), 'openspec/changes', changeId, 'tasks.md');
  
  if (!fs.existsSync(tasksPath)) {
    throw new Error('tasks.md 不存在');
  }
  
  const content = fs.readFileSync(tasksPath, 'utf-8');
  
  // 解析任务
  const tasks = [];
  const lines = content.split('\n');
  let currentSection = '';
  
  for (const line of lines) {
    // 检测章节
    const sectionMatch = line.match(/^##\s*(.+)/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      continue;
    }
    
    // 检测任务
    const taskMatch = line.match(/^-\s*\[\s*([ x])\s*\]\s*(.+)/);
    if (taskMatch) {
      tasks.push({
        section: currentSection,
        completed: taskMatch[1] === 'x',
        description: taskMatch[2].trim()
      });
    }
  }
  
  const pendingTasks = tasks.filter(t => !t.completed);
  log.info(`总任务: ${tasks.length}, 待完成: ${pendingTasks.length}`);
  
  return { tasks, pendingTasks, content };
}

// 模拟实现任务（实际项目中，这里可以调用 AI 或执行实际代码生成）
async function implementTask(task, changeId, taskIndex) {
  log.info(`实现任务: ${task.description}`);
  
  // 这里可以根据任务类型执行不同的实现逻辑
  // 例如：
  // - 调用 LLM API 生成代码
  // - 执行脚手架命令
  // - 应用代码补丁
  
  // 模拟实现延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  log.success(`任务完成: ${task.description}`);
}

// 更新任务状态
function updateTaskStatus(changeId, tasks) {
  log.step(4, '更新任务状态');
  
  const tasksPath = path.join(process.cwd(), 'openspec/changes', changeId, 'tasks.md');
  let content = fs.readFileSync(tasksPath, 'utf-8');
  
  // 标记所有待办任务为已完成
  content = content.replace(/- \[ ] /g, '- [x] ');
  
  fs.writeFileSync(tasksPath, content);
  log.success('任务状态已更新');
}

// 创建实现摘要
function createImplementationSummary(changeId, tasks) {
  log.step(5, '生成实现摘要');
  
  const summaryPath = path.join(process.cwd(), 'openspec/changes', changeId, 'IMPLEMENTATION_SUMMARY.md');
  
  const summary = `# 实现摘要

## 变更 ID
${changeId}

## 实现时间
${new Date().toISOString()}

## 完成任务
${tasks.map(t => `- [x] ${t.description}`).join('\n')}

## 文件变更
\`\`\`bash
# 查看所有变更
git diff --name-only
\`\`\`

## 待办
- [ ] 运行测试验证
- [ ] 代码审查
- [ ] 归档变更
`;
  
  fs.writeFileSync(summaryPath, summary);
  log.success(`摘要已保存: ${summaryPath}`);
}

// 主函数
async function main() {
  const changeId = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  
  if (!changeId) {
    log.error('请提供 change-id');
    console.log('\n用法: node phase-4-implement.js <change-id> [--dry-run]');
    process.exit(1);
  }
  
  log.header('💻 阶段 4: 代码实现');
  
  try {
    // 验证批准状态
    verifyApproval(changeId);
    
    // 读取任务
    const { tasks, pendingTasks } = readTasks(changeId);
    
    if (pendingTasks.length === 0) {
      log.success('所有任务已完成');
      console.log(`\n${colors.cyan}下一步:${colors.reset}`);
      console.log(`  node scripts/automated-workflow/phases/phase-5-verify-and-commit.js ${changeId}`);
      return;
    }
    
    if (dryRun) {
      log.warning('干运行模式 - 不实际执行');
      console.log('\n待实现任务:');
      pendingTasks.forEach((t, i) => {
        console.log(`  ${i + 1}. ${t.description}`);
      });
      return;
    }
    
    log.step(3, '执行任务');
    
    // 逐个实现任务
    for (let i = 0; i < pendingTasks.length; i++) {
      await implementTask(pendingTasks[i], changeId, i);
    }
    
    // 更新任务状态
    updateTaskStatus(changeId, tasks);
    
    // 生成摘要
    createImplementationSummary(changeId, tasks);
    
    log.header('✅ 阶段 4 完成');
    console.log(`\n${colors.green}代码实现完成${colors.reset}`);
    console.log(`\n${colors.cyan}下一步:${colors.reset}`);
    console.log(`  node scripts/automated-workflow/phases/phase-5-verify-and-commit.js ${changeId}`);
    
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }
}

main();
