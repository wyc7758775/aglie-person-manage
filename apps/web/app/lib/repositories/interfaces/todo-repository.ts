/**
 * Todo Repository 接口
 * 待办事项数据访问抽象
 */

import { Repository } from './base-repository';

/**
 * 待办状态
 */
export type TodoStatus = 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';

/**
 * 待办优先级
 */
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * 关联类型
 */
export type LinkType = 'blocks' | 'blocked_by' | 'related_to';

/**
 * 子任务
 */
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assignee: string | null;
  createdAt: Date;
}

/**
 * 关联
 */
export interface TodoLink {
  id: string;
  sourceId: string;
  targetId: string;
  linkType: LinkType;
  createdAt: Date;
}

/**
 * 评论
 */
export interface TodoComment {
  id: string;
  userId: string;
  userNickname: string;
  content: string;
  createdAt: Date;
}

/**
 * 待办实体
 */
export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  assignee: string;
  startDate: Date | null;
  dueDate: Date | null;
  points: number;
  tags: string[];
  projectId: string | null;
  subtasks: Subtask[];
  links: TodoLink[];
  comments: TodoComment[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建待办请求
 */
export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: TodoPriority;
  assignee?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  points?: number;
  tags?: string[];
  projectId?: string | null;
}

/**
 * 更新待办请求
 */
export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  assignee?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  points?: number;
  tags?: string[];
  projectId?: string | null;
}

/**
 * 待办筛选条件
 */
export interface TodoFilters {
  projectId?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  assignee?: string;
}

/**
 * 创建子任务请求
 */
export interface CreateSubtaskRequest {
  title: string;
  assignee?: string;
}

/**
 * 创建关联请求
 */
export interface CreateLinkRequest {
  targetId: string;
  linkType: LinkType;
}

/**
 * 待办 Repository 接口
 */
export interface TodoRepository extends Repository<Todo, string> {
  /**
   * 根据项目ID查找待办
   */
  findByProjectId(projectId: string, filters?: TodoFilters): Promise<Todo[]>;

  /**
   * 查找用户的所有待办
   */
  findByUserId(userId: string, filters?: TodoFilters): Promise<Todo[]>;

  /**
   * 更新状态
   */
  updateStatus(id: string, status: TodoStatus): Promise<Todo | null>;

  /**
   * 添加子任务
   */
  addSubtask(todoId: string, request: CreateSubtaskRequest): Promise<Todo | null>;

  /**
   * 更新子任务
   */
  updateSubtask(todoId: string, subtaskId: string, completed: boolean): Promise<Todo | null>;

  /**
   * 删除子任务
   */
  removeSubtask(todoId: string, subtaskId: string): Promise<Todo | null>;

  /**
   * 创建关联
   */
  createLink(sourceId: string, request: CreateLinkRequest): Promise<TodoLink | null>;

  /**
   * 删除关联
   */
  removeLink(linkId: string): Promise<boolean>;

  /**
   * 查找阻塞的待办
   */
  findBlocked(todoId: string): Promise<Todo[]>;

  /**
   * 查找阻塞者
   */
  findBlockers(todoId: string): Promise<Todo[]>;

  /**
   * 添加评论
   */
  addComment(todoId: string, userId: string, userNickname: string, content: string): Promise<Todo | null>;
}
