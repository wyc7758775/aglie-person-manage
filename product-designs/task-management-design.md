# 任务管理界面 - 设计同步文档

> 同步时间: 2026-03-03  
> 来源: http://localhost:3000/dashboard/project  
> 关联 Pencil Node IDs: u6Jf1, FX7ab, AJhSP, 6hvSW, v6EZ2

---

## 📸 界面截图

![任务管理界面](task-management-screenshot.png)

---

## 📐 布局结构

### 1. 顶部标题栏 (Node: u6Jf1)
- **标题**: 项目管理
- **徽章**: 4（项目数量）
- **位置**: 页面顶部左侧

### 2. 操作与筛选区 (Node: FX7ab)
- **添加按钮**: + 添加项目（蓝色主按钮）
- **状态筛选**: 全部 | 正常 | 有风险 | 失控
- **类型筛选**: 全部 | 冲刺项目 | 慢燃项目

### 3. 项目卡片网格

#### 卡片 1 (Node: AJhSP)
| 属性 | 值 |
|------|-----|
| 标题 | 44444 |
| 积分 | 10分 |
| 描述 | 阿东发送到 |
| 状态 | 正常 🟢 |
| 优先级 | ⚡ 中 |
| 进度 | 未开始 |
| 截止日期 | 2026-03-04 |
| 剩余时间 | 剩1天 |

#### 卡片 2 (Node: 6hvSW)
| 属性 | 值 |
|------|-----|
| 标题 | 冲刺项目 |
| 积分 | 10分 |
| 描述 | 测试未保存功能 |
| 状态 | 正常 🟢 |
| 优先级 | ⚡ 中 |
| 进度 | 未开始 |
| 截止日期 | 2026-03-04 |
| 剩余时间 | 剩1天 |
| 类型 | 冲刺项目 |

#### 卡片 3 (Node: v6EZ2)
| 属性 | 值 |
|------|-----|
| 标题 | 测试 233bbbbbbccc |
| 积分 | 10分 |
| 描述 | 阿东发送到 |
| 状态 | 正常 🟢 |
| 优先级 | ⚡ 中 |
| 进度 | 未开始 |
| 截止日期 | 2026-03-04 |
| 剩余时间 | 剩1天 |

#### 卡片 4
| 属性 | 值 |
|------|-----|
| 标题 | 测试 |
| 积分 | 10分 |
| 描述 | 艾森的 艾森的 艾森的...（长文本截断） |
| 状态 | 失控 🔴 |
| 优先级 | ⚡ 中 |
| 进度 | 未开始 |
| 类型 | 🌱 慢燃项目 - 持续进行中 |

---

## 🎨 设计 Token

### 颜色
```css
/* 主色调 */
--color-primary: #4F46E5;           /* Indigo-600 */
--color-primary-gradient: linear-gradient(135deg, #6366F1, #3B82F6);

/* 状态色 */
--color-status-normal: #10B981;     /* Emerald-500 */
--color-status-warning: #F59E0B;    /* Amber-500 */
--color-status-danger: #EF4444;     /* Rose-500 */

/* 背景 */
--color-bg-page: #F9FAFB;           /* Gray-50 */
--color-bg-card: #FFFFFF;
```

### 字体
```css
--font-heading: 24px / 600;
--font-body: 14px / 400;
--font-caption: 12px / 400;
--font-badge: 12px / 500;
```

### 间距
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
```

### 圆角
```css
--radius-card: 16px;      /* rounded-2xl */
--radius-button: 8px;     /* rounded-lg */
--radius-badge: 9999px;   /* rounded-full */
```

### 阴影
```css
--shadow-card: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

---

## 🧩 组件规范

### ProjectCard 项目卡片

**容器属性**:
- 宽度: 自适应（网格列）
- 背景: #FFFFFF
- 圆角: 16px
- 内边距: 24px
- 阴影: shadow-lg

**子元素**:
1. **Header**: 图标 + 标题 + 积分徽章
2. **Description**: 描述文本（单行截断）
3. **Tags**: 状态标签 + 优先级标签
4. **Progress**: 进度条 + 进度文本
5. **Footer**: 截止日期 + 剩余天数

### FilterButton 筛选按钮

**状态**:
- **Active**: 蓝色背景 (#4F46E5)，白色文字
- **Inactive**: 透明背景，灰色文字 (#6B7280)

---

## 📋 DOM 节点映射

| 元素 | Chrome DevTools UID | Pencil Node ID |
|------|---------------------|----------------|
| 页面标题 | 3_58 | u6Jf1 |
| 添加按钮 | 3_63 | FX7ab |
| 筛选按钮组 | 3_70-3_76 | FX7ab-children |
| 项目卡片1 | 3_96 | AJhSP |
| 项目卡片2 | 3_147 | 6hvSW |
| 项目卡片3 | 3_199 | v6EZ2 |
| 项目卡片4 | 3_251 | - |

---

## 🔄 同步说明

此文档由 Chrome DevTools MCP 自动抓取界面生成，用于与 Pencil MCP 设计文件同步。

如需在 Pencil 中更新设计:
1. 打开对应的 .pen 文件
2. 参考本文档中的设计 Token 和组件规范
3. 更新 Node IDs (u6Jf1, FX7ab, AJhSP, 6hvSW, v6EZ2) 对应的元素
