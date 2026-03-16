import { Requirement as BaseRequirement } from '@/app/lib/definitions';
import { RequirementStatus, RequirementPriority } from '@/app/ui/dashboard/requirement-badges';

export interface ExtendedRequirement {
  id: string;
  workItemId: string;
  name: string;
  status: RequirementStatus;
  priority: RequirementPriority;
  assignee?: {
    nickname: string;
    avatar?: string;
  };
  reporter?: {
    nickname: string;
    avatar?: string;
  };
  deadline?: string;
  points: number;
  parentId?: string | null;
  subRequirements?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const statusMap: Record<string, RequirementStatus> = {
  draft: 'todo',
  review: 'in_progress',
  approved: 'in_progress',
  development: 'in_progress',
  testing: 'in_progress',
  completed: 'done',
  rejected: 'cancelled',
};

const priorityMap: Record<string, RequirementPriority> = {
  critical: 'p0',
  high: 'p1',
  medium: 'p2',
  low: 'p3',
};

// 将日期转换为 YYYY-MM-DD 格式
function formatDateForInput(dateValue: string | undefined): string | undefined {
  if (!dateValue) return undefined;
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString().split('T')[0];
  } catch {
    return undefined;
  }
}

export function convertToExtendedRequirement(req: BaseRequirement): ExtendedRequirement {
  return {
    id: req.id,
    workItemId: `REQ-${req.id.slice(-3).toUpperCase()}`,
    name: req.title,
    status: statusMap[req.status] || 'todo',
    priority: priorityMap[req.priority] || 'p2',
    assignee: req.assignee ? { nickname: req.assignee, avatar: undefined } : undefined,
    reporter: req.reporter ? { nickname: req.reporter, avatar: undefined } : undefined,
    deadline: formatDateForInput(req.dueDate),
    points: req.points || 0,
    parentId: req.parentId || null,
    subRequirements: [],
    description: req.description,
    createdAt: req.createdAt,
    updatedAt: req.updatedAt,
  };
}

export const statusFilterOptions = [
  { key: 'all', label: '全部状态' },
  { key: 'todo', label: '待办' },
  { key: 'in_progress', label: '进行中' },
  { key: 'done', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
  { key: 'accepted', label: '已验收' },
  { key: 'closed', label: '已关闭' },
];

export const priorityFilterOptions = [
  { key: 'all', label: '全部优先级' },
  { key: 'p0', label: 'P0' },
  { key: 'p1', label: 'P1' },
  { key: 'p2', label: 'P2' },
  { key: 'p3', label: 'P3' },
  { key: 'p4', label: 'P4' },
];

/**
 * 生成子需求工作项ID
 * 规则：父需求ID + "-" + 序号
 * 例如：REQ-001 -> REQ-001-1, REQ-001-2
 * @param parentWorkItemId 父需求工作项ID
 * @param existingIds 现有子需求工作项ID列表
 * @returns 新的子需求工作项ID
 */
export function generateSubRequirementId(parentWorkItemId: string, existingIds: string[]): string {
  let index = 1;
  let newId = `${parentWorkItemId}-${index}`;

  while (existingIds.includes(newId)) {
    index++;
    newId = `${parentWorkItemId}-${index}`;
  }

  return newId;
}

/**
 * 根据优先级获取默认积分
 */
export function getDefaultPointsByPriority(priority: RequirementPriority): number {
  switch (priority) {
    case 'p0':
      return 20;
    case 'p1':
      return 15;
    case 'p2':
      return 10;
    case 'p3':
      return 5;
    case 'p4':
      return 2;
    default:
      return 10;
  }
}
