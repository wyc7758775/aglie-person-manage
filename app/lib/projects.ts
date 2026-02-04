import { Project, ProjectType, ProjectStatus, ProjectPriority, ProjectCreateRequest, ProjectUpdateRequest } from './definitions';
import { projects as initialProjects } from './placeholder-data';
import { getShouldUseMemoryBackend, forceMemoryBackend, isConnectionError } from './db-backend';

let projects: Project[] = [...initialProjects];

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

function getProjectsMemory(
  filters?: { status?: ProjectStatus; type?: ProjectType; priority?: ProjectPriority }
): Project[] {
  let list = [...projects];
  if (filters?.status) list = list.filter(p => p.status === filters.status);
  if (filters?.type) list = list.filter(p => p.type === filters.type);
  if (filters?.priority) list = list.filter(p => p.priority === filters.priority);
  return list;
}

/**
 * 获取项目列表。PostgreSQL 不可用时自动回退到内存。
 */
export async function getProjects(
  filters?: { status?: ProjectStatus; type?: ProjectType; priority?: ProjectPriority },
  userId?: string
): Promise<Project[]> {
  if (process.env.POSTGRES_URL && userId && !getShouldUseMemoryBackend()) {
    try {
      const db = await import('./db');
      return db.getProjects(userId, filters);
    } catch (error) {
      if (isConnectionError(error)) {
        forceMemoryBackend();
        return getProjectsMemory(filters);
      }
      throw error;
    }
  }
  return getProjectsMemory(filters);
}

/**
 * 获取单个项目。PostgreSQL 不可用时自动回退到内存。
 */
export async function getProjectById(id: string, userId?: string): Promise<Project | null> {
  if (process.env.POSTGRES_URL && userId && !getShouldUseMemoryBackend()) {
    try {
      const db = await import('./db');
      return db.getProjectById(id, userId);
    } catch (error) {
      if (isConnectionError(error)) {
        forceMemoryBackend();
      } else {
        throw error;
      }
    }
  }
  return projects.find(p => p.id === id) ?? null;
}

/**
 * 创建项目。PostgreSQL 不可用时自动回退到内存。
 */
export async function createProject(data: ProjectCreateRequest, userId?: string): Promise<Project> {
  if (process.env.POSTGRES_URL && userId && !getShouldUseMemoryBackend()) {
    try {
      const db = await import('./db');
      return db.createProject(data, userId);
    } catch (error) {
      if (isConnectionError(error)) {
        forceMemoryBackend();
      } else {
        throw error;
      }
    }
  }
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    ...data,
    progress: 0,
    points: data.points ?? 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  projects.push(newProject);
  return newProject;
}

/**
 * 更新项目。PostgreSQL 不可用时自动回退到内存。
 */
export async function updateProject(id: string, data: ProjectUpdateRequest, userId?: string): Promise<Project | null> {
  if (process.env.POSTGRES_URL && userId && !getShouldUseMemoryBackend()) {
    try {
      const db = await import('./db');
      return db.updateProject(id, data, userId);
    } catch (error) {
      if (isConnectionError(error)) {
        forceMemoryBackend();
      } else {
        throw error;
      }
    }
  }
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  projects[index] = { ...projects[index], ...data, updatedAt: new Date().toISOString() };
  return projects[index];
}

/**
 * 删除项目。PostgreSQL 不可用时自动回退到内存。
 */
export async function deleteProject(id: string, userId?: string): Promise<boolean> {
  if (process.env.POSTGRES_URL && userId && !getShouldUseMemoryBackend()) {
    try {
      const db = await import('./db');
      return db.deleteProject(id, userId);
    } catch (error) {
      if (isConnectionError(error)) {
        forceMemoryBackend();
      } else {
        throw error;
      }
    }
  }
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return false;
  projects.splice(index, 1);
  return true;
}
