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

export async function createRequirement(data: RequirementCreateRequest, userId?: string): Promise<Requirement> {
  try {
    const db = await import('./db');
    const requirement = await db.createRequirement(data);
    
    // 记录创建操作日志
    if (userId) {
      try {
        await db.createOperationLog({
          entityType: 'requirement',
          entityId: requirement.id,
          userId,
          action: 'create',
          fieldName: undefined,
          oldValue: undefined,
          newValue: undefined,
        });
      } catch (logError) {
        console.error('记录操作日志失败:', logError);
        // 日志记录失败不应影响主流程
      }
    }
    
    return requirement;
  } catch (error) {
    console.error('createRequirement 错误:', error);
    throw error;
  }
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

  // 记录操作日志
  if (userId) {
    // 记录状态变更
    if (data.status && data.status !== oldStatus) {
      await db.createOperationLog({
        entityType: 'requirement',
        entityId: id,
        userId,
        action: 'status_change',
        fieldName: 'status',
        oldValue: oldStatus,
        newValue: data.status,
      });
    }
    // 记录其他字段变更
    const fieldsToLog = ['title', 'description', 'priority', 'assignee'] as const;
    for (const field of fieldsToLog) {
      const oldValue = oldRequirement[field];
      const newValue = data[field];
      if (newValue !== undefined && newValue !== oldValue) {
        await db.createOperationLog({
          entityType: 'requirement',
          entityId: id,
          userId,
          action: 'update',
          fieldName: field,
          oldValue: String(oldValue || ''),
          newValue: String(newValue || ''),
        });
      }
    }
  }

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
