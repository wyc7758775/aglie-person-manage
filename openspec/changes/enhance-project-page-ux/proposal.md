# Proposal: enhance-project-page-ux

## Summary
增强项目页面的用户体验，包括项目详情展开动画、国际化支持和加载状态的骨架屏动画。

## Problem Statement
当前项目页面存在以下用户体验问题：
1. 项目详情抽屉展开时，内容区域没有渐入动画，显得生硬
2. 页面中存在硬编码的中文文本（如"加载中..."），缺少国际化支持
3. 项目列表加载时只显示简单的"加载中..."文本，没有视觉反馈的骨架屏

## Proposed Solution

### 1. 项目详情展开动画增强
- 为 ProjectDrawer 的内容区域添加渐入和上滑动画
- 使用 CSS transition 实现平滑的动画效果
- 动画时长与抽屉展开动画协调

### 2. 国际化支持
- 将项目页面中的硬编码文本替换为国际化键
- 添加缺失的翻译键到中英文字典
- 确保所有用户可见文本都支持多语言

### 3. 项目列表骨架屏
- 创建项目卡片骨架屏组件（ProjectCardSkeleton）
- 使用 shimmer 动画效果
- 在加载状态时显示骨架屏而不是简单文本
- 骨架屏布局与真实项目卡片保持一致

## Scope
- **In Scope:**
  - 项目页面组件 (`app/dashboard/project/page.tsx`)
  - 项目详情抽屉组件 (`app/dashboard/project/components/ProjectDrawer.tsx`)
  - 骨架屏组件 (`app/ui/skeletons.tsx` 或新建 `app/dashboard/project/components/ProjectCardSkeleton.tsx`)
  - 国际化字典 (`app/lib/i18n/dictionary.zh.ts`, `app/lib/i18n/dictionary.en.ts`)
  - 动画样式（使用 Tailwind CSS 或现有 `animations.css`）

- **Out of Scope:**
  - 其他页面的骨架屏
  - 数据库或 API 变更
  - 其他功能增强

## Success Criteria
1. 项目详情抽屉打开时，内容区域有平滑的渐入动画
2. 项目页面所有文本都通过国际化系统显示
3. 项目列表加载时显示带动画效果的骨架屏
4. 骨架屏布局与真实项目卡片视觉一致
5. 所有动画流畅，不影响性能

## Dependencies
- 现有的 i18n 系统 (`app/lib/i18n`)
- 现有的骨架屏模式 (`app/ui/skeletons.tsx`)
- Tailwind CSS 动画工具类

## Risks
- 低风险：仅影响 UI 展示，不涉及数据变更
- 动画性能需要验证，确保不影响低端设备体验
- 骨架屏布局需要与真实卡片保持一致性
