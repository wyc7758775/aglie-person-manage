# Change: 新增子需求弹窗实现

## Why

根据产品PRD（需求管理-20260221）和Pencil设计（Node ID: uiIIm），当前系统已经支持父子需求的数据模型（parent_id字段），但缺少用户友好的子需求创建界面。用户需要：

1. **直观创建子需求**：在查看父需求时，能够快速创建关联的子需求
2. **清晰的父子关系**：创建时明确显示父需求信息，避免关联错误
3. **一致的交互体验**：与现有需求管理界面风格保持一致
4. **完整的表单支持**：支持状态、优先级、时间规划、积分、描述等字段

## What Changes

### 前端实现

#### 1. 新增子需求弹窗组件 (`SubRequirementModal`)
- **设计风格**：严格遵循Pencil设计Node ID: uiIIm
- **弹窗规格**：
  - 宽度：520px
  - 圆角：16px
  - 阴影：blur 60px, color #1A1D2E30, offset (0, 8)
  - 背景：白色 (#FFFFFF)
  - 遮罩层：#1A1D2E55

- **弹窗结构**：
  ```
  ┌──────────────────────────────────────────────┐
  │  🌿 新增子需求                           [×]  │  Header (56px, 底部边框 #1A1D2E10)
  ├──────────────────────────────────────────────┤
  │  📌 父需求：REQ-001 用户登录功能开发          │  父需求信息区 (橙色主题 #E8944A)
  ├──────────────────────────────────────────────┤
  │  子需求名称 *                                │
  │  [请输入子需求名称                      ]     │  名称输入框
  │                                              │
  │  [状态 ▼]              [优先级 ▼]            │  双列：状态 + 优先级
  │                                              │
  │  [开始时间 ▼]          [截止时间 ▼]          │  双列：开始时间 + 截止时间
  │                                              │
  │  可获得积分                                  │
  │  [0                                    ]     │  积分输入框
  │                                              │
  │  描述                                        │
  │  [简要描述子需求内容...                ]     │  描述文本域 (72px高)
  ├──────────────────────────────────────────────┤
  │                                  [取消] [创建] │  Footer (60px, 顶部边框 #1A1D2E10)
  └──────────────────────────────────────────────┘
  ```

- **样式规范**：
  - 标签：12px, font-weight 600, color #1A1D2E
  - 必填标记：*, color #F44336
  - 输入框：高度 38px, 圆角 10px, 背景 #F5F0F0
  - 占位符：color #1A1D2E55
  - 父需求信息区：背景 #E8944A08, 边框 #E8944A22, 圆角 10px
  - 取消按钮：背景 #F5F0F0, 文字 #1A1D2E
  - 创建按钮：背景 #E8944A, 文字 #FFFFFF, 图标 + 文字

#### 2. 触发方式
- 在需求详情面板的子需求列表中，点击"创建子需求"按钮
- 在需求表格中，右键菜单选择"创建子需求"
- 传入父需求ID和名称作为props

#### 3. 表单验证
- 子需求名称：必填，2-100字符
- 状态：必填，默认"todo"
- 优先级：必填，继承父需求优先级或默认"p2"
- 开始/截止时间：截止时间不能早于开始时间
- 积分：非负数，可选

### 后端实现

#### 1. 扩展现有API
- `POST /api/requirements` 已支持创建需求，需支持 `parentId` 字段
- 自动生成子需求工作项ID：基于父需求ID添加层级后缀
  - 父需求：REQ-001
  - 一级子需求：REQ-001-1, REQ-001-2
  - 二级子需求：REQ-001-1-1, REQ-001-1-2

#### 2. 数据验证
- 验证父需求存在且属于同一项目
- 验证用户有权限在项目中创建需求
- 防止循环引用（子需求不能是自己的父需求）

#### 3. 操作日志
- 记录创建子需求操作
- 记录父子关系建立

### 数据库Schema

利用现有`parent_id`字段（已存在）：
```sql
-- 已存在，无需修改
parent_id VARCHAR(100) REFERENCES requirements(id) ON DELETE CASCADE
```

### 国际化

新增翻译键值：
- `requirement.sub.createTitle`: "新增子需求"
- `requirement.sub.parentLabel`: "父需求"
- `requirement.sub.nameLabel`: "子需求名称"
- `requirement.sub.namePlaceholder`: "请输入子需求名称"
- `requirement.sub.createButton`: "创建子需求"
- `requirement.error.parentNotFound`: "父需求不存在"
- `requirement.error.circularReference`: "不能将需求设为自己的子需求"

## Impact

### Affected Specs
- `specs/project-management/` - 扩展项目管理下的需求管理能力

### Affected Code
- **UI层**:
  - 新增: `app/ui/dashboard/sub-requirement-modal.tsx`
  - 修改: `app/ui/dashboard/sub-requirement-list.tsx` - 集成创建按钮
  - 修改: `app/ui/dashboard/requirement-slide-panel.tsx` - 集成弹窗
  
- **API层**:
  - 修改: `app/api/requirements/route.ts` - 确保支持parentId
  
- **数据层**:
  - 修改: `app/lib/requirement-utils.ts` - 添加生成子需求ID逻辑
  
- **国际化**:
  - 修改: `app/lib/i18n/dictionary.zh.ts`
  - 修改: `app/lib/i18n/dictionary.en.ts`
  - 修改: `app/lib/i18n/dictionary.ja.ts`

### Breaking Changes
无破坏性变更，新增功能完全向后兼容。

### Dependencies
- 依赖现有需求管理工作流基础功能
- 依赖已实现的`parent_id`数据库字段

## 验收标准

### 功能验收
- [ ] 弹窗严格按照Pencil设计实现，样式像素级一致
- [ ] 能够成功创建子需求，工作项ID正确生成
- [ ] 父需求信息正确显示
- [ ] 表单验证正常工作，错误提示清晰
- [ ] 创建成功后刷新子需求列表
- [ ] 操作日志正确记录

### 数据验收
- [ ] 子需求正确保存到数据库，parent_id字段正确
- [ ] 工作项ID格式正确（REQ-XXX-Y）
- [ ] 所有字段正确持久化

### 性能验收
- [ ] 弹窗打开无延迟
- [ ] 表单提交响应时间 < 1秒

### UI验收
- [ ] 符合设计规范的颜色、字体、间距
- [ ] 响应式布局正确
- [ ] 动画过渡流畅
