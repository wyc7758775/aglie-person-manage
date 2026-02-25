'use client';

import { useState } from 'react';
import { Task, TaskType, TaskStatus, TaskDifficulty, TaskPriority } from '@/app/lib/definitions';
import TaskEditDrawer from './TaskEditDrawer';
import HabitDetailDrawer from '../habits/HabitDetailDrawer';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: string;
  onTaskUpdated?: () => void;
}

const typeLabels: Record<TaskType, string> = {
  hobby: '爱好',
  habit: '习惯',
  task: '任务',
  desire: '欲望',
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

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function TaskDetailDrawer({ isOpen, onClose, task, projectId, onTaskUpdated }: TaskDetailDrawerProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  if (!isOpen || !task) return null;

  // 如果是习惯类型，使用新的 HabitDetailDrawer
  if (task.type === 'habit') {
    return (
      <HabitDetailDrawer
        isOpen={isOpen}
        onClose={onClose}
        task={task}
        projectId={projectId}
        onTaskUpdated={onTaskUpdated}
      />
    );
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}/complete`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        onTaskUpdated?.();
        onClose();
      }
    } catch (error) {
      console.error('完成任务失败:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex justify-end"
        style={{ backgroundColor: 'rgba(26, 29, 46, 0.27)' }}
        onClick={handleOverlayClick}
      >
        <div 
          className="h-full bg-white flex flex-col"
          style={{ 
            width: '614px',
            boxShadow: '-8px 0 40px rgba(26, 29, 46, 0.3)',
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between px-6 shrink-0"
            style={{ 
              height: '60px',
              borderBottom: '1px solid rgba(26, 29, 46, 0.08)',
            }}
          >
            <div className="flex items-center gap-3">
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: '#E8944A15',
                  color: '#E8944A',
                }}
              >
                {typeLabels[task.type]}
              </span>
              <span className="font-bold text-base" style={{ color: '#1A1D2E' }}>
                任务详情
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleEdit}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#F5F0F0', color: '#1A1D2E' }}
              >
                编辑
              </button>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(26, 29, 46, 0.53)" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div 
            className="flex-1 overflow-y-auto"
            style={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Title & Complete Button */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold" style={{ color: '#1A1D2E' }}>
                  {task.title}
                </h1>                
                {task.status !== 'completed' && (
                  <button
                    onClick={handleComplete}
                    disabled={isCompleting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                    style={{ 
                      backgroundColor: '#4CAF5015',
                      color: '#4CAF50',
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isCompleting ? '处理中...' : '标记完成'}
                  </button>
                )}
              </div>

              {/* Game Stats Card */}
              <div 
                className="rounded-2xl p-5 text-white"
                style={{ backgroundColor: '#1A1D2E' }}
              >
                <div className="font-bold text-sm mb-4">游戏属性</div>                
                <div className="grid grid-cols-2 gap-3">
                  {/* Streak */}
                  <div 
                    className="rounded-xl p-3.5"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4" fill="#EF4444" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="text-xs opacity-70">连胜天数</span>
                    </div>
                    <div className="text-lg font-bold">{task.streak || 0} 天</div>
                  </div>

                  {/* XP */}
                  <div 
                    className="rounded-xl p-3.5"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4" fill="#3B82F6" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                      <span className="text-xs opacity-70">经验值</span>
                    </div>
                    <div className="text-lg font-bold">+{task.points || 0} XP</div>
                  </div>

                  {/* Gold */}
                  <div 
                    className="rounded-xl p-3.5"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4" fill="#E8944A" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <span className="text-xs opacity-70">金币奖励</span>
                    </div>
                    <div className="text-lg font-bold">+{task.goldReward}</div>
                  </div>

                  {/* Total Count */}
                  <div 
                    className="rounded-xl p-3.5"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4" fill="#10B981" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span className="text-xs opacity-70">完成次数</span>
                    </div>
                    <div className="text-lg font-bold">{task.totalCount || 0} 次</div>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div 
                className="rounded-2xl p-5"
                style={{ backgroundColor: '#F5F0F0' }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs mb-1" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>难度</div>
                    <div className="text-sm font-medium" style={{ color: '#1A1D2E' }}>
                      {difficultyLabels[task.difficulty]}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs mb-1" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>优先级</div>
                    <div className="text-sm font-medium" style={{ color: '#1A1D2E' }}>
                      {priorityLabels[task.priority]}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs mb-1" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>开始日期</div>
                    <div className="text-sm font-medium" style={{ color: '#1A1D2E' }}>
                      {formatDate(task.startDate)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs mb-1" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>截止日期</div>
                    <div className="text-sm font-medium" style={{ color: '#1A1D2E' }}>
                      {formatDate(task.dueDate)}
                    </div>
                  </div>

                  {(task.type === 'hobby' || task.type === 'habit') && task.repeatDays.length > 0 && (
                    <div className="col-span-2">
                      <div className="text-xs mb-1" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>重复日</div>
                      <div className="flex gap-2">
                        {task.repeatDays.map((day) => (
                          <span
                            key={day}
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: 'white' }}
                          >
                            {weekDays[day]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.tags.length > 0 && (
                    <div className="col-span-2">
                      <div className="text-xs mb-1" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>标签</div>
                      <div className="flex gap-2 flex-wrap">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full text-xs"
                            style={{ backgroundColor: 'white' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <>
                  <div style={{ height: '1px', backgroundColor: 'rgba(26, 29, 46, 0.06)' }} />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="rgba(26, 29, 46, 0.53)" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-semibold text-sm" style={{ color: '#1A1D2E' }}>备注说明</span>
                    </div>
                    <div 
                      className="rounded-xl p-4 text-sm leading-relaxed"
                      style={{ 
                        backgroundColor: '#F5F0F0',
                        color: '#1A1D2E',
                        lineHeight: '1.6',
                      }}
                    >
                      {task.description}
                    </div>
                  </div>
                </>
              )}

              {/* History */}
              {task.history && task.history.length > 0 && (
                <>
                  <div style={{ height: '1px', backgroundColor: 'rgba(26, 29, 46, 0.06)' }} />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="rgba(26, 29, 46, 0.53)" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-sm" style={{ color: '#1A1D2E' }}>操作日志</span>
                      </div>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ backgroundColor: 'rgba(26, 29, 46, 0.08)' }}
                      >
                        {task.history.length} 条记录
                      </span>
                    </div>
                    <div className="space-y-2">
                      {task.history.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-center gap-3 text-sm">
                          <span className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.4)' }}>
                            {new Date(log.timestamp).toLocaleString('zh-CN')}
                          </span>
                          <span 
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ 
                              backgroundColor: log.action === 'completed' ? '#4CAF5015' : '#F5F0F0',
                              color: log.action === 'completed' ? '#4CAF50' : '#1A1D2E',
                            }}
                          >
                            {log.action === 'created' ? '创建' : 
                             log.action === 'updated' ? '更新' : 
                             log.action === 'completed' ? '完成' : 
                             log.action === 'deleted' ? '删除' : '状态变更'}
                          </span>
                          <span style={{ color: 'rgba(26, 29, 46, 0.7)' }}>{log.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      <TaskEditDrawer
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        task={task}
        projectId={projectId}
        onTaskUpdated={() => {
          onTaskUpdated?.();
          setIsEditOpen(false);
          onClose();
        }}
      />
    </>
  );
}