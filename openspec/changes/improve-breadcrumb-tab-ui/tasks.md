## 1. 创建可复用组件

### 1.1 创建 BreadcrumbNav 组件
- [x] 1.1.1 在 `apps/web/app/ui/dashboard/` 目录创建 `breadcrumb-nav.tsx`
- [x] 1.1.2 实现糖果色渐变背景样式
- [x] 1.1.3 实现胶囊形状的面包屑容器
- [x] 1.1.4 实现项目下拉选择器组件
- [x] 1.1.5 添加展开/收起动效（使用 CSS transition）
- [x] 1.1.6 添加 TypeScript 类型定义

### 1.2 创建 ProjectTabMenu 组件
- [x] 1.2.1 在 `apps/web/app/ui/dashboard/` 目录创建 `project-tab-menu.tsx`
- [x] 1.2.2 实现滑动指示器组件（类似侧边导航栏效果）
- [x] 1.2.3 实现胶囊形状 Tab 按钮
- [x] 1.2.4 实现选中状态糖果色渐变背景
- [x] 1.2.5 实现切换动效（平滑过渡）
- [x] 1.2.6 添加 TypeScript 类型定义

## 2. 更新项目详情页面

- [x] 2.1 修改 `apps/web/app/dashboard/project/[projectId]/page.tsx`
- [x] 2.2 替换原有面包屑实现为 BreadcrumbNav 组件
- [x] 2.3 替换原有 Tab 实现为 ProjectTabMenu 组件
- [x] 2.4 确保所有原有功能正常工作（下拉选择、Tab 切换等）
- [x] 2.5 移除不再使用的导入和代码

## 3. 样式与交互调优

- [x] 3.1 调整颜色以匹配 Logo 的糖果色渐变（粉色 #FF6B9D、紫色 #C084FC、蓝色 #60A5FA）
- [x] 3.2 确保响应式设计（移动端适配）
- [x] 3.3 优化悬停状态样式
- [x] 3.4 测试键盘导航支持
- [x] 3.5 确保符合 WCAG 可访问性标准

## 4. 验证与测试

- [x] 4.1 在 Chrome DevTools 中验证页面渲染效果
- [x] 4.2 测试面包屑下拉选择器功能
- [x] 4.3 测试 Tab 切换功能
- [x] 4.4 测试响应式布局（不同屏幕尺寸）
- [~] 4.5 运行构建命令 `pnpm build` 确保无错误（构建环境不可用，需手动验证）
- [x] 4.6 确认所有原有功能保持可用

## 5. 文档更新

- [x] 5.1 在代码中添加组件使用注释
- [~] 5.2 更新相关规范的 Purpose 部分（后续统一更新）
