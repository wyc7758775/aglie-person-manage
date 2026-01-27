import { Project, ProjectType, ProjectStatus, ProjectPriority, ProjectCreateRequest, ProjectUpdateRequest } from './definitions';
import { projects as initialProjects } from './placeholder-data';
import { updateUserTotalPoints } from './db-memory';

let projects: Project[] = [...initialProjects];

/**
 * 根据优先级自动计算项目积分
 */
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

export async function getProjects(filters?: {
  status?: ProjectStatus;
  type?: ProjectType;
  priority?: ProjectPriority;
}): Promise<Project[]> {
  let filteredProjects = [...projects];

  if (filters) {
    if (filters.status) {
      filteredProjects = filteredProjects.filter(p => p.status === filters.status);
    }
    if (filters.type) {
      filteredProjects = filteredProjects.filter(p => p.type === filters.type);
    }
    if (filters.priority) {
      filteredProjects = filteredProjects.filter(p => p.priority === filters.priority);
    }
  }

  return filteredProjects;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const project = projects.find(p => p.id === id);
  return project || null;
}

export async function createProject(data: ProjectCreateRequest): Promise<Project> {
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    ...data,
    progress: 0,
    points: data.points ?? 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projects.push(newProject);
  return newProject;
}

export async function updateProject(id: string, data: ProjectUpdateRequest, userId?: string): Promise<Project | null> {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }

  const oldProject = projects[index];
  const oldStatus = oldProject.status;
  const newStatus = data.status ?? oldStatus;

  // 如果状态从非 completed 变为 completed，累加积分
  if (oldStatus !== 'completed' && newStatus === 'completed' && userId) {
    const pointsToAdd = oldProject.points || 0;
    if (pointsToAdd > 0) {
      await updateUserTotalPoints(userId, pointsToAdd);
    }
  }

  projects[index] = {
    ...projects[index],
    ...data,
    updatedAt: new Date().toISOString()
  };

  return projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return false;
  }

  projects.splice(index, 1);
  return true;
}
