'use client';

import SectionContainer from '@/app/ui/dashboard/section-container';
import { TaskIcon, UserIcon } from '@/app/ui/icons';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

// 任务状态类型
type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

// 任务优先级类型
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// 任务接口
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  completedHours: number;
  tags: string[];
}

// 生成示例任务数据
function generateSampleTasks(): Task[] {
  return [
    {
      id: '1',
      title: '用户登录功能开发',
      description: '实现用户登录、注册和密码重置功能',
      status: 'in_progress',
      priority: 'high',
      assignee: '张三',
      dueDate: '2024-01-15',
      estimatedHours: 16,
      completedHours: 8,
      tags: ['前端', '认证']
    },
    {
      id: '2',
      title: 'API接口文档编写',
      description: '编写完整的API接口文档和使用示例',
      status: 'todo',
      priority: 'medium',
      assignee: '李四',
      dueDate: '2024-01-20',
      estimatedHours: 12,
      completedHours: 0,
      tags: ['文档', '后端']
    },
    {
      id: '3',
      title: '数据库性能优化',
      description: '优化查询性能，添加必要的索引',
      status: 'review',
      priority: 'high',
      assignee: '王五',
      dueDate: '2024-01-18',
      estimatedHours: 20,
      completedHours: 18,
      tags: ['数据库', '性能']
    },
    {
      id: '4',
      title: '移动端适配',
      description: '确保应用在移动设备上的良好体验',
      status: 'done',
      priority: 'medium',
      assignee: '赵六',
      dueDate: '2024-01-10',
      estimatedHours: 24,
      completedHours: 24,
      tags: ['前端', '移动端']
    },
    {
      id: '5',
      title: '安全漏洞修复',
      description: '修复已发现的安全漏洞',
      status: 'todo',
      priority: 'urgent',
      assignee: '钱七',
      dueDate: '2024-01-12',
      estimatedHours: 8,
      completedHours: 0,
      tags: ['安全', '修复']
    }
  ];
}

// 任务卡片组件
function TaskCard({ task }: { task: Task }) {
  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    review: 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-800'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600',
    urgent: 'bg-red-100 text-red-600'
  };

  const statusLabels = {
    todo: '待开始',
    in_progress: '进行中',
    review: '待审核',
    done: '已完成'
  };

  const priorityLabels = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  };

  const progress = (task.completedHours / task.estimatedHours) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <div className="flex gap-2">
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            priorityColors[task.priority]
          )}>
            {priorityLabels[task.priority]}
          </span>
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            statusColors[task.status]
          )}>
            {statusLabels[task.status]}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{task.description}</p>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <UserIcon className="w-4 h-4" />
          <span>{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span>{task.dueDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          <span>{task.completedHours}/{task.estimatedHours}h</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>进度</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {task.tags.map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// 主页面组件
export default function TasksPage() {
  const tasks = generateSampleTasks();
  
  const filters = ['全部', '待开始', '进行中', '待审核', '已完成'];

  return (
    <div className="space-y-6">
      <SectionContainer
        title="任务管理"
        badge={tasks.length}
        filters={filters}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
