import { Task, TaskStatus, TaskPriority, TaskType, TaskCreateRequest, TaskUpdateRequest } from './definitions';

export async function getTasks(filters?: {
  projectId?: string;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}): Promise<Task[]> {
  const db = await import('./db');
  return db.getTasks(filters);
}

export async function getTaskById(id: string): Promise<Task | null> {
  const db = await import('./db');
  return db.getTaskById(id);
}

export async function createTask(data: TaskCreateRequest): Promise<Task> {
  const db = await import('./db');
  return db.createTask(data);
}

export async function updateTask(id: string, data: TaskUpdateRequest): Promise<Task | null> {
  const db = await import('./db');
  return db.updateTask(id, data);
}

export async function deleteTask(id: string): Promise<boolean> {
  const db = await import('./db');
  return db.deleteTask(id);
}

export async function completeTask(id: string): Promise<Task | null> {
  const db = await import('./db');
  return db.completeTask(id);
}
