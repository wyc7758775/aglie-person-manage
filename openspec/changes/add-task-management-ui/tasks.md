# 任务清单：添加任务管理界面

## 1. 数据模型与类型定义
- [ ] 1.1 在 `app/lib/definitions.ts` 定义 `DailyTask`、`Habit`、`Todo` 类型
- [ ] 1.2 定义任务状态枚举：`pending` | `in_progress` | `completed`
- [ ] 1.3 定义难度等级枚举：`easy` | `medium` | `hard`
- [ ] 1.4 定义频率枚举：`daily` | `weekdays` | `weekly` | `custom`
- [ ] 1.5 定义待办事项子任务类型 `SubTask`
- [ ] 1.6 定义评论类型 `Comment`
- [ ] 1.7 定义历史记录类型 `HistoryLog`

## 2. 数据库层
- [ ] 2.1 在 `app/lib/db.ts` 实现 `daily_tasks` 表的 CRUD 操作
- [ ] 2.2 实现 `habits` 表的 CRUD 操作
- [ ] 2.3 实现 `todos` 表的 CRUD 操作
- [ ] 2.4 实现 `sub_tasks` 表的 CRUD 操作
- [ ] 2.5 实现 `comments` 表的 CRUD 操作
- [ ] 2.6 实现 `history_logs` 表的 CRUD 操作
- [ ] 2.7 实现获取任务连胜天数的方法

## 3. API 路由
- [ ] 3.1 创建 `app/api/tasks/route.ts` - GET 获取所有任务列表
- [ ] 3.2 创建 `app/api/tasks/daily/route.ts` - POST 创建日常任务
- [ ] 3.3 创建 `app/api/tasks/habits/route.ts` - POST 创建习惯
- [ ] 3.4 创建 `app/api/tasks/todos/route.ts` - POST 创建待办事项
- [ ] 3.5 创建 `app/api/tasks/[id]/route.ts` - GET/PUT/DELETE 单任务操作
- [ ] 3.6 创建 `app/api/tasks/[id]/complete/route.ts` - POST 标记任务完成
- [ ] 3.7 创建 `app/api/tasks/[id]/subtasks/route.ts` - 子任务 CRUD
- [ ] 3.8 创建 `app/api/tasks/[id]/comments/route.ts` - 评论 CRUD

## 4. UI 组件
- [ ] 4.1 创建 `app/ui/tasks/TaskListCard.tsx` - 任务列表卡片
- [ ] 4.2 创建 `app/ui/tasks/TaskTable.tsx` - 任务表格组件
- [ ] 4.3 创建 `app/ui/tasks/TaskRow.tsx` - 任务行组件
- [ ] 4.4 创建 `app/ui/tasks/TypeTabBar.tsx` - 任务类型切换标签栏
- [ ] 4.5 创建 `app/ui/tasks/CreateTaskDrawer.tsx` - 任务创建抽屉
- [ ] 4.6 创建 `app/ui/tasks/TaskDetailDrawer.tsx` - 任务详情抽屉
- [ ] 4.7 创建 `app/ui/tasks/EditTaskDrawer.tsx` - 任务编辑抽屉
- [ ] 4.8 创建 `app/ui/tasks/StatsCard.tsx` - 游戏属性卡片
- [ ] 4.9 创建 `app/ui/tasks/WeekGrid.tsx` - 周完成记录组件
- [ ] 4.10 创建 `app/ui/tasks/LogList.tsx` - 操作日志列表
- [ ] 4.11 创建 `app/ui/tasks/SubTaskList.tsx` - 子任务列表
- [ ] 4.12 创建 `app/ui/tasks/CommentList.tsx` - 评论列表
- [ ] 4.13 创建 `app/ui/tasks/TagInput.tsx` - 标签输入组件
- [ ] 4.14 创建 `app/ui/tasks/DaySelector.tsx` - 重复日选择器

## 5. 任务列表页面
- [ ] 5.1 创建 `app/dashboard/tasks/page.tsx` - 任务列表主页面
- [ ] 5.2 实现类型 Tab 切换（习惯/日常任务/待办事项）
- [ ] 5.3 实现筛选器（按状态、标签筛选）
- [ ] 5.4 实现搜索功能
- [ ] 5.5 实现新建任务按钮及抽屉打开
- [ ] 5.6 实现任务行点击打开详情抽屉

## 6. 表单验证
- [ ] 6.1 使用 Zod 创建任务创建表单验证 schema
- [ ] 6.2 创建任务编辑表单验证 schema
- [ ] 6.3 实现表单错误提示

## 7. 交互功能
- [ ] 7.1 实现任务标记完成功能
- [ ] 7.2 实现连胜天数计算和显示
- [ ] 7.3 实现金币增减逻辑
- [ ] 7.4 实现重复日选择交互
- [ ] 7.5 实现标签添加/删除
- [ ] 7.6 实现子任务添加/完成/删除
- [ ] 7.7 实现评论添加/显示

## 8. 导航集成
- [ ] 8.1 在侧边栏添加任务管理菜单项
- [ ] 8.2 实现与现有导航的样式统一

## 9. 测试验证
- [ ] 9.1 验证三种任务类型的创建流程
- [ ] 9.2 验证任务详情展示（含游戏属性）
- [ ] 9.3 验证任务编辑功能
- [ ] 9.4 验证筛选和搜索功能
- [ ] 9.5 验证待办事项的子任务和评论功能
- [ ] 9.6 运行 `pnpm build` 确保无编译错误
