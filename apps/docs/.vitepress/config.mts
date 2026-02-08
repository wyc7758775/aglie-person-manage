import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '产品设计',
  description: 'PRD、i18n 与产品设计文档',
  srcDir: '../../packages/product-designs',
  outDir: './dist',
  themeConfig: {
    nav: [{ text: '首页', link: '/' }],
    sidebar: [
      { text: '说明', link: '/' },
      {
        text: '项目管理增强',
        collapsed: false,
        items: [
          { text: 'PRD', link: '/项目管理增强-20260201/prd' },
          { text: 'i18n', link: '/项目管理增强-20260201/i18n' },
        ],
      },
      {
        text: '导航架构调整',
        collapsed: false,
        items: [
          { text: 'PRD', link: '/导航架构调整-20260202/prd' },
          { text: 'i18n', link: '/导航架构调整-20260202/i18n' },
        ],
      },
      {
        text: '用户与项目数据持久化',
        collapsed: false,
        items: [
          { text: 'PRD', link: '/用户与项目数据持久化-20260204/prd' },
        ],
      },
    ],
  },
})
