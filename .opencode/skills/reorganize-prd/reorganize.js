#!/usr/bin/env node

/**
 * 重构产品需求文档脚本
 * 
 * 将 packages/product-designs 中的 PRD 按业务模块重新组织
 * 生成 apps/docs/product/ 下的结构化文档
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  sourceDir: 'packages/product-designs',
  outputDir: 'apps/docs/product',
  modules: [
    { id: 'project', name: '项目管理', order: 1 },
    { id: 'auth', name: '用户认证', order: 2 },
    { id: 'navigation', name: '导航架构', order: 3 },
    { id: 'task', name: '任务管理', order: 4 },
    { id: 'requirement', name: '需求管理', order: 5 },
    { id: 'defect', name: '缺陷管理', order: 6 },
    { id: 'rewards', name: '积分奖励', order: 7 },
    { id: 'design', name: '设计系统', order: 8 }
  ]
};

// 模块分类规则
const MODULE_RULES = {
  project: {
    keywords: ['项目', 'project', 'slow-burn', 'sprint-project', 'ProjectModal', 'ProjectDrawer', '描述编辑器', '项目状态', '项目类型'],
    exclude: ['导航', 'UI', '品牌']
  },
  auth: {
    keywords: ['用户', '登录', '注册', '认证', '密码', '数据持久化', '用户-项目', '真实数据库', 'bcrypt'],
    exclude: []
  },
  navigation: {
    keywords: ['导航', '侧边栏', 'Tab', '路由', '面包屑', '一级导航', '二级导航', '项目详情页'],
    exclude: []
  },
  task: {
    keywords: ['任务', 'task', '爱好', '习惯', '欲望'],
    exclude: []
  },
  requirement: {
    keywords: ['需求', 'requirement', '看板'],
    exclude: []
  },
  defect: {
    keywords: ['缺陷', 'defect', 'bug'],
    exclude: []
  },
  rewards: {
    keywords: ['积分', '奖励', '徽章', '等级', '自动计算', '积分值', '积分基数'],
    exclude: []
  },
  design: {
    keywords: ['UI', '设计', '色彩', '字体', '组件', '品牌', 'Logo', 'Glassmorphism', '动效', '规范', '视觉'],
    exclude: []
  }
};

// 解析 PRD 文件
function parsePRD(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(path.dirname(filePath));
  
  // 提取日期
  const dateMatch = fileName.match(/-(\d{8})$/);
  const date = dateMatch ? dateMatch[1] : '';
  
  // 提取标题
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : fileName;
  
  // 提取文档信息
  const infoMatch = content.match(/##\s+文档信息[\s\S]*?(?=##\s+|$)/);
  const info = infoMatch ? infoMatch[0] : '';
  
  // 提取背景与目标
  const backgroundMatch = content.match(/##\s+1\.\s+背景与目标[\s\S]*?(?=##\s+2\.|$)/);
  const background = backgroundMatch ? backgroundMatch[0] : '';
  
  // 提取功能列表
  const featuresMatch = content.match(/##\s+3\.\s+功能需求[\s\S]*?(?=##\s+4\.|$)/);
  const features = featuresMatch ? featuresMatch[0] : '';
  
  // 提取验收标准
  const acceptanceMatch = content.match(/##\s+6\.\s+验收标准[\s\S]*?(?=##\s+7\.|$)/);
  const acceptance = acceptanceMatch ? acceptanceMatch[0] : '';
  
  return {
    fileName,
    date,
    title,
    content,
    info,
    background,
    features,
    acceptance,
    filePath
  };
}

// 分类 PRD 到模块
function classifyPRD(prd) {
  const scores = {};
  
  for (const [moduleId, rules] of Object.entries(MODULE_RULES)) {
    let score = 0;
    const content = prd.content.toLowerCase();
    
    // 计算关键词匹配分数
    for (const keyword of rules.keywords) {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      const matches = content.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    
    // 排除负向关键词
    for (const exclude of rules.exclude) {
      if (content.includes(exclude.toLowerCase())) {
        score -= 5;
      }
    }
    
    scores[moduleId] = score;
  }
  
  // 找出最高分模块
  let maxScore = 0;
  let primaryModule = null;
  
  for (const [moduleId, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryModule = moduleId;
    }
  }
  
  // 找出次要模块（分数 >= 3 且非主模块）
  const secondaryModules = Object.entries(scores)
    .filter(([id, score]) => score >= 3 && id !== primaryModule)
    .map(([id]) => id);
  
  return {
    primary: primaryModule,
    secondary: secondaryModules,
    scores
  };
}

// 生成模块索引文档
function generateModuleIndex(module, prds) {
  const modulePrds = prds.filter(p => p.classification.primary === module.id);
  
  let content = `# ${module.name}\n\n`;
  content += `## 模块概述\n\n`;
  
  // 生成模块描述
  switch (module.id) {
    case 'project':
      content += `项目管理是系统的核心模块，支持创建、编辑、删除项目，以及项目详情管理。\n\n`;
      content += `### 项目类型\n- **Sprint 项目（冲刺项目）**：短期、高强度、有明确截止日期的项目\n- **Slow-burn 项目（慢燃项目）**：长期、持续积累、无固定截止日期的项目\n\n`;
      content += `### 项目状态\n- **正常**：项目按计划进行\n- **有风险**：项目遇到阻碍，需要关注\n- **失控**：项目严重偏离计划，需要干预\n\n`;
      break;
    case 'auth':
      content += `用户认证模块负责用户的注册、登录和会话管理，确保数据安全与用户隔离。\n\n`;
      content += `### 核心功能\n- 用户注册与登录\n- 密码安全存储（bcrypt 哈希）\n- 用户-项目数据关联\n- 数据持久化到 PostgreSQL\n\n`;
      break;
    case 'navigation':
      content += `导航架构模块定义系统的信息架构和页面导航结构。\n\n`;
      content += `### 导航层级\n- **一级导航**：概览、项目、奖励、通知、设置\n- **二级导航**（项目详情内）：需求、任务、缺陷\n\n`;
      break;
    case 'task':
      content += `任务管理模块支持四种任务类型的管理。\n\n`;
      content += `### 任务类型\n- **爱好**：长期兴趣活动\n- **习惯**：需要养成的日常行为\n- **任务**：一次性待办事项\n- **欲望**：想要达成的目标\n\n`;
      break;
    case 'requirement':
      content += `需求管理模块用于管理项目的功能需求，支持看板视图。\n\n`;
      break;
    case 'defect':
      content += `缺陷管理模块用于跟踪代码项目中的 Bug 和问题，仅适用于 Sprint 项目。\n\n`;
      break;
    case 'rewards':
      content += `积分奖励模块提供游戏化的激励机制，包括积分、徽章、等级系统。\n\n`;
      content += `### 核心机制\n- **积分**：完成任务和项目获得积分（1 积分 = 1 元价值感）\n- **徽章**：达成特定成就解锁徽章\n- **等级**：累计积分提升等级\n- **兑换**：积分可兑换奖励\n\n`;
      break;
    case 'design':
      content += `设计系统模块定义产品的视觉语言和交互规范。\n\n`;
      content += `### 设计理念\n**温暖复古 + 现代简约**，致敬《人人都是产品经理》\n\n`;
      content += `### 设计关键词\n- **温暖**：柔和渐变、圆润边角\n- **复古**：打字机字体、徽章元素\n- **玻璃态**：毛玻璃效果、半透明层级\n- **有机**：流畅动画、自然过渡\n\n`;
      break;
  }
  
  // 相关 PRD 列表
  content += `## 相关需求文档\n\n`;
  content += `| 需求名称 | 日期 | 状态 |\n`;
  content += `|----------|------|------|\n`;
  
  for (const prd of modulePrds.sort((a, b) => b.date.localeCompare(a.date))) {
    const statusMatch = prd.info.match(/状态\s*\|\s*(.+?)\s*\|/);
    const status = statusMatch ? statusMatch[1].trim() : '-';
    content += `| ${prd.title} | ${prd.date} | ${status} |\n`;
  }
  
  if (modulePrds.length === 0) {
    content += `| - | - | - |\n`;
  }
  
  content += `\n`;
  
  // 功能清单
  content += `## 功能清单\n\n`;
  
  const allFeatures = [];
  for (const prd of modulePrds) {
    // 提取功能列表表格
    const tableMatch = prd.features.match(/\|[^|]+功能模块[^|]+\|[\s\S]*?(?=\n##|\n###|$)/);
    if (tableMatch) {
      const lines = tableMatch[0].split('\n').filter(l => l.startsWith('|') && !l.includes('---'));
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(c => c);
        if (cells.length >= 2) {
          allFeatures.push({
            module: cells[0],
            feature: cells[1],
            priority: cells[2] || '-',
            source: prd.title,
            date: prd.date
          });
        }
      }
    }
  }
  
  if (allFeatures.length > 0) {
    content += `| 功能模块 | 功能点 | 优先级 | 来源 |\n`;
    content += `|----------|--------|--------|------|\n`;
    for (const f of allFeatures) {
      content += `| ${f.module} | ${f.feature} | ${f.priority} | ${f.source} |\n`;
    }
  } else {
    content += `> 暂无功能清单\n`;
  }
  
  content += `\n`;
  
  // 快速链接
  content += `## 查看详细\n\n`;
  content += `👉 [查看详细功能](./module.md)\n`;
  
  return content;
}

// 生成模块详细文档
function generateModuleDetail(module, prds) {
  const modulePrds = prds.filter(p => 
    p.classification.primary === module.id || 
    p.classification.secondary.includes(module.id)
  );
  
  let content = `# ${module.name} - 详细功能\n\n`;
  content += `> 本文档汇总了所有与${module.name}相关的需求实现细节\n\n`;
  
  // 按时间倒序排列
  const sortedPrds = modulePrds.sort((a, b) => b.date.localeCompare(a.date));
  
  for (const prd of sortedPrds) {
    content += `## ${prd.title}\n\n`;
    content += `- **文档日期**: ${prd.date}\n`;
    content += `- **文件位置**: packages/product-designs/${prd.fileName}/prd.md\n`;
    
    if (prd.classification.secondary.includes(module.id)) {
      const primaryModule = CONFIG.modules.find(m => m.id === prd.classification.primary);
      content += `- **主要模块**: ${primaryModule ? primaryModule.name : prd.classification.primary}（本文档为关联内容）\n`;
    }
    
    content += `\n`;
    
    // 添加背景
    if (prd.background) {
      // 提取内容部分（去掉标题）
      const bgContent = prd.background.replace(/##\s+1\.\s+背景与目标\s*/, '').trim();
      if (bgContent) {
        content += `### 背景与目标\n\n${bgContent}\n\n`;
      }
    }
    
    // 添加功能需求
    if (prd.features) {
      // 提取功能列表
      const featuresContent = prd.features.replace(/##\s+3\.\s+功能需求\s*/, '').trim();
      if (featuresContent) {
        content += `### 功能需求\n\n${featuresContent}\n\n`;
      }
    }
    
    // 添加验收标准
    if (prd.acceptance) {
      const acceptanceContent = prd.acceptance.replace(/##\s+6\.\s+验收标准\s*/, '').trim();
      if (acceptanceContent) {
        content += `### 验收标准\n\n${acceptanceContent}\n\n`;
      }
    }
    
    content += `---\n\n`;
  }
  
  return content;
}

// 生成总览文档
function generateOverview(prds) {
  let content = `# 产品需求文档总览\n\n`;
  content += `> 本文档按业务功能模块组织，汇总所有产品需求。由系统自动生成，源文件位于 packages/product-designs/\n\n`;
  
  // 统计信息
  content += `## 统计信息\n\n`;
  content += `- **总需求数**: ${prds.length}\n`;
  content += `- **最后更新**: ${new Date().toISOString().split('T')[0]}\n`;
  content += `- **覆盖模块**: ${CONFIG.modules.length}\n\n`;
  
  // 模块索引
  content += `## 功能模块\n\n`;
  
  for (const module of CONFIG.modules.sort((a, b) => a.order - b.order)) {
    const modulePrds = prds.filter(p => p.classification.primary === module.id);
    content += `### ${module.order}. ${module.name}\n\n`;
    
    // 根据模块添加描述
    switch (module.id) {
      case 'project':
        content += `项目的创建、编辑、删除，支持 Sprint 和 Slow-burn 两种类型。\n\n`;
        break;
      case 'auth':
        content += `用户注册、登录、数据持久化与权限管理。\n\n`;
        break;
      case 'navigation':
        content += `系统导航架构，侧边栏与项目详情页布局。\n\n`;
        break;
      case 'task':
        content += `任务管理，支持爱好、习惯、任务、欲望四种类型。\n\n`;
        break;
      case 'requirement':
        content += `需求管理，看板视图展示。\n\n`;
        break;
      case 'defect':
        content += `缺陷跟踪，代码项目专用。\n\n`;
        break;
      case 'rewards':
        content += `积分、徽章、等级等游戏化激励系统。\n\n`;
        break;
      case 'design':
        content += `UI 设计规范，色彩、字体、组件、动效。\n\n`;
        break;
    }
    
    content += `- [查看详细文档](./${String(module.order).padStart(2, '0')}-${module.id}/index.md)\n`;
    content += `- **相关需求**: ${modulePrds.length} 个\n\n`;
  }
  
  // 最近更新
  content += `## 最近更新\n\n`;
  content += `| 日期 | 需求名称 | 主要模块 |\n`;
  content += `|------|----------|----------|\n`;
  
  const recentPrds = prds
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);
  
  for (const prd of recentPrds) {
    const module = CONFIG.modules.find(m => m.id === prd.classification.primary);
    content += `| ${prd.date} | ${prd.title} | ${module ? module.name : '-'} |\n`;
  }
  
  content += `\n`;
  
  // 使用说明
  content += `## 使用说明\n\n`;
  content += `### 查看特定模块需求\n`;
  content += `点击上方功能模块链接，查看该模块的所有需求文档。\n\n`;
  content += `### 追踪需求变更\n`;
  content += `每个模块文档中包含历史变更记录，可追溯功能的演进过程。\n\n`;
  content += `### 新增需求\n`;
  content += `1. 在 packages/product-designs/ 下创建新的 PRD 目录\n`;
  content += `2. 按格式编写 prd.md 文件\n`;
  content += `3. 运行重构脚本更新本文档\n\n`;
  
  return content;
}

// 主函数
function main() {
  console.log('🚀 开始重构产品需求文档...\n');
  
  // 1. 查找所有 PRD 文件
  const prdFiles = [];
  
  function findPRDs(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findPRDs(fullPath);
      } else if (entry.name === 'prd.md') {
        prdFiles.push(fullPath);
      }
    }
  }
  
  findPRDs(CONFIG.sourceDir);
  console.log(`📄 找到 ${prdFiles.length} 个 PRD 文件`);
  
  // 2. 解析所有 PRD
  const prds = prdFiles.map(parsePRD);
  console.log(`✅ 成功解析 ${prds.length} 个文档\n`);
  
  // 3. 分类所有 PRD
  for (const prd of prds) {
    prd.classification = classifyPRD(prd);
  }
  
  // 打印分类结果
  console.log('📊 PRD 分类结果：');
  for (const prd of prds) {
    const module = CONFIG.modules.find(m => m.id === prd.classification.primary);
    console.log(`  - ${prd.title} → ${module ? module.name : prd.classification.primary}`);
    if (prd.classification.secondary.length > 0) {
      const secondary = prd.classification.secondary.map(id => {
        const m = CONFIG.modules.find(mod => mod.id === id);
        return m ? m.name : id;
      });
      console.log(`    次要模块: ${secondary.join(', ')}`);
    }
  }
  console.log('');
  
  // 4. 创建输出目录
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // 5. 生成模块文档
  console.log('📝 生成模块文档...');
  for (const module of CONFIG.modules) {
    const moduleDir = path.join(CONFIG.outputDir, `${String(module.order).padStart(2, '0')}-${module.id}`);
    
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
    }
    
    // 生成索引文档
    const indexContent = generateModuleIndex(module, prds);
    fs.writeFileSync(path.join(moduleDir, 'index.md'), indexContent);
    console.log(`  ✅ ${module.name} - index.md`);
    
    // 生成详细文档
    const detailContent = generateModuleDetail(module, prds);
    fs.writeFileSync(path.join(moduleDir, 'module.md'), detailContent);
    console.log(`  ✅ ${module.name} - module.md`);
  }
  
  // 6. 生成总览文档
  console.log('\n📝 生成总览文档...');
  const overviewContent = generateOverview(prds);
  fs.writeFileSync(path.join(CONFIG.outputDir, 'index.md'), overviewContent);
  console.log('  ✅ index.md');
  
  // 7. 生成 module-index.md
  let moduleIndexContent = '# 模块索引\n\n';
  moduleIndexContent += '快速导航到各功能模块：\n\n';
  for (const module of CONFIG.modules.sort((a, b) => a.order - b.order)) {
    moduleIndexContent += `- [${module.name}](./${String(module.order).padStart(2, '0')}-${module.id}/index.md)\n`;
  }
  fs.writeFileSync(path.join(CONFIG.outputDir, '00-index.md'), moduleIndexContent);
  console.log('  ✅ 00-index.md');
  
  console.log('\n✨ 重构完成！');
  console.log(`\n输出目录: ${CONFIG.outputDir}`);
  console.log('\n请运行以下命令查看生成的文档：');
  console.log('  pnpm dev:docs');
}

// 运行
main();
