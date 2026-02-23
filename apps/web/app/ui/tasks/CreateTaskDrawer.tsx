'use client';

import { useState } from 'react';
import { TaskType, TaskStatus, TaskPriority, TaskDifficulty, TaskFrequency, TaskDirection, ResetPeriod, resetPeriodOptions } from '@/app/lib/definitions';
import DropdownOptions from '@/app/ui/dropdown-options';

interface CreateTaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onTaskCreated?: () => void;
}

type DailyTaskType = 'habit' | 'daily';

const difficulties: { value: TaskDifficulty; label: string }[] = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
];

const frequencies: { value: TaskFrequency; label: string }[] = [
  { value: 'daily', label: '每天' },
  { value: 'weekdays', label: '工作日' },
  { value: 'weekly', label: '每周' },
  { value: 'custom', label: '自定义' },
];

const habitTypes: { value: TaskDirection; label: string; icon: React.ReactNode }[] = [
  { 
    value: 'positive', 
    label: '好习惯',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    )
  },
  { 
    value: 'negative', 
    label: '坏习惯',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    )
  },
];

const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

// 难度选项渲染
const DifficultyBadge = ({ difficulty }: { difficulty: TaskDifficulty }) => {
  const labels: Record<TaskDifficulty, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };
  return (
    <div 
      className="px-3 py-2 rounded-[10px] text-sm flex items-center justify-between"
      style={{ 
        backgroundColor: '#F5F0F0',
        color: '#1A1D2E',
      }}
    >
      <span>{labels[difficulty]}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(26, 29, 46, 0.53)" strokeWidth="2">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </div>
  );
};

// 频率选项渲染
const FrequencyBadge = ({ frequency }: { frequency: TaskFrequency }) => {
  const labels: Record<TaskFrequency, string> = {
    daily: '每天',
    weekdays: '工作日',
    weekly: '每周',
    custom: '自定义',
  };
  return (
    <div 
      className="px-3 py-2 rounded-[10px] text-sm flex items-center justify-between"
      style={{ 
        backgroundColor: '#F5F0F0',
        color: '#1A1D2E',
      }}
    >
      <span>{labels[frequency]}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(26, 29, 46, 0.53)" strokeWidth="2">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </div>
  );
};

export default function CreateTaskDrawer({ isOpen, onClose, projectId, onTaskCreated }: CreateTaskDrawerProps) {
  const [selectedType, setSelectedType] = useState<DailyTaskType>('daily');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [frequency, setFrequency] = useState<TaskFrequency>('daily');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [direction, setDirection] = useState<TaskDirection>('positive');
  const [resetPeriod, setResetPeriod] = useState<ResetPeriod>('daily');
  const [startDate, setStartDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRepeatDayToggle = (day: number) => {
    setRepeatDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('任务标题不能为空');
      return;
    }

    setIsLoading(true);
    setError('');

    // 根据频率自动设置重复日
    const getRepeatDays = () => {
      if (selectedType !== 'daily') return [];
      switch (frequency) {
        case 'daily': return [0, 1, 2, 3, 4, 5, 6]; // 每天
        case 'weekdays': return [1, 2, 3, 4, 5]; // 工作日
        case 'weekly': return [1]; // 每周（周一）
        case 'custom': return repeatDays; // 用户选择
        default: return [];
      }
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title: title.trim(),
          description,
          type: selectedType,
          status: 'todo' as TaskStatus,
          priority: 'p2' as TaskPriority,
          difficulty,
          assignee: null,
          points: 10,
          goldReward: 10,
          goldPenalty: 0,
          frequency: selectedType === 'daily' ? frequency : 'daily',
          repeatDays: getRepeatDays(),
          startDate: startDate || null,
          dueDate: null,
          tags: [],
          direction: selectedType === 'habit' ? direction : 'positive',
          resetPeriod: selectedType === 'habit' ? resetPeriod : 'daily',
        }),
      });

      const data = await response.json();

      if (data.success) {
        onTaskCreated?.();
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
        setRepeatDays([]);
      } else {
        setError(data.message || '创建任务失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end"
      style={{ backgroundColor: 'rgba(26, 29, 46, 0.27)' }}
      onClick={handleOverlayClick}
    >
      <div 
        className="h-full bg-white flex flex-col"
        style={{ 
          width: '560px',
          boxShadow: '-8px 0 40px rgba(26, 29, 46, 0.3)',
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 shrink-0"
          style={{ 
            height: '56px',
            borderBottom: '1px solid rgba(26, 29, 46, 0.06)',
          }}
        >
          <span className="font-bold text-base" style={{ color: '#1A1D2E' }}>
            {selectedType === 'habit' ? '新建习惯' : '新建日常任务'}
          </span>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(26, 29, 46, 0.53)" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                {error}
              </div>
            )}

            {/* Type Selection - Tab Style */}
            <div>
              <label className="block text-sm mb-2" style={{ color: '#1A1D2E', fontWeight: 700 }}>任务类型</label>
              <div className="flex gap-2">
                {/* 习惯 */}
                <button
                  onClick={() => setSelectedType('habit')}
                  className="flex-1 py-2.5 rounded-[10px] text-sm font-medium transition-all flex items-center justify-center gap-1.5"
                  style={{
                    backgroundColor: selectedType === 'habit' ? '#E8944A' : '#F5F0F0',
                    color: selectedType === 'habit' ? 'white' : 'rgba(26, 29, 46, 0.53)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={selectedType === 'habit' ? 'white' : 'rgba(26, 29, 46, 0.53)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 2.1l4 4-4 4"/>
                    <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"/>
                    <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/>
                  </svg>
                  <span>习惯</span>
                </button>
                {/* 日常任务 */}
                <button
                  onClick={() => setSelectedType('daily')}
                  className="flex-1 py-2.5 rounded-[10px] text-sm font-medium transition-all flex items-center justify-center gap-1.5"
                  style={{
                    backgroundColor: selectedType === 'daily' ? '#E8944A' : '#F5F0F0',
                    color: selectedType === 'daily' ? 'white' : 'rgba(26, 29, 46, 0.53)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={selectedType === 'daily' ? 'white' : 'rgba(26, 29, 46, 0.53)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>日常任务</span>
                </button>
              </div>
            </div>

            {/* 习惯类型选择（仅习惯显示） */}
            {selectedType === 'habit' && (
              <div className="flex gap-4 justify-center">
                {habitTypes.map((habit) => {
                  const isPositive = habit.value === 'positive';
                  const isSelected = direction === habit.value;
                  return (
                      <button
                      key={habit.value}
                      onClick={() => setDirection(habit.value)}
                      className="w-20 h-20 rounded-full text-xs font-medium transition-all duration-300 flex flex-col items-center justify-center gap-1.5 border-2"
                      style={{
                        backgroundColor: isSelected
                          ? (isPositive ? '#22C55E' : '#EF4444')
                          : 'white',
                        color: isSelected ? 'white' : (isPositive ? '#22C55E' : '#EF4444'),
                        borderColor: isSelected 
                          ? (isPositive ? '#22C55E' : '#EF4444')
                          : (isPositive ? '#86EFAC' : '#FCA5A5'),
                        boxShadow: isSelected 
                          ? `0 8px 24px ${isPositive ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)'}` 
                          : `0 2px 8px ${isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
                      }}
                    >
                      {habit.icon}
                      <span>{habit.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Section: 基本信息 */}
            <div>
              <label className="block text-sm mb-4" style={{ color: '#1A1D2E', fontWeight: 700 }}>基本信息</label>
              
              {/* Title */}
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-1.5">
                  <label className="text-sm" style={{ color: '#1A1D2E' }}>任务名称</label>
                  <span style={{ color: '#EF4444' }}>*</span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入任务名称"
                  className="w-full px-3.5 py-2 rounded-[10px] text-sm focus:outline-none"
                  style={{ 
                    backgroundColor: '#F5F0F0',
                    color: '#1A1D2E',
                    height: '38px',
                    border: 'none',
                  }}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm mb-1.5" style={{ color: '#1A1D2E' }}>备注说明</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="可选的补充说明..."
                  rows={3}
                  className="w-full px-3.5 py-3 rounded-[10px] text-sm focus:outline-none resize-none"
                  style={{ 
                    backgroundColor: '#F5F0F0',
                    color: '#1A1D2E',
                    minHeight: '60px',
                    border: 'none',
                  }}
                />
              </div>

              {/* 重置计数（仅习惯显示） */}
              {selectedType === 'habit' && (
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <label className="text-sm" style={{ color: '#1A1D2E' }}>重置计数</label>
                    <span style={{ color: '#EF4444' }}>*</span>
                  </div>
                  <DropdownOptions
                    options={resetPeriodOptions}
                    value={resetPeriod}
                    onChange={(val) => setResetPeriod(val as ResetPeriod)}
                    renderTrigger={() => (
                      <div 
                        className="w-full px-3.5 py-2 rounded-[10px] text-sm flex items-center justify-between cursor-pointer"
                        style={{ 
                          backgroundColor: '#F5F0F0',
                          color: '#1A1D2E',
                          height: '38px',
                        }}
                      >
                        <span>{resetPeriodOptions.find(opt => opt.value === resetPeriod)?.label}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(26, 29, 46, 0.53)" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                    )}
                    renderOption={(option) => (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-sm" style={{ color: '#1A1D2E' }}>{option.label}</span>
                        {resetPeriod === option.value && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8944A" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        )}
                      </div>
                    )}
                    minWidth="100%"
                  />
                </div>
              )}
            </div>

            {/* Conditional Fields based on type */}
            {selectedType === 'habit' ? null : (
              /* 日常任务类型特有字段 */
              <>
                {/* 难度和频率 - 并排 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 难度 */}
                  <div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <label className="text-sm" style={{ color: '#1A1D2E' }}>难度</label>
                      <span style={{ color: '#EF4444' }}>*</span>
                    </div>
                    <DropdownOptions
                      options={difficulties}
                      value={difficulty}
                      onChange={(val) => setDifficulty(val as TaskDifficulty)}
                      renderTrigger={() => <DifficultyBadge difficulty={difficulty} />}
                      renderOption={(option) => <span className="text-sm" style={{ color: '#1A1D2E' }}>{option.label}</span>}
                      minWidth="100%"
                    />
                  </div>

                  {/* 频率 */}
                  <div>
                    <div className="flex items-center gap-1 mb-1.5">
                      <label className="text-sm" style={{ color: '#1A1D2E' }}>频率</label>
                      <span style={{ color: '#EF4444' }}>*</span>
                    </div>
                    <DropdownOptions
                      options={frequencies}
                      value={frequency}
                      onChange={(val) => setFrequency(val as TaskFrequency)}
                      renderTrigger={() => <FrequencyBadge frequency={frequency} />}
                      renderOption={(option) => <span className="text-sm" style={{ color: '#1A1D2E' }}>{option.label}</span>}
                      minWidth="100%"
                    />
                  </div>
                </div>

                  {/* Section: 计划设置 */}
                <div>
                  <label className="block text-sm mb-4" style={{ color: '#1A1D2E', fontWeight: 700 }}>计划设置</label>
                  
                  {/* Start Date */}
                  <div className="mb-4">
                    <label className="block text-sm mb-1.5" style={{ color: '#1A1D2E' }}>开始日期</label>
                    <div 
                      className="w-full px-3.5 py-2 rounded-[10px] text-sm flex items-center justify-between"
                      style={{ 
                        backgroundColor: '#F5F0F0',
                        color: '#1A1D2E',
                        height: '38px',
                      }}
                    >
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm"
                        style={{ color: '#1A1D2E' }}
                        placeholder="今天"
                      />
                    </div>
                  </div>

                  {/* Repeat Days - always show for daily tasks */}
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#1A1D2E' }}>重复日</label>
                    <div className="flex gap-2">
                      {weekDays.map((day, index) => {
                        const isSelected = repeatDays.includes(index);
                        return (
                          <button
                            key={index}
                            onClick={() => handleRepeatDayToggle(index)}
                            className="w-10 h-10 rounded-[10px] text-sm font-medium transition-all"
                            style={{
                              backgroundColor: isSelected ? '#E8944A' : 'white',
                              color: isSelected ? 'white' : '#1A1D2E',
                              border: isSelected ? 'none' : '1px solid rgba(26, 29, 46, 0.15)',
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-end gap-3 px-6 shrink-0"
          style={{ 
            height: '68px',
            borderTop: '1px solid rgba(26, 29, 46, 0.06)',
          }}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-[10px] text-sm font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: '#F5F0F0', color: '#1A1D2E' }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-[10px] text-sm font-medium text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: '#E8944A' }}
          >
            {isLoading ? '创建中...' : '创建任务'}
          </button>
        </div>
      </div>
    </div>
  );
}