#!/usr/bin/env node
/**
 * 阶段 5: 验证测试并智能提交
 * 
 * 输入: change-id
 * 操作: 运行测试 → 自动修复 → 智能提交 → 推送
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

// 读取配置
function readConfig() {
  const configPath = path.join(process.cwd(), '.workflow-config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return {
    max_test_retries: 3,
    auto_fix_on_failure: true,
    push_on_success: true,
    create_pr_on_success: false
  };
}

// 运行构建验证
function runBuild() {
  log.step(1, '构建验证');
  
  try {
    execSync('pnpm build', {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log.success('构建成功');
    return true;
  } catch (error) {
    log.error('构建失败');
    return false;
  }
}

// 运行单元测试
function runUnitTests() {
  log.step(2, '单元测试');
  
  try {
    execSync('pnpm --filter web test:unit', {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log.success('单元测试通过');
    return true;
  } catch (error) {
    log.error('单元测试失败');
    return false;
  }
}

// 运行 E2E 测试
function runE2ETests(changeId) {
  log.step(3, 'E2E 测试');
  
  try {
    // 只运行当前变更相关的测试
    execSync(`pnpm --filter e2e test --grep "${changeId}"`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log.success('E2E 测试通过');
    return true;
  } catch (error) {
    log.error('E2E 测试失败');
    return false;
  }
}

// 尝试自动修复
function attemptAutoFix() {
  log.warning('尝试自动修复...');
  
  // 这里可以实现自动修复逻辑，例如：
  // - 运行 linter auto-fix
  // - 调用 AI 分析错误并修复
  
  try {
    execSync('pnpm --filter web lint --fix', {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    log.success('自动修复完成');
    return true;
  } catch (error) {
    return false;
  }
}

// 分析 git diff
function analyzeGitChanges() {
  log.step(4, '分析代码变更');
  
  try {
    const diff = execSync('git diff --name-status', { encoding: 'utf-8' });
    const files = diff.trim().split('\n').filter(Boolean);
    
    const changes = {
      added: [],
      modified: [],
      deleted: []
    };
    
    for (const line of files) {
      const [status, file] = line.split('\t');
      if (status === 'A') changes.added.push(file);
      else if (status === 'M') changes.modified.push(file);
      else if (status === 'D') changes.deleted.push(file);
    }
    
    log.info(`新增: ${changes.added.length}, 修改: ${changes.modified.length}, 删除: ${changes.deleted.length}`);
    
    return changes;
  } catch (error) {
    log.warning('无法获取变更信息');
    return { added: [], modified: [], deleted: [] };
  }
}

// 生成分组提交
function generateCommitGroups(changes) {
  const groups = [];
  
  // 按文件路径和功能模块分组
  const featureFiles = changes.added.filter(f => 
    f.includes('/app/') || f.includes('/components/')
  );
  const testFiles = changes.added.filter(f => 
    f.includes('/tests/') || f.includes('/e2e/')
  );
  const apiFiles = changes.added.filter(f => 
    f.includes('/api/')
  );
  const docFiles = [...changes.added, ...changes.modified].filter(f => 
    f.endsWith('.md') || f.includes('/docs/')
  );
  
  if (featureFiles.length > 0) {
    groups.push({
      type: 'feat',
      scope: 'feature',
      files: featureFiles,
      message: '添加新功能实现'
    });
  }
  
  if (apiFiles.length > 0) {
    groups.push({
      type: 'feat',
      scope: 'api',
      files: apiFiles,
      message: '添加 API 端点'
    });
  }
  
  if (testFiles.length > 0) {
    groups.push({
      type: 'test',
      scope: 'e2e',
      files: testFiles,
      message: '添加 E2E 测试'
    });
  }
  
  if (docFiles.length > 0) {
    groups.push({
      type: 'docs',
      scope: 'openspec',
      files: docFiles,
      message: '更新文档和提案'
    });
  }
  
  // 处理修改的文件
  const modifiedFeatureFiles = changes.modified.filter(f => 
    f.includes('/app/') && !f.includes('/api/')
  );
  
  if (modifiedFeatureFiles.length > 0) {
    groups.push({
      type: 'refactor',
      scope: 'feature',
      files: modifiedFeatureFiles,
      message: '重构功能代码'
    });
  }
  
  return groups;
}

// 图标映射
const typeIcons = {
  feat: '✨',
  fix: '🐛',
  docs: '📝',
  style: '🎨',
  refactor: '♻️',
  perf: '⚡',
  test: '✅',
  chore: '🔧',
  deploy: '🚀'
};

// 执行分批提交
function executeCommits(groups, changeId) {
  log.step(5, '执行分批提交');
  
  for (const group of groups) {
    const icon = typeIcons[group.type] || '🔹';
    const commitMessage = `${icon} ${group.type}(${group.scope}): ${group.message}`;
    
    log.info(`提交: ${commitMessage}`);
    log.info(`  文件: ${group.files.join(', ')}`);
    
    // 添加文件
    for (const file of group.files) {
      try {
        execSync(`git add "${file}"`, { cwd: process.cwd() });
      } catch (error) {
        log.warning(`无法添加文件: ${file}`);
      }
    }
    
    // 创建提交
    try {
      execSync(`git commit -m "${commitMessage}"`, {
        stdio: 'pipe',
        cwd: process.cwd()
      });
      log.success(`提交成功: ${commitMessage}`);
    } catch (error) {
      log.warning(`提交失败或被跳过: ${commitMessage}`);
    }
  }
}

// 推送到远程
function pushToRemote(changeId) {
  log.step(6, '推送到远程仓库');
  
  try {
    const branch = execSync('git branch --show-current', { 
      encoding: 'utf-8',
      cwd: process.cwd()
    }).trim();
    
    execSync(`git push origin ${branch}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    log.success(`已推送到 ${branch}`);
    return true;
  } catch (error) {
    log.error('推送失败');
    return false;
  }
}

// 归档变更
function archiveChange(changeId) {
  log.step(7, '归档变更');
  
  try {
    execSync(`openspec archive ${changeId} --yes`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log.success('变更已归档');
    return true;
  } catch (error) {
    log.warning('归档失败，可以稍后手动执行');
    return false;
  }
}

// 主函数
async function main() {
  const changeId = process.argv[2];
  const skipTests = process.argv.includes('--skip-tests');
  const skipPush = process.argv.includes('--skip-push');
  
  if (!changeId) {
    log.error('请提供 change-id');
    console.log('\n用法: node phase-5-verify-and-commit.js <change-id> [--skip-tests] [--skip-push]');
    process.exit(1);
  }
  
  const config = readConfig();
  
  log.header('🚀 阶段 5: 验证并提交');
  
  try {
    // 运行测试
    let testsPassed = true;
    
    if (!skipTests) {
      testsPassed = runBuild() && runUnitTests() && runE2ETests(changeId);
      
      // 自动修复重试
      if (!testsPassed && config.auto_fix_on_failure) {
        for (let i = 0; i < config.max_test_retries && !testsPassed; i++) {
          log.warning(`第 ${i + 1} 次尝试自动修复...`);
          if (attemptAutoFix()) {
            testsPassed = runBuild() && runUnitTests();
          }
        }
      }
      
      if (!testsPassed) {
        log.error('测试未通过，提交已中止');
        log.info('使用 --skip-tests 跳过测试（不推荐）');
        process.exit(1);
      }
    } else {
      log.warning('跳过测试验证');
    }
    
    // 分析变更
    const changes = analyzeGitChanges();
    
    if (changes.added.length === 0 && changes.modified.length === 0) {
      log.warning('没有检测到代码变更');
      return;
    }
    
    // 生成分组
    const groups = generateCommitGroups(changes);
    
    log.info(`将创建 ${groups.length} 个提交:`);
    groups.forEach((g, i) => {
      console.log(`  ${i + 1}. ${typeIcons[g.type] || '🔹'} ${g.type}(${g.scope}): ${g.message}`);
    });
    
    // 执行提交
    executeCommits(groups, changeId);
    
    // 推送
    if (!skipPush && config.push_on_success) {
      pushToRemote(changeId);
    }
    
    // 可选：归档变更
    // archiveChange(changeId);
    
    log.header('✅ 阶段 5 完成');
    console.log(`\n${colors.green}工作流全部完成!${colors.reset}`);
    console.log(`\n${colors.cyan}变更 ID:${colors.reset} ${changeId}`);
    console.log(`${colors.cyan}提交数:${colors.reset} ${groups.length}`);
    
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }
}

main();
