/**
 * OpenSpec Change 验证脚本模板
 *
 * 使用方法：
 * 1. 复制此文件到 openspec/changes/<change-id>/verify.mjs
 * 2. 修改 CHANGE_ID 和 scenarios
 * 3. 在 Claude Code 中请求执行验证
 *
 * 前置条件：
 * - Chrome 浏览器已打开 http://localhost:3000
 * - 已登录到系统（dashboard 可访问）
 * - Playwriter 扩展已启用
 *
 * 用法示例（在 Claude Code 中）：
 * "请用 Playwriter 执行 openspec/changes/add-xxx/verify.mjs 的验证脚本"
 */

// ============================================
// 配置区 - 根据你的 change 修改这里
// ============================================

const CONFIG = {
  // 基础 URL
  baseUrl: 'http://localhost:3000',

  // Change ID（用于日志和报告）
  changeId: '<change-id>',

  // 验证超时时间（毫秒）
  timeout: 30000,
}

// ============================================
// 验证场景定义
// ============================================

/**
 * 每个场景包含：
 * - name: 场景名称
 * - description: 场景描述
 * - steps: 执行步骤数组
 * - expect: 期望结果描述
 *
 * 步骤类型：
 * - goto: { action: 'goto', url: string }
 * - click: { action: 'click', selector: string }
 * - fill: { action: 'fill', selector: string, value: string }
 * - snapshot: { action: 'snapshot', search?: RegExp }
 * - wait: { action: 'wait', selector?: string, text?: string }
 * - press: { action: 'press', key: string }
 * - check: { action: 'check', fn: string } // 自定义检查函数
 */
const scenarios = [
  // ==========================================
  // 场景 1: 示例 - 请替换为实际场景
  // ==========================================
  {
    name: '场景 1: 基础页面访问',
    description: '验证用户可以访问目标页面',
    steps: [
      {
        action: 'goto',
        url: `${CONFIG.baseUrl}/dashboard`,
        comment: '导航到 dashboard',
      },
      {
        action: 'snapshot',
        search: /项目|任务|需求/,
        comment: '检查页面是否包含关键元素',
      },
    ],
    expect: '页面正常加载，显示项目/任务/需求等关键元素',
  },

  // ==========================================
  // 场景 2: 示例 - 创建操作
  // ==========================================
  {
    name: '场景 2: 创建新项目',
    description: '验证用户可以创建新项目',
    steps: [
      {
        action: 'click',
        selector: 'button:has-text("创建项目")',
        comment: '点击创建项目按钮',
      },
      {
        action: 'fill',
        selector: 'input[name="name"]',
        value: '测试项目 - Playwriter 验证',
        comment: '填写项目名称',
      },
      {
        action: 'click',
        selector: 'button[type="submit"]',
        comment: '提交表单',
      },
      {
        action: 'wait',
        text: '测试项目 - Playwriter 验证',
        comment: '等待项目创建成功',
      },
    ],
    expect: '项目创建成功，列表中显示新项目',
  },

  // ==========================================
  // 场景 3: 示例 - 编辑操作
  // ==========================================
  {
    name: '场景 3: 编辑项目',
    description: '验证用户可以编辑现有项目',
    steps: [
      {
        action: 'click',
        selector: '.project-card:has-text("测试项目") button:has-text("编辑")',
        comment: '点击编辑按钮',
      },
      {
        action: 'fill',
        selector: 'input[name="description"]',
        value: '这是 Playwriter 验证添加的描述',
        comment: '填写项目描述',
      },
      {
        action: 'click',
        selector: 'button[type="submit"]',
        comment: '保存更改',
      },
    ],
    expect: '项目编辑成功，描述已更新',
  },

  // ==========================================
  // 添加更多场景...
  // ==========================================
]

// ============================================
// 验证执行说明（给 Claude Code 的指令）
// ============================================

/**
 * 执行验证的步骤：
 *
 * 1. 确认前置条件
 *    - 检查 Chrome 是否打开了 localhost:3000
 *    - 确认已登录（URL 包含 dashboard 或页面有用户信息）
 *
 * 2. 遍历每个场景
 *    - 按顺序执行 steps
 *    - 记录每个步骤的结果
 *    - 如果失败，记录错误并继续下一个场景
 *
 * 3. 生成验证报告
 *    - 统计通过/失败的场景数
 *    - 记录失败原因
 *    - 更新 tasks.md 中的验证状态
 *
 * 4. 清理（可选）
 *    - 如果创建了测试数据，考虑清理
 */

// ============================================
// 导出配置（供 Claude Code 读取）
// ============================================

export { CONFIG, scenarios }

// 验证结果类型定义（TypeScript 注释）
/**
 * @typedef {Object} VerificationResult
 * @property {string} scenario - 场景名称
 * @property {'pass' | 'fail'} status - 验证状态
 * @property {string} [error] - 错误信息（如果失败）
 * @property {number} duration - 执行时间（毫秒）
 */

/**
 * @typedef {Object} VerificationReport
 * @property {string} changeId - Change ID
 * @property {Date} timestamp - 验证时间
 * @property {number} total - 总场景数
 * @property {number} passed - 通过数
 * @property {number} failed - 失败数
 * @property {VerificationResult[]} results - 详细结果
 */
