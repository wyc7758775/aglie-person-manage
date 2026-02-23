# improve-project-ui 任务清单

## 任务0：准备阶段

### 0.1 确认表情包列表
- [x] 在 `app/dashboard/project/components/` 创建 `constants.ts`
- [x] 定义 AVATARS 数组（20个表情）
- [x] 导出 AVATARS 常量

**表情包列表**：
```typescript
export const AVATARS = [
  '💻', '🏠', '📚', '🎮', '🏃',
  '💪', '🎨', '📷', '🎵', '🎬',
  '🍳', '🚗', '✈️', '🎁', '🎯',
  '💡', '🔧', '📊',
];
```

**验证方式**：
- [x] AVATARS 常量可正确导入

### 0.2 设计动画样式
- [x] 创建 `app/dashboard/project/components/animations.css`
- [x] 添加抽屉滑入/滑出动画
- [x] 添加卡片进入/退出动画
- [x] 添加卡片悬停动画

**动画样式参考**：
```css
/* 抽屉动画 */
.drawer-enter {
  transform: translateX(100%);
}
.drawer-enter-active {
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-exit {
  transform: translateX(0);
}
.drawer-exit-active {
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 卡片进入动画 */
.card-enter {
  opacity: 0;
  transform: translateY(20px);
}
.card-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-out;
}

/* 卡片悬停动画 */
.card-hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease-out;
}
```

**验证方式**：
- [x] 动画样式文件可正确导入

---

## 任务1：创建统一抽屉弹窗

### 1.1 创建 ProjectDrawer 组件
- [x] 创建 `app/dashboard/project/components/ProjectDrawer.tsx`
- [x] 实现 props 接口（open, onClose, project, mode, onSave, onDelete）
- [x] 实现查看模式（只显示信息）
- [x] 实现编辑模式（显示表单）
- [x] 实现模式切换按钮
- [x] 右侧抽屉布局样式
- [x] 集成滑入/滑出动画
- [x] 添加遮罩层（点击关闭）

**布局结构**：
```tsx
<div className="fixed inset-0 z-50">
  <div className="drawer-mask" onClick={onClose} />
  <div className="drawer-content right-0">
    <div className="drawer-header">
      <h2>{mode === 'edit' ? t('project.drawer.editMode') : t('project.drawer.viewMode')}</h2>
      {mode === 'view' && (
        <button onClick={switchToEditMode}>{t('project.drawer.switchToEdit')}</button>
      )}
      <button onClick={onClose}>✕</button>
    </div>
    <div className="drawer-body">
      {mode === 'view' ? <ProjectDetails /> : <ProjectForm />}
    </div>
    <div className="drawer-footer">
      {mode === 'edit' && (
        <button onClick={handleSave}>{t('project.drawer.save')}</button>
      )}
      <button onClick={handleDelete} className="text-red-600">
        {t('project.delete')}
      </button>
    </div>
  </div>
</div>
```

**验证方式**：
- [x] 抽屉可正常打开和关闭
- [x] 查看模式正确显示项目信息
- [x] 编辑模式正确显示表单
- [x] 模式切换正常工作
- [x] 滑入/滑出动画正常

### 1.2 集成到列表页
- [x] 修改 `app/dashboard/project/page.tsx`
- [x] 移除 ProjectDialog 和 ProjectDetailDialog 导入
- [x] 添加 ProjectDrawer 导入
- [x] 添加 drawer 状态（open, mode）
- [x] 修改打开查看逻辑（打开查看模式抽屉）
- [x] 修改打开编辑逻辑（打开编辑模式抽屉）

**验证方式**：
- [x] 点击项目卡片打开查看模式抽屉
- [x] 点击编辑按钮打开编辑模式抽屉
- [x] 点击关闭按钮正常关闭

---

## 任务2：创建删除确认对话框

### 2.1 创建 DeleteConfirmDialog 组件
- [x] 创建 `app/dashboard/project/components/DeleteConfirmDialog.tsx`
- [x] 实现 props 接口（open, onClose, onConfirm, projectName）
- [x] 显示项目名称
- [x] 危险操作样式（红色主题）
- [x] 确认和取消按钮
- [x] 居中对话框样式

**验证方式**：
- [x] 对话框可正常打开和关闭
- [x] 项目名称正确显示
- [x] 确认按钮正常工作
- [x] 取消按钮正常工作

### 2.2 集成到抽屉
- [x] 修改 `ProjectDrawer.tsx`
- [x] 添加 DeleteConfirmDialog 导入
- [x] 添加 confirmDialog 状态
- [x] 删除按钮点击打开确认对话框
- [x] 确认后调用 onDelete
- [x] 关闭两个对话框

**验证方式**：
- [x] 点击删除按钮打开确认对话框
- [x] 确认后项目被删除
- [x] 取消后不执行删除

---

## 任务3：创建头像选择器

### 3.1 创建 AvatarPicker 组件
- [x] 创建 `app/dashboard/project/components/AvatarPicker.tsx`
- [x] 导入 AVATARS 常量
- [x] 网格布局显示所有表情
- [x] 选中状态高亮（蓝色边框）
- [x] 悬停预览效果（放大）
- [x] 点击选择头像
- [x] 显示标题和提示

**样式参考**：
```tsx
<div className="avatar-picker">
  <h3>{t('project.avatar.title')}</h3>
  <div className="avatar-grid">
    {AVATARS.map(avatar => (
      <button
        key={avatar}
        className={`avatar-item ${selected === avatar ? 'selected' : ''}`}
        onClick={() => onChange(avatar)}
      >
        <span className="avatar-emoji">{avatar}</span>
      </button>
    ))}
  </div>
</div>
```

**验证方式**：
- [x] 表情包正确显示
- [x] 选中状态高亮显示
- [x] 点击选择头像正常工作

### 3.2 集成到表单
- [x] 修改 `ProjectDrawer.tsx`（或 ProjectForm）
- [x] 在表单中添加 AvatarPicker
- [x] 绑定头像状态
- [x] 显示当前选择的头像

**验证方式**：
- [x] 头像选择器正常显示
- [x] 选择头像后表单更新

---

## 任务4：创建带里程碑的进度条

### 4.1 创建 ProgressWithMilestones 组件
- [x] 创建 `app/dashboard/project/components/ProgressWithMilestones.tsx`
- [x] 实现 props 接口（value, milestones, editable, onMilestonesChange）
- [x] 显示基础进度条
- [x] 在进度条上标记里程碑位置
- [x] 里程碑使用三角形或圆点标记
- [x] 悬停显示里程碑标签
- [x] 编辑模式下显示里程碑列表
- [x] 支持添加/删除/编辑里程碑

**里程碑数据结构**：
```typescript
interface Milestone {
  value: number;  // 进度百分比（0-100）
  label: string; // 里程碑名称
}
```

**布局结构**：
```tsx
<div className="progress-with-milestones">
  <div className="progress-bar-container">
    <div className="progress-bar" style={{ width: `${value}%` }} />
    {milestones.map(milestone => (
      <div
        key={milestone.value}
        className="milestone-marker"
        style={{ left: `${milestone.value}%` }}
        title={milestone.label}
      />
    ))}
  </div>
  {editable && (
    <div className="milestones-list">
      <h4>{t('project.milestones.title')}</h4>
      {milestones.map((m, i) => (
        <div key={i} className="milestone-item">
          <input value={m.label} onChange={...} />
          <input type="number" value={m.value} onChange={...} />
          <button onClick={() => deleteMilestone(i)}>{t('common.buttons.delete')}</button>
        </div>
      ))}
      <button onClick={addMilestone}>{t('project.milestones.add')}</button>
    </div>
  )}
</div>
```

**验证方式**：
- [x] 进度条正确显示
- [x] 里程碑标记正确显示
- [x] 悬停显示标签
- [x] 编辑模式可添加/删除里程碑
- [x] 里程碑值在 0-100 范围内

### 4.2 集成到项目模型
- [x] 修改 `app/lib/definitions.ts`
- [x] 在 Project 类型中添加 `milestones` 字段
- [x] 定义 Milestone 类型

**类型定义**：
```typescript
export type Milestone = {
  value: number;
  label: string;
};

export type Project = {
  // ... 其他字段
  milestones?: Milestone[];
};
```

**验证方式**：
- [x] 类型定义正确
- [x] 编译无错误

---

## 任务5：优化项目卡片

### 5.1 创建独立的 ProjectCard 组件
- [x] 创建 `app/dashboard/project/components/ProjectCard.tsx`
- [x] 从 `page.tsx` 提取卡片逻辑
- [x] 实现卡片组件
- [x] 根据项目类型使用不同的半透明背景色
- [x] 显示项目头像（左上角）
- [x] 添加卡片悬停动画
- [x] 添加进入/退出动画（使用 CSS group）

**背景色映射**：
```typescript
const getTypeBgColor = (type: string) => {
  return type === 'code'
    ? 'bg-blue-100/50'  // 蓝色半透明
    : 'bg-green-100/50'; // 绿色半透明
};
```

**卡片样式**：
```tsx
<div className={`
  project-card
  group
  ${getTypeBgColor(project.type)}
`}>
  {/* 头像 */}
  <div className="project-avatar">{project.avatar || getTypeIcon(project.type)}</div>

  {/* 项目信息 */}
  <div className="project-info">
    <h3>{project.name}</h3>
    <p>{project.description}</p>
    {/* 标签、状态、优先级 */}
  </div>

  {/* 进度条 */}
  <ProgressWithMilestones value={project.progress} />
</div>
```

**验证方式**：
- [x] 卡片正确渲染
- [x] 背景色根据类型正确显示
- [x] 头像正确显示
- [x] 悬停动画正常工作

### 5.2 添加卡片切换动画
- [x] 修改 `app/dashboard/project/page.tsx`
- [x] 为项目卡片列表添加动画组
- [x] 使用 CSS transition 或 key 变化触发动画

**实现方式**：
```tsx
<div className="project-grid">
  {filteredProjects.map((project) => (
    <ProjectCard
      key={project.id}
      project={project}
      // 使用 key 变化触发动画
      className="card-enter"
    />
  ))}
</div>
```

**验证方式**：
- [x] 筛选切换时卡片有动画效果
- [x] 动画流畅不卡顿

---

## 任务6：添加国际化支持

### 6.1 添加中文翻译
- [x] 打开 `app/lib/i18n/dictionary.zh.ts`
- [x] 添加 project.drawer 翻译键
- [x] 添加 project.deleteConfirm 翻译键
- [x] 添加 project.avatar 翻译键
- [x] 添加 project.milestones 翻译键

### 6.2 添加英文翻译
- [x] 打开 `app/lib/i18n/dictionary.en.ts`
- [x] 添加所有新增翻译键的英文版本

### 6.3 应用国际化
- [x] 修改所有新组件使用 `useLanguage`
- [x] 替换所有硬编码文本为翻译函数调用

**验证方式**：
- [x] 中文界面正常显示
- [x] 英文界面正常显示
- [x] 切换语言后文本正确更新

---

## 任务7：测试和验证

### 7.1 功能测试
- [x] 测试打开查看模式抽屉
- [x] 测试切换到编辑模式
- [x] 测试保存项目
- [x] 测试删除项目（二次确认）
- [x] 测试选择头像
- [x] 测试添加/编辑里程碑
- [x] 测试筛选切换动画
- [x] 测试卡片悬停动画

### 7.2 动画测试
- [x] 测试抽屉滑入动画
- [x] 测试抽屉滑出动画
- [x] 测试卡片进入动画
- [x] 测试卡片悬停动画
- [x] 检查动画流畅度（无卡顿）

### 7.3 构建验证
- [x] 运行 `pnpm build`
- [x] 修复所有类型错误
- [x] 修复所有构建错误

**验证方式**：
- [x] `pnpm build` 成功
- [x] 所有功能测试通过
- [x] 所有动画测试通过

---

## 验收检查清单

- [x] 编辑和查看功能合并在同一个右侧抽屉中
- [x] 抽屉有滑入/滑出动画效果
- [x] 删除项目显示专门的二次确认对话框
- [x] 进度条显示里程碑标记
- [x] 可在编辑模式下编辑里程碑
- [x] 可以从表情包选择项目头像
- [x] 项目卡片使用半透明纯色背景（code: 蓝色, life: 绿色）
- [x] 筛选切换时卡片有动画效果
- [x] 卡片悬停有动画效果
- [x] 模式切换按钮正常工作
- [x] 头像选择器正常工作
- [x] 里程碑编辑正常工作
- [x] 所有动画流畅不卡顿
- [x] 中英文切换正常工作
- [x] `pnpm build` 成功

---

## 预估工时

| 任务 | 预估时间 |
|------|----------|
| 准备阶段（表情包、动画样式） | 30分钟 |
| 创建统一抽屉弹窗 | 1.5小时 |
| 创建删除确认对话框 | 30分钟 |
| 创建头像选择器 | 30分钟 |
| 创建带里程碑的进度条 | 1小时 |
| 优化项目卡片 | 1小时 |
| 列表页集成 | 1小时 |
| 添加国际化支持 | 30分钟 |
| 测试和验证 | 30分钟 |
| **总计** | **约 7.5 小时** |

---

## 技术要点

### CSS 动画最佳实践

```css
/* 使用 transform 和 opacity 进行动画，性能更好 */
.animated-element {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

/* 避免使用 layout 属性进行动画 */
.animated-element {
  /* ❌ 避免 */
  transition: width 0.3s, height 0.3s;
  /* ✅ 推荐 */
  transition: transform 0.3s, opacity 0.3s;
}
```

### 条件渲染优化

```tsx
// 使用 key 变化触发动画
<ProjectCard
  key={project.id}
  project={project}
  className="card-enter"
/>

// 或使用 CSS group 和 data 属性
<div className="project-grid">
  {filteredProjects.map((project, index) => (
    <ProjectCard
      key={project.id}
      project={project}
      style={{ '--delay': `${index * 50}ms` }}
    />
  ))}
</div>
```

### 抽屉状态管理

```typescript
const [drawerOpen, setDrawerOpen] = useState(false);
const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');
const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

const handleOpenView = (project: Project) => {
  setSelectedProject(project);
  setDrawerMode('view');
  setDrawerOpen(true);
};

const handleOpenEdit = (project?: Project) => {
  setSelectedProject(project);
  setDrawerMode('edit');
  setDrawerOpen(true);
};
```
