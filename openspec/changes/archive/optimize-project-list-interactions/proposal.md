# Change: 优化项目列表交互体验

## Why
当前项目列表页面在以下交互场景中存在体验问题：

1. **编辑刷新范围过大**: 编辑项目后整个列表重新刷新，造成视觉闪烁和性能浪费
2. **无缓存机制**: 从项目详情页返回列表页时总是重新加载数据，增加等待时间
3. **骨架屏不符合设计**: 当前的骨架屏与项目卡片实际布局不符，视觉体验差
4. **缺少防误触机制**: 编辑项目时未保存就关闭抽屉，容易造成数据丢失

这些体验问题影响了用户使用效率和满意度，需要系统性优化。

## What Changes

### 1. 局部刷新机制
- 编辑项目后仅更新对应项目卡片数据
- 新增项目后追加到列表末尾
- 删除项目后移除对应卡片

### 2. 列表数据缓存
- 使用 React Query / SWR 实现数据缓存
- 从项目详情页返回时展示缓存数据
- 后台静默更新，避免阻塞用户操作

### 3. 骨架屏组件化
- 优化骨架屏布局，与项目卡片保持一致
- 抽离为独立 UI 组件 `ProjectCardSkeleton`
- 添加到 UI 组件库 `app/ui/skeletons/`

### 4. 未保存确认弹窗
- 检测表单变更状态
- 关闭抽屉前如有变更显示确认弹窗
- 提供"保存并关闭"、"放弃更改"、"取消"三个选项

### 5. E2E 测试覆盖
- 局部刷新功能测试
- 缓存行为测试
- 骨架屏渲染测试
- 未保存确认弹窗测试

## Impact

### 受影响的能力规格
- `project-management`: 修改项目列表刷新逻辑、抽屉交互
- `ui-components`: 新增骨架屏组件

### 受影响的代码文件
- `apps/web/app/dashboard/project/page.tsx` - 列表页面
- `apps/web/app/dashboard/project/components/ProjectCard.tsx` - 项目卡片
- `apps/web/app/dashboard/project/components/ProjectDrawer.tsx` - 项目抽屉
- `apps/web/app/dashboard/project/components/ProjectCardSkeleton.tsx` - 骨架屏
- `apps/web/app/ui/skeletons/project-card-skeleton.tsx` - UI 组件库骨架屏
- `apps/e2e/tests/web/project-list.spec.ts` - E2E 测试

## 关联变更
- 与 `enhance-project-page-ux` 相关（已归档）
- 可能受 `add-project-detail-enhancements` 影响

## 验收标准
- [x] 编辑项目后只刷新对应卡片，其他卡片保持不动
- [x] 从项目详情页返回列表时显示缓存数据
- [x] 骨架屏布局与项目卡片完全匹配
- [x] 未保存内容时关闭抽屉显示确认弹窗
- [x] 所有功能均有 E2E 测试覆盖
