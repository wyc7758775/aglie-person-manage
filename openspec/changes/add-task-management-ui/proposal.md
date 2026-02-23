# Change: 添加任务管理界面

## Why
目前系统已有项目管理和需求管理功能，任务管理（爱好、习惯、任务、欲望）是用户日常使用最频繁的核心功能。任务应该与项目关联，在项目详情页的任务 Tab 中进行管理。需要将现有的简单任务列表增强为完整的任务管理界面，支持四种任务类型的创建、详情、编辑等功能。

## What Changes
- 在项目详情页的任务 Tab 中实现完整的任务管理功能
- 实现四种任务类型（爱好、习惯、任务、欲望）的列表展示
- 实现任务创建抽屉面板（支持四种类型切换）
- 实现任务详情抽屉面板（含游戏属性展示）
- 实现任务编辑抽屉面板
- 实现列表筛选（按状态、类型）和搜索功能
- 任务数据与项目关联（通过 projectId）

## Impact
- **Affected specs**: task-management（新增）、project-management（更新）、ui-components（更新）
- **Affected code**: 
  - `apps/web/app/dashboard/project/[projectId]/components/TaskTabContent.tsx` - 任务 Tab 内容组件
  - `apps/web/app/ui/tasks/` - 任务相关组件（抽屉、表单等）
  - `apps/web/app/api/tasks/` - 任务 API（更新为支持 projectId 筛选）
  - `apps/web/app/lib/db.ts` - 数据库操作
  - `apps/web/app/lib/definitions.ts` - 类型定义

## UI Design Reference (Pencil)

以下组件需严格参考 pencil 设计稿实现，**实施阶段必须通过 pencil MCP 调用 `pencil_get_screenshot` 验证**：

### 任务列表页
- **Node ID: OcsmI** (`任务列表页_日常任务`) - 日常任务列表页布局
  - 内容区域：白色卡片 (bg-white), 圆角 16px (rounded-2xl), 阴影效果
  - Tab 栏：圆角 14px, 填充背景 rgba(26, 29, 46, 0.04)
  - 工具栏：筛选器 + 新建任务按钮 (bg-[#E8944A])
  - 表格头部：深色背景 (bg-[#1A1D2E]), 高度 48px
  - 表格内容区域：padding [12, 16, 16, 16]

- **Node ID: sBfMx** (`任务列表页_习惯`) - 习惯列表页布局
  - 与日常任务相同布局，仅数据展示差异

- **Node ID: 2RaWt** (`任务列表页_待办事项`) - 待办事项列表页布局
  - 与日常任务相同布局，仅数据展示差异

### 任务创建面板
- **Node ID: FX7ab** (`新建任务面板`) - 日常任务/爱好创建抽屉
  - 抽屉宽度：560px
  - 遮罩层：半透明深色 rgba(26, 29, 46, 0.27)
  - 面板阴影：blur 40px, 颜色 #1A1D2E30, 偏移 -8px 0
  - 头部：高度 56px, 底部边框 rgba(26, 29, 46, 0.06)
  - 内容区域：padding 24px, 垂直布局, gap 18px
  - 任务类型选择器：横向排列, gap 8px
  - 表单分组标题：font-weight 700, font-size 13px
  - 底部按钮栏：高度 68px, 顶部边框, 右对齐
  - 创建按钮：bg-[#E8944A], 圆角 10px, padding [10, 24]
  - 取消按钮：bg-[#F5F0F0], 圆角 10px

- **Node ID: 6hvSW** (`新建习惯面板`) - 习惯创建抽屉
  - 同 560px 宽度，额外包含：
  - 计数方向选择器（正向/负向/双向）
  - 习惯预览表区域 (HabitPreviewSection)

- **Node ID: v6EZ2** (`新建待办事项面板`) - 任务/待办创建抽屉
  - 抽屉宽度：900px（双栏布局）
  - 左栏：表单字段，右侧边框分隔
  - 右栏：360px 宽度，包含 Tab 切换（子任务/关联项/评论/历史）

### 任务详情面板
- **Node ID: AJhSP** (`任务详情面板`) - 基础详情抽屉
  - 抽屉宽度：614px
  - 头部：高度 60px, 底部边框 rgba(26, 29, 46, 0.08)
  - 内容区域：可滚动, padding 24px, gap 24px
  - 标题行：任务名称 + 标记完成按钮 (bg-[#4CAF5015], 文字 #4CAF50)

- **Node ID: Mq8Pk** (`DetailPanel_完整展示`) - 完整详情展示参考
  - **游戏属性卡片**：深色背景 (bg-[#1A1D2E]), 圆角 16px, padding 20px
    - 内部分块：圆角 12px, 半透明背景 rgba(255,255,255,0.06), padding 14px
    - 包含：连胜天数、经验值、金币、HP 四个属性块
  - **信息网格**：浅色背景 (bg-[#F5F0F0]), 圆角 16px, padding 20px
    - 两列布局展示：难度、频率、开始日期、重复日、标签
  - **备注说明区域**：带图标标题 + 描述卡片 (bg-[#F5F0F0], 圆角 12px, padding 16px)
  - **完成记录区域**：周完成网格 (weekGrid), bg-[#F5F0F0], 圆角 12px
  - **操作日志区域**：列表形式，每条日志带时间、类型、描述
  - 分隔线：高度 1px, 颜色 rgba(26, 29, 46, 0.06)

### 任务编辑面板
- **Node ID: TvQyQ** (`习惯任务_详情编辑`) - 日常任务/习惯编辑抽屉
  - 与创建面板同尺寸 560px
  - 头部标题改为"编辑日常任务"/"编辑习惯"
  - 新增"查看详情"按钮返回详情面板
  - 表单预填充现有数据
  - 保存按钮：bg-[#E8944A], 文字"保存修改"

- **Node ID: E4IoS** (`待办任务_详情编辑`) - 任务/待办编辑抽屉
  - 宽度 560px（编辑时简化为单栏）
  - 包含：标题、描述、状态优先级、标签等字段
  - 底部保存/取消按钮栏

## Implementation Notes

### Pencil MCP 验证步骤
每个 UI 组件实现后，**必须**调用以下命令验证：
```bash
# 获取设计截图
pencil_get_screenshot --filePath /Users/wuyucun/Documents/untitled.pen --nodeId <NODE_ID>

# 对比实现效果
# 验证要点：
# - 尺寸是否匹配（宽度 560px/614px/900px）
# - 颜色值是否一致（#E8944A, #1A1D2E, #F5F0F0 等）
# - 间距和 padding 是否正确
# - 阴影和圆角效果是否还原
```

### 需要验证的节点清单
1. [ ] OcsmI - 任务列表页布局
2. [ ] FX7ab - 新建日常任务抽屉
3. [ ] 6hvSW - 新建习惯抽屉
4. [ ] v6EZ2 - 新建待办事项抽屉（900px 双栏）
5. [ ] AJhSP - 任务详情抽屉基础结构
6. [ ] Mq8Pk - 游戏属性卡片和信息网格
7. [ ] TvQyQ - 编辑抽屉布局和交互
8. [ ] E4IoS - 待办编辑抽屉

## Reference
- UI 设计文件：`/Users/wuyucun/Documents/untitled.pen`
- 现有项目详情页路径: `/dashboard/project/[projectId]`
- 任务 Tab 已通过 `?tab=task` 参数访问
