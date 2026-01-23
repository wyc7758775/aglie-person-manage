# add-requirement-views 设计文档

## Context

当前需求管理页面仅提供基础的卡片列表视图，使用示例数据。需要实现完整的需求管理功能，包括数据模型、API、以及列表和看板两种视图模式。

## Goals / Non-Goals

### Goals
- 实现完整的需求管理 CRUD 功能
- 提供列表视图和看板视图两种展示方式
- 看板视图支持按状态和按优先级两种分组方式
- 视图切换功能位于页面顶部标题区域
- 保持与现有项目风格一致（参考项目管理页面）

### Non-Goals
- 需求卡片拖拽排序（未来扩展）
- 需求关联项目功能（未来扩展）
- 需求评论和协作功能（个人使用场景）
- 需求附件上传功能

## Decisions

### Decision 1: 视图切换控件位置
**决策**：视图切换控件放在页面顶部标题区域（与标题、描述同一行）

**理由**：
- 用户期望在页面顶部找到视图切换功能
- 不影响 SectionContainer 的通用性
- 与筛选器分离，职责清晰

**实现**：
- 在页面标题区域右侧添加视图切换按钮组
- 使用图标按钮（列表图标、看板图标）
- 当前视图高亮显示

### Decision 2: 看板视图分组方式
**决策**：支持按状态和按优先级两种分组方式，用户可切换

**理由**：
- 按状态分组：适合跟踪需求流转进度
- 按优先级分组：适合关注重要需求
- 两种方式都有价值，提供切换更灵活

**实现**：
- 在看板视图顶部添加分组切换按钮（状态/优先级）
- 根据选择的分组方式动态生成列
- 状态分组：draft, review, approved, development, testing, completed, rejected
- 优先级分组：critical, high, medium, low

### Decision 3: 数据存储方式
**决策**：使用内存数据库（placeholder-data.ts），与项目其他模块保持一致

**理由**：
- 当前项目使用内存数据库作为演示
- 保持架构一致性
- 未来可迁移到真实数据库

**实现**：
- 在 `app/lib/placeholder-data.ts` 中添加需求数据数组
- 实现 CRUD 操作函数
- 数据在服务器重启时重置（符合当前架构）

### Decision 4: 组件架构
**决策**：采用组件化设计，将看板视图、需求卡片、视图切换器分离为独立组件

**理由**：
- 提高代码可维护性
- 组件可复用
- 便于测试和调试

**组件结构**：
```
RequirementPage (page.tsx)
├── ViewSwitcher (视图切换控件)
├── SectionContainer
│   ├── RequirementListView (列表视图)
│   │   └── RequirementCard[]
│   └── RequirementKanbanView (看板视图)
│       ├── KanbanColumn[] (按状态或优先级)
│       └── RequirementCard[]
└── RequirementForm (创建/编辑表单)
```

### Decision 5: API 设计
**决策**：采用 RESTful API 设计，与项目 API 保持一致

**理由**：
- 与现有项目 API 风格一致
- RESTful 设计清晰易懂
- 便于未来扩展

**API 端点**：
- `GET /api/requirements` - 获取需求列表（支持 ?status=xxx 筛选）
- `POST /api/requirements` - 创建需求
- `GET /api/requirements/[id]` - 获取需求详情
- `PUT /api/requirements/[id]` - 更新需求
- `DELETE /api/requirements/[id]` - 删除需求

## Risks / Trade-offs

### Risk 1: 看板视图性能
**风险**：需求数量较多时，看板视图渲染可能较慢

**缓解**：
- 使用 React 虚拟滚动（如需要）
- 限制单页显示数量
- 优化组件渲染性能

### Risk 2: 视图状态持久化
**风险**：用户切换视图后刷新页面，视图状态丢失

**缓解**：
- 可选：使用 localStorage 保存视图偏好
- 默认使用列表视图（更通用）

### Risk 3: 数据同步
**风险**：多标签页打开时，数据可能不同步

**缓解**：
- 当前使用内存数据库，多标签页共享同一数据源
- 未来迁移到真实数据库时，考虑实时同步机制

## Migration Plan

### 步骤 1: 数据层迁移
- 将现有页面中的 Requirement 类型定义迁移到 `definitions.ts`
- 将示例数据生成函数迁移到 `placeholder-data.ts`

### 步骤 2: API 迁移
- 创建 API 路由
- 页面从 API 获取数据，替换示例数据

### 步骤 3: UI 重构
- 提取需求卡片为独立组件
- 创建看板视图组件
- 添加视图切换功能
- 集成到页面

### 步骤 4: 功能完善
- 添加创建/编辑功能
- 添加国际化支持
- 测试和优化

## Open Questions

- 是否需要需求详情页面（弹窗或抽屉）？
- 是否需要需求搜索功能？
- 是否需要需求导出功能？
