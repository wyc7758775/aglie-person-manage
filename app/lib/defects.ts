import { Defect, DefectStatus, DefectSeverity, DefectType, DefectCreateRequest, DefectUpdateRequest } from './definitions';
import { defects as initialDefects } from './placeholder-data';

let defects: Defect[] = [...initialDefects];

export async function getDefects(filters?: {
  projectId?: string;
  status?: DefectStatus;
  severity?: DefectSeverity;
  type?: DefectType;
}): Promise<Defect[]> {
  let filteredDefects = [...defects];

  if (filters) {
    if (filters.projectId) {
      filteredDefects = filteredDefects.filter(d => d.projectId === filters.projectId);
    }
    if (filters.status) {
      filteredDefects = filteredDefects.filter(d => d.status === filters.status);
    }
    if (filters.severity) {
      filteredDefects = filteredDefects.filter(d => d.severity === filters.severity);
    }
    if (filters.type) {
      filteredDefects = filteredDefects.filter(d => d.type === filters.type);
    }
  }

  return filteredDefects;
}

export async function getDefectById(id: string): Promise<Defect | null> {
  const defect = defects.find(d => d.id === id);
  return defect || null;
}

export async function createDefect(data: DefectCreateRequest): Promise<Defect> {
  const newDefect: Defect = {
    id: `DEF-${String(Date.now()).slice(-6)}`,
    ...data,
  };

  defects.push(newDefect);
  return newDefect;
}

export async function updateDefect(id: string, data: DefectUpdateRequest): Promise<Defect | null> {
  const index = defects.findIndex(d => d.id === id);
  if (index === -1) {
    return null;
  }

  defects[index] = {
    ...defects[index],
    ...data,
  };

  return defects[index];
}

export async function deleteDefect(id: string): Promise<boolean> {
  const index = defects.findIndex(d => d.id === id);
  if (index === -1) {
    return false;
  }

  defects.splice(index, 1);
  return true;
}
