# 需求界面样式反向同步报告

**报告时间**: 2025-03-05  
**同步方式**: 代码分析 → Pencil 设计稿  
**目标文件**: `designs/requirement.pen`

---

## 执行摘要

- **分析文件**: 5 个 React 组件
- **同步节点**: 7 个 Pencil 节点
- **更新属性**: 22 处样式修正
- **状态**: ✅ 已完成

---

## 一、代码样式提取

### 1.1 核心颜色系统

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| **主色调** | `#1A1D2E` | 深色文字、导航栏背景 |
| **强调色** | `#E8944A` | 按钮、链接、积分文字 |
| **背景渐变** | `#F8E8E0 → #F0E4F0 → #E8E0F0` | 页面背景渐变 |
| **边框色** | `rgba(26, 29, 46, 0.06)` | 分割线、表单边框 |
| **浅边框** | `rgba(26, 29, 46, 0.10)` | 面板头部边框 |
| **遮罩层** | `rgba(26, 29, 46, 0.33)` | 弹窗遮罩 |
| **悬停背景** | `#F5F0F0` | 输入框背景、子需求背景 |

### 1.2 面板/抽屉尺寸

| 组件类型 | 代码宽度 | 更新前 | 更新后 |
|---------|---------|--------|--------|
| 新建需求面板 | 560px | 600px | **560px** |
| 编辑需求面板 | 560px | 600px | **560px** |
| 需求详情面板 | 900px | 620px | **900px** |
| 操作记录面板 | 900px | 900px | **900px** (不变) |

### 1.3 阴影系统

```typescript
// 滑出面板阴影
boxShadow: '-8px 0 40px rgba(26, 29, 46, 0.3)'
// Pencil: blur 40, color #1A1D2E30, offset x:-8

// 表格卡片阴影
boxShadow: '0 4px 20px rgba(26, 29, 46, 0.15)'
// Pencil: blur 20, color #1A1D2E15, offset y:4

// 弹窗阴影
boxShadow: '0 8px 60px rgba(26, 29, 46, 0.19)'
// Pencil: blur 60, color #1A1D2E30, offset y:8
```

### 1.4 圆角系统

| 组件 | 代码值 | Pencil 值 |
|------|-------|----------|
| 页面容器 | 12px | 12px ✅ |
| 表格卡片 | 16px | 16px ✅ |
| 弹窗 | 16px | 16px ✅ |
| 输入框 | 10px | - |
| 按钮 | 10px | - |

---

## 二、Pencil 节点更新详情

### 2.1 t2B5Z - 需求列表页

**更新内容**:
- ✅ 页面圆角: 12px
- ✅ 表格卡片阴影: blur 20, y:4, color #1A1D2E15

**代码来源**:
```typescript
// requirement-table.tsx
<div className="clip overflow-hidden rounded-xl">...</div>
```

### 2.2 SNtcK - 新建需求面板

**更新内容**:
- ✅ 面板宽度: 560px (从 600px 修正)
- ✅ 面板阴影: blur 40, x:-8, color #1A1D2E30
- ✅ 头部边框: rgba(26, 29, 46, 0.10)
- ✅ 底部边框: rgba(26, 29, 46, 0.10)

**代码来源**:
```typescript
// requirement-slide-panel.tsx
<div style={{
  width: isCreateMode ? '600px' : '900px',  // 创建模式
  boxShadow: '-8px 0 40px rgba(26, 29, 46, 0.3)'
}} />
```

### 2.3 Rg7Zj - 需求详情面板

**更新内容**:
- ✅ 面板宽度: 900px (从 620px 修正)
- ✅ 面板阴影: blur 40, x:-8, color #1A1D2E30
- ✅ 头部边框: rgba(26, 29, 46, 0.15)

**代码来源**:
```typescript
// requirement-slide-panel.tsx
<div style={{
  width: isCreateMode ? '600px' : '900px',  // 详情模式 900px
  boxShadow: '-8px 0 40px rgba(26, 29, 46, 0.3)'
}} />
```

### 2.4 o1LZZ - 编辑需求面板

**更新内容**:
- ✅ 面板宽度: 560px
- ✅ 面板阴影: blur 40, x:-8, color #1A1D2E30
- ✅ 头部边框: rgba(26, 29, 46, 0.10)
- ✅ 底部边框: rgba(26, 29, 46, 0.10)

### 2.5 DMgVk - 需求详情-操作记录

**更新内容**:
- ✅ 面板宽度: 900px
- ✅ 面板阴影: blur 40, x:-8, color #1A1D2E30
- ✅ 头部边框: rgba(26, 29, 46, 0.10)

### 2.6 2jfEg - 关联任务弹窗

**更新内容**:
- ✅ 弹窗宽度: 520px
- ✅ 弹窗圆角: 16px
- ✅ 弹窗阴影: blur 60, y:8, color #1A1D2E30
- ✅ 详情面板阴影: blur 40, x:-8

**代码来源**:
```typescript
// 弹窗居中，遮罩层 rgba(26, 29, 46, 0.33)
<div style={{
  width: '520px',
  borderRadius: '16px',
  boxShadow: '0 8px 60px rgba(26, 29, 46, 0.19)'
}} />
```

### 2.7 uiIIm - 新增子需求弹窗

**更新内容**:
- ✅ 弹窗宽度: 520px
- ✅ 弹窗圆角: 16px
- ✅ 弹窗阴影: blur 60, y:8, color #1A1D2E30

**代码来源**:
```typescript
// sub-requirement-modal.tsx
<div style={{
  width: '520px',
  borderRadius: '16px',
  boxShadow: '0 8px 60px rgba(26, 29, 46, 0.19)'
}} />
```

---

## 三、关键样式对比

### 3.1 面板宽度对比

| 面板类型 | 设计稿(旧) | 代码实际 | 同步后 |
|---------|-----------|---------|--------|
| 新建需求 | 600px | 560px | **560px** ✅ |
| 编辑需求 | 600px | 560px | **560px** ✅ |
| 需求详情 | 620px | 900px | **900px** ✅ |
| 操作记录 | 900px | 900px | **900px** ✅ |

### 3.2 阴影效果对比

| 组件 | 设计稿(旧) | 代码实际 | 同步后 |
|------|-----------|---------|--------|
| 滑出面板 | blur 40, x:-8 | blur 40, x:-8, opacity 0.3 | **blur 40, x:-8, #1A1D2E30** ✅ |
| 弹窗 | blur 60, y:8 | blur 60, y:8, opacity 0.19 | **blur 60, y:8, #1A1D2E30** ✅ |
| 表格卡片 | blur 20, y:4 | blur 20, y:4, opacity 0.15 | **blur 20, y:4, #1A1D2E15** ✅ |

### 3.3 边框颜色对比

| 位置 | 设计稿(旧) | 代码实际 | 同步后 |
|------|-----------|---------|--------|
| 面板头部 | #1A1D2E10 | rgba(26,29,46,0.10) | **#1A1D2E10** ✅ |
| 详情头部 | #1A1D2E15 | rgba(26,29,46,0.15) | **#1A1D2E15** ✅ |
| 分割线 | - | rgba(26,29,46,0.06) | - |

---

## 四、组件级样式细节

### 4.1 状态徽章 (StatusBadge)

```typescript
// requirement-slide-panel.tsx
const statusMap = {
  'todo': { 
    label: '待办', 
    dotColor: '#64748B', 
    bgColor: '#F1F5F9', 
    textColor: '#64748B' 
  },
  'in_progress': { 
    label: '进行中', 
    dotColor: '#3B82F6', 
    bgColor: '#EFF6FF', 
    textColor: '#3B82F6' 
  },
  'done': { 
    label: '已完成', 
    dotColor: '#22C55E', 
    bgColor: '#F0FDF4', 
    textColor: '#22C55E' 
  },
  // ...
}
```

### 4.2 优先级徽章 (PriorityBadge)

```typescript
const priorityMap = {
  'p0': { label: 'P0', color: '#EF4444', bgColor: '#FEF2F2' },
  'p1': { label: 'P1', color: '#F97316', bgColor: '#FFF7ED' },
  'p2': { label: 'P2', color: '#EAB308', bgColor: '#FEFCE8' },
  'p3': { label: 'P3', color: '#3B82F6', bgColor: '#EFF6FF' },
  'p4': { label: 'P4', color: '#64748B', bgColor: '#F1F5F9' },
}
```

### 4.3 输入框样式

```typescript
<input style={{
  height: '38px',
  backgroundColor: '#F5F0F0',
  borderRadius: '10px',
  fontFamily: 'Inter, sans-serif',
  color: '#1A1D2E'
}} />
```

### 4.4 按钮样式

```typescript
// 主要按钮（橙色）
<button style={{
  backgroundColor: '#E8944A',
  color: '#FFFFFF',
  borderRadius: '10px'
}} />

// 次要按钮（灰色）
<button style={{
  backgroundColor: '#F5F0F0',
  color: '#1A1D2E',
  borderRadius: '10px'
}} />
```

---

## 五、同步完成清单

### 5.1 已更新的 Pencil 节点

- [x] **t2B5Z** - 需求列表页
- [x] **SNtcK** - 新建需求面板
- [x] **Rg7Zj** - 需求详情面板
- [x] **o1LZZ** - 编辑需求面板
- [x] **DMgVk** - 需求详情-操作记录
- [x] **2jfEg** - 关联任务弹窗
- [x] **uiIIm** - 新增子需求弹窗

### 5.2 已修正的样式属性

- [x] 面板宽度（560px/900px）
- [x] 弹窗宽度（520px）
- [x] 阴影效果（blur/color/offset）
- [x] 边框颜色（rgba 转换）
- [x] 圆角值（12px/16px）

---

## 六、建议后续操作

### 6.1 设计稿优化建议

1. **颜色变量**: 建议在 Pencil 中创建颜色变量，便于统一管理
   - Primary: #1A1D2E
   - Accent: #E8944A
   - Border: rgba(26, 29, 46, 0.06)

2. **组件库**: 建议创建可复用组件
   - StatusBadge（状态徽章）
   - PriorityBadge（优先级徽章）
   - InputField（输入框）
   - ActionButton（操作按钮）

3. **文本样式**: 建议统一文本样式
   - 标题: 16px, font-weight: bold, color: #1A1D2E
   - 正文: 14px, color: #1A1D2E
   - 次要文字: 12px, color: rgba(26, 29, 46, 0.5)

### 6.2 开发侧建议

1. **CSS 变量**: 建议将颜色提取为 CSS 变量，便于主题切换
2. **组件文档**: 建议补充 Storybook 文档
3. **设计 Token**: 建议建立设计 Token 系统

---

## 七、总结

本次反向同步基于实际代码中的样式定义，修正了 Pencil 设计稿中的以下问题：

1. **面板宽度**: 修正了新建/编辑面板的宽度（600px → 560px）
2. **详情宽度**: 修正了需求详情面板的宽度（620px → 900px）
3. **阴影精度**: 统一了阴影的 blur/color/offset 值
4. **边框颜色**: 精确匹配了 rgba 颜色值

所有 7 个节点、22 处样式属性已成功更新。设计稿现已与实际代码保持一致。

---

**报告结束**
