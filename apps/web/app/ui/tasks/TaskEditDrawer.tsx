'use client';

import { useState, useEffect } from 'react';
import { Task, TaskType, TaskStatus, TaskPriority, TaskDifficulty, TaskFrequency, TaskDirection, ResetPeriod, resetPeriodOptions } from '@/app/lib/definitions';
import DropdownOptions from '@/app/ui/dropdown-options';

interface TaskEditDrawerProps {
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

const difficulties: { value: TaskDifficulty; label: string }[] = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
];

const priorities: { value: TaskPriority; label: string }[] = [
  { value: 'p0', label: '紧急' },
  { value: 'p1', label: '高' },
  { value: 'p2', label: '中' },
  { value: 'p3', label: '低' },
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const frequencies: { value: TaskFrequency; label: string }[] = [
  { value: 'daily', label: '每天' },
  { value: 'weekdays', label: '工作日' },
  { value: 'weekly', label: '每周' },
  { value: 'custom', label: '自定义' },
];

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const habitTypes: { value: TaskDirection; label: string; icon: React.ReactNode }[] = [
  {
    value: 'positive',
    label: '好习惯',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    )
  },
  {
    value: 'negative',
    label: '坏习惯',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    )
  },
];

export default function TaskEditDrawer({ isOpen, onClose, task, projectId, onTaskUpdated }: TaskEditDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [priority, setPriority] = useState<TaskPriority>('p2');
  const [frequency, setFrequency] = useState<TaskFrequency>('daily');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [goldReward, setGoldReward] = useState(10);
  const [points, setPoints] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState<TaskDirection>('positive');
  const [resetPeriod, setResetPeriod] = useState<ResetPeriod>('daily');

  // Load task data when drawer opens
  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setDifficulty(task.difficulty);
      setPriority(task.priority);
      setFrequency(task.frequency);
      setRepeatDays(task.repeatDays || []);
      setGoldReward(task.goldReward);
      setPoints(task.points);
      setStartDate(task.startDate || '');
      setDueDate(task.dueDate || '');
      setTags(task.tags || []);
      setDirection(task.direction || 'positive');
      setResetPeriod(task.resetPeriod || 'daily');
      setError('');
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

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

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('任务标题不能为空');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description,
          status,
          priority,
          difficulty,
          points,
          goldReward,
          frequency,
          repeatDays: frequency === 'custom' ? repeatDays : [],
          startDate: startDate || null,
          dueDate: dueDate || null,
          tags,
          direction,
          resetPeriod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onTaskUpdated?.();
      } else {
        setError(data.message || '更新任务失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex justify-end"
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
            编辑{typeLabels[task.type]}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: '#F5F0F0', color: '#1A1D2E' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              查看详情
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
          <div className="space-y-5">
            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入任务标题"
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  borderColor: 'rgba(26, 29, 46, 0.1)',
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>备注说明</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="输入任务描述（可选）"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                style={{ borderColor: 'rgba(26, 29, 46, 0.1)' }}
              />
            </div>

            {/* 习惯类型选择（仅习惯显示） */}
            {task.type === 'habit' && (
              <div>
                <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>习惯类型</label>
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
              </div>
            )}

            {/* 重置计数（仅习惯显示） */}
            {task.type === 'habit' && (
              <div>
                <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>
                  重置计数 <span className="text-red-500">*</span>
                </label>
                <DropdownOptions
                  options={resetPeriodOptions}
                  value={resetPeriod}
                  onChange={(val) => setResetPeriod(val as ResetPeriod)}
                  renderTrigger={() => (
                    <div
                      className="w-full px-4 py-2.5 rounded-lg border text-sm flex items-center justify-between cursor-pointer"
                      style={{
                        borderColor: 'rgba(26, 29, 46, 0.1)',
                        color: '#1A1D2E',
                      }}
                    >
                      <span>{resetPeriodOptions.find(opt => opt.value === resetPeriod)?.label}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(26, 29, 46, 0.53)" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  )}
                  renderOption={(option) => (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm" style={{ color: '#1A1D2E' }}>{option.label}</span>
                      {resetPeriod === option.value && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8944A" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                  )}
                  minWidth="100%"
                />
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>状态</label>
              <div className="flex gap-2 flex-wrap">
                {statuses.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatus(s.value)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: status === s.value ? '#E8944A' : '#F5F0F0',
                      color: status === s.value ? 'white' : '#1A1D2E',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>难度</label>
                <div className="flex gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        backgroundColor: difficulty === d.value ? '#E8944A' : '#F5F0F0',
                        color: difficulty === d.value ? 'white' : '#1A1D2E',
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>优先级</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(26, 29, 46, 0.1)' }}
                >
                  {priorities.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Frequency */}
            {(task.type === 'hobby' || task.type === 'habit') && (
              <div>
                <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>频率</label>
                <div className="flex gap-2 flex-wrap">
                  {frequencies.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFrequency(f.value)}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                      style={{
                        backgroundColor: frequency === f.value ? '#E8944A' : '#F5F0F0',
                        color: frequency === f.value ? 'white' : '#1A1D2E',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Custom Repeat Days */}
                {frequency === 'custom' && (
                  <div className="mt-3 flex gap-2">
                    {weekDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleRepeatDayToggle(index)}
                        className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                        style={{
                          backgroundColor: repeatDays.includes(index) ? '#E8944A' : '#F5F0F0',
                          color: repeatDays.includes(index) ? 'white' : '#1A1D2E',
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(26, 29, 46, 0.1)' }}
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>截止日期</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(26, 29, 46, 0.1)' }}
                />
              </div>
            </div>

            {/* Gold & Points */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>金币奖励</label>
                <input
                  type="number"
                  value={goldReward}
                  onChange={(e) => setGoldReward(parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(26, 29, 46, 0.1)' }}
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>积分奖励</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(26, 29, 46, 0.1)' }}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block font-bold text-sm mb-2" style={{ color: '#1A1D2E' }}>标签</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="输入标签按回车添加"
                  className="flex-1 px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: 'rgba(26, 29, 46, 0.1)' }}
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: '#E8944A' }}
                >
                  添加
                </button>
              </div>              
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                    style={{ backgroundColor: '#F5F0F0', color: '#1A1D2E' }}
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-end gap-3 px-6 shrink-0"
          style={{ 
            height: '64px',
            borderTop: '1px solid rgba(26, 29, 46, 0.06)',
          }}
        >
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: '#F5F0F0', color: '#1A1D2E' }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: '#E8944A' }}
          >
            {isLoading ? '保存中...' : '保存修改'}
          </button>
        </div>
      </div>
    </div>
  );
}