# Spec: Project Page UX Enhancements

## ADDED Requirements

### Requirement: 项目列表加载骨架屏

项目列表加载时 SHALL 显示带动画效果的骨架屏，而不是简单的文本提示。

**Acceptance Criteria:**
- 骨架屏布局与真实项目卡片保持一致
- 使用 shimmer 动画效果
- 显示多个骨架卡片（6-9 个）
- 网格布局与真实列表一致

**Implementation:**
- 创建 `ProjectCardSkeleton` 组件
- 创建 `ProjectListSkeleton` 组件
- 在加载状态时替换 "加载中..." 文本

#### Scenario: 项目列表加载显示骨架屏
- **GIVEN** 用户访问项目页面
- **WHEN** 项目数据正在加载（`loading === true`）
- **THEN** 显示项目列表骨架屏
- **AND** 骨架屏包含多个项目卡片占位符
- **AND** 每个卡片占位符包含头像、标题、描述、状态标签、进度条等元素的占位
- **AND** 骨架屏有 shimmer 动画效果

#### Scenario: 骨架屏布局匹配真实卡片
- **GIVEN** 项目列表骨架屏正在显示
- **WHEN** 用户查看骨架屏
- **THEN** 骨架屏的网格布局与真实项目卡片列表一致
- **AND** 卡片尺寸和间距与真实卡片匹配

---

### Requirement: 项目详情抽屉内容区域动画

项目详情抽屉打开时，内容区域 SHALL 有平滑的渐入和上滑动画效果。

**Acceptance Criteria:**
- 内容区域在抽屉展开后渐入显示
- 动画包含轻微的上滑效果
- 动画时长与抽屉展开动画协调
- 动画流畅，不影响性能

**Implementation:**
- 使用 CSS transition 或 Tailwind 动画类
- 动画延迟与抽屉展开同步
- 使用 `transform` 和 `opacity` 进行动画

#### Scenario: 抽屉内容区域渐入动画
- **GIVEN** 用户点击项目卡片或"添加项目"按钮
- **WHEN** 项目详情抽屉开始展开
- **THEN** 抽屉主体从右侧滑入
- **AND** 内容区域在抽屉展开后渐入显示（opacity 0 → 1）
- **AND** 内容区域有轻微的上滑效果（translateY）

#### Scenario: 动画时序协调
- **GIVEN** 项目详情抽屉正在打开
- **WHEN** 抽屉主体动画完成
- **THEN** 内容区域动画开始或接近完成
- **AND** 整体动画流畅自然

---

### Requirement: 项目页面完整国际化支持

项目页面 SHALL 支持完整的国际化，所有用户可见文本都通过国际化系统显示。

**Acceptance Criteria:**
- 页面中无硬编码的中文或英文文本
- 所有文本都通过 `t()` 函数获取
- 支持中英文切换
- 新增的国际化键添加到中英文字典

**Implementation:**
- 识别所有硬编码文本
- 添加缺失的国际化键
- 替换硬编码文本为 `t()` 调用

#### Scenario: 加载状态文本国际化
- **GIVEN** 项目页面正在加载数据
- **WHEN** 用户查看页面
- **THEN** 显示国际化后的加载文本（如 `t('project.loading')` 或 `t('common.loading')`）
- **AND** 切换语言后文本正确显示

#### Scenario: 错误消息国际化
- **GIVEN** 项目页面加载失败
- **WHEN** 显示错误消息
- **THEN** 错误消息通过国际化系统显示（如 `t('common.errors.networkError')`）
- **AND** 切换语言后错误消息正确显示

#### Scenario: 项目详情抽屉文本国际化
- **GIVEN** 项目详情抽屉已打开
- **WHEN** 用户查看抽屉内容
- **THEN** 所有文本都通过国际化系统显示
- **AND** 包括"修改后自动保存"等提示文本
- **AND** 切换语言后所有文本正确显示

---

## MODIFIED Requirements

### Requirement: 项目页面加载状态显示

项目页面的加载状态显示 SHALL 从简单文本改为骨架屏组件。

**Before:**
```tsx
{loading ? (
  <div className="text-center py-8 text-gray-500">加载中...</div>
) : ...}
```

**After:**
```tsx
{loading ? (
  <ProjectListSkeleton />
) : ...}
```

#### Scenario: 加载状态显示骨架屏
- **GIVEN** 项目页面组件
- **WHEN** `loading` 状态为 `true`
- **THEN** 显示 `ProjectListSkeleton` 组件
- **AND** 不再显示简单的 "加载中..." 文本

---

### Requirement: 项目详情抽屉内容区域样式

项目详情抽屉的内容区域 SHALL 添加渐入动画类。

**Before:**
```tsx
<div className="flex-1 overflow-y-auto p-6">
  {/* 内容 */}
</div>
```

**After:**
```tsx
<div className="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-out opacity-0 translate-y-4 animate-[fadeInUp_0.3s_ease-out_0.1s_forwards]">
  {/* 内容 */}
</div>
```

#### Scenario: 内容区域添加动画类
- **GIVEN** 项目详情抽屉组件
- **WHEN** 抽屉内容区域渲染
- **THEN** 内容区域包含动画相关的 CSS 类
- **AND** 动画在抽屉展开时触发

---

## Related Capabilities

- Related to: `i18n` (国际化系统)
- Related to: `project-management` (项目管理功能)
- May enhance: `enhance-drawer-experience` (抽屉体验增强)
