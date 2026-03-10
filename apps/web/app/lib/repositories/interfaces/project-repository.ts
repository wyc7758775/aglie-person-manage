/**
 * Project Repository 接口
 * 项目数据访问抽象
 */

import { Repository, FilterOptions } from './base-repository';

/**
 * 项目类型
 */
export type ProjectType = 'sprint-project' | 'slow-burn';

/**
 * 项目状态
 */
export type ProjectStatus = 'normal' | 'at_risk' | 'out_of_control';

/**
 * 项目优先级
 */
export type ProjectPriority = 'high' | 'medium' | 'low';

/**
 * 项目指标
 */
export interface ProjectIndicator {
  id: string;
  name: string;
  value: number;
  target: number;
  weight: number;
}

/**
 * 项目实体
 */
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  goals: string[];
  tags: string[];
  indicators: ProjectIndicator[];
  startDate: Date;
  endDate: Date | null;
  progress: number;
  points: number;
  coverImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建项目请求
 */
export interface CreateProjectRequest {
  userId: string;
  name: string;
  description: string;
  type: ProjectType;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  goals?: string[];
  tags?: string[];
  indicators?: ProjectIndicator[];
  startDate: Date;
  endDate?: Date | null;
  progress?: number;
  points?: number;
  coverImageUrl?: string | null;
}

/**
 * 更新项目请求
 */
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  type?: ProjectType;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  goals?: string[];
  tags?: string[];
  indicators?: ProjectIndicator[];
  startDate?: Date;
  endDate?: Date | null;
  progress?: number;
  points?: number;
  coverImageUrl?: string | null;
}

/**
 * 项目筛选条件
 */
export interface ProjectFilters {
  userId?: string;
  type?: ProjectType;
  status?: ProjectStatus;
  priority?: ProjectPriority;
}

/**
 * 项目 Repository 接口
 */
export interface ProjectRepository extends Repository<Project, string> {
  /**
   * 根据用户ID查找项目
   */
  findByUserId(userId: string, filters?: ProjectFilters): Promise<Project[]>;

  /**
   * 按类型筛选
   */
  findByType(userId: string, type: ProjectType): Promise<Project[]>;

  /**
   * 按状态筛选
   */
  findByStatus(userId: string, status: ProjectStatus): Promise<Project[]>;

  /**
   * 更新项目进度
   */
  updateProgress(id: string, progress: number): Promise<Project | null>;

  /**
   * 更新项目积分
   */
  updatePoints(id: string, points: number): Promise<Project | null>;

  /**
   * 添加项目指标
   */
  addIndicator(projectId: string, indicator: Omit<ProjectIndicator, 'id'>): Promise<Project | null>;

  /**
   * 更新项目指标
   */
  updateIndicator(projectId: string, indicatorId: string, updates: Partial<ProjectIndicator>): Promise<Project | null>;

  /**
   * 删除项目指标
   */
  removeIndicator(projectId: string, indicatorId: string): Promise<Project | null>;
}
