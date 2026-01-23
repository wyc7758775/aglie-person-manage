import { Requirement, RequirementStatus, RequirementPriority, RequirementType, RequirementCreateRequest, RequirementUpdateRequest } from './definitions';
import { requirements as initialRequirements } from './placeholder-data';

let requirements: Requirement[] = [...initialRequirements];

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
  };

  requirements.push(newRequirement);
  return newRequirement;
}

export async function updateRequirement(id: string, data: RequirementUpdateRequest): Promise<Requirement | null> {
  const index = requirements.findIndex(r => r.id === id);
  if (index === -1) {
    return null;
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
