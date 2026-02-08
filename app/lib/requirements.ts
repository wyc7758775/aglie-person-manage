import {
  Requirement,
  RequirementStatus,
  RequirementPriority,
  RequirementType,
  RequirementCreateRequest,
  RequirementUpdateRequest,
} from './definitions';

/**
 * 根据优先级自动计算需求积分
 */
export function calculateRequirementPoints(priority: RequirementPriority): number {
  switch (priority) {
    case 'critical':
      return 15;
    case 'high':
      return 10;
    case 'medium':
      return 5;
    case 'low':
      return 2;
    default:
      return 0;
  }
}

export async function getRequirements(filters?: {
  projectId?: string;
  status?: RequirementStatus;
  priority?: RequirementPriority;
  type?: RequirementType;
}): Promise<Requirement[]> {
  const db = await import('./db');
  return db.getRequirements(filters);
}

export async function getRequirementById(id: string): Promise<Requirement | null> {
  const db = await import('./db');
  return db.getRequirementById(id);
}

export async function createRequirement(data: RequirementCreateRequest): Promise<Requirement> {
  const db = await import('./db');
  return db.createRequirement(data);
}

export async function updateRequirement(
  id: string,
  data: RequirementUpdateRequest,
  userId?: string
): Promise<Requirement | null> {
  const db = await import('./db');
  const oldRequirement = await db.getRequirementById(id);
  if (!oldRequirement) return null;

  const oldStatus = oldRequirement.status;
  const newStatus = data.status ?? oldStatus;

  const updated = await db.updateRequirement(id, data);
  if (!updated) return null;

  if (oldStatus !== 'completed' && newStatus === 'completed' && userId) {
    const pointsToAdd = oldRequirement.points || 0;
    if (pointsToAdd > 0) {
      await db.updateUserTotalPoints(userId, pointsToAdd);
    }
  }

  return updated;
}

export async function deleteRequirement(id: string): Promise<boolean> {
  const db = await import('./db');
  return db.deleteRequirement(id);
}
