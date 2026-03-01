#!/usr/bin/env node
/**
 * MCP 客户端工具
 * 
 * 用于与 Pencil MCP 和 Chrome DevTools MCP 通信
 * 支持 stdio 和 sse 两种传输方式
 */

const { spawn } = require('child_process');
const fs = require('fs');

// 动态加载 EventSource（SSE 模式需要）
let EventSource;
try {
  EventSource = require('eventsource');
} catch (e) {
  // SSE 模式下会报错
}
const path = require('path');

class MCPClient {
  constructor(serverName, config = {}) {
    this.serverName = serverName;
    this.config = {
      transport: config.transport || 'stdio', // 'stdio' or 'sse'
      command: config.command,
      args: config.args || [],
      endpoint: config.endpoint, // for sse
      ...config
    };
    this.process = null;
    this.messageId = 0;
    this.pendingRequests = new Map();
    this.tools = [];
  }

  /**
   * 连接到 MCP Server
   */
  async connect() {
    if (this.config.transport === 'stdio') {
      return this.connectStdio();
    } else if (this.config.transport === 'sse') {
      return this.connectSSE();
    }
    throw new Error(`不支持的传输方式: ${this.config.transport}`);
  }

  /**
   * 通过 stdio 连接
   */
  async connectStdio() {
    return new Promise((resolve, reject) => {
      this.process = spawn(this.config.command, this.config.args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let buffer = '';

      this.process.stdout.on('data', (data) => {
        buffer += data.toString();
        
        // 处理 JSON-RPC 消息（每行一个）
        let lines = buffer.split('\n');
        buffer = lines.pop(); // 保留不完整的行

        for (const line of lines) {
          if (line.trim()) {
            this.handleMessage(line);
          }
        }
      });

      this.process.stderr.on('data', (data) => {
        console.error(`[${this.serverName}] ${data.toString()}`);
      });

      this.process.on('error', (error) => {
        reject(error);
      });

      this.process.on('exit', (code) => {
        if (code !== 0) {
          console.error(`[${this.serverName}] 进程退出，代码: ${code}`);
        }
      });

      // 等待初始化
      setTimeout(() => {
        this.initialize().then(resolve).catch(reject);
      }, 1000);
    });
  }

  /**
   * 通过 SSE 连接
   */
  async connectSSE() {
    return new Promise((resolve, reject) => {
      const es = new EventSource(`${this.config.endpoint}/sse`);
      
      es.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      es.onerror = (error) => {
        reject(error);
      };

      es.onopen = () => {
        this.eventSource = es;
        this.initialize().then(resolve).catch(reject);
      };
    });
  }

  /**
   * 初始化 MCP 连接
   */
  async initialize() {
    const result = await this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'automated-workflow-client',
        version: '1.0.0'
      }
    });

    // 获取工具列表
    const toolsResult = await this.request('tools/list', {});
    this.tools = toolsResult.tools || [];

    console.log(`[MCP] ${this.serverName} 已连接，可用工具: ${this.tools.length} 个`);
    
    return result;
  }

  /**
   * 发送 JSON-RPC 请求
   */
  async request(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++this.messageId;
      const message = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      this.pendingRequests.set(id, { resolve, reject });

      if (this.config.transport === 'stdio') {
        this.process.stdin.write(JSON.stringify(message) + '\n');
      } else if (this.config.transport === 'sse') {
        fetch(`${this.config.endpoint}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        }).catch(reject);
      }

      // 超时处理
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`请求超时: ${method}`));
        }
      }, 30000);
    });
  }

  /**
   * 调用工具
   */
  async callTool(toolName, args) {
    const result = await this.request('tools/call', {
      name: toolName,
      arguments: args
    });

    if (result.isError) {
      const error = JSON.parse(result.content[0].text);
      throw new Error(error.error || '工具调用失败');
    }

    return JSON.parse(result.content[0].text);
  }

  /**
   * 处理收到的消息
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      
      if (message.id && this.pendingRequests.has(message.id)) {
        const { resolve, reject } = this.pendingRequests.get(message.id);
        this.pendingRequests.delete(message.id);

        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result);
        }
      }
    } catch (error) {
      console.error('解析消息失败:', error);
    }
  }

  /**
   * 断开连接
   */
  async disconnect() {
    if (this.config.transport === 'stdio' && this.process) {
      this.process.kill();
    } else if (this.config.transport === 'sse' && this.eventSource) {
      this.eventSource.close();
    }
  }
}

/**
 * 获取默认 MCP 配置
 */
function getDefaultMCPConfig() {
  const rootDir = process.cwd();
  
  return {
    pencil: {
      transport: process.env.PENCIL_MCP_TRANSPORT || 'stdio',
      command: 'node',
      args: [path.join(rootDir, 'mcp-servers/pencil-mcp/server.js')],
      endpoint: process.env.PENCIL_MCP_ENDPOINT || 'http://localhost:3001'
    },
    chromeDevTools: {
      transport: process.env.CHROME_DEVTOOLS_MCP_TRANSPORT || 'stdio',
      command: 'node',
      args: [path.join(rootDir, 'mcp-servers/chrome-devtools-mcp/server.js')],
      endpoint: process.env.CHROME_DEVTOOLS_MCP_ENDPOINT || 'http://localhost:3002'
    }
  };
}

/**
 * 从配置文件加载 MCP 配置
 */
function loadMCPConfig() {
  const configPath = path.join(process.cwd(), '.mcp-config.json');
  
  if (fs.existsSync(configPath)) {
    const customConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return { ...getDefaultMCPConfig(), ...customConfig };
  }
  
  return getDefaultMCPConfig();
}

module.exports = {
  MCPClient,
  getDefaultMCPConfig,
  loadMCPConfig
};

// 如果直接运行，测试连接
if (require.main === module) {
  async function test() {
    const config = loadMCPConfig();
    
    console.log('测试 Pencil MCP 连接...');
    const pencilClient = new MCPClient('pencil', config.pencil);
    await pencilClient.connect();
    
    console.log('\n可用工具:');
    pencilClient.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    
    await pencilClient.disconnect();
  }
  
  test().catch(console.error);
}
