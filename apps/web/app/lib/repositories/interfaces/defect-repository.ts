/**
 * Defect Repository 接口
 * 缺陷数据访问抽象
 */

import { Repository } from './base-repository';

/**
 * 缺陷状态
 */
export type DefectStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'reopened';

/**
 * 缺陷严重程度
 */
export type DefectSeverity = 'critical' | 'high' | 'medium' | 'low';

/**
 * 缺陷类型
 */
export type DefectType = 'bug' | 'performance' | 'ui' | 'security' | 'compatibility';

/**
 * 缺陷实体
 */
export interface Defect {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: DefectStatus;
  severity: DefectSeverity;
  type: DefectType;
  assignee: string | null;
  reporter: string;
  createdDate: Date;
  dueDate: Date;
  environment: string;
  steps: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建缺陷请求
 */
export interface CreateDefectRequest {
  projectId: string;
  title: string;
  description: string;
  severity: DefectSeverity;
  type: DefectType;
  assignee?: string | null;
  reporter: string;
  dueDate?: Date;
  environment?: string;
  steps?: string[];
}

/**
 * 更新缺陷请求
 */
export interface UpdateDefectRequest {
  title?: string;
  description?: string;
  status?: DefectStatus;
  severity?: DefectSeverity;
  type?: DefectType;
  assignee?: string | null;
  dueDate?: Date;
  environment?: string;
  steps?: string[];
}

/**
 * 缺陷筛选条件
 */
export interface DefectFilters {
  projectId?: string;
  status?: DefectStatus;
  severity?: DefectSeverity;
  type?: DefectType;
  assignee?: string;
}

/**
 * 缺陷统计
 */
export interface DefectStats {
  total: number;
  byStatus: Record<DefectStatus, number>;
  bySeverity: Record<DefectSeverity, number>;
  closedRate: number; // 关闭率
}

/**
 * 缺陷 Repository 接口
 */
export interface DefectRepository extends Repository<Defect, string> {
  /**
   * 根据项目ID查找缺陷
   */
  findByProjectId(projectId: string, filters?: DefectFilters): Promise<Defect[]>;

  /**
   * 更新缺陷状态
   */
  updateStatus(id: string, status: DefectStatus): Promise<Defect | null>;

  /**
   * 分配缺陷给某人
   */
  assign(id: string, assignee: string): Promise<Defect | null>;

  /**
   * 获取缺陷统计
   */
  getStats(projectId: string): Promise<DefectStats>;
}
