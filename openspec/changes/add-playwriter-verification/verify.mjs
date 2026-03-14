/**
 * OpenSpec Change: add-playwriter-verification
 * 验证脚本 - 验证 Playwriter 验证工作流本身
 *
 * 前置条件：
 * - Chrome 浏览器已打开 http://localhost:3000
 * - 已登录到系统（dashboard 可访问）
 * - Playwriter 扩展已启用
 */

// ============================================
// 配置区
// ============================================

const CONFIG = {
  baseUrl: 'http://localhost:3000',
  changeId: 'add-playwriter-verification',
  timeout: 30000,
}

// ============================================
// 验证场景
// ============================================

const scenarios = [
  // ==========================================
  // 场景 1: 验证模板文件存在
  // ==========================================
  {
    name: '场景 1: 验证模板文件已创建',
    description: '确认 verify.mjs 模板文件存在于正确位置',
    type: 'file-check',
    steps: [
      {
        action: 'check',
        type: 'file-exists',
        path: 'openspec/templates/verify.mjs',
        comment: '检查模板文件是否存在',
      },
    ],
    expect: '模板文件存在于 openspec/templates/verify.mjs',
  },

  // ==========================================
  // 场景 2: 验证 AGENTS.md 已更新
  // ==========================================
  {
    name: '场景 2: 验证 AGENTS.md 已更新',
    description: '确认 AGENTS.md 包含 Stage 2.5: Verification 章节',
    type: 'file-check',
    steps: [
      {
        action: 'check',
        type: 'file-contains',
        path: 'openspec/AGENTS.md',
        search: 'Stage 2.5: Verification',
        comment: '检查 AGENTS.md 是否包含验证阶段',
      },
    ],
    expect: 'AGENTS.md 包含 Stage 2.5: Verification 章节',
  },

  // ==========================================
  // 场景 3: Playwriter 连接测试
  // ==========================================
  {
    name: '场景 3: Playwriter 连接测试',
    description: '验证 Playwriter 可以连接到 Chrome 浏览器',
    type: 'playwright',
    steps: [
      {
        action: 'snapshot',
        comment: '获取当前页面快照，验证 Playwriter 连接',
      },
    ],
    expect: 'Playwriter 成功连接并获取页面快照',
  },

  // ==========================================
  // 场景 4: Dashboard 访问测试
  // ==========================================
  {
    name: '场景 4: Dashboard 页面可访问',
    description: '验证用户已登录并可以访问 dashboard',
    type: 'playwright',
    steps: [
      {
        action: 'goto',
        url: `${CONFIG.baseUrl}/dashboard`,
        comment: '导航到 dashboard 页面',
      },
      {
        action: 'snapshot',
        search: /项目|任务|需求/,
        comment: '检查页面是否包含关键元素',
      },
    ],
    expect: 'Dashboard 页面正常加载，显示项目/任务/需求等关键元素',
  },
]

// ============================================
// 导出
// ============================================

export { CONFIG, scenarios }
