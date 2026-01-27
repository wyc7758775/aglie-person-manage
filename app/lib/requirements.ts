import { Requirement, RequirementStatus, RequirementPriority, RequirementType, RequirementCreateRequest, RequirementUpdateRequest } from './definitions';
import { requirements as initialRequirements } from './placeholder-data';
import { updateUserTotalPoints } from './db-memory';

let requirements: Requirement[] = [...initialRequirements];

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
  status?: RequirementStatus;
  priority?: RequirementPriority;
  type?: RequirementType;
}): Promise<Requirement[]> {
  let filteredRequirements = [...requirements];

  if (filters) {
    if (filters.status) {
      filteredRequirements = filteredRequirements.filter(r => r.status === filters.status);
    }
    if (filters.priority) {
      filteredRequirements = filteredRequirements.filter(r => r.priority === filters.priority);
    }
    if (filters.type) {
      filteredRequirements = filteredRequirements.filter(r => r.type === filters.type);
    }
  }

  return filteredRequirements;
}

export async function getRequirementById(id: string): Promise<Requirement | null> {
  const requirement = requirements.find(r => r.id === id);
  return requirement || null;
}

export async function createRequirement(data: RequirementCreateRequest): Promise<Requirement> {
  const newRequirement: Requirement = {
    id: `REQ-${String(Date.now()).slice(-6)}`,
    ...data,
    points: data.points ?? 0,
  };

  requirements.push(newRequirement);
  return newRequirement;
}

export async function updateRequirement(id: string, data: RequirementUpdateRequest, userId?: string): Promise<Requirement | null> {
  const index = requirements.findIndex(r => r.id === id);
  if (index === -1) {
    return null;
  }

  const oldRequirement = requirements[index];
  const oldStatus = oldRequirement.status;
  const newStatus = data.status ?? oldStatus;

  // 如果状态从非 completed 变为 completed，累加积分
  if (oldStatus !== 'completed' && newStatus === 'completed' && userId) {
    const pointsToAdd = oldRequirement.points || 0;
    if (pointsToAdd > 0) {
      await updateUserTotalPoints(userId, pointsToAdd);
    }
  }

  requirements[index] = {
    ...requirements[index],
    ...data,
  };

  return requirements[index];
}

export async function deleteRequirement(id: string): Promise<boolean> {
  const index = requirements.findIndex(r => r.id === id);
  if (index === -1) {
    return false;
  }

  requirements.splice(index, 1);
  return true;
}
