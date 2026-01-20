# enhance-project-management 任务清单

## 任务0：创建数据类型定义

### 0.1 添加 Project 类型到 definitions.ts
- [x] 打开 `app/lib/definitions.ts`
- [x] 添加 `ProjectType` 类型定义
- [x] 添加 `ProjectStatus` 类型定义
- [x] 添加 `ProjectPriority` 类型定义
- [x] 添加 `Project` 接口定义
- [x] 添加 `ProjectCreateRequest` 类型
- [x] 添加 `ProjectUpdateRequest` 类型
- [x] 添加 `ProjectResponse` 类型

**验证方式**：
- [x] 运行 `pnpm build` 无类型错误

---

## 任务1：创建示例数据和数据访问函数

### 1.1 添加示例项目数据
- [x] 打开 `app/lib/placeholder-data.ts`
- [x] 创建 `projects` 数组
- [x] 添加至少 5 个示例项目（包含 life 和 code 类型）
- [x] 导出 `projects` 数组

**示例数据参考**：
```typescript
const projects = [
  {
    id: 'proj-1',
    name: '敏捷人员管理系统',
    description: '基于Next.js的现代化人员管理平台',
    type: 'code',
    status: 'active',
    priority: 'high',
    goals: ['实现用户管理', '实现项目管理', '实现任务管理'],
    tags: ['Next.js', 'TypeScript', 'React'],
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    progress: 75,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  // ... 更多示例
];
```

### 1.2 创建项目数据访问函数
- [x] 创建 `app/lib/projects.ts`
- [x] 实现 `getProjects()` 函数（支持筛选）
- [x] 实现 `getProjectById()` 函数
- [x] 实现 `createProject()` 函数
- [x] 实现 `updateProject()` 函数
- [x] 实现 `deleteProject()` 函数

**函数签名参考**：
```typescript
export async function getProjects(filters?: {
  status?: ProjectStatus;
  type?: ProjectType;
  priority?: ProjectPriority;
}): Promise<Project[]>;

export async function getProjectById(id: string): Promise<Project | null>;

export async function createProject(data: ProjectCreateRequest): Promise<Project>;

export async function updateProject(id: string, data: ProjectUpdateRequest): Promise<Project | null>;

export async function deleteProject(id: string): Promise<boolean>;
```

**验证方式**：
- [x] 所有函数可正确导入
- [x] 返回值类型正确

---

## 任务2：创建项目 API 路由

### 2.1 创建项目列表和创建路由
- [x] 创建 `app/api/projects/route.ts`
- [x] 实现 `GET` 方法（获取项目列表，支持筛选）
- [x] 实现 `POST` 方法（创建新项目）
- [x] 添加请求验证
- [x] 添加错误处理

**GET 请求示例**：
```
GET /api/projects?status=active&type=code
```

**验证方式**：
- [x] 使用 `curl` 或 Postman 测试 GET 请求
- [x] 使用 `curl` 或 Postman 测试 POST 请求

### 2.2 创建项目详情、更新、删除路由
- [x] 创建 `app/api/projects/[id]/route.ts`
- [x] 实现 `GET` 方法（获取项目详情）
- [x] 实现 `PUT` 方法（更新项目）
- [x] 实现 `DELETE` 方法（删除项目）
- [x] 添加错误处理

**验证方式**：
- [x] 使用 `curl` 或 Postman 测试 GET 请求
- [x] 使用 `curl` 或 Postman 测试 PUT 请求
- [x] 使用 `curl` 或 Postman 测试 DELETE 请求

---

## 任务3：创建项目表单组件

### 3.1 创建 ProjectForm 组件
- [x] 创建 `app/dashboard/project/components/ProjectForm.tsx`
- [x] 添加表单字段：名称、描述、类型、优先级、开始日期、结束日期
- [x] 添加目标列表（支持添加/删除）
- [x] 添加标签列表（支持添加/删除）
- [x] 实现表单验证
- [x] 实现提交逻辑（调用 API）

**表单字段要求**：
- 名称：必填，最大长度 100
- 描述：可选，最大长度 500
- 类型：必选（life/code）
- 优先级：必选（high/medium/low）
- 开始日期：必选
- 结束日期：可选，需晚于开始日期

**验证方式**：
- [x] 表单可正常渲染
- [x] 表单验证正常工作
- [x] 提交成功后返回正确数据

### 3.2 创建 ProjectDialog 组件
- [x] 创建 `app/dashboard/project/components/ProjectDialog.tsx`
- [x] 对话框容器（支持创建和编辑模式）
- [x] 集成 ProjectForm 组件
- [x] 实现打开/关闭逻辑
- [x] 实现成功回调

**验证方式**：
- [x] 对话框可正常打开和关闭
- [x] 创建模式正常工作
- [x] 编辑模式正常工作

---

## 任务4：修改项目列表页

### 4.1 修改 page.tsx 使用真实数据
- [x] 打开 `app/dashboard/project/page.tsx`
- [x] 移除 `generateSampleProjects` 函数
- [x] 添加 `useEffect` 从 API 获取项目列表
- [x] 添加加载状态
- [x] 添加错误处理
- [x] 实现项目筛选功能（按状态、类型）
- [x] 实现"添加项目"按钮（打开 ProjectDialog）
- [x] 添加项目卡片上的操作菜单（编辑、删除）

**验证方式**：
- [x] 页面加载显示真实数据
- [x] 筛选功能正常工作
- [x] 添加项目功能正常
- [x] 编辑项目功能正常
- [x] 删除项目功能正常

---

## 任务5：创建项目详情弹窗

### 5.1 创建项目详情弹窗组件
- [x] 创建 `app/dashboard/project/components/ProjectDetailDialog.tsx`
- [x] 对话框形式展示项目完整信息
- [x] 展示项目基本信息（名称、描述、类型、状态、优先级）
- [x] 展示项目进度条
- [x] 展示项目目标列表
- [x] 展示项目标签列表
- [x] 展示开始日期和结束日期
- [x] 提供"编辑"按钮（点击后打开编辑弹窗）
- [x] 提供"删除"按钮（点击后显示确认对话框）
- [x] 实现关闭逻辑（关闭按钮、ESC键、点击遮罩）

**验证方式**：
- [x] 点击项目卡片打开详情弹窗
- [x] 详情弹窗正确显示项目信息
- [x] 点击"编辑"按钮打开编辑弹窗
- [x] 点击"删除"按钮显示确认对话框
- [x] ESC 键关闭弹窗
- [x] 点击遮罩关闭弹窗

---

## 任务6：添加国际化支持

### 6.1 添加中文翻译
- [x] 打开 `app/lib/i18n/dictionary.zh.ts`
- [x] 在 `project` 对象中添加所有新增翻译键
- [x] 添加类型、状态、优先级翻译
- [x] 添加表单相关翻译
- [x] 添加筛选器翻译

### 6.2 添加英文翻译
- [x] 打开 `app/lib/i18n/dictionary.en.ts`
- [x] 在 `project` 对象中添加所有新增翻译键
- [x] 添加类型、状态、优先级翻译
- [x] 添加表单相关翻译
- [x] 添加筛选器翻译

### 6.3 应用国际化
- [x] 修改 `app/dashboard/project/page.tsx` 使用 `useLanguage`
- [x] 替换所有硬编码文本为翻译函数调用
- [x] 修改 `ProjectForm.tsx` 使用 `useLanguage`
- [x] 修改 `app/dashboard/project/[id]/page.tsx` 使用 `useLanguage`

**验证方式**：
- [x] 中文界面正常显示
- [x] 英文界面正常显示
- [x] 切换语言后文本正确更新

---

## 任务7：添加项目操作功能

### 7.1 实现项目状态更新
- [x] 在项目卡片上添加状态切换按钮
- [x] 调用 API 更新项目状态
- [x] 刷新项目列表

### 7.2 实现项目删除确认
- [x] 在删除操作前显示确认对话框
- [x] 确认后调用 API 删除
- [x] 取消后不执行删除

**验证方式**：
- [x] 状态更新功能正常
- [x] 删除确认功能正常

---

## 任务8：优化用户体验

### 8.1 添加加载和错误状态
- [x] 项目列表加载时显示加载动画
- [x] API 错误时显示错误提示
- [x] 操作成功后显示成功提示

### 8.2 优化项目卡片显示
- [x] 根据项目类型（life/code）显示不同图标或颜色
- [x] 项目进度条显示更清晰
- [x] 项目标签显示优化

**验证方式**：
- [x] 加载状态正常显示
- [x] 错误提示正常显示
- [x] 成功提示正常显示

---

## 任务9：构建验证

### 9.1 类型检查
- [x] 运行 `pnpm build` 检查类型错误
- [x] 修复所有类型错误

### 9.2 功能测试
- [x] 测试项目列表加载
- [x] 测试创建项目
- [x] 测试编辑项目
- [x] 测试删除项目
- [x] 测试项目筛选
- [x] 测试项目详情
- [x] 测试国际化切换

**验证方式**：
- [x] `pnpm build` 成功
- [x] 所有功能测试通过

---

## 验收检查清单

- [x] 项目类型定义正确添加到 `definitions.ts`
- [x] 示例项目数据添加到 `placeholder-data.ts`
- [x] 项目数据访问函数正常工作
- [x] GET /api/projects 正确返回项目列表
- [x] POST /api/projects 正确创建项目
- [x] GET /api/projects/[id] 正确返回项目详情
- [x] PUT /api/projects/[id] 正确更新项目
- [x] DELETE /api/projects/[id] 正确删除项目
- [x] 项目列表页显示真实数据
- [x] 可以创建新项目（支持 life/code 类型）
- [x] 可以编辑项目信息
- [x] 可以删除项目（有确认对话框）
- [x] 可以筛选项目（按状态、类型）
- [x] 可以查看项目详情（弹窗形式）
- [x] 项目正确显示目标和标签
- [x] 项目类型（life/code）有视觉区分
- [x] 中英文切换正常工作
- [x] 加载状态正常显示
- [x] 错误处理正常工作
- [x] `pnpm build` 成功

---

## 示例项目数据

| ID | 名称 | 类型 | 状态 | 优先级 | 目标 | 标签 |
|----|------|------|------|--------|------|------|
| proj-1 | 敏捷人员管理系统 | code | active | high | 用户管理,项目管理 | Next.js,TypeScript |
| proj-2 | 健身计划 | life | active | medium | 减肥,增肌 | 健康,运动 |
| proj-3 | 学习英语 | life | planning | medium | 考过六级 | 英语,学习 |
| proj-4 | 个人博客 | code | paused | low | 完成基础功能 | 博客,前端 |
| proj-5 | 读书计划 | life | active | high | 读12本书 | 阅读,知识 |

---

## 预估工时

| 任务 | 预估时间 |
|------|----------|
| 创建数据类型定义 | 30分钟 |
| 创建示例数据和数据访问函数 | 30分钟 |
| 创建项目 API 路由 | 1.5小时 |
| 创建项目表单组件 | 1小时 |
| 修改项目列表页 | 1小时 |
| 创建项目详情弹窗 | 30分钟 |
| 添加国际化支持 | 30分钟 |
| 添加项目操作功能 | 30分钟 |
| 优化用户体验 | 30分钟 |
| 构建验证 | 30分钟 |
| **总计** | **约 6.5 小时** |

---

## 技术要点

### API 错误处理模式

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 业务逻辑
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
```

### 表单验证模式

```typescript
const validateProject = (data: ProjectCreateRequest): string[] => {
  const errors: string[] = [];
  if (!data.name || data.name.length === 0) {
    errors.push('项目名称不能为空');
  }
  if (data.name && data.name.length > 100) {
    errors.push('项目名称不能超过100个字符');
  }
  // ... 更多验证
  return errors;
};
```

### 国际化使用模式

```typescript
const { t, locale } = useLanguage();

// 在组件中使用
<h1>{t('project.title')}</h1>
<span>{t(`project.type.${project.type}`)}</span>
