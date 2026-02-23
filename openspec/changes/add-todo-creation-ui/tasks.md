## 1. 数据模型与数据库
- [x] 1.1 在 `definitions.ts` 中定义 Todo、Subtask、TodoLink、TodoComment、TodoActivity 类型
- [x] 1.2 在 `db.ts` 中创建数据库表结构
- [x] 1.3 实现数据库 CRUD 操作函数

## 2. API 端点实现
- [x] 2.1 创建 `app/api/todos/route.ts` - GET/POST 待办事项列表
- [x] 2.2 创建 `app/api/todos/[id]/route.ts` - GET/PUT/DELETE 单个待办事项
- [x] 2.3 创建 `app/api/todos/[id]/subtasks/route.ts` - 子任务管理
- [x] 2.4 创建 `app/api/todos/[id]/links/route.ts` - 关联任务管理
- [x] 2.5 创建 `app/api/todos/[id]/comments/route.ts` - 评论管理
- [x] 2.6 创建 `app/api/todos/[id]/activities/route.ts` - 操作记录

## 3. UI 组件实现 - 基础组件
- [x] 3.1 创建 `StatusSelector` 组件（状态选择器）
- [x] 3.2 创建 `PrioritySelector` 组件（优先级选择器）
- [x] 3.3 创建 `UserSelector` 组件（负责人选择器）
- [x] 3.4 创建 `PointsSelector` 组件（积分选择器）
- [x] 3.5 创建 `DatePicker` 组件（日期选择器）

## 4. UI 组件实现 - 抽屉主体
- [x] 4.1 创建 `TodoCreateDrawer` 组件主框架（900px 宽度）
- [x] 4.2 实现左侧面板：标题、描述、InfoGrid 两列布局
- [x] 4.3 实现左侧面板底部：取消/创建按钮
- [x] 4.4 实现右侧面板：TabBar（子任务/关联任务/评论/操作记录）

## 5. UI 组件实现 - Tab 内容
- [x] 5.1 实现 `SubtaskTab` 组件：子任务列表、添加/删除/完成状态切换
- [x] 5.2 实现 `RelatedTaskTab` 组件：关联任务列表、添加/删除关联
- [x] 5.3 实现 `CommentTab` 组件：评论列表、添加评论、@成员
- [x] 5.4 实现 `ActivityTab` 组件：操作记录时间线

## 6. 页面集成
- [x] 6.1 在项目详情页添加"新建待办"按钮触发抽屉
- [x] 6.2 实现抽屉打开/关闭逻辑
- [x] 6.3 实现表单提交与 API 对接
- [x] 6.4 实现表单验证（必填字段）

## 7. 积分机制
- [x] 7.1 在 Todo 状态更新为 `done` 时触发积分发放
- [x] 7.2 记录积分变更到操作日志

## 8. 测试验证
- [x] 8.1 使用 `test-api.js` 测试 API 端点
- [x] 8.2 运行 `pnpm build` 验证构建
- [x] 8.3 手动验证 UI 与 Pencil MCP 设计一致性

## Dependencies
- 任务 1.x 需在任务 2.x 之前完成
- 任务 3.x 和 4.x 可并行开发
- 任务 5.x 依赖 4.4 完成
- 任务 6.x 依赖 4.x 和 5.x 完成
- 任务 7.x 依赖 2.2 完成
