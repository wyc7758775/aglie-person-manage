# enhance-project-management 提案

## 项目概述

补充 `/app/dashboard/project/page.tsx` 页面的完整功能，使其成为一个可用的敏捷开发项目管理系统。根据 `project.md` 的要求，项目管理系统应支持生活（life）和代码（code）两种项目类型，包含目标与标签管理。

## 目标

- 实现项目的完整 CRUD 操作
- 支持 life | code 两种项目类型区分
- 实现项目目标与标签管理
- 实现项目状态与优先级管理
- 实现项目进度跟踪（关联任务统计）
- 实现国际化支持
- 实现数据持久化（内存数据库）

## 背景

根据 `project.md` 规划：
> 项目管理：支持 life | code 两种项目类型，包含目标与标签

当前状态：
- `app/dashboard/project/page.tsx` 仅有前端 UI，使用示例数据
- 没有后端 API 支持
- 没有数据持久化机制
- 缺少项目添加/编辑功能
- 没有项目详情页面
- 缺少项目类型（life/code）的实际应用

## 实施范围

### 包含

**数据层：**
- 在 `app/lib/definitions.ts` 中添加 Project 类型定义
- 在 `app/lib/placeholder-data.ts` 中添加示例项目数据
- 创建项目数据访问函数（CRUD 操作）

**API 层：**
- `GET /api/projects` - 获取项目列表
- `POST /api/projects` - 创建新项目
- `GET /api/projects/[id]` - 获取项目详情（用于详情弹窗）
- `PUT /api/projects/[id]` - 更新项目
- `DELETE /api/projects/[id]` - 删除项目

**UI 层：**
- 添加项目表单组件（支持创建和编辑）
- 项目详情弹窗（展示项目完整信息）
- 项目操作菜单（编辑、删除、状态更新）
- 集成国际化支持

**功能特性：**
- 项目类型区分（life/code）
- 项目目标管理
- 项目标签管理
- 项目状态切换（active/completed/paused/planning）
- 项目优先级设置（high/medium/low）
- 项目进度计算（基于关联任务）
- 项目筛选（按状态、类型）

### 不包含

- 项目成员协作功能（个人使用场景）
- 项目权限管理
- 项目统计报表
- 项目模板功能
- 项目导入导出

## 数据模型

### Project 类型定义

```typescript
export type ProjectType = 'life' | 'code';

export type ProjectStatus = 'active' | 'completed' | 'paused' | 'planning';

export type ProjectPriority = 'high' | 'medium' | 'low';

export type Project = {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  goals: string[];
  tags: string[];
  startDate: string;
  endDate: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
};
```

## API 设计

### 获取项目列表
- **端点**: `GET /api/projects`
- **查询参数**: `status`?, `type`?, `priority`?
- **响应**: `{ success: true, projects: Project[] }`

### 创建项目
- **端点**: `POST /api/projects`
- **请求体**: `Omit<Project, 'id' | 'progress' | 'createdAt' | 'updatedAt'>`
- **响应**: `{ success: true, project: Project }`

### 更新项目
- **端点**: `PUT /api/projects/[id]`
- **请求体**: `Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>`
- **响应**: `{ success: true, project: Project }`

### 删除项目
- **端点**: `DELETE /api/projects/[id]`
- **响应**: `{ success: true, message: string }`

## 技术实现

### 文件结构

```
app/
├── api/projects/
│   ├── route.ts                    # 项目列表（GET）和创建（POST）
│   └── [id]/
│       └── route.ts                # 项目详情（GET）、更新（PUT）、删除（DELETE）
├── dashboard/project/
│   ├── page.tsx                    # 项目列表页（修改）
│   └── components/
│       ├── ProjectForm.tsx        # 项目表单（新建）
│       ├── ProjectDialog.tsx      # 创建/编辑弹窗（新建）
│       └── ProjectDetailDialog.tsx # 详情弹窗（新建）
lib/
├── definitions.ts                  # 添加 Project 类型
├── placeholder-data.ts             # 添加示例数据
└── projects.ts                     # 项目数据访问函数（新建）
```

### 组件设计

#### ProjectForm 组件
- 表单字段：名称、描述、类型、优先级、开始日期、结束日期、目标、标签
- 表单验证：必填字段验证
- 提交：调用 API 创建/更新项目

#### ProjectDialog 组件
- 对话框形式显示 ProjectForm
- 支持创建和编辑模式
- 成功后刷新项目列表

#### 项目详情弹窗
- 对话框形式展示项目完整信息
- 展示项目进度
- 提供编辑/删除操作
- 点击"编辑"按钮打开编辑弹窗

## 国际化支持

### 新增翻译键

```typescript
project: {
  title: '项目管理',
  subtitle: '管理和跟踪您的项目进度，协调团队协作',
  empty: '没有找到符合条件的项目',
  progress: '进度',
  // 新增
  type: {
    life: '生活',
    code: '代码',
  },
  status: {
    active: '进行中',
    completed: '已完成',
    paused: '暂停',
    planning: '规划中',
  },
  priority: {
    high: '高',
    medium: '中',
    low: '低',
  },
  goals: '目标',
  tags: '标签',
  add: '添加项目',
  edit: '编辑项目',
  delete: '删除项目',
  deleteConfirm: '确定要删除此项目吗？',
  startDate: '开始日期',
  endDate: '结束日期',
  form: {
    name: '项目名称',
    namePlaceholder: '输入项目名称',
    description: '项目描述',
    descriptionPlaceholder: '输入项目描述',
    type: '项目类型',
    priority: '优先级',
    status: '状态',
    goals: '目标',
    addGoal: '添加目标',
    tags: '标签',
    addTag: '添加标签',
    save: '保存',
    cancel: '取消',
  },
  filters: {
    all: '全部',
    active: '进行中',
    completed: '已完成',
    paused: '暂停',
    planning: '规划中',
    life: '生活',
    code: '代码',
  },
}
```

## 成功标准

1. 项目列表页显示真实数据（非示例数据）
2. 可以创建新项目（支持 life/code 类型）
3. 可以编辑项目信息
4. 可以删除项目
5. 可以筛选项目（按状态）
6. 可以查看项目详情（弹窗形式）
7. 项目正确显示目标和标签
8. 项目进度正确计算
9. 所有操作有适当的错误处理
10. 支持中英文切换
11. `pnpm build` 成功

## 时间线

| 阶段 | 内容 | 预估时间 |
|------|------|----------|
| **准备阶段** | 创建数据类型和示例数据 | 30分钟 |
| **API 开发** | 实现 CRUD API | 1.5小时 |
| **UI 组件** | 表单、编辑弹窗、详情弹窗 | 2小时 |
| **页面集成** | 修改列表页、集成弹窗 | 1小时 |
| **国际化** | 添加翻译、应用多语言 | 30分钟 |
| **测试验证** | 功能测试、构建验证 | 30分钟 |

**总计：约 6 小时**

## 依赖关系

- 依赖现有 `SectionContainer` 组件
- 依赖现有图标库
- 依赖 `i18n` 国际化系统
- 依赖内存数据存储机制

## 风险与注意事项

1. **数据持久化**: 当前使用内存数据库，服务器重启后数据会丢失
2. **进度计算**: 目前没有关联任务系统，进度只能手动设置
3. **用户体验**: 缺少确认对话框（删除等危险操作）
4. **表单验证**: 需要确保所有必填字段验证
