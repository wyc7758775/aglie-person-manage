'use client';

import { 
  PlusIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import SectionContainer from '@/app/ui/dashboard/section-container';
import { useState } from 'react';

// 项目状态类型
type ProjectStatus = 'active' | 'completed' | 'paused' | 'planning';

// 项目优先级类型
type ProjectPriority = 'high' | 'medium' | 'low';

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  startDate: string;
  endDate: string;
  teamMembers: number;
  tasksCount: number;
  completedTasks: number;
}

/**
 * 生成示例项目数据
 */
const generateSampleProjects = (): Project[] => {
  return [
    {
      id: 'proj-1',
      name: '敏捷人员管理系统',
      description: '基于Next.js的现代化人员管理平台',
      status: 'active',
      priority: 'high',
      progress: 75,
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      teamMembers: 5,
      tasksCount: 24,
      completedTasks: 18
    },
    {
      id: 'proj-2',
      name: '移动端应用开发',
      description: 'React Native跨平台移动应用',
      status: 'active',
      priority: 'medium',
      progress: 45,
      startDate: '2024-02-01',
      endDate: '2024-05-15',
      teamMembers: 3,
      tasksCount: 16,
      completedTasks: 7
    },
    {
      id: 'proj-3',
      name: 'API接口重构',
      description: '后端服务架构优化和性能提升',
      status: 'planning',
      priority: 'medium',
      progress: 10,
      startDate: '2024-03-01',
      endDate: '2024-04-30',
      teamMembers: 2,
      tasksCount: 12,
      completedTasks: 1
    },
    {
      id: 'proj-4',
      name: '数据分析平台',
      description: '企业级数据可视化和分析工具',
      status: 'completed',
      priority: 'high',
      progress: 100,
      startDate: '2023-10-01',
      endDate: '2024-01-15',
      teamMembers: 4,
      tasksCount: 32,
      completedTasks: 32
    },
    {
      id: 'proj-5',
      name: '用户体验优化',
      description: 'UI/UX设计改进和用户反馈收集',
      status: 'paused',
      priority: 'low',
      progress: 30,
      startDate: '2024-01-20',
      endDate: '2024-06-30',
      teamMembers: 2,
      tasksCount: 8,
      completedTasks: 2
    }
  ];
};

/**
 * 获取状态颜色样式
 */
const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'planning':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * 获取优先级颜色样式
 */
const getPriorityColor = (priority: ProjectPriority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-orange-100 text-orange-800';
    case 'low':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * 项目卡片组件
 */
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>进度</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* 项目统计 */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-1">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{project.endDate}</span>
        </div>
        <div className="flex items-center space-x-1">
          <UserGroupIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{project.teamMembers}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ChartBarIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{project.completedTasks}/{project.tasksCount}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 项目管理页面
 */
export default function ProjectPage() {
  const [projects] = useState<Project[]>(generateSampleProjects());
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Active', 'Completed', 'Planning', 'Paused'];

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'All') return true;
    return project.status === activeFilter.toLowerCase();
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="mt-2 text-gray-600">
          管理和跟踪您的项目进度，协调团队协作
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionContainer
          title="My Projects"
          badge={projects.length}
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddClick={() => console.log('Add project')}
          addButtonText="Add a Project"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">没有找到符合条件的项目</p>
            </div>
          )}
        </SectionContainer>
      </div>
    </div>
  );
}
