'use client';

import { Requirement, RequirementStatus, RequirementPriority } from '@/app/lib/definitions';
import RequirementCard from './requirement-card';
import { KanbanGroupBy } from './view-switcher';

interface RequirementKanbanProps {
  requirements: Requirement[];
  groupBy: KanbanGroupBy;
  onRequirementClick?: (requirement: Requirement) => void;
}

// 状态列表
const STATUS_LIST: RequirementStatus[] = ['draft', 'review', 'approved', 'development', 'testing', 'completed', 'rejected'];

// 优先级列表
const PRIORITY_LIST: RequirementPriority[] = ['critical', 'high', 'medium', 'low'];

// 状态中文映射
const STATUS_LABELS: Record<RequirementStatus, string> = {
  draft: '草稿',
  review: '评审中',
  approved: '已批准',
  development: '开发中',
  testing: '测试中',
  completed: '已完成',
  rejected: '已拒绝',
};

// 优先级中文映射
const PRIORITY_LABELS: Record<RequirementPriority, string> = {
  critical: '紧急',
  high: '高',
  medium: '中',
  low: '低',
};

/**
 * 获取状态颜色样式
 */
const getStatusColor = (status: RequirementStatus) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'review':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'development':
      return 'bg-purple-100 text-purple-800';
    case 'testing':
      return 'bg-orange-100 text-orange-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * 获取优先级颜色样式
 */
const getPriorityColor = (priority: RequirementPriority) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * 需求看板视图组件
 */
export default function RequirementKanban({ requirements, groupBy, onRequirementClick }: RequirementKanbanProps) {
  // 按状态分组
  const groupByStatus = () => {
    const grouped: Record<RequirementStatus, Requirement[]> = {
      draft: [],
      review: [],
      approved: [],
      development: [],
      testing: [],
      completed: [],
      rejected: [],
    };

    requirements.forEach(req => {
      grouped[req.status].push(req);
    });

    return grouped;
  };

  // 按优先级分组
  const groupByPriority = () => {
    const grouped: Record<RequirementPriority, Requirement[]> = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };

    requirements.forEach(req => {
      grouped[req.priority].push(req);
    });

    return grouped;
  };

  const groupedData = groupBy === 'status' ? groupByStatus() : groupByPriority();
  const columns = groupBy === 'status' ? STATUS_LIST : PRIORITY_LIST;
  const getLabel = (key: string) => {
    if (groupBy === 'status') {
      return STATUS_LABELS[key as RequirementStatus];
    } else {
      return PRIORITY_LABELS[key as RequirementPriority];
    }
  };
  const getColor = (key: string) => {
    if (groupBy === 'status') {
      return getStatusColor(key as RequirementStatus);
    } else {
      return getPriorityColor(key as RequirementPriority);
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4 min-w-max">
        {columns.map((columnKey) => {
          const columnRequirements = groupedData[columnKey as keyof typeof groupedData] || [];
          
          return (
            <div
              key={columnKey}
              className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
            >
              {/* 列标题 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getColor(columnKey)}`}>
                    {getLabel(columnKey)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {columnRequirements.length}
                  </span>
                </div>
              </div>

              {/* 需求卡片列表 */}
              <div className="space-y-3">
                {columnRequirements.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    暂无需求
                  </div>
                ) : (
                  columnRequirements.map((requirement) => (
                    <RequirementCard
                      key={requirement.id}
                      requirement={requirement}
                      onClick={() => onRequirementClick?.(requirement)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
