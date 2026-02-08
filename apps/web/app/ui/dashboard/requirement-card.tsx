'use client';

import { 
  EllipsisVerticalIcon,
  UserIcon,
  ClockIcon,
} from '@/app/ui/icons';
import { Requirement, RequirementStatus, RequirementPriority, RequirementType } from '@/app/lib/definitions';
import clsx from 'clsx';

interface RequirementCardProps {
  requirement: Requirement;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

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
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * 获取需求类型颜色样式
 */
const getTypeColor = (type: RequirementType) => {
  switch (type) {
    case 'feature':
      return 'bg-blue-100 text-blue-800';
    case 'enhancement':
      return 'bg-green-100 text-green-800';
    case 'bugfix':
      return 'bg-red-100 text-red-800';
    case 'research':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * 需求卡片组件
 */
export default function RequirementCard({ requirement, onClick, onEdit, onDelete }: RequirementCardProps) {
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-mono text-gray-500">{requirement.id}</span>
            <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getTypeColor(requirement.type))}>
              {requirement.type}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{requirement.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{requirement.description}</p>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(requirement.status))}>
              {requirement.status}
            </span>
            <span className={clsx('px-2 py-1 rounded-full text-xs font-medium border', getPriorityColor(requirement.priority))}>
              {requirement.priority}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {requirement.storyPoints} SP
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {requirement.points || 0} 积分
            </span>
          </div>
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: 显示操作菜单
          }}
        >
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 标签 */}
      {requirement.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {requirement.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 底部信息 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-1">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{requirement.assignee}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{requirement.dueDate}</span>
        </div>
      </div>
    </div>
  );
}
