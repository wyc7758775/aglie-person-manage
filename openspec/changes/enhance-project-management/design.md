# enhance-project-management 设计文档

## 架构概述

本项目遵循现有的技术栈和架构模式，采用 Next.js App Router + TypeScript + Tailwind CSS 的技术栈。项目管理功能采用 RESTful API 设计，前端使用 React Hooks 进行状态管理。

## 系统架构

### 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ ProjectPage │  │ProjectDetail│  │ ProjectForm │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    API Layer (Routes)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │GET/POST     │  │ GET/PUT/DEL │  │  Validation │    │
│  │ /projects   │  │/projects[id]│  │  & Errors   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Data Access Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │getProjects  │  │createProject│  │update/delete│    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Data Storage Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  In-Memory  │  │  Type Defs  │  │ Placeholder │    │
│  │     Data    │  │   (TS)      │  │   Data      │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 数据模型设计

### Project 核心数据结构

```typescript
// 项目类型
ProjectType: 'life' | 'code'

// 项目状态
ProjectStatus: 'active' | 'completed' | 'paused' | 'planning'

// 项目优先级
ProjectPriority: 'high' | 'medium' | 'low'

// 项目主结构
Project {
  id: string              // UUID
  name: string            // 项目名称 (1-100字符)
  description: string     // 项目描述 (0-500字符)
  type: ProjectType       // life 或 code
  status: ProjectStatus  // 当前状态
  priority: ProjectPriority // 优先级
  goals: string[]         // 目标列表
  tags: string[]          // 标签列表
  startDate: string       // 开始日期 (ISO 8601)
  endDate: string | null  // 结束日期 (可选)
  progress: number        // 进度百分比 (0-100)
  createdAt: string       // 创建时间
  updatedAt: string       // 更新时间
}
```

### 数据关系

```
Project (1) ── (N) Goals
Project (1) ── (N) Tags
Project (1) ── (N) Tasks (未来功能)
```

## API 设计

### 端点设计

| 方法 | 端点 | 描述 | 权限 |
|------|------|------|------|
| GET | /api/projects | 获取项目列表 | 登录用户 |
| POST | /api/projects | 创建新项目 | 登录用户 |
| GET | /api/projects/[id] | 获取项目详情 | 登录用户 |
| PUT | /api/projects/[id] | 更新项目 | 登录用户 |
| DELETE | /api/projects/[id] | 删除项目 | 登录用户 |

### 请求/响应格式

#### GET /api/projects

**查询参数**：
```typescript
{
  status?: 'active' | 'completed' | 'paused' | 'planning'
  type?: 'life' | 'code'
  priority?: 'high' | 'medium' | 'low'
}
```

**响应**：
```json
{
  "success": true,
  "projects": [
    {
      "id": "proj-1",
      "name": "敏捷人员管理系统",
      "type": "code",
      "status": "active",
      "priority": "high",
      "progress": 75
    }
  ]
}
```

#### POST /api/projects

**请求体**：
```json
{
  "name": "新项目",
  "description": "项目描述",
  "type": "code",
  "status": "planning",
  "priority": "medium",
  "goals": ["目标1", "目标2"],
  "tags": ["标签1"],
  "startDate": "2024-01-01",
  "endDate": null
}
```

**响应**：
```json
{
  "success": true,
  "project": {
    "id": "proj-new",
    "name": "新项目",
    "progress": 0,
    "createdAt": "2024-01-19T00:00:00.000Z",
    "updatedAt": "2024-01-19T00:00:00.000Z"
  }
}
```

#### PUT /api/projects/[id]

**请求体**：
```json
{
  "name": "更新后的名称",
  "status": "active",
  "progress": 50
}
```

**响应**：
```json
{
  "success": true,
  "project": {
    "id": "proj-1",
    "name": "更新后的名称",
    "updatedAt": "2024-01-19T01:00:00.000Z"
  }
}
```

#### DELETE /api/projects/[id]

**响应**：
```json
{
  "success": true,
  "message": "项目已删除"
}
```

## 组件设计

### 组件层次结构

```
ProjectPage (app/dashboard/project/page.tsx)
├── SectionContainer
│   ├── ProjectCard[] (项目卡片列表)
│   │   └── ProjectMenu (操作菜单)
│   └── AddButton (添加按钮)
├── ProjectDialog (对话框)
│   └── ProjectForm (表单)
└── ProjectDetailDialog (详情弹窗)
    ├── ProjectInfo (项目基本信息)
    ├── ProjectGoals (目标列表)
    ├── ProjectTags (标签列表)
    └── ProjectActions (操作按钮)
```

### ProjectCard 组件

**Props**：
```typescript
interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}
```

**状态**：无（纯展示组件）

**设计要点**：
- 显示项目名称、描述、类型、状态、优先级
- 进度条可视化
- 类型标识图标
- 悬停阴影效果

### ProjectForm 组件

**Props**：
```typescript
interface ProjectFormProps {
  project?: Project; // 如果提供则为编辑模式
  onSubmit: (data: ProjectCreateRequest) => Promise<void>;
  onCancel: () => void;
}
```

**状态**：
```typescript
{
  formData: ProjectCreateRequest
  errors: Record<string, string>
  submitting: boolean
}
```

**验证规则**：
- 名称：必填，1-100字符
- 描述：可选，0-500字符
- 类型：必选
- 优先级：必选
- 开始日期：必选
- 结束日期：可选，需 ≥ 开始日期

### ProjectDialog 组件

**Props**：
```typescript
interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
  onSuccess: () => void;
}
```

**设计要点**：
- 对话框遮罩层
- 模态居中显示
- ESC 键关闭
- 点击遮罩关闭（可选）
- 宽度适中，可滚动查看完整信息

## 状态管理

### 客户端状态管理

使用 React Hooks 进行状态管理：

```typescript
// 项目列表页状态
const {
  projects,          // 项目列表
  loading,           // 加载状态
  error,             // 错误信息
  filters,           // 筛选条件
  dialogOpen         // 对话框状态
} = useProjectPage();

// 自定义 Hook 实现
function useProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // ... 状态管理逻辑
  return { projects, loading, error, filters, dialogOpen };
}
```

### 服务器端数据获取

```typescript
// 在 Server Component 中
async function getProjects(filters?: ProjectFilters): Promise<Project[]> {
  return await fetchProjectsFromAPI(filters);
}

// 在 Client Component 中
useEffect(() => {
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError('获取项目列表失败');
    } finally {
      setLoading(false);
    }
  };
  fetchProjects();
}, [filters]);
```

## 国际化策略

### 翻译键命名规范

```
project: {
  title: '项目管理',
  type: {
    life: '生活',
    code: '代码'
  },
  status: {
    active: '进行中'
  },
  form: {
    name: '项目名称',
    namePlaceholder: '输入项目名称'
  },
  filters: {
    all: '全部'
  }
}
```

### 国际化使用模式

```typescript
import { useLanguage } from '@/app/lib/i18n';

function ProjectCard({ project }: { project: Project }) {
  const { t } = useLanguage();

  return (
    <div>
      <span>{t(`project.type.${project.type}`)}</span>
      <span>{t(`project.status.${project.status}`)}</span>
    </div>
  );
}
```

## 错误处理

### API 错误处理

```typescript
try {
  // 业务逻辑
} catch (error) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { success: false, message: error.message, errors: error.details },
      { status: 400 }
    );
  } else if (error instanceof NotFoundError) {
    return NextResponse.json(
      { success: false, message: '项目不存在' },
      { status: 404 }
    );
  } else {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
```

### 客户端错误处理

```typescript
try {
  await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
} catch (error) {
  setError('创建项目失败，请稍后重试');
  // 显示错误提示
}
```

## 性能优化

### 数据缓存

```typescript
// 使用 React Query 或 SWR 进行数据缓存（可选）
const { data: projects, isLoading } = useQuery({
  queryKey: ['projects', filters],
  queryFn: () => fetchProjects(filters)
});
```

### 组件懒加载

```typescript
// 动态导入项目详情弹窗
const ProjectDetailDialog = dynamic(
  () => import('@/app/dashboard/project/components/ProjectDetailDialog'),
  { loading: () => <LoadingSpinner /> }
);
```

## 安全考虑

### 输入验证

```typescript
// 服务端验证
const validateProject = (data: any): ProjectCreateRequest => {
  if (!data.name || data.name.trim().length === 0) {
    throw new ValidationError('项目名称不能为空');
  }
  if (data.name.length > 100) {
    throw new ValidationError('项目名称不能超过100个字符');
  }
  // ... 更多验证
  return data;
};
```

### XSS 防护

```typescript
// 使用 React 的自动转义
<div>{project.name}</div>

// 如果需要显示 HTML，使用 DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(project.description)
}} />
```

## 测试策略

### API 测试

```bash
# 使用 test-api.js 测试脚本
node test-api.js
```

### 手动测试清单

- [ ] 创建项目
- [ ] 编辑项目
- [ ] 删除项目
- [ ] 筛选项目
- [ ] 查看项目详情
- [ ] 国际化切换
- [ ] 表单验证
- [ ] 错误处理

## 部署注意事项

1. **数据持久化**：当前使用内存数据库，生产环境需要连接真实数据库
2. **文件存储**：如果项目有附件，需要配置文件存储服务
3. **环境变量**：确保必要的环境变量已配置
4. **构建验证**：部署前运行 `pnpm build` 确保无错误

## 未来扩展

### 短期扩展（可能包含）

- 项目成员管理
- 项目评论功能
- 项目文件附件
- 项目模板功能

### 长期扩展（未来考虑）

- 项目统计报表
- 项目协作功能
- 项目导入导出
- 项目版本控制
- AI 辅助项目建议
