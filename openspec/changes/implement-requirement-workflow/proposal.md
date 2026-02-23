# Change: 实现完整需求管理工作流

## Why

当前系统的需求管理功能较为基础，仅提供简单的看板视图和基础 CRUD 操作。根据最新产品 PRD（需求管理-20260221），需要升级为完整的需求管理工作流，支持：

1. **层级结构展示**：父子需求关系在列表中以树形结构展示，参考 Element UI Table 的层级展示
2. **完整的生命周期管理**：从创建、编辑、查看到状态流转的完整工作流
3. **协作功能**：评论、附件上传、操作记录追溯
4. **关联管理**：需求与任务、缺陷的双向关联
5. **沉浸式操作体验**：右侧滑出面板替代现有弹窗，提供更连贯的操作体验

## What Changes

### 核心功能新增

#### 1. 需求列表表格化重构
- 从现有看板视图升级为表格视图，支持父子层级折叠展开
- 表格列：选择框、展开图标、需求名称、工作项ID、状态、负责人、优先级、截止时间、可获得积分、操作
- 顶部筛选栏：状态、优先级、负责人筛选 + 搜索框
- 分页支持：默认 20 条/页，支持 50/100 条切换

#### 2. 右侧滑出面板（Slide-out Panel）
- **新增模式**：从右侧滑出创建表单，宽度 600px
- **编辑/查看模式**：共用面板，支持查看/编辑模式切换
- **面板区块**：基本信息、描述（Markdown 渲染）、子需求、关联任务、评论、操作记录
- **交互**：点击遮罩层或 ESC 关闭，未保存时提示确认

#### 3. 子需求管理
- 支持创建子需求，工作项 ID 自动添加层级后缀（REQ-001-1、REQ-001-1-1）
- 树形展示：父需求左侧显示展开/折叠图标，子需求缩进显示
- 父需求状态自动聚合：根据子需求状态自动计算父需求状态

#### 4. 任务关联
- 需求详情面板中展示关联任务列表
- 支持添加现有任务或创建新任务并关联
- 双向关联：一个需求可关联多个任务，一个任务只能关联一个需求

#### 5. 评论与附件
- 评论列表按时间倒序展示
- 支持 Markdown(.md)、Word、Excel、PDF 附件上传
- 单文件最大 20MB，单条评论最多 5 个附件
- 图片支持点击预览

#### 6. 操作记录
- 记录创建、编辑、状态变更、分配变更等操作
- 展示格式：`时间 操作人 操作内容：旧值 → 新值`
- 操作记录不可删除、不可修改

### 数据模型扩展

#### 新增类型定义
- `RequirementStatus`: todo, in_progress, done, cancelled, accepted, closed
- `Priority`: p0, p1, p2, p3, p4
- `Comment`: 评论数据结构
- `OperationLog`: 操作记录数据结构
- `Attachment`: 附件数据结构

#### Requirement 字段扩展
- `workItemId`: 工作项 ID（如 REQ-001）
- `parentId`: 父需求 ID
- `subRequirements`: 子需求 ID 列表
- `relatedTasks`: 关联任务 ID 列表
- `relatedDefects`: 关联缺陷 ID 列表

### API 扩展

#### 新增接口
- `GET /api/projects/{projectId}/requirements` - 需求列表（支持筛选、分页）
- `GET /api/requirements/{requirementId}` - 需求详情（包含子需求、关联任务、评论、操作记录）
- `POST /api/projects/{projectId}/requirements` - 创建需求
- `PUT /api/requirements/{requirementId}` - 更新需求
- `DELETE /api/requirements/{requirementId}` - 删除需求
- `GET /api/requirements/{requirementId}/comments` - 评论列表
- `POST /api/requirements/{requirementId}/comments` - 添加评论
- `DELETE /api/comments/{commentId}` - 删除评论
- `GET /api/requirements/{requirementId}/logs` - 操作记录

### UI 组件新增

#### 新组件
- `RequirementTable`: 需求表格组件（支持层级展示）
- `RequirementSlidePanel`: 右侧滑出面板组件
- `RequirementForm`: 需求表单组件（新增/编辑共用）
- `RequirementDetailView`: 需求详情查看组件
- `SubRequirementList`: 子需求列表组件
- `RelatedTaskList`: 关联任务列表组件
- `CommentSection`: 评论区组件
- `AttachmentUploader`: 附件上传组件
- `OperationLogList`: 操作记录列表组件

#### 样式规范
参考 Pencil 设计 Node ID: YNcpT（顶部导航栏）
- 导航栏背景色：`#1A1D2E`（深色主题）
- 强调色：`#E8944A`（橙色）
- 文字层级：白色 (#FFFFFF) → 半透明白色 (#FFFFFF99, #FFFFFFCC)
- 字体：Inter
- 导航链接激活态：橙色高亮，非激活态：半透明

## Impact

### Affected Specs
- `specs/project-management/` - 扩展项目管理下的需求管理能力
- `specs/ui-components/` - 新增表格、面板等组件规范

### Affected Code
- **API 层**: `app/api/requirements/` 系列路由
- **数据层**: `app/lib/db.ts` 新增表结构，`app/lib/definitions.ts` 扩展类型
- **UI 层**: 
  - `app/dashboard/project/[projectId]/page.tsx` - 重构需求 Tab 内容
  - `app/ui/dashboard/requirement-table.tsx` - 新增表格组件
  - `app/ui/dashboard/requirement-slide-panel.tsx` - 新增面板组件
  - `app/ui/dashboard/comment-section.tsx` - 新增评论组件
- **国际化**: `app/lib/i18n/dictionary.*.ts` - 新增需求管理相关翻译

### Breaking Changes
- **数据库 Schema**: 需执行 migration 新增 comments、operation_logs 表，扩展 requirements 表字段
- **API 响应格式**: `GET /api/requirements` 返回格式从 `{success, requirements}` 调整为 `{success, data: {list, pagination}}`

### Dependencies
- 依赖 PRD: `packages/product-designs/需求管理-20260221/prd.md`
- 依赖 UI 设计: Pencil Node YNcpT（顶部导航栏风格）
- 需先完成 `compact-ui-sizing` 变更（UI 尺寸统一优化）

## 验收标准

### 功能验收
- [ ] 需求列表以表格形式展示，支持父子层级折叠展开
- [ ] 点击需求名称打开右侧滑出面板，默认查看模式
- [ ] 面板支持查看/编辑模式切换
- [ ] 可创建子需求，工作项 ID 正确生成层级后缀
- [ ] 可关联任务，验证双向关系
- [ ] 可发表评论和上传附件
- [ ] 操作记录记录所有变更

### 性能验收
- [ ] 列表加载时间：100条数据 < 2秒
- [ ] 面板打开动画：< 300ms
- [ ] 筛选响应时间：< 500ms

### 数据验收
- [ ] 所有字段正确保存
- [ ] 工作项 ID 唯一性保证
- [ ] 操作记录完整性
