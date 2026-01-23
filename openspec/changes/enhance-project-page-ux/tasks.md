# Tasks: enhance-project-page-ux

## Phase 1: 国际化支持

- [x] 1.1 识别项目页面中的硬编码文本
  - 检查 `app/dashboard/project/page.tsx` 中的硬编码文本
  - 检查 `app/dashboard/project/components/ProjectDrawer.tsx` 中的硬编码文本
  - 记录所有需要国际化的文本
  - 验证：列出所有需要替换的文本

- [x] 1.2 添加缺失的国际化键到中文字典
  - 在 `app/lib/i18n/dictionary.zh.ts` 的 `project` 部分添加新键
  - 添加 `loading`、`networkError` 等通用键（如果不存在）
  - 验证：字典文件包含所有需要的键

- [x] 1.3 添加缺失的国际化键到英文字典
  - 在 `app/lib/i18n/dictionary.en.ts` 的 `project` 部分添加对应英文翻译
  - 确保中英文字典结构一致
  - 验证：英文字典包含所有对应的翻译

- [x] 1.4 替换项目页面中的硬编码文本
  - 在 `app/dashboard/project/page.tsx` 中使用 `t()` 替换硬编码文本
  - 替换 "加载中..." 为 `t('project.loading')` 或 `t('common.loading')`
  - 替换 "网络错误，请稍后重试" 为 `t('common.errors.networkError')`
  - 验证：页面中无硬编码中文文本

- [x] 1.5 替换项目详情抽屉中的硬编码文本
  - 在 `app/dashboard/project/components/ProjectDrawer.tsx` 中使用 `t()` 替换硬编码文本
  - 替换 "修改后自动保存" 等文本
  - 验证：抽屉中无硬编码中文文本

## Phase 2: 项目列表骨架屏

- [x] 2.1 创建 ProjectCardSkeleton 组件
  - 创建 `app/dashboard/project/components/ProjectCardSkeleton.tsx`
  - 设计骨架屏布局，匹配真实项目卡片的结构
  - 包含：头像占位、标题占位、描述占位、状态标签占位、进度条占位
  - 验证：组件可以正常渲染

- [x] 2.2 添加 shimmer 动画效果
  - 使用现有的 `shimmer` 工具类或创建新的动画
  - 应用动画到骨架屏元素
  - 确保动画流畅且不闪烁
  - 验证：骨架屏有平滑的 shimmer 动画

- [x] 2.3 创建项目列表骨架屏容器
  - 创建 `ProjectListSkeleton` 组件，包含多个 `ProjectCardSkeleton`
  - 使用网格布局，与真实项目列表布局一致
  - 显示 6-9 个骨架卡片
  - 验证：骨架屏布局与真实列表一致

- [x] 2.4 集成骨架屏到项目页面
  - 在 `app/dashboard/project/page.tsx` 的加载状态中使用 `ProjectListSkeleton`
  - 替换简单的 "加载中..." 文本
  - 验证：加载时显示骨架屏

## Phase 3: 项目详情展开动画

- [x] 3.1 分析现有抽屉动画
  - 检查 `ProjectDrawer.tsx` 中的动画实现
  - 确认抽屉主体和遮罩的动画效果
  - 验证：理解现有动画机制

- [x] 3.2 添加内容区域渐入动画
  - 为抽屉内容区域添加 `opacity` 和 `transform` 动画
  - 使用 CSS transition 实现渐入和轻微上滑效果
  - 动画延迟与抽屉展开协调
  - 验证：内容区域有平滑的渐入动画

- [x] 3.3 优化动画时序
  - 调整动画时长和延迟，确保流畅
  - 使用合适的 easing 函数
  - 测试不同屏幕尺寸下的表现
  - 验证：动画流畅且协调

- [x] 3.4 处理动画性能
  - 使用 `transform` 和 `opacity` 进行动画（GPU 加速）
  - 避免触发 layout 和 paint
  - 验证：动画不影响页面性能

## Phase 4: 测试和验证

- [ ] 4.1 功能测试
  - 测试项目列表加载时显示骨架屏
  - 测试项目详情抽屉打开时的动画
  - 测试语言切换后所有文本正确显示
  - 验证：所有功能正常工作

- [ ] 4.2 视觉测试
  - 验证骨架屏与真实卡片布局一致
  - 验证动画流畅自然
  - 验证在不同屏幕尺寸下的表现
  - 验证：视觉效果符合预期

- [ ] 4.3 性能测试
  - 检查动画性能（使用 Chrome DevTools）
  - 验证骨架屏加载不影响性能
  - 验证：性能指标正常

- [x] 4.4 构建验证
  - 运行 `pnpm build`
  - 修复所有 TypeScript 和 lint 错误
  - 验证：构建成功无错误

## Dependencies

- Phase 1 可以独立进行
- Phase 2 可以在 Phase 1 完成后进行
- Phase 3 可以在 Phase 1 完成后进行
- Phase 4 需要所有前面阶段完成

## Parallelizable Work

- Phase 1.2 和 1.3（中英文字典更新）可以并行
- Phase 2 和 Phase 3 可以并行进行
