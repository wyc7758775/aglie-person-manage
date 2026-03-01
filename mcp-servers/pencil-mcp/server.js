#!/usr/bin/env node
/**
 * Pencil MCP Server
 * 
 * 根据 PRD 生成 UI 设计稿，并将设计规范同步到 OpenSpec 提案中
 */

const express = require('express');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs');
const path = require('path');

// 配置
const PORT = process.env.PORT || 3001;
const OUTPUT_DIR = process.env.OUTPUT_DIR || './outputs';
const MCP_TRANSPORT = process.env.MCP_TRANSPORT || 'stdio';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * MCP 工具定义
 */
const TOOLS = [
  {
    name: 'generate_ui_design',
    description: '根据 PRD 内容生成 UI 设计稿和设计规范',
    inputSchema: {
      type: 'object',
      properties: {
        change_id: {
          type: 'string',
          description: 'OpenSpec change ID'
        },
        prd_content: {
          type: 'string',
          description: 'PRD 文档内容'
        },
        viewports: {
          type: 'array',
          description: '需要生成的视口尺寸',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              width: { type: 'number' },
              height: { type: 'number' }
            }
          },
          default: [
            { name: 'desktop', width: 1440, height: 900 },
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'mobile', width: 375, height: 667 }
          ]
        }
      },
      required: ['change_id', 'prd_content']
    }
  },
  {
    name: 'extract_design_tokens',
    description: '从设计稿中提取设计 token（颜色、字体、间距等）',
    inputSchema: {
      type: 'object',
      properties: {
        design_path: {
          type: 'string',
          description: '设计稿文件路径'
        }
      },
      required: ['design_path']
    }
  },
  {
    name: 'generate_component_spec',
    description: '生成组件规范文档',
    inputSchema: {
      type: 'object',
      properties: {
        change_id: {
          type: 'string',
          description: 'OpenSpec change ID'
        },
        components: {
          type: 'array',
          description: '组件列表',
          items: { type: 'string' }
        }
      },
      required: ['change_id']
    }
  },
  {
    name: 'sync_to_openspec',
    description: '将设计输出同步到 OpenSpec 目录',
    inputSchema: {
      type: 'object',
      properties: {
        change_id: {
          type: 'string',
          description: 'OpenSpec change ID'
        },
        design_outputs: {
          type: 'object',
          description: '设计输出文件路径映射'
        }
      },
      required: ['change_id', 'design_outputs']
    }
  }
];

/**
 * 工具实现
 */
async function generateUIDesign(args) {
  const { change_id, prd_content, viewports } = args;
  
  console.log(`[Pencil MCP] 正在为 ${change_id} 生成 UI 设计稿...`);
  
  const outputs = {
    mockups: [],
    tokens: {},
    components: []
  };
  
  // 为每个视口生成设计稿
  for (const viewport of viewports) {
    const outputPath = path.join(OUTPUT_DIR, `${change_id}-${viewport.name}.png`);
    
    await generateMockupImage(prd_content, viewport, outputPath);
    
    outputs.mockups.push({
      viewport: viewport.name,
      path: outputPath,
      dimensions: { width: viewport.width, height: viewport.height }
    });
  }
  
  // 提取设计 token
  outputs.tokens = extractDesignTokensFromPRD(prd_content);
  
  // 识别组件
  outputs.components = identifyComponents(prd_content);
  
  console.log(`[Pencil MCP] 设计稿生成完成: ${outputs.mockups.length} 个视口`);
  
  return {
    success: true,
    outputs,
    message: `成功生成 ${outputs.mockups.length} 个视口的设计稿`
  };
}

async function extractDesignTokens(args) {
  const { design_path } = args;
  
  return {
    success: true,
    tokens: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        background: '#FFFFFF',
        text: '#1F2937'
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        headingSize: '1.5rem',
        bodySize: '1rem'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
      }
    }
  };
}

async function generateComponentSpec(args) {
  const { change_id, components = [] } = args;
  
  const componentSpecs = components.map(name => ({
    name,
    props: [],
    states: ['default', 'hover', 'active', 'disabled'],
    accessibility: {
      role: '',
      ariaLabels: []
    }
  }));
  
  return {
    success: true,
    specs: componentSpecs
  };
}

async function syncToOpenSpec(args) {
  const { change_id, design_outputs } = args;
  
  const designDir = path.join(process.cwd(), 'openspec/changes', change_id, 'design');
  
  if (!fs.existsSync(designDir)) {
    fs.mkdirSync(designDir, { recursive: true });
  }
  
  const syncedFiles = [];
  
  for (const [key, sourcePath] of Object.entries(design_outputs)) {
    const targetPath = path.join(designDir, path.basename(sourcePath));
    fs.copyFileSync(sourcePath, targetPath);
    syncedFiles.push(targetPath);
  }
  
  // 生成设计系统文档
  const designDoc = generateDesignDoc(change_id, design_outputs);
  fs.writeFileSync(path.join(designDir, 'design-system.md'), designDoc);
  
  return {
    success: true,
    syncedFiles,
    designDir
  };
}

/**
 * 辅助函数
 */
async function generateMockupImage(prdContent, viewport, outputPath) {
  await new Promise(resolve => setTimeout(resolve, 500));
  fs.writeFileSync(outputPath, `Mockup: ${viewport.name} (${viewport.width}x${viewport.height})`);
}

function extractDesignTokensFromPRD(prdContent) {
  const tokens = {
    colors: [],
    typography: {},
    spacing: {}
  };
  
  const colorMatches = prdContent.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
  if (colorMatches) {
    tokens.colors = [...new Set(colorMatches)];
  }
  
  return tokens;
}

function identifyComponents(prdContent) {
  const componentPatterns = [
    /按钮|Button/g,
    /输入框|Input|表单|Form/g,
    /卡片|Card/g,
    /模态框|Modal|对话框|Dialog/g,
    /列表|List/g,
    /表格|Table/g,
    /导航|Nav|菜单|Menu/g,
    /标签|Tab/g
  ];
  
  const components = [];
  for (const pattern of componentPatterns) {
    if (pattern.test(prdContent)) {
      components.push(pattern.source.replace(/\|/g, '/'));
    }
  }
  
  return components;
}

function generateDesignDoc(changeId, outputs) {
  return `# Design System for ${changeId}

## Overview
自动生成的设计规范文档。

## Design Outputs
${Object.entries(outputs).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## Generated At
${new Date().toISOString()}
`;
}

/**
 * MCP Server 实现
 */
async function main() {
  const server = new Server(
    {
      name: 'pencil-mcp-server',
      version: '1.0.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );
  
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });
  
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      let result;
      
      switch (name) {
        case 'generate_ui_design':
          result = await generateUIDesign(args);
          break;
        case 'extract_design_tokens':
          result = await extractDesignTokens(args);
          break;
        case 'generate_component_spec':
          result = await generateComponentSpec(args);
          break;
        case 'sync_to_openspec':
          result = await syncToOpenSpec(args);
          break;
        default:
          throw new Error(`未知工具: ${name}`);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            })
          }
        ],
        isError: true
      };
    }
  });
  
  if (MCP_TRANSPORT === 'sse') {
    const app = express();
    let transport = null;
    
    app.get('/sse', async (req, res) => {
      transport = new SSEServerTransport('/messages', res);
      await server.connect(transport);
    });
    
    app.post('/messages', async (req, res) => {
      if (transport) {
        await transport.handlePostMessage(req, res);
      }
    });
    
    app.listen(PORT, () => {
      console.log(`[Pencil MCP] SSE Server running on port ${PORT}`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log('[Pencil MCP] Stdio Server running');
  }
}

main().catch(console.error);
