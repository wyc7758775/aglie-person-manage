#!/usr/bin/env node
/**
 * 阶段 2.5: UI 设计同步
 * 
 * 调用 Pencil MCP 生成 UI 设计稿，并同步到 OpenSpec 提案中
 * 这是可选阶段，只有在需要 UI 设计时使用
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
 * 读取 PRD 内容
 */
function readPRD(changeId) {
  const proposalPath = path.join(process.cwd(), 'openspec/changes', changeId, 'proposal.md');
  
  if (!fs.existsSync(proposalPath)) {
    throw new Error(`提案不存在: ${changeId}`);
  }
  
  return fs.readFileSync(proposalPath, 'utf-8');
}

/**
 * 调用 Pencil MCP 生成设计
 */
async function generateDesignWithMCP(changeId, prdContent) {
  log.step(1, '连接 Pencil MCP Server');
  
  const config = loadMCPConfig();
  const client = new MCPClient('pencil', config.pencil);
  
  try {
    await client.connect();
    log.success('Pencil MCP 连接成功');
    
    log.step(2, '生成 UI 设计稿');
    const designResult = await client.callTool('generate_ui_design', {
      change_id: changeId,
      prd_content: prdContent,
      viewports: [
        { name: 'desktop', width: 1440, height: 900 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'mobile', width: 375, height: 667 }
      ]
    });
    
    if (!designResult.success) {
      throw new Error(designResult.message || '设计生成失败');
    }
    
    log.success(`生成完成: ${designResult.outputs.mockups.length} 个视口`);
    
    log.step(3, '提取设计 Token');
    if (designResult.outputs.mockups.length > 0) {
      const tokensResult = await client.callTool('extract_design_tokens', {
        design_path: designResult.outputs.mockups[0].path
      });
      
      // 保存设计 token
      const designDir = path.join(process.cwd(), 'openspec/changes', changeId, 'design');
      if (!fs.existsSync(designDir)) {
        fs.mkdirSync(designDir, { recursive: true });
      }
      
      fs.writeFileSync(
        path.join(designDir, 'design-tokens.json'),
        JSON.stringify(tokensResult.tokens, null, 2)
      );
      
      log.success('设计 Token 已保存');
    }
    
    log.step(4, '生成组件规范');
    if (designResult.outputs.components.length > 0) {
      const specResult = await client.callTool('generate_component_spec', {
        change_id: changeId,
        components: designResult.outputs.components
      });
      
      const designDir = path.join(process.cwd(), 'openspec/changes', changeId, 'design');
      fs.writeFileSync(
        path.join(designDir, 'components-spec.json'),
        JSON.stringify(specResult.specs, null, 2)
      );
      
      log.success('组件规范已保存');
    }
    
    log.step(5, '同步到 OpenSpec');
    const designOutputs = {};
    for (const mockup of designResult.outputs.mockups) {
      designOutputs[mockup.viewport] = mockup.path;
    }
    
    const syncResult = await client.callTool('sync_to_openspec', {
      change_id: changeId,
      design_outputs: designOutputs
    });
    
    log.success(`已同步 ${syncResult.syncedFiles.length} 个文件`);
    
    return {
      success: true,
      designOutputs,
      components: designResult.outputs.components,
      designDir: syncResult.designDir
    };
    
  } finally {
    await client.disconnect();
  }
}

/**
 * 生成设计文档
 */
function generateDesignDocument(changeId, designData) {
  const designDir = path.join(process.cwd(), 'openspec/changes', changeId, 'design');
  
  const docContent = `# UI 设计规范

## 概述
本设计规范由 Pencil MCP 自动生成。

## 设计稿
${Object.entries(designData.designOutputs).map(([viewport, path]) => 
  `- **${viewport}**: ${path}`
).join('\n')}

## 组件清单
${designData.components.map(c => `- ${c}`).join('\n')}

## 设计文件位置
\`\`\`
${designData.designDir}
\`\`\`

## 验证要求
- [ ] 视觉回归测试
- [ ] 设计 Token 一致性检查
- [ ] 响应式布局验证
- [ ] 可访问性检查

## 注意事项
- 设计稿为参考基准，实际实现应保持 95% 以上一致性
- 响应式断点: 375px (mobile), 768px (tablet), 1440px (desktop)
`;

  fs.writeFileSync(path.join(designDir, 'README.md'), docContent);
  
  // 更新 proposal.md，添加设计相关链接
  const proposalPath = path.join(process.cwd(), 'openspec/changes', changeId, 'proposal.md');
  let proposalContent = fs.readFileSync(proposalPath, 'utf-8');
  
  // 检查是否已存在设计部分
  if (!proposalContent.includes('## UI Design')) {
    proposalContent += `\n\n## UI Design\n- 设计文档: [design/README.md](./design/README.md)\n- 设计 Token: [design/design-tokens.json](./design/design-tokens.json)\n- 组件规范: [design/components-spec.json](./design/components-spec.json)\n`;
    
    fs.writeFileSync(proposalPath, proposalContent);
  }
}

/**
 * 主函数
 */
async function main() {
  const changeId = process.argv[2];
  const skipMCP = process.argv.includes('--skip-mcp');
  
  if (!changeId) {
    log.error('请提供 change-id');
    console.log('\n用法: node phase-2.5-ui-design-sync.js <change-id> [--skip-mcp]');
    console.log('');
    console.log('选项:');
    console.log('  --skip-mcp  跳过 MCP 调用，仅生成设计文档框架');
    process.exit(1);
  }
  
  log.header('🎨 阶段 2.5: UI 设计同步');
  
  try {
    // 读取 PRD
    const prdContent = readPRD(changeId);
    log.info(`已读取提案: ${changeId}`);
    
    let designData;
    
    if (skipMCP) {
      log.warning('跳过 MCP 调用，生成设计文档框架');
      
      // 创建基础设计目录结构
      const designDir = path.join(process.cwd(), 'openspec/changes', changeId, 'design');
      if (!fs.existsSync(designDir)) {
        fs.mkdirSync(designDir, { recursive: true });
      }
      
      // 创建占位文件
      fs.writeFileSync(
        path.join(designDir, 'design-tokens.json'),
        JSON.stringify({
          colors: { primary: '#4F46E5', secondary: '#10B981' },
          typography: { fontFamily: 'Inter' },
          spacing: { unit: '4px' }
        }, null, 2)
      );
      
      designData = {
        designOutputs: {
          desktop: 'design/ui-mockups/desktop.png',
          mobile: 'design/ui-mockups/mobile.png'
        },
        components: ['Button', 'Input', 'Card'],
        designDir
      };
    } else {
      // 使用 MCP 生成设计
      designData = await generateDesignWithMCP(changeId, prdContent);
    }
    
    // 生成设计文档
    generateDesignDocument(changeId, designData);
    
    log.header('✅ 阶段 2.5 完成');
    console.log(`\n${colors.cyan}设计文件位置:${colors.reset}`);
    console.log(`  openspec/changes/${changeId}/design/`);
    console.log(`\n${colors.yellow}下一步:${colors.reset}`);
    console.log(`  node scripts/automated-workflow/phases/phase-3-generate-tests.js ${changeId}`);
    
  } catch (error) {
    log.error(error.message);
    
    if (error.message.includes('Pencil MCP')) {
      console.log('\n提示: 如果 MCP Server 未启动，可以:');
      console.log('  1. 启动 MCP Server: cd mcp-servers/pencil-mcp && npm start');
      console.log('  2. 或使用 --skip-mcp 跳过设计生成');
    }
    
    process.exit(1);
  }
}

main();
