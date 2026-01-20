import { Project, ProjectType, ProjectStatus, ProjectPriority, ProjectCreateRequest, ProjectUpdateRequest } from './definitions';
import { projects as initialProjects } from './placeholder-data';

let projects: Project[] = [...initialProjects];

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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  projects.push(newProject);
  return newProject;
}

export async function updateProject(id: string, data: ProjectUpdateRequest): Promise<Project | null> {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
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
