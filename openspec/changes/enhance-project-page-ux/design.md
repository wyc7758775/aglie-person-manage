# Design: enhance-project-page-ux

## Context
项目页面需要改进用户体验，包括加载状态的视觉反馈、动画效果和国际化支持。当前实现存在硬编码文本和简单的加载提示，缺少现代化的用户体验。

## Goals / Non-Goals

### Goals
- 提供流畅的项目详情展开动画
- 实现完整的国际化支持
- 添加视觉友好的加载状态骨架屏

### Non-Goals
- 不改变现有的数据结构和 API
- 不修改其他页面的实现
- 不引入新的依赖库

## Decisions

### Decision 1: 骨架屏实现方式
**决策**: 创建独立的 `ProjectCardSkeleton` 组件，复用现有的 `shimmer` 动画模式

**理由**:
- 与现有骨架屏实现保持一致（参考 `app/ui/skeletons.tsx`）
- 独立的组件便于维护和复用
- 使用 Tailwind CSS 工具类，无需额外 CSS 文件

**实现细节**:
```tsx
// 使用现有的 shimmer 模式
const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';
```

**替代方案考虑**:
- 使用第三方骨架屏库（如 `react-loading-skeleton`）：增加了依赖，不符合项目简洁性原则
- 使用 CSS-in-JS：项目已使用 Tailwind CSS，保持一致性更好

### Decision 2: 动画实现方式
**决策**: 使用 Tailwind CSS transition 类实现内容区域渐入动画

**理由**:
- 项目已使用 Tailwind CSS，保持技术栈一致性
- CSS transition 性能优于 JavaScript 动画
- 无需引入额外的动画库

**实现细节**:
```tsx
// 内容区域添加渐入和上滑动画
<div className="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-out opacity-0 translate-y-4 animate-[fadeInUp_0.3s_ease-out_0.1s_forwards]">
```

**替代方案考虑**:
- 使用 Framer Motion：功能强大但增加了依赖和复杂度
- 使用 CSS keyframes：可以实现，但 Tailwind transition 更简洁

### Decision 3: 国际化键命名规范
**决策**: 遵循现有的命名规范，使用层级结构

**理由**:
- 与现有国际化实现保持一致
- 层级结构便于管理和查找
- 符合项目规范（参考 `dictionary.zh.ts`）

**实现细节**:
```typescript
project: {
  loading: '加载中...',
  // ... 其他键
}
common: {
  loading: '加载中...', // 通用加载文本
}
```

**替代方案考虑**:
- 扁平化命名：不利于组织和管理
- 使用命名空间：当前实现已足够清晰

## Risks / Trade-offs

### 风险 1: 动画性能
**风险**: 动画可能影响低端设备的性能

**缓解措施**:
- 使用 `transform` 和 `opacity` 进行动画（GPU 加速）
- 避免使用会触发 layout 的属性
- 测试不同设备的性能表现

### 风险 2: 骨架屏布局不一致
**风险**: 骨架屏布局可能与真实卡片不完全匹配

**缓解措施**:
- 仔细对比骨架屏和真实卡片的布局
- 使用相同的网格系统和间距
- 在开发过程中持续对比和调整

### 风险 3: 国际化键遗漏
**风险**: 可能遗漏某些需要国际化的文本

**缓解措施**:
- 仔细审查代码，查找所有硬编码文本
- 使用 TypeScript 类型检查确保键存在
- 在测试中切换语言验证

## Migration Plan

### 步骤 1: 添加国际化支持
1. 更新中英文字典
2. 替换硬编码文本
3. 测试语言切换

### 步骤 2: 实现骨架屏
1. 创建骨架屏组件
2. 集成到项目页面
3. 测试加载状态

### 步骤 3: 添加动画效果
1. 实现内容区域动画
2. 优化动画时序
3. 测试动画效果

### 回滚计划
- 如果出现问题，可以逐步回滚各个功能
- 国际化更改可以通过恢复硬编码文本回滚
- 骨架屏可以通过恢复简单文本回滚
- 动画可以通过移除动画类回滚

## Open Questions

- 是否需要为骨架屏添加不同的变体（如不同数量的卡片）？
- 动画时长是否需要可配置？
- 是否需要考虑用户的动画偏好设置（减少动画）？
