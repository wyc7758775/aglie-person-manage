/**
 * Task Repository 接口
 * 任务数据访问抽象
 */

import { Repository } from './base-repository';

/**
 * 任务类型
 */
export type TaskType = 'habit' | 'daily' | 'task';

/**
 * 任务状态
 */
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

/**
 * 任务优先级
 */
export type TaskPriority = 'p0' | 'p1' | 'p2' | 'p3';

/**
 * 任务难度
 */
export type TaskDifficulty = 'easy' | 'medium' | 'hard';

/**
 * 习惯方向
 */
export type TaskDirection = 'positive' | 'negative';

/**
 * 重置周期
 */
export type ResetPeriod = 'daily' | 'weekly' | 'monthly';

/**
 * 频率类型
 */
export type TaskFrequency = 'daily' | 'weekdays' | 'weekly' | 'custom';

/**
 * 子任务
 */
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

/**
 * 任务评论
 */
export interface TaskComment {
  id: string;
  userId: string;
  userNickname: string;
  content: string;
  createdAt: Date;
}

/**
 * 历史记录
 */
export interface HistoryLog {
  id: string;
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'status_changed';
  description: string;
  userId?: string;
  userNickname?: string;
  timestamp: Date;
}

/**
 * 任务实体
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  projectId: string | null;
  assignee: string | null;
  points: number;
  goldReward: number;
  goldPenalty: number;
  // 习惯特有
  streak: number;
  totalCount: number;
  currentCount: number;
  targetCount: number;
  direction: TaskDirection;
  resetPeriod: ResetPeriod;
  // 频率
  frequency: TaskFrequency;
  repeatDays: number[]; // 0=周日, 1=周一...
  // 日期
  startDate: Date | null;
  dueDate: Date | null;
  // 关联数据
  tags: string[];
  subTasks: SubTask[];
  comments: TaskComment[];
  history: HistoryLog[];
  // 时间戳
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建任务请求
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  type: TaskType;
  priority?: TaskPriority;
  difficulty?: TaskDifficulty;
  projectId?: string | null;
  assignee?: string | null;
  points?: number;
  goldReward?: number;
  goldPenalty?: number;
  // 习惯特有
  streak?: number;
  totalCount?: number;
  currentCount?: number;
  targetCount?: number;
  direction?: TaskDirection;
  resetPeriod?: ResetPeriod;
  // 频率
  frequency?: TaskFrequency;
  repeatDays?: number[];
  // 日期
  startDate?: Date | null;
  dueDate?: Date | null;
  // 标签
  tags?: string[];
}

/**
 * 更新任务请求
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  difficulty?: TaskDifficulty;
  projectId?: string | null;
  assignee?: string | null;
  points?: number;
  goldReward?: number;
  goldPenalty?: number;
  streak?: number;
  totalCount?: number;
  currentCount?: number;
  targetCount?: number;
  direction?: TaskDirection;
  resetPeriod?: ResetPeriod;
  frequency?: TaskFrequency;
  repeatDays?: number[];
  startDate?: Date | null;
  dueDate?: Date | null;
  tags?: string[];
}

/**
 * 任务筛选条件
 */
export interface TaskFilters {
  projectId?: string;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
}

/**
 * 任务完成结果
 */
export interface TaskCompletionResult {
  task: Task;
  pointsEarned: number;
  streakUpdated: boolean;
  newStreak?: number;
}

/**
 * 任务 Repository 接口
 */
export interface TaskRepository extends Repository<Task, string> {
  /**
   * 根据项目ID查找任务
   */
  findByProjectId(projectId: string, filters?: TaskFilters): Promise<Task[]>;

  /**
   * 查找用户的所有任务
   */
  findByUserId(userId: string, filters?: TaskFilters): Promise<Task[]>;

  /**
   * 完成任务
   */
  completeTask(taskId: string, userId: string): Promise<TaskCompletionResult | null>;

  /**
   * 取消完成任务
   */
  uncompleteTask(taskId: string): Promise<Task | null>;

  /**
   * 添加子任务
   */
  addSubTask(taskId: string, title: string): Promise<Task | null>;

  /**
   * 更新子任务状态
   */
  updateSubTask(taskId: string, subTaskId: string, completed: boolean): Promise<Task | null>;

  /**
   * 删除子任务
   */
  removeSubTask(taskId: string, subTaskId: string): Promise<Task | null>;

  /**
   * 添加评论
   */
  addComment(taskId: string, userId: string, userNickname: string, content: string): Promise<Task | null>;

  /**
   * 重置每日习惯计数
   */
  resetDailyCounts(): Promise<number>;
}
