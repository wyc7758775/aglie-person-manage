import { Task, TaskStatus, TaskPriority, TaskCreateRequest, TaskUpdateRequest } from './definitions';

export async function getTasks(filters?: {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
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
