# Change: 项目弹窗优化

## Why

当前项目创建/编辑弹窗（ProjectModal）在用户体验和代码组织方面存在优化空间：ESC 关闭体验不完整、积分计算交互不够直观、组件复用度低、主题色不够灵活。为提升产品易用性和可维护性，需要对弹窗进行全面优化。

## What Changes

- **ESC 关闭弹窗 + 二次确认**：编辑态下按 ESC 触发确认对话框，防止误操作丢失数据
- **积分设置区域优化**：将「根据优先级自动计算」单选框移动到积分 label 右侧，布局更紧凑，默认选中
- **积分基数调整**：所有积分默认值乘以 10，使 1 积分 = 1 元，提升价值感知
- **弹窗视觉优化**：label 颜色比 value 更淡，提升视觉层次
- **创建按钮位置调整**：按钮移至弹窗右下角，符合主流交互习惯
- **UI 组件抽离**：将弹窗内通用组件抽离到 `components/ui/` 目录，支持复用
- **动态主题色**：主题色可配置，默认与登录页主色一致
- **移除编辑态动画**：删除编辑态到文本态的过渡动画，减少视觉干扰
- **项目类型简化**：从 life/code 两种类型调整为 sprint-project（⚡ 冲刺项目）和 slow-project（🌱 长期项目）

## Impact

- **Affected specs**: project-management, i18n, ui-components
- **Affected code**:
  - `app/dashboard/project/components/ProjectModal.tsx` - 弹窗主体逻辑
  - `app/components/ui/` - 新增/更新通用 UI 组件
  - `app/lib/i18n/dictionary.*.ts` - 新增翻译键
  - `app/lib/definitions.ts` - ProjectType 类型变更
  - `app/dashboard/project/page.tsx` - 项目类型筛选和显示
  - `app/lib/projects.ts` - 项目数据处理逻辑
