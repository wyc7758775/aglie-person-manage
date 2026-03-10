/**
 * PostgreSQL Project Repository 实现
 */

import { sql } from '../../db';
import { PostgresRepository, generateUUID } from './base-postgres-repository';
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectFilters,
  ProjectType,
  ProjectStatus,
  ProjectPriority,
  ProjectIndicator,
  ProjectRepository,
} from '../interfaces/project-repository';

export class PostgresProjectRepository extends PostgresRepository<Project, string> implements ProjectRepository {
  constructor() {
    super(sql, 'projects', 'id');
  }

  protected mapToEntity(row: Record<string, unknown>): Project {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      name: row.name as string,
      description: (row.description as string) || '',
      type: row.type as ProjectType,
      status: row.status as ProjectStatus,
      priority: row.priority as ProjectPriority,
      goals: (row.goals as string[]) || [],
      tags: (row.tags as string[]) || [],
      indicators: (row.indicators as ProjectIndicator[]) || [],
      startDate: new Date(row.start_date as string),
      endDate: row.end_date ? new Date(row.end_date as string) : null,
      progress: (row.progress as number) || 0,
      points: (row.points as number) || 0,
      coverImageUrl: (row.cover_image_url as string) || null,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  protected mapToRow(entity: Partial<Project>): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    
    if (entity.userId !== undefined) row.user_id = entity.userId;
    if (entity.name !== undefined) row.name = entity.name;
    if (entity.description !== undefined) row.description = entity.description;
    if (entity.type !== undefined) row.type = entity.type;
    if (entity.status !== undefined) row.status = entity.status;
    if (entity.priority !== undefined) row.priority = entity.priority;
    if (entity.goals !== undefined) row.goals = JSON.stringify(entity.goals);
    if (entity.tags !== undefined) row.tags = JSON.stringify(entity.tags);
    if (entity.indicators !== undefined) row.indicators = JSON.stringify(entity.indicators);
    if (entity.startDate !== undefined) row.start_date = entity.startDate;
    if (entity.endDate !== undefined) row.end_date = entity.endDate;
    if (entity.progress !== undefined) row.progress = entity.progress;
    if (entity.points !== undefined) row.points = entity.points;
    if (entity.coverImageUrl !== undefined) row.cover_image_url = entity.coverImageUrl;
    if (entity.createdAt !== undefined) row.created_at = entity.createdAt;
    if (entity.updatedAt !== undefined) row.updated_at = entity.updatedAt;
    
    return row;
  }

  protected generateId(): string {
    return generateUUID();
  }

  async findByUserId(userId: string, filters?: ProjectFilters): Promise<Project[]> {
    let query = this.sql`SELECT * FROM projects WHERE user_id = ${userId}`;
    
    if (filters?.type) {
      query = this.sql`${query} AND type = ${filters.type}`;
    }
    if (filters?.status) {
      query = this.sql`${query} AND status = ${filters.status}`;
    }
    if (filters?.priority) {
      query = this.sql`${query} AND priority = ${filters.priority}`;
    }
    
    query = this.sql`${query} ORDER BY created_at DESC`;
    
    const rows = await query;
    return rows.map(row => this.mapToEntity(row as Record<string, unknown>));
  }

  async findByType(userId: string, type: ProjectType): Promise<Project[]> {
    return this.findByUserId(userId, { type });
  }

  async findByStatus(userId: string, status: ProjectStatus): Promise<Project[]> {
    return this.findByUserId(userId, { status });
  }

  async updateProgress(id: string, progress: number): Promise<Project | null> {
    const result = await this.sql`
      UPDATE projects
      SET progress = ${progress},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) return null;
    return this.mapToEntity(result[0] as Record<string, unknown>);
  }

  async updatePoints(id: string, points: number): Promise<Project | null> {
    const result = await this.sql`
      UPDATE projects
      SET points = ${points},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) return null;
    return this.mapToEntity(result[0] as Record<string, unknown>);
  }

  async addIndicator(
    projectId: string,
    indicator: Omit<ProjectIndicator, 'id'>
  ): Promise<Project | null> {
    const project = await this.findById(projectId);
    if (!project) return null;

    const newIndicator: ProjectIndicator = {
      id: crypto.randomUUID(),
      ...indicator,
    };

    const updatedIndicators = [...project.indicators, newIndicator];

    const result = await this.sql`
      UPDATE projects
      SET indicators = ${JSON.stringify(updatedIndicators)},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
      RETURNING *
    `;

    return this.mapToEntity(result[0] as Record<string, unknown>);
  }

  async updateIndicator(
    projectId: string,
    indicatorId: string,
    updates: Partial<ProjectIndicator>
  ): Promise<Project | null> {
    const project = await this.findById(projectId);
    if (!project) return null;

    const updatedIndicators = project.indicators.map(ind =>
      ind.id === indicatorId ? { ...ind, ...updates } : ind
    );

    const result = await this.sql`
      UPDATE projects
      SET indicators = ${JSON.stringify(updatedIndicators)},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
      RETURNING *
    `;

    return this.mapToEntity(result[0] as Record<string, unknown>);
  }

  async removeIndicator(projectId: string, indicatorId: string): Promise<Project | null> {
    const project = await this.findById(projectId);
    if (!project) return null;

    const updatedIndicators = project.indicators.filter(ind => ind.id !== indicatorId);

    const result = await this.sql`
      UPDATE projects
      SET indicators = ${JSON.stringify(updatedIndicators)},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
      RETURNING *
    `;

    return this.mapToEntity(result[0] as Record<string, unknown>);
  }

  /**
   * 创建项目（使用 CreateProjectRequest）
   */
  async createFromRequest(request: CreateProjectRequest): Promise<Project> {
    const id = this.generateId();
    const now = new Date();
    
    const result = await this.sql`
      INSERT INTO projects (
        id, user_id, name, description, type, status, priority,
        goals, tags, indicators, start_date, end_date, progress, points,
        cover_image_url, created_at, updated_at
      ) VALUES (
        ${id}, ${request.userId}, ${request.name}, ${request.description || ''},
        ${request.type}, ${request.status || 'normal'}, ${request.priority || 'medium'},
        ${JSON.stringify(request.goals || [])}, ${JSON.stringify(request.tags || [])},
        ${JSON.stringify(request.indicators || [])}, ${request.startDate}, ${request.endDate || null},
        ${request.progress || 0}, ${request.points || 0}, ${request.coverImageUrl || null},
        ${now}, ${now}
      )
      RETURNING *
    `;

    return this.mapToEntity(result[0] as Record<string, unknown>);
  }
}

// 单例实例
export const projectRepository = new PostgresProjectRepository();
