import { Defect, DefectStatus, DefectSeverity, DefectType, DefectCreateRequest, DefectUpdateRequest } from './definitions';

export async function getDefects(filters?: {
  projectId?: string;
  status?: DefectStatus;
  severity?: DefectSeverity;
  type?: DefectType;
}): Promise<Defect[]> {
  const db = await import('./db');
  return db.getDefects(filters);
}

export async function getDefectById(id: string): Promise<Defect | null> {
  const db = await import('./db');
  return db.getDefectById(id);
}

export async function createDefect(data: DefectCreateRequest): Promise<Defect> {
  const db = await import('./db');
  return db.createDefect(data);
}

export async function updateDefect(id: string, data: DefectUpdateRequest): Promise<Defect | null> {
  const db = await import('./db');
  return db.updateDefect(id, data);
}

export async function deleteDefect(id: string): Promise<boolean> {
  const db = await import('./db');
  return db.deleteDefect(id);
}
