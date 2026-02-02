import { Task, TaskStatus, TaskPriority, TaskCreateRequest, TaskUpdateRequest } from './definitions';
import { tasks as initialTasks } from './placeholder-data';

let tasks: Task[] = [...initialTasks];

export async function getTasks(filters?: {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}): Promise<Task[]> {
  let filteredTasks = [...tasks];

  if (filters) {
    if (filters.projectId) {
      filteredTasks = filteredTasks.filter(t => t.projectId === filters.projectId);
    }
    if (filters.status) {
      filteredTasks = filteredTasks.filter(t => t.status === filters.status);
    }
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === filters.priority);
    }
  }

  return filteredTasks;
}

export async function getTaskById(id: string): Promise<Task | null> {
  const task = tasks.find(t => t.id === id);
  return task || null;
}

export async function createTask(data: TaskCreateRequest): Promise<Task> {
  const newTask: Task = {
    id: `task-${String(Date.now()).slice(-6)}`,
    ...data,
  };

  tasks.push(newTask);
  return newTask;
}

export async function updateTask(id: string, data: TaskUpdateRequest): Promise<Task | null> {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return null;
  }

  tasks[index] = {
    ...tasks[index],
    ...data,
  };

  return tasks[index];
}

export async function deleteTask(id: string): Promise<boolean> {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  return true;
}
