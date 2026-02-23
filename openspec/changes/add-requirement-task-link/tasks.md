## 1. 后端 API 开发

### 1.1 更新数据库类型定义
- [ ] 1.1.1 在 `apps/web/app/lib/definitions.ts` 中添加 `RelatedTaskInfo` 类型
- [ ] 1.1.2 更新 `Requirement` 类型，添加 `relatedTasks?: string[]` 字段

### 1.2 实现任务查询 API
- [ ] 1.2.1 在 `apps/web/app/api/tasks/route.ts` 创建任务列表 API
  - 支持 `projectId` 过滤
  - 支持 `search` 关键词搜索（标题和ID）
  - 返回任务基本信息（id, title, status, priority）
- [ ] 1.2.2 在 `apps/web/app/lib/db.ts` 添加 `getTasksForLinking` 函数

### 1.3 实现需求关联任务更新 API
- [ ] 1.3.1 在 `apps/web/app/api/requirements/[id]/tasks/route.ts` 创建 API
  - PUT 方法更新关联任务列表
  - 验证任务ID是否存在
  - 更新 `related_tasks` 字段
- [ ] 1.3.2 在 `apps/web/app/lib/db.ts` 添加 `updateRequirementTasks` 函数

### 1.4 更新需求查询函数
- [ ] 1.4.1 修改 `getRequirementById` 函数，返回 `related_tasks` 字段
- [ ] 1.4.2 修改 `rowToRequirement` 函数，解析 `related_tasks` JSONB

## 2. 前端组件开发

### 2.1 创建 LinkTaskModal 组件
- [ ] 2.1.1 创建 `apps/web/app/ui/dashboard/link-task-modal.tsx`
  - 实现模态框基础结构（头部、主体、底部）
  - 实现搜索框 UI
  - 实现已关联任务列表项
  - 实现可关联任务列表项
  - 实现底部统计和操作按钮

### 2.2 实现组件状态管理
- [ ] 2.2.1 实现搜索功能（本地过滤）
- [ ] 2.2.2 实现任务选择/取消选择逻辑
- [ ] 2.2.3 实现已关联和可关联任务的分组显示
- [ ] 2.2.4 实现选择统计计算

### 2.3 实现数据获取
- [ ] 2.3.1 实现任务列表 API 调用
- [ ] 2.3.2 实现关联任务更新 API 调用
- [ ] 2.3.3 处理加载和错误状态

## 3. 集成到需求详情面板

### 3.1 更新需求详情面板
- [ ] 3.1.1 在 `requirement-slide-panel.tsx` 导入 LinkTaskModal
- [ ] 3.1.2 实现"新建"按钮打开模态框
- [ ] 3.1.3 实现模态框关闭和确认回调
- [ ] 3.1.4 显示已关联任务数量（从 requirement.relatedTasks 读取）
- [ ] 3.1.5 可选：显示已关联任务简要列表

## 4. 测试验证

### 4.1 功能测试
- [ ] 4.1.1 测试打开模态框正确加载任务列表
- [ ] 4.1.2 测试搜索功能过滤任务
- [ ] 4.1.3 测试选择/取消选择任务
- [ ] 4.1.4 测试确认关联后数据库更新
- [ ] 4.1.5 测试取消操作不保存变更
- [ ] 4.1.6 测试需求详情面板显示正确的关联数量

### 4.2 UI 测试
- [ ] 4.2.1 验证模态框样式符合 Pencil 设计 RI4aJ
- [ ] 4.2.2 验证响应式布局正常
- [ ] 4.2.3 验证加载状态和空状态显示正确

## 5. 构建验证
- [ ] 5.1 运行 `pnpm build` 确保无编译错误
- [ ] 5.2 运行测试确保无回归问题
