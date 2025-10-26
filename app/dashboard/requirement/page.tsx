'use client';

import { 
  PlusIcon,
  EllipsisVerticalIcon,
  UserIcon,
  ClockIcon,
  FlagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import SectionContainer from '@/app/ui/dashboard/section-container';
import { useState } from 'react';

// 需求状态类型
type RequirementStatus = 'draft' | 'review' | 'approved' | 'development' | 'testing' | 'completed' | 'rejected';

// 需求优先级类型
type RequirementPriority = 'critical' | 'high' | 'medium' | 'low';

// 需求类型
type RequirementType = 'feature' | 'enhancement' | 'bugfix' | 'research';

interface Requirement {
  id: string;
  title: string;
  description: string;
  type: RequirementType;
  status: RequirementStatus;
  priority: RequirementPriority;
  assignee: string;
  reporter: string;
  createdDate: string;
  dueDate: string;
  storyPoints: number;
  tags: string[];
}

/**
 * 生成示例需求数据
 */
const generateSampleRequirements = (): Requirement[] => {
  return [
    {
      id: 'REQ-001',
      title: '用户登录功能优化',
      description: '改进用户登录体验，支持多种登录方式，增加记住密码功能',
      type: 'enhancement',
      status: 'development',
      priority: 'high',
      assignee: '张三',
      reporter: '产品经理',
      createdDate: '2024-01-15',
      dueDate: '2024-02-15',
      storyPoints: 8,
      tags: ['用户体验', '登录', '安全']
    },
    {
      id: 'REQ-002',
      title: '数据导出功能',
      description: '支持将用户数据导出为Excel和PDF格式，包含筛选和排序功能',
      type: 'feature',
      status: 'review',
      priority: 'medium',
      assignee: '李四',
      reporter: '客户',
      createdDate: '2024-01-20',
      dueDate: '2024-03-01',
      storyPoints: 13,
      tags: ['数据', '导出', 'Excel', 'PDF']
    },
    {
      id: 'REQ-003',
      title: '移动端响应式适配',
      description: '优化移动端显示效果，确保在各种屏幕尺寸下的良好体验',
      type: 'enhancement',
      status: 'approved',
      priority: 'high',
      assignee: '王五',
      reporter: 'UI设计师',
      createdDate: '2024-01-25',
      dueDate: '2024-02-28',
      storyPoints: 21,
      tags: ['移动端', '响应式', 'UI']
    },
    {
      id: 'REQ-004',
      title: '性能监控系统',
      description: '建立系统性能监控机制，实时监控系统运行状态和性能指标',
      type: 'feature',
      status: 'draft',
      priority: 'medium',
      assignee: '赵六',
      reporter: '运维团队',
      createdDate: '2024-02-01',
      dueDate: '2024-04-01',
      storyPoints: 34,
      tags: ['监控', '性能', '运维']
    },
    {
      id: 'REQ-005',
      title: '修复文件上传bug',
      description: '解决大文件上传时出现的超时和进度显示错误问题',
      type: 'bugfix',
      status: 'testing',
      priority: 'critical',
      assignee: '钱七',
      reporter: '测试团队',
      createdDate: '2024-02-05',
      dueDate: '2024-02-10',
      storyPoints: 5,
      tags: ['bug修复', '文件上传', '超时']
    },
    {
      id: 'REQ-006',
      title: '用户权限管理重构',
      description: '重新设计用户权限管理系统，支持更细粒度的权限控制',
      type: 'feature',
      status: 'completed',
      priority: 'high',
      assignee: '孙八',
      reporter: '安全团队',
      createdDate: '2023-12-01',
      dueDate: '2024-01-31',
      storyPoints: 55,
      tags: ['权限', '安全', '重构']
    }
  ];
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
function RequirementCard({ requirement }: { requirement: Requirement }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-mono text-gray-500">{requirement.id}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(requirement.type)}`}>
              {requirement.type}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{requirement.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{requirement.description}</p>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
              {requirement.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(requirement.priority)}`}>
              {requirement.priority}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {requirement.storyPoints} SP
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
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

/**
 * 需求管理页面
 */
export default function RequirementPage() {
  const [requirements] = useState<Requirement[]>(generateSampleRequirements());
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Draft', 'Review', 'Approved', 'Development', 'Testing', 'Completed'];

  const filteredRequirements = requirements.filter(requirement => {
    if (activeFilter === 'All') return true;
    return requirement.status === activeFilter.toLowerCase();
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Requirements</h1>
        <p className="mt-2 text-gray-600">
          管理产品需求，跟踪开发进度，确保项目按计划进行
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionContainer
          title="Requirements"
          badge={requirements.length}
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddClick={() => console.log('Add requirement')}
          addButtonText="Add a Requirement"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequirements.map((requirement) => (
              <RequirementCard key={requirement.id} requirement={requirement} />
            ))}
          </div>
          
          {filteredRequirements.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">没有找到符合条件的需求</p>
            </div>
          )}
        </SectionContainer>
      </div>
    </div>
  );
}
