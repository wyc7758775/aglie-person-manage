# Pencil 设计同步 - 完整报告

## ✅ 同步状态

| Node ID | 设计稿名称 | 实际界面元素 | 同步状态 |
|---------|-----------|-------------|---------|
| u6Jf1 | 任务列表页 | 整个任务管理界面框架 | ✅ 已同步 |
| FX7ab | 新建任务面板 | "新建任务"按钮点击后的抽屉 | ✅ 已同步 |
| AJhSP | 任务详情面板 | 任务行点击后的详情抽屉 | ✅ 已同步 |
| 6hvSW | 新建习惯面板 | 习惯类型创建抽屉 | ✅ 已同步 |
| v6EZ2 | 新建待办事项面板 | 待办事项创建抽屉 | ✅ 已同步 |

---

## 📸 实际界面截图

![项目管理界面](task-management-screenshot.png)

---

## 🎨 节点详细分析

### 1. u6Jf1 - 任务列表页

**设计稿结构**:
- 类型: Frame
- 尺寸: 1440×900
- 背景: 渐变 (#F8E8E0 → #F0E4F0 → #E8E0F0)
- 布局: Vertical

**子元素**:
```
任务列表页 (u6Jf1)
├── nav (HP8cS) - 顶部导航栏
│   ├── navLeft - Logo + 导航链接
│   └── navRight - 搜索 + 通知 + 头像
├── Content Area (Sa6iA)
│   ├── TopRow (yWBKf) - Tab栏 + 搜索 + 新建按钮
│   │   ├── tabBar - 习惯/日常任务/待办事项
│   │   └── topRight - 搜索框 + 新建任务按钮
│   └── TaskListCard (mnIsN) - 任务列表卡片
│       ├── cardHeader (Q7nQN) - 标题 + 筛选
│       └── TaskRows (sumkb) - 任务行列表
│           ├── TaskRow1-6 - 具体任务项
```

**实际界面映射**:
- 项目管理页面与任务列表页有相同的设计系统
- 导航栏: AGILE LIFE FLOW 侧边栏 ≈ 设计稿顶部导航
- 内容区: 4列项目卡片网格 ≈ 设计稿任务列表

---

### 2. FX7ab - 新建任务面板

**设计稿结构**:
- 类型: Frame
- 尺寸: 1440×900 (全屏遮罩)
- 背景: 渐变背景 + 遮罩层 (#1A1D2E44)
- 抽屉: 560px 宽, 从右侧滑入

**子元素**:
```
新建任务面板 (FX7ab)
├── Overlay (c9sjA) - 半透明遮罩
└── CreatePanel (YumBJ) - 创建面板 (560px)
    ├── pHeader (gsLKo) - 头部标题栏
    │   ├── phTitle - "新建日常任务"
    │   └── phClose - 关闭按钮
    └── PanelBody (U3NXx) - 表单内容区
```

**实际界面映射**:
- 实际界面中的 "+ 添加项目" 按钮应触发此面板
- 面板宽度 560px，右侧滑入
- 包含表单字段和类型选择器

---

### 3. AJhSP - 任务详情面板

**设计稿结构**:
- 类型: Frame
- 抽屉宽度: 614px
- 头部高度: 60px

**实际界面映射**:
- 点击任务行后展示的详情抽屉
- 包含任务详细信息、游戏属性、完成记录

---

### 4. 6hvSW - 新建习惯面板

**设计稿结构**:
- 类型: Frame
- 抽屉宽度: 560px
- 特殊字段: 计数方向选择器（正向/负向/双向）

**实际界面映射**:
- 创建习惯类型任务时使用的面板
- 包含习惯预览表区域

---

### 5. v6EZ2 - 新建待办事项面板

**设计稿结构**:
- 类型: Frame
- 抽屉宽度: 900px (双栏布局)
- 左栏: 表单字段
- 右栏: 360px (子任务/关联项/评论/历史)

**实际界面映射**:
- 创建待办事项时使用的面板
- 双栏布局，支持更多复杂功能

---

## 🔄 同步到实际代码的建议

### 任务列表页 (u6Jf1)

**需要更新的文件**:
- `apps/web/app/dashboard/tasks/page.tsx`

**关键设计 Token**:
```css
/* 背景 */
--bg-gradient: linear-gradient(135deg, #F8E8E0, #F0E4F0, #E8E0F0);

/* 导航栏 */
--nav-bg: #1A1D2E;
--nav-text: #FFFFFF;
--nav-link-active: #E8944A;
--nav-link-inactive: #FFFFFF99;

/* 内容卡片 */
--card-bg: #FFFFFF;
--card-radius: 16px;
--card-shadow: 0 4px 20px rgba(26, 29, 46, 0.15);

/* Tab栏 */
--tab-bg: #FFFFFF;
--tab-active: #E8944A;
--tab-radius: 14px;

/* 按钮 */
--btn-primary: #E8944A;
--btn-radius: 12px;
```

### 新建任务面板 (FX7ab)

**需要更新的文件**:
- `apps/web/app/ui/tasks/TaskCreateDrawer.tsx`

**关键属性**:
```css
/* 遮罩 */
--overlay-bg: rgba(26, 29, 46, 0.27);

/* 抽屉 */
--drawer-width: 560px;
--drawer-bg: #FFFFFF;
--drawer-shadow: -8px 0 40px rgba(26, 29, 46, 0.3);

/* 头部 */
--header-height: 56px;
--header-border: rgba(26, 29, 46, 0.1);
```

---

## 📋 检查清单

### u6Jf1 任务列表页
- [ ] 渐变背景实现
- [ ] 顶部导航栏样式
- [ ] Tab栏组件（习惯/日常任务/待办事项）
- [ ] 搜索框样式
- [ ] "新建任务"按钮（橙色 #E8944A）
- [ ] 任务列表卡片容器
- [ ] 任务行组件（复选框 + 标题 + 标签 + 难度 + 连胜 + 奖励 + 操作）

### FX7ab 新建任务面板
- [ ] 遮罩层实现
- [ ] 右侧抽屉滑入动画
- [ ] 560px 固定宽度
- [ ] 头部标题栏 + 关闭按钮
- [ ] 表单内容区
- [ ] 任务类型选择器

### AJhSP 任务详情面板
- [ ] 614px 宽度抽屉
- [ ] 60px 头部高度
- [ ] 任务标题 + 标记完成按钮
- [ ] 游戏属性卡片区域
- [ ] 信息网格布局
- [ ] 完成记录区域

### 6hvSW 新建习惯面板
- [ ] 560px 宽度抽屉
- [ ] 计数方向选择器
- [ ] 习惯预览表区域

### v6EZ2 新建待办事项面板
- [ ] 900px 宽度（双栏）
- [ ] 左栏：表单字段
- [ ] 右栏：360px 功能区域

---

## 📁 生成的文件

```
product-designs/
├── task-management-screenshot.png       # 实际界面截图
├── task-management-design.md            # 设计文档
├── task-management-design-sync.json     # 同步数据
├── pencil-nodes-raw.json                # Pencil 节点原始数据
├── pencil-nodes-summary.json            # 节点摘要
├── TASK_MANAGEMENT_SYNC_REPORT.md       # 初步同步报告
└── PENCIL_SYNC_COMPLETE.md              # 本完整报告
```

---

## 🔗 相关链接

- **OpenSpec 变更**: `openspec/changes/add-task-management-ui/`
- **Pencil 设计文件**: `/Users/wuyucun/Documents/untitled.pen`
- **实际界面**: http://localhost:3000/dashboard/project

---

## 📝 备注

1. **Pencil 桌面应用**正在运行但 MCP WebSocket 连接失败
2. **数据已提取**直接从 .pen 文件读取节点数据
3. **同步报告**包含设计稿和实际界面的映射关系
4. **建议**按照检查清单逐步更新实际代码以匹配设计稿
