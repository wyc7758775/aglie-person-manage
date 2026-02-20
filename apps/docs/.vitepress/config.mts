import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '产品设计',
  description: '产品需求与设计文档',
  cleanUrls: true,
  srcDir: '../../packages/product-designs',
  outDir: './dist',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '产品文档', link: '/product/' },
    ],
    sidebar: {
      // 默认侧边栏（时间维度的 PRD）
      '/': [
        { text: '说明', link: '/' },
        {
          text: '按时间查看',
          items: [
            { text: '项目管理增强', link: '/项目管理增强-20260201/prd' },
            { text: '导航架构调整', link: '/导航架构调整-20260202/prd' },
            { text: '用户与项目数据持久化', link: '/用户与项目数据持久化-20260204/prd' },
            { text: '项目弹窗优化', link: '/项目弹窗优化-20260211/prd' },
            { text: 'Slow-burn 项目优化', link: '/slow-burn项目优化-20260216/prd' },
            { text: 'UI 设计规范', link: '/UI设计规范-20260219/prd' },
            { text: '品牌视觉系统升级', link: '/品牌视觉系统升级-20260219/prd' },
          ],
        },
      ],
      // 按模块查看的侧边栏
      '/product/': [
        { text: '文档总览', link: '/product/' },
        { text: '模块索引', link: '/product/00-index' },
        {
          text: '功能模块',
          items: [
            { text: '1. 项目管理', link: '/product/01-project/' },
            { text: '2. 用户认证', link: '/product/02-auth/' },
            { text: '3. 导航架构', link: '/product/03-navigation/' },
            { text: '4. 任务管理', link: '/product/04-task/' },
            { text: '5. 需求管理', link: '/product/05-requirement/' },
            { text: '6. 缺陷管理', link: '/product/06-defect/' },
            { text: '7. 积分奖励', link: '/product/07-rewards/' },
            { text: '8. 设计系统', link: '/product/08-design/' },
          ],
        },
      ],
    },
  },
})
