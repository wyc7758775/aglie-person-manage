'use client';

import { Task, TaskType, TaskStatus, TaskDifficulty, TaskPriority } from '@/app/lib/definitions';

interface TaskTableProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const typeLabels: Record<TaskType, string> = {
  habit: '习惯',
  daily: '日常任务',
  task: '待办事项',
};

const statusLabels: Record<TaskStatus, string> = {
  todo: '待办',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
};

const difficultyLabels: Record<TaskDifficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

const priorityLabels: Record<TaskPriority, string> = {
  p0: '紧急',
  p1: '高',
  p2: '中',
  p3: '低',
};

const statusColors: Record<TaskStatus, string> = {
  todo: '#9CA3AF',
  in_progress: '#E8944A',
  completed: '#4CAF50',
  cancelled: '#EF4444',
};

const typeColors: Record<TaskType, string> = {
  habit: '#E8944A',
  daily: '#10B981',
  task: '#3B82F6',
};

export default function TaskTable({ tasks, onTaskClick }: TaskTableProps) {
  return (
    <div className="w-full">
      {/* 表头 */}
      <div 
        className="flex items-center px-4 py-3 text-xs font-medium text-white"
        style={{ 
          backgroundColor: '#1A1D2E',
          height: '48px',
        }}
      >
        <div className="w-24 shrink-0">类型</div>
        <div className="flex-1 min-w-0">标题</div>
        <div className="w-24 shrink-0 text-center">状态</div>
        <div className="w-24 shrink-0 text-center">难度</div>
        <div className="w-20 shrink-0 text-center">优先级</div>
        <div className="w-24 shrink-0 text-right">金币</div>
        <div className="w-20 shrink-0 text-right">连胜</div>
      </div>

      {/* 表内容 */}
      <div style={{ padding: '12px 16px 16px 16px' }}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskClick?.(task)}
              className="flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all hover:shadow-md"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(26, 29, 46, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(232, 148, 74, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(232, 148, 74, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = 'rgba(26, 29, 46, 0.08)';
              }}
            >
              {/* 类型 */}
              <div className="w-24 shrink-0">
                <span 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${typeColors[task.type]}15`,
                    color: typeColors[task.type],
                  }}
                >
                  {typeLabels[task.type]}
                </span>
              </div>

              {/* 标题 */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {task.title}
                </div>
                {task.description && (
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {task.description}
                  </div>
                )}
              </div>

              {/* 状态 */}
              <div className="w-24 shrink-0 text-center">
                <span 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${statusColors[task.status]}15`,
                    color: statusColors[task.status],
                  }}
                >
                  {statusLabels[task.status]}
                </span>
              </div>

              {/* 难度 */}
              <div className="w-24 shrink-0 text-center">
                <span className="text-xs text-gray-600">
                  {difficultyLabels[task.difficulty]}
                </span>
              </div>

              {/* 优先级 */}
              <div className="w-20 shrink-0 text-center">
                <span className="text-xs text-gray-600">
                  {priorityLabels[task.priority]}
                </span>
              </div>

              {/* 金币 */}
              <div className="w-24 shrink-0 text-right">
                <div className="flex items-center justify-end gap-1">
                  <svg className="w-3.5 h-3.5" fill="#E8944A" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">
                    +{task.goldReward}
                  </span>
                  {task.goldPenalty > 0 && (
                    <span className="text-xs text-red-500">
                      /-{task.goldPenalty}
                    </span>
                  )}
                </div>
              </div>

              {/* 连胜 */}
              <div className="w-20 shrink-0 text-right">
                {task.type === 'habit' && task.streak > 0 ? (
                  <div className="flex items-center justify-end gap-1">
                    <svg className="w-3.5 h-3.5" fill="#EF4444" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="text-xs font-medium text-gray-700">
                      {task.streak}天
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}