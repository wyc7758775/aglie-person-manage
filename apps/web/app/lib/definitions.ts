// 用户角色类型
export type UserRole = 'user' | 'superadmin';

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  nickname: string;
  password: string;
  role?: UserRole;
  totalPoints?: number;
};

export type LoginRequest = {
  nickname: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    nickname: string;
    isAdmin: boolean;
  };
};

export type RegisterRequest = {
  nickname: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    nickname: string;
  };
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type ProjectType = 'sprint-project' | 'slow-burn';

export type ProjectStatus = 'normal' | 'at_risk' | 'out_of_control';

export type ProjectPriority = 'high' | 'medium' | 'low';

export interface ProjectIndicator {
  id: string;
  name: string;
  value: number;
  target: number;
  weight: number;
}

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
  points: number;
  avatar?: string;
  coverImageUrl?: string;
  indicators?: ProjectIndicator[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectCreateRequest = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'avatar' | 'progress'> & {
  progress?: number;
};

export type ProjectUpdateRequest = Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>;

export type ProjectResponse = {
  success: boolean;
  project?: Project;
  message?: string;
};

// 需求管理类型定义
export type RequirementStatus = 'draft' | 'review' | 'approved' | 'development' | 'testing' | 'completed' | 'rejected';

export type RequirementPriority = 'critical' | 'high' | 'medium' | 'low';

export type RequirementType = 'feature' | 'enhancement' | 'bugfix' | 'research';

export type Requirement = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: RequirementType;
  status: RequirementStatus;
  priority: RequirementPriority;
  assignee: string;
  reporter: string;
  createdDate: string;
  dueDate: string;
  storyPoints: number;
  points: number;
  tags: string[];
  parentId?: string | null;
};

export type RequirementCreateRequest = Omit<Requirement, 'id'> & {
  parentId?: string | null;
};

export type RequirementUpdateRequest = Partial<Omit<Requirement, 'id'>>;

export type RequirementResponse = {
  success: boolean;
  requirement?: Requirement;
  message?: string;
};

// 任务管理类型定义 - 扩展版（支持三种任务类型：习惯/日常任务/待办事项）
export type TaskType = 'habit' | 'daily' | 'task';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

export type TaskPriority = 'p0' | 'p1' | 'p2' | 'p3';

export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export type TaskFrequency = 'daily' | 'weekdays' | 'weekly' | 'custom';

export type TaskDirection = 'positive' | 'negative';

export type ResetPeriod = 'daily' | 'weekly' | 'monthly';

// 子任务类型
export type SubTask = {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

// 任务评论类型
export type TaskComment = {
  id: string;
  taskId: string;
  userId: string;
  userNickname: string;
  content: string;
  createdAt: string;
};

// 任务历史记录类型
export type HistoryLog = {
  id: string;
  taskId: string;
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'status_changed';
  description: string;
  userId?: string;
  userNickname?: string;
  timestamp: string;
};

// 扩展的 Task 类型
export type Task = {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  projectId: string;
  assignee: string | null;
  points: number;
  goldReward: number;
  goldPenalty: number;
  // 习惯类型特有字段
  streak: number;
  totalCount: number;
  direction: TaskDirection;
  resetPeriod: ResetPeriod;
  // 频率相关字段
  frequency: TaskFrequency;
  repeatDays: number[]; // 0=周日, 1=周一, ..., 6=周六
  // 日期字段
  startDate: string | null;
  dueDate: string | null;
  // 标签和关联数据
  tags: string[];
  subTasks: SubTask[];
  comments: TaskComment[];
  history: HistoryLog[];
  // 时间戳
  createdAt: string;
  updatedAt: string;
};

export type TaskCreateRequest = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'streak' | 'totalCount' | 'subTasks' | 'comments' | 'history'> & {
  streak?: number;
  totalCount?: number;
};

// 任务重置周期选项
export const resetPeriodOptions: { value: ResetPeriod; label: string }[] = [
  { value: 'daily', label: '每日' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
];

export type TaskUpdateRequest = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'subTasks' | 'comments' | 'history'>>;

export type TaskResponse = {
  success: boolean;
  task?: Task;
  message?: string;
};

export type TaskListResponse = {
  success: boolean;
  tasks?: Task[];
  message?: string;
};

// 缺陷管理类型定义
export type DefectStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'reopened';

export type DefectSeverity = 'low' | 'medium' | 'high' | 'critical';

export type DefectType = 'bug' | 'performance' | 'ui' | 'security' | 'compatibility';

export type Defect = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: DefectStatus;
  severity: DefectSeverity;
  type: DefectType;
  assignee: string;
  reporter: string;
  createdDate: string;
  dueDate: string;
  environment: string;
  steps: string[];
};

export type DefectCreateRequest = Omit<Defect, 'id'>;

export type DefectUpdateRequest = Partial<Omit<Defect, 'id'>>;

export type DefectResponse = {
  success: boolean;
  defect?: Defect;
  message?: string;
};

// 需求评论类型
export type RequirementComment = {
  id: string;
  requirementId: string;
  userId: string;
  userNickname: string;
  content: string;
  attachments?: Attachment[];
  createdAt: string;
};

export type RequirementCommentCreateRequest = Omit<RequirementComment, 'id' | 'userNickname' | 'createdAt'>;

// 操作日志类型
export type OperationLog = {
  id: string;
  entityType: 'requirement' | 'task' | 'defect' | 'project';
  entityId: string;
  userId: string;
  userNickname: string;
  action: 'create' | 'update' | 'delete' | 'status_change';
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
};

// 附件类型
export type Attachment = {
  id: string;
  entityType: 'requirement_comment' | 'task' | 'defect';
  entityId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
};

// 待办事项（To-Do）类型定义
export type TodoStatus = 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';

export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export type LinkType = 'blocks' | 'blocked_by' | 'related_to';

export type Todo = {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  assignee: string;
  startDate: string | null;
  dueDate: string | null;
  points: number;
  tags: string[];
  projectId?: string;
  createdAt: string;
  updatedAt: string;
};

export type TodoCreateRequest = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export type TodoUpdateRequest = Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;

export type TodoResponse = {
  success: boolean;
  todo?: Todo;
  message?: string;
};

// 子任务类型定义
export type Subtask = {
  id: string;
  todoId: string;
  title: string;
  completed: boolean;
  assignee?: string;
  createdAt: string;
};

export type SubtaskCreateRequest = Omit<Subtask, 'id' | 'todoId' | 'createdAt'>;

export type SubtaskUpdateRequest = Partial<Omit<Subtask, 'id' | 'todoId' | 'createdAt'>>;

// 关联任务类型定义
export type TodoLink = {
  id: string;
  sourceId: string;
  targetId: string;
  linkType: LinkType;
  createdAt: string;
};

export type TodoLinkCreateRequest = {
  targetId: string;
  linkType: LinkType;
};

// 待办事项评论类型定义
export type TodoComment = {
  id: string;
  todoId: string;
  userId: string;
  userNickname: string;
  content: string;
  createdAt: string;
};

export type TodoCommentCreateRequest = Omit<TodoComment, 'id' | 'todoId' | 'userNickname' | 'createdAt'>;

// 待办事项操作记录类型定义
export type TodoActivity = {
  id: string;
  todoId: string;
  userId: string;
  userNickname: string;
  action: string;
  details?: string;
  createdAt: string;
};
