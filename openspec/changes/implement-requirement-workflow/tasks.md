## 1. 数据库 Schema 设计与 Migration
- [ ] 1.1 扩展 requirements 表字段：work_item_id, parent_id, sub_requirements, related_tasks, related_defects
- [ ] 1.2 创建 comments 表（评论）
- [ ] 1.3 创建 operation_logs 表（操作记录）
- [ ] 1.4 创建 attachments 表（附件）
- [ ] 1.5 编写数据库 migration 脚本
- [ ] 1.6 验证 migration 在本地 PostgreSQL 执行成功

## 2. 类型定义与数据结构
- [ ] 2.1 在 `app/lib/definitions.ts` 扩展 Requirement 类型
- [ ] 2.2 定义 RequirementStatus 和 Priority 枚举
- [ ] 2.3 定义 Comment、OperationLog、Attachment 类型
- [ ] 2.4 定义 API 请求/响应类型
- [ ] 2.5 运行 TypeScript 编译检查无类型错误

## 3. 数据访问层（DAL）实现
- [ ] 3.1 实现 `getRequirements()` - 支持筛选、排序、分页
- [ ] 3.2 实现 `getRequirementById()` - 包含子需求、关联任务、评论、操作记录
- [ ] 3.3 实现 `createRequirement()` - 自动生成 workItemId，支持子需求
- [ ] 3.4 实现 `updateRequirement()` - 记录操作日志
- [ ] 3.5 实现 `deleteRequirement()` - 级联删除子需求
- [ ] 3.6 实现 `getCommentsByRequirementId()`
- [ ] 3.7 实现 `createComment()`
- [ ] 3.8 实现 `deleteComment()`
- [ ] 3.9 实现 `getOperationLogsByRequirementId()`
- [ ] 3.10 运行单元测试验证 DAL 函数

## 4. API 路由实现
- [ ] 4.1 `GET /api/projects/[projectId]/requirements` - 列表接口
- [ ] 4.2 `GET /api/requirements/[id]` - 详情接口
- [ ] 4.3 `POST /api/projects/[projectId]/requirements` - 创建接口
- [ ] 4.4 `PUT /api/requirements/[id]` - 更新接口
- [ ] 4.5 `DELETE /api/requirements/[id]` - 删除接口
- [ ] 4.6 `GET /api/requirements/[id]/comments` - 评论列表
- [ ] 4.7 `POST /api/requirements/[id]/comments` - 添加评论
- [ ] 4.8 `DELETE /api/comments/[id]` - 删除评论
- [ ] 4.9 `GET /api/requirements/[id]/logs` - 操作记录
- [ ] 4.10 使用 `node test-api.js` 手动测试所有 API

## 5. UI 组件开发
- [ ] 5.1 创建 `RequirementTable` 组件 - 表格展示、层级折叠、列排序
- [ ] 5.2 创建 `RequirementSlidePanel` 组件 - 右侧滑出、遮罩层、ESC 关闭
- [ ] 5.3 创建 `RequirementForm` 组件 - 新增/编辑共用表单
- [ ] 5.4 创建 `RequirementDetailView` 组件 - 查看模式字段展示
- [ ] 5.5 创建 `SubRequirementList` 组件 - 子需求列表、添加子需求
- [ ] 5.6 创建 `RelatedTaskList` 组件 - 关联任务列表、添加关联
- [ ] 5.7 创建 `CommentSection` 组件 - 评论列表、输入框、附件上传
- [ ] 5.8 创建 `AttachmentUploader` 组件 - 文件选择、进度条、预览
- [ ] 5.9 创建 `OperationLogList` 组件 - 操作记录时间线
- [ ] 5.10 创建 `PriorityBadge` 组件 - 优先级图标+颜色
- [ ] 5.11 创建 `StatusBadge` 组件 - 状态标签+颜色
- [ ] 5.12 运行组件渲染测试

## 6. 页面集成
- [ ] 6.1 重构项目详情页需求 Tab (`app/dashboard/project/[projectId]/page.tsx`)
- [ ] 6.2 集成 RequirementTable 替换现有看板视图
- [ ] 6.3 集成 RequirementSlidePanel 处理新增/编辑/查看
- [ ] 6.4 实现筛选栏功能（状态、优先级、负责人、搜索）
- [ ] 6.5 实现分页功能
- [ ] 6.6 实现批量操作功能（P1）
- [ ] 6.7 验证页面在桌面端正常显示和操作

## 7. 国际化（i18n）
- [ ] 7.1 在 `dictionary.zh.ts` 添加需求管理相关翻译
- [ ] 7.2 在 `dictionary.en.ts` 添加英文翻译
- [ ] 7.3 在 `dictionary.ja.ts` 添加日文翻译
- [ ] 7.4 在 `dictionary-mapping.md` 更新映射文档
- [ ] 7.5 验证所有新增文本正确显示对应语言

## 8. 样式与主题
- [ ] 8.1 应用顶部导航栏深色主题风格（参考 Pencil YNcpT）
- [ ] 8.2 实现状态标签颜色（灰色/蓝色/绿色/红色/紫色/深灰色）
- [ ] 8.3 实现优先级图标颜色（P0红色/P1橙色/P2黄色/P3蓝色/P4灰色）
- [ ] 8.4 应用紧凑 UI 尺寸（配合 compact-ui-sizing 变更）
- [ ] 8.5 验证与现有项目卡片、Tab 菜单等组件风格一致

## 9. 性能优化
- [ ] 9.1 实现需求列表虚拟滚动（数据量大时）
- [ ] 9.2 优化面板打开动画（< 300ms）
- [ ] 9.3 实现评论懒加载（分页加载）
- [ ] 9.4 验证 100 条数据加载时间 < 2 秒

## 10. 测试与验证
- [ ] 10.1 编写需求管理 E2E 测试用例
- [ ] 10.2 运行 E2E 测试全部通过
- [ ] 10.3 进行手动功能测试（创建、编辑、删除、关联等）
- [ ] 10.4 验证父子需求层级展示正确
- [ ] 10.5 验证操作记录完整记录所有变更
- [ ] 10.6 验证附件上传和预览功能正常
- [ ] 10.7 运行 `pnpm build` 构建成功

## 11. 文档更新
- [ ] 11.1 更新 `packages/product-designs/product/05-requirement/` 相关文档
- [ ] 11.2 编写 API 接口文档
- [ ] 11.3 更新 CHANGELOG

## 12. 部署准备
- [ ] 12.1 确认数据库 migration 可在生产环境执行
- [ ] 12.2 验证环境变量配置正确
- [ ] 12.3 进行预发布环境测试
