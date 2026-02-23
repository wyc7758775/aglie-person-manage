# improve-project-ui 设计文档

## 架构概述

本项目改进项目管理页面的用户体验，重点优化弹窗交互、动画效果和卡片视觉设计。采用右侧抽屉式弹窗，统一编辑和查看功能，添加流畅的动画过渡。

## 组件架构

### 组件层次结构

```
ProjectPage (page.tsx)
├── SectionContainer
│   └── ProjectGrid (带动画组)
│       └── ProjectCard[] (独立组件)
│           ├── Avatar (表情头像)
│           ├── ProjectInfo (基本信息)
│           ├── Tags (标签、状态、优先级)
│           └── ProgressWithMilestones (带里程碑的进度条)
├── ProjectDrawer (统一抽屉)
│   ├── DrawerHeader (标题、模式切换、关闭)
│   ├── DrawerBody
│   │   ├── ViewMode (项目详情展示)
│   │   └── EditMode (表单编辑)
│   │       ├── AvatarPicker (头像选择器)
│   │       ├── ProjectForm (项目表单)
│   │       └── MilestonesEditor (里程碑编辑)
│   └── DrawerFooter (保存、删除)
└── DeleteConfirmDialog (删除确认)
```

## 核心设计决策

### 1. 统一的右侧抽屉

**决策**：使用右侧抽屉替代居中弹窗

**理由**：
- 不遮挡整个页面，用户仍能看到背景内容
- 更符合现代应用的交互习惯
- 适合显示大量信息（项目详情、编辑表单）
- 移动端友好（全屏抽屉）

**实现**：
- 固定定位，从右侧滑入
- 遮罩层（点击关闭、背景模糊）
- 最大宽度：600px，移动端：100%
- 支持响应式高度

### 2. 查看和编辑模式切换

**决策**：在同一个抽屉内切换模式

**理由**：
- 用户体验更流畅（无需关闭再打开）
- 保留上下文（用户正在查看的项目）
- 减少组件数量（统一为 ProjectDrawer）

**实现**：
- `mode` 状态：`'view' | 'edit'`
- 查看模式：只读展示项目信息
- 编辑模式：显示可编辑的表单
- 模式切换按钮：仅在查看模式时显示"编辑"按钮

### 3. 二次确认对话框

**决策**：专门的对话框组件（替代原生 confirm）

**理由**：
- 更好的视觉一致性
- 可以自定义样式和文案
- 支持动画效果
- 可扩展（如添加撤销功能）

**实现**：
- 居中对话框，红色主题
- 显示项目名称和警告图标
- 确认和取消按钮
- 遮罩层（非模态，点击不关闭）

### 4. 项目卡片优化

**决策**：使用半透明纯色背景 + 表情头像

**理由**：
- 视觉层次更清晰
- 区分项目类型（code: 蓝色, life: 绿色）
- 表情头像更生动
- 符合现代设计趋势

**背景色方案**：
```css
.code-project {
  background-color: rgba(59, 130, 246, 0.1); /* 蓝色半透明 */
}

.life-project {
  background-color: rgba(16, 185, 129, 0.1); /* 绿色半透明 */
}
```

**表情包设计**：
- 20 个常用表情
- 覆盖常见项目类型
- 显示在卡片左上角
- 较大尺寸（32px）

### 5. 进度条里程碑

**决策**：在进度条上标记里程碑位置

**理由**：
- 可视化项目进度的重要节点
- 直观了解项目完成度
- 支持里程碑管理（基本功能）

**里程碑数据结构**：
```typescript
interface Milestone {
  value: number;   // 进度百分比（0-100）
  label: string;   // 里程碑名称
}
```

**里程碑显示**：
- 使用三角形标记（▲）或圆点（●）
- 定位在进度条上对应的位置
- 悬停显示完整标签
- 编辑模式下显示里程碑列表

## 动画设计

### 抽屉动画

**动画曲线**：`cubic-bezier(0.4, 0, 0.2, 1)` - 标准缓动

**动画时长**：300ms

**实现**：
```css
/* 进入动画 */
.drawer-enter {
  transform: translateX(100%);
}

.drawer-enter-active {
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 退出动画 */
.drawer-exit {
  transform: translateX(0);
}

.drawer-exit-active {
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 卡片进入动画

**动画类型**：Fade + Slide Up（淡入 + 上滑）

**动画时长**：300ms

**延迟效果**：每个卡片延迟 50ms（staggered）

```css
.card-enter {
  opacity: 0;
  transform: translateY(20px);
}

.card-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-out;
}
```

### 卡片悬停动画

**动画效果**：轻微上移 + 阴影加深

**动画时长**：200ms

```css
.card {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### 对话框动画

**动画效果**：Fade + Scale（淡入 + 缩放）

**动画时长**：200ms

```css
.dialog-enter {
  opacity: 0;
  transform: scale(0.95);
}

.dialog-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: all 0.2s ease-out;
}
```

## 状态管理

### 抽屉状态

```typescript
const [drawerOpen, setDrawerOpen] = useState(false);
const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');
const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
const [milestones, setMilestones] = useState<Milestone[]>([]);
const [selectedAvatar, setSelectedAvatar] = useState<string>('');

// 打开查看模式
const handleOpenView = (project: Project) => {
  setSelectedProject(project);
  setDrawerMode('view');
  setDrawerOpen(true);
};

// 打开编辑模式
const handleOpenEdit = (project?: Project) => {
  setSelectedProject(project || createEmptyProject());
  setDrawerMode('edit');
  setDrawerOpen(true);
};

// 切换模式
const switchMode = () => {
  setDrawerMode(prev => prev === 'view' ? 'edit' : 'view');
};
```

### 删除确认状态

```typescript
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

const handleDeleteClick = () => {
  setDeleteDialogOpen(true);
};

const handleDeleteConfirm = async () => {
  await deleteProject(selectedProject.id);
  setDeleteDialogOpen(false);
  setDrawerOpen(false);
};
```

## 响应式设计

### 抽屉响应式

```css
/* 桌面（>= 1024px） */
.drawer {
  width: 600px;
}

/* 平板（768px - 1023px） */
@media (max-width: 1023px) {
  .drawer {
    width: 80%;
  }
}

/* 移动端（< 768px） */
@media (max-width: 767px) {
  .drawer {
    width: 100%;
  }
}
```

### 卡片网格响应式

```css
/* 移动端（< 768px） */
.project-grid {
  grid-template-columns: 1fr;
}

/* 平板（768px - 1023px） */
@media (min-width: 768px) and (max-width: 1023px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面（>= 1024px） */
@media (min-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 性能优化

### CSS 动画性能

**原则**：优先使用 transform 和 opacity，避免 layout 属性

```css
/* ✅ 推荐 */
.animated {
  transition: transform 0.3s, opacity 0.3s;
}

/* ❌ 避免 */
.animated {
  transition: width 0.3s, height 0.3s;
}
```

### React 渲染优化

**使用 useMemo 缓存计算值**：
```typescript
const filteredProjects = useMemo(() => {
  return projects.filter(p => {
    if (activeFilter === 'All') return true;
    return p.status === activeFilter.toLowerCase();
  });
}, [projects, activeFilter]);
```

**使用 useCallback 缓存事件处理器**：
```typescript
const handleOpenView = useCallback((project: Project) => {
  setSelectedProject(project);
  setDrawerMode('view');
  setDrawerOpen(true);
}, []);

const handleOpenEdit = useCallback((project?: Project) => {
  setSelectedProject(project || createEmptyProject());
  setDrawerMode('edit');
  setDrawerOpen(true);
}, []);
```

## 可访问性（A11y）

### 键盘导航

- ESC 键：关闭抽屉、取消对话框
- Tab 键：在表单元素间导航
- Enter 键：提交表单

### 焦点管理

```tsx
<button
  onClick={handleClick}
  onKeyPress={(e) => e.key === 'Escape' && handleCancel()}
  aria-label="Close drawer"
>
  ✕
</button>
```

### 屏幕阅读器支持

```tsx
<div role="dialog" aria-modal="true" aria-label="Project details drawer">
  {/* 内容 */}
</div>
```

## 依赖关系

### 现有组件
- ✅ SectionContainer
- ✅ 图标库（PlusIcon, EllipsisVerticalIcon 等）
- ✅ i18n 国际化系统
- ✅ Project 类型定义

### 可选依赖
- 🔄 framer-motion（高级动画，可选）
- ✅ 纯 CSS 动画（推荐，无额外依赖）

## 文件结构

```
app/dashboard/project/
├── page.tsx                              # 修改：集成新组件
├── components/
│   ├── constants.ts                       # 新增：表情包常量
│   ├── animations.css                     # 新增：动画样式
│   ├── ProjectDrawer.tsx                 # 新增：统一抽屉
│   ├── DeleteConfirmDialog.tsx            # 新增：删除确认
│   ├── AvatarPicker.tsx                   # 新增：头像选择器
│   ├── ProgressWithMilestones.tsx         # 新增：带里程碑的进度条
│   └── ProjectCard.tsx                   # 新增：优化的项目卡片

app/lib/
├── definitions.ts                         # 修改：添加 Milestone 类型
└── i18n/
    ├── dictionary.zh.ts                    # 修改：添加新翻译
    └── dictionary.en.ts                   # 修改：添加新翻译
```

## 风险与缓解措施

### 风险 1：动画性能问题

**风险**：大量卡片同时动画可能导致卡顿

**缓解**：
- 使用 CSS transform 和 opacity
- 减少同时动画的元素数量
- 使用 will-change 属性优化
- 测试不同设备性能

### 风险 2：表情显示不一致

**风险**：不同操作系统/浏览器中表情可能显示不一致

**缓解**：
- 使用常用表情（兼容性好）
- 测试主流浏览器
- 考虑使用 SVG 图标作为备选方案

### 风险 3：里程碑编辑逻辑复杂

**风险**：里程碑编辑可能过于复杂

**缓解**：
- 简化为基本功能（添加、删除、编辑）
- 不支持拖拽排序
- 不支持复杂的状态管理

### 风险 4：抽屉在小屏幕上体验不佳

**风险**：移动端抽屉可能占用过多空间

**缓解**：
- 响应式设计（移动端全屏）
- 内容可滚动
- 优化布局和间距
