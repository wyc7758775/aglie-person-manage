'use client';

import { useState, useMemo } from 'react';
import { Task, TaskType, TaskStatus } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import TaskTable from '@/app/ui/tasks/TaskTable';
import CreateTaskDrawer from '@/app/ui/tasks/CreateTaskDrawer';
import CreateTodoDrawer from '@/app/ui/tasks/CreateTodoDrawer';
import TaskDetailDrawer from '@/app/ui/tasks/TaskDetailDrawer';

interface TaskTabContentProps {
  tasks: Task[];
  projectId: string;
  onTaskCreated?: () => void;
}

const taskTypes: { value: TaskType | 'all'; label: string }[] = [
  { value: 'all', label: '全部类型' },
  { value: 'habit', label: '习惯' },
  { value: 'daily', label: '日常任务' },
  { value: 'task', label: '待办事项' },
];

const taskStatuses: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
];

export default function TaskTabContent({ tasks, projectId, onTaskCreated }: TaskTabContentProps) {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<TaskType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [isCreateTodoDrawerOpen, setIsCreateTodoDrawerOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesType = selectedType === 'all' || task.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
      const matchesSearch = 
        !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [tasks, selectedType, selectedStatus, searchQuery]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  const handleCreateHabitOrDaily = () => {
    setShowCreateMenu(false);
    setIsCreateDrawerOpen(true);
  };

  const handleCreateTodo = () => {
    setShowCreateMenu(false);
    setIsCreateTodoDrawerOpen(true);
  };

  return (
    <div 
      className="flex flex-col h-full bg-white rounded-2xl overflow-hidden"
      style={{ 
        boxShadow: '0 4px 20px rgba(26, 29, 46, 0.08)',
      }}
    >
      {/* 工具栏 */}
      <div 
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(26, 29, 46, 0.06)' }}
      >
        <div className="flex items-center gap-3">
          {/* 类型筛选 */}
          <div 
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ backgroundColor: 'rgba(26, 29, 46, 0.04)' }}
          >
            {taskTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: selectedType === type.value ? 'white' : 'transparent',
                  color: selectedType === type.value ? '#E8944A' : 'rgba(26, 29, 46, 0.6)',
                  boxShadow: selectedType === type.value ? '0 1px 3px rgba(26, 29, 46, 0.1)' : 'none',
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* 状态筛选 */}
          <div 
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ backgroundColor: 'rgba(26, 29, 46, 0.04)' }}
          >
            {taskStatuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: selectedStatus === status.value ? 'white' : 'transparent',
                  color: selectedStatus === status.value ? '#E8944A' : 'rgba(26, 29, 46, 0.6)',
                  boxShadow: selectedStatus === status.value ? '0 1px 3px rgba(26, 29, 46, 0.1)' : 'none',
                }}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <input
              type="text"
              placeholder="搜索任务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2"
              style={{
                borderColor: 'rgba(26, 29, 46, 0.1)',
                backgroundColor: 'rgba(26, 29, 46, 0.02)',
              }}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: 'rgba(26, 29, 46, 0.4)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 新建任务下拉菜单 */}
        <div className="relative">
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all"
            style={{ 
              backgroundColor: '#E8944A',
              boxShadow: '0 2px 8px rgba(232, 148, 74, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4843A';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E8944A';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建任务
            <svg 
              className="w-3 h-3 ml-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ transform: showCreateMenu ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 下拉菜单 */}
          {showCreateMenu && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowCreateMenu(false)}
              />
              <div 
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg z-50 py-1"
                style={{ 
                  boxShadow: '0 4px 20px rgba(26, 29, 46, 0.15)',
                  border: '1px solid rgba(26, 29, 46, 0.08)',
                }}
              >
                <button
                  onClick={handleCreateHabitOrDaily}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: '#E8944A15', color: '#E8944A' }}
                  >
                    🎯
                  </span>
                  <div>
                    <div className="font-medium" style={{ color: '#1A1D2E' }}>习惯/日常任务</div>
                    <div className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>培养长期习惯</div>
                  </div>
                </button>
                
                <div 
                  className="mx-4 my-1" 
                  style={{ height: '1px', backgroundColor: 'rgba(26, 29, 46, 0.08)' }} 
                />
                
                <button
                  onClick={handleCreateTodo}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: '#3B82F615', color: '#3B82F6' }}
                  >
                    📋
                  </span>
                  <div>
                    <div className="font-medium" style={{ color: '#1A1D2E' }}>待办事项</div>
                    <div className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>一次性任务</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 任务列表 */}
      {filteredTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
          <div className="relative mb-8 group">
            <svg
              width="160"
              height="120"
              viewBox="0 0 160 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-500 ease-out group-hover:scale-105"
            >
              <defs>
                <pattern id="taskGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" strokeOpacity="0.3"/>
                </pattern>
              </defs>
              <rect width="160" height="120" fill="url(#taskGrid)" />
              <rect x="40" y="20" width="80" height="80" rx="8" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5"/>
              <rect x="50" y="30" width="60" height="12" rx="4" fill="#E5E7EB"/>
              <rect x="50" y="50" width="50" height="8" rx="2" fill="#E5E7EB"/>
              <rect x="50" y="64" width="40" height="8" rx="2" fill="#E5E7EB"/>
              <rect x="50" y="80" width="16" height="16" rx="4" fill="white" stroke="#D1D5DB" strokeWidth="1.5"/>
              <g className="animate-pulse">
                <circle cx="120" cy="32" r="16" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="2 2"/>
                <line x1="120" y1="26" x2="120" y2="38" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                <line x1="114" y1="32" x2="126" y2="32" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </g>
            </svg>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-gray-900 tracking-tight">
              暂无任务
            </h3>
            <p className="text-sm text-gray-400 font-light">
              点击上方按钮创建您的第一个任务
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <TaskTable 
            tasks={filteredTasks} 
            onTaskClick={handleTaskClick}
            onTaskUpdated={onTaskCreated}
          />
        </div>
      )}

      {/* 创建任务抽屉（习惯和日常任务） */}
      <CreateTaskDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        projectId={projectId}
        onTaskCreated={onTaskCreated}
      />

      {/* 创建待办事项抽屉 */}
      <CreateTodoDrawer
        isOpen={isCreateTodoDrawerOpen}
        onClose={() => setIsCreateTodoDrawerOpen(false)}
        projectId={projectId}
        onTaskCreated={onTaskCreated}
      />

      {/* 任务详情抽屉 */}
      <TaskDetailDrawer
        isOpen={!!selectedTask}
        onClose={handleCloseDetail}
        task={selectedTask}
        projectId={projectId}
        onTaskUpdated={onTaskCreated}
      />
    </div>
  );
}