/**
 * Requirement Repository 接口
 * 需求数据访问抽象
 */

import { Repository } from './base-repository';

/**
 * 需求状态
 */
export type RequirementStatus = 'draft' | 'review' | 'approved' | 'development' | 'testing' | 'completed' | 'rejected';

/**
 * 需求优先级
 */
export type RequirementPriority = 'critical' | 'high' | 'medium' | 'low';

/**
 * 需求类型
 */
export type RequirementType = 'feature' | 'enhancement' | 'bugfix' | 'research';

/**
 * 需求评论
 */
export interface RequirementComment {
  id: string;
  userId: string;
  userNickname: string;
  content: string;
  createdAt: Date;
}

/**
 * 需求实体
 */
export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: RequirementType;
  status: RequirementStatus;
  priority: RequirementPriority;
  assignee: string | null;
  reporter: string;
  createdDate: Date;
  dueDate: Date;
  storyPoints: number;
  points: number;
  tags: string[];
  parentId: string | null;
  comments: RequirementComment[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建需求请求
 */
export interface CreateRequirementRequest {
  projectId: string;
  title: string;
  description?: string;
  type: RequirementType;
  priority?: RequirementPriority;
  assignee?: string | null;
  reporter: string;
  dueDate?: Date;
  storyPoints?: number;
  points?: number;
  tags?: string[];
  parentId?: string | null;
}

/**
 * 更新需求请求
 */
export interface UpdateRequirementRequest {
  title?: string;
  description?: string;
  type?: RequirementType;
  status?: RequirementStatus;
  priority?: RequirementPriority;
  assignee?: string | null;
  dueDate?: Date;
  storyPoints?: number;
  points?: number;
  tags?: string[];
}

/**
 * 需求筛选条件
 */
export interface RequirementFilters {
  projectId?: string;
  status?: RequirementStatus;
  priority?: RequirementPriority;
  type?: RequirementType;
  assignee?: string;
}

/**
 * 需求 Repository 接口
 */
export interface RequirementRepository extends Repository<Requirement, string> {
  /**
   * 根据项目ID查找需求
   */
  findByProjectId(projectId: string, filters?: RequirementFilters): Promise<Requirement[]>;

  /**
   * 查找子需求
   */
  findChildren(parentId: string): Promise<Requirement[]>;

  /**
   * 查找根需求（无父需求）
   */
  findRoots(projectId: string): Promise<Requirement[]>;

  /**
   * 更新需求状态
   */
  updateStatus(id: string, status: RequirementStatus): Promise<Requirement | null>;

  /**
   * 添加评论
   */
  addComment(requirementId: string, userId: string, userNickname: string, content: string): Promise<Requirement | null>;

  /**
   * 删除评论
   */
  removeComment(requirementId: string, commentId: string): Promise<Requirement | null>;
}
