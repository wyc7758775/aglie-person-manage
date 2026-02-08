import { Project, ProjectType, ProjectStatus, ProjectPriority, ProjectCreateRequest, ProjectUpdateRequest } from './definitions';

export function calculateProjectPoints(priority: ProjectPriority): number {
  switch (priority) {
    case 'high':
      return 20;
    case 'medium':
      return 10;
    case 'low':
      return 5;
    default:
      return 0;
  }
}

/**
 * 获取项目列表（仅 PostgreSQL，需传入 userId）
 */
export async function getProjects(
  filters?: { status?: ProjectStatus; type?: ProjectType; priority?: ProjectPriority },
  userId?: string
): Promise<Project[]> {
  if (!userId) return [];
  const db = await import('./db');
  return db.getProjects(userId, filters);
}

/**
 * 获取单个项目（仅 PostgreSQL，需传入 userId）
 */
export async function getProjectById(id: string, userId?: string): Promise<Project | null> {
  if (!userId) return null;
  const db = await import('./db');
  return db.getProjectById(id, userId);
}

/**
 * 创建项目（仅 PostgreSQL，需传入 userId）
 */
export async function createProject(data: ProjectCreateRequest, userId?: string): Promise<Project> {
  if (!userId) throw new Error('创建项目需要已登录用户');
  const db = await import('./db');
  return db.createProject(data, userId);
}

/**
 * 更新项目（仅 PostgreSQL，需传入 userId）
 */
export async function updateProject(id: string, data: ProjectUpdateRequest, userId?: string): Promise<Project | null> {
  if (!userId) return null;
  const db = await import('./db');
  return db.updateProject(id, data, userId);
}

/**
 * 删除项目（仅 PostgreSQL，需传入 userId）
 */
export async function deleteProject(id: string, userId?: string): Promise<boolean> {
  if (!userId) return false;
  const db = await import('./db');
  return db.deleteProject(id, userId);
}
