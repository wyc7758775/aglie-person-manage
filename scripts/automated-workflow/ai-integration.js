#!/usr/bin/env node
/**
 * AI 集成模块 - 用于自动化代码实现
 * 
 * 此模块可以集成 Kimi Code CLI 或其他 AI 工具来自动实现代码
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

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
};

/**
 * 读取任务清单
 */
function readTasks(changeId) {
  const tasksPath = path.join(process.cwd(), 'openspec/changes', changeId, 'tasks.md');
  const content = fs.readFileSync(tasksPath, 'utf-8');
  
  const tasks = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^-\s*\[\s*\]\s*(.+)/);
    if (match) {
      tasks.push(match[1].trim());
    }
  }
  
  return tasks;
}

/**
 * 读取提案内容
 */
function readProposal(changeId) {
  const proposalPath = path.join(process.cwd(), 'openspec/changes', changeId, 'proposal.md');
  return fs.readFileSync(proposalPath, 'utf-8');
}

/**
 * 读取规格说明
 */
function readSpecs(changeId) {
  const specsDir = path.join(process.cwd(), 'openspec/changes', changeId, 'specs');
  const specs = {};
  
  if (fs.existsSync(specsDir)) {
    const entries = fs.readdirSync(specsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const specPath = path.join(specsDir, entry.name, 'spec.md');
        if (fs.existsSync(specPath)) {
          specs[entry.name] = fs.readFileSync(specPath, 'utf-8');
        }
      }
    }
  }
  
  return specs;
}

/**
 * 生成 AI 提示词
 */
function generatePrompt(changeId) {
  const proposal = readProposal(changeId);
  const tasks = readTasks(changeId);
  const specs = readSpecs(changeId);
  
  return `
请根据以下 OpenSpec 提案实现代码。

## 提案内容
${proposal}

## 待实现任务
${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

## 规格说明
${Object.entries(specs).map(([name, content]) => `
### ${name}
${content.substring(0, 1000)}...`).join('\n')}

## 实现要求
1. 遵循项目现有代码风格和架构
2. 使用 TypeScript 和 React
3. 所有代码必须通过类型检查
4. 参考 apps/web/app/lib/definitions.ts 中的类型定义
5. UI 组件参考 app/ui/ 目录下的现有组件
6. API 路由参考 app/api/ 目录下的现有实现

请按顺序实现以上任务，每个任务完成后标记为完成。
`;
}

/**
 * 使用 Kimi Code CLI 实现代码
 */
async function implementWithKimi(changeId) {
  const prompt = generatePrompt(changeId);
  const promptFile = path.join(process.cwd(), '.workflow-prompt.txt');
  
  fs.writeFileSync(promptFile, prompt);
  
  log.info('正在调用 Kimi Code CLI...');
  log.info('提示词已保存到: .workflow-prompt.txt');
  
  // 检查 kimi 命令是否可用
  try {
    execSync('which kimi', { stdio: 'pipe' });
  } catch (error) {
    log.error('kimi 命令未找到，请确保 Kimi Code CLI 已安装');
    log.info('安装命令: npm install -g kimi-cli');
    return false;
  }
  
  try {
    // 使用 kimi 执行提示词
    const kimi = spawn('kimi', ['-p', promptFile], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    return new Promise((resolve) => {
      kimi.on('close', (code) => {
        fs.unlinkSync(promptFile);
        resolve(code === 0);
      });
    });
  } catch (error) {
    log.error('Kimi 调用失败:', error.message);
    return false;
  }
}

/**
 * 模拟 AI 实现（用于测试）
 */
async function simulateAIImplementation(changeId) {
  log.info('模拟 AI 实现模式');
  
  const tasks = readTasks(changeId);
  
  for (let i = 0; i < tasks.length; i++) {
    log.info(`[${i + 1}/${tasks.length}] ${tasks[i]}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  log.success('模拟实现完成');
  return true;
}

/**
 * 主函数
 */
async function main() {
  const changeId = process.argv[2];
  const simulate = process.argv.includes('--simulate');
  
  if (!changeId) {
    console.log('用法: node ai-integration.js <change-id> [--simulate]');
    process.exit(1);
  }
  
  log.info(`开始 AI 实现: ${changeId}`);
  
  let success;
  if (simulate) {
    success = await simulateAIImplementation(changeId);
  } else {
    success = await implementWithKimi(changeId);
  }
  
  if (success) {
    log.success('AI 实现完成');
    process.exit(0);
  } else {
    log.error('AI 实现失败');
    process.exit(1);
  }
}

// 导出模块
module.exports = {
  generatePrompt,
  implementWithKimi,
  simulateAIImplementation,
  readTasks,
  readProposal,
  readSpecs
};

// 如果直接运行
if (require.main === module) {
  main();
}
