'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoStatus, TodoPriority, Subtask, TodoLink, TodoComment } from '@/app/lib/definitions';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import FieldChangeLog from './field-change-log';

interface TodoCreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TodoCreateRequest) => Promise<void>;
  projectId?: string;
  editingTodo?: Todo | null;
}

interface TodoCreateRequest {
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  assignee: string;
  startDate: string | null;
  dueDate: string | null;
  points: number;
  tags: string[];
  projectId?: string;
}

const STATUS_OPTIONS: { value: TodoStatus; label: string; color: string; bgColor: string }[] = [
  { value: 'todo', label: '待处理', color: '#3B82F6', bgColor: '#3B82F622' },
  { value: 'in_progress', label: '进行中', color: '#F59E0B', bgColor: '#F59E0B22' },
  { value: 'blocked', label: '已阻塞', color: '#EF4444', bgColor: '#EF444422' },
  { value: 'done', label: '已完成', color: '#10B981', bgColor: '#10B98122' },
  { value: 'cancelled', label: '已取消', color: '#6B7280', bgColor: '#6B728022' },
];

const PRIORITY_OPTIONS: { value: TodoPriority; label: string; color: string; bgColor: string }[] = [
  { value: 'urgent', label: '紧急', color: '#EF4444', bgColor: '#EF444422' },
  { value: 'high', label: '高', color: '#F59E0B', bgColor: '#F59E0B22' },
  { value: 'medium', label: '中', color: '#3B82F6', bgColor: '#3B82F622' },
  { value: 'low', label: '低', color: '#6B7280', bgColor: '#6B728022' },
];

const POINTS_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 50, 100];

type TabType = 'subtasks' | 'related' | 'comments' | 'history';

export default function TodoCreateDrawer({ isOpen, onClose, onSubmit, projectId, editingTodo }: TodoCreateDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TodoStatus>('todo');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [assignee, setAssignee] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [points, setPoints] = useState(10);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('subtasks');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [comments, setComments] = useState<TodoComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [links, setLinks] = useState<TodoLink[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description);
      setStatus(editingTodo.status);
      setPriority(editingTodo.priority);
      setAssignee(editingTodo.assignee);
      setStartDate(editingTodo.startDate);
      setDueDate(editingTodo.dueDate);
      setPoints(editingTodo.points);
      setTags(editingTodo.tags);
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setAssignee('');
      setStartDate(null);
      setDueDate(null);
      setPoints(10);
      setTags([]);
    }
    setSubtasks([]);
    setComments([]);
    setLinks([]);
    setActiveTab('subtasks');
  }, [editingTodo, isOpen]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description,
        status,
        priority,
        assignee,
        startDate,
        dueDate,
        points,
        tags,
        projectId,
      });
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: `temp-${Date.now()}`,
        todoId: '',
        title: newSubtask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setSubtasks([...subtasks, subtask]);
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => 
      st.id === id ? { ...st, completed: !st.completed } : st
    ));
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  if (!isOpen) return null;

  const statusOption = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
  const priorityOption = PRIORITY_OPTIONS.find(o => o.value === priority) || PRIORITY_OPTIONS[2];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-[#1A1D2E44]" onClick={onClose} />
      
      <div className="fixed right-0 top-0 h-full w-[900px] bg-white shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between h-14 px-6 border-b border-[#1A1D2E15]">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-[#1A1D2E]">
              {editingTodo ? '编辑待办事项' : '新建待办事项'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F5F0F0] hover:bg-[#E8E8E8]"
            >
              <XMarkIcon className="w-4 h-4 text-[#1A1D2E88]" />
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center h-8 px-5 rounded-lg bg-[#F5F0F0] text-sm font-medium text-[#1A1D2E] hover:bg-[#E8E8E8]"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !title.trim()}
              className="flex items-center justify-center h-8 px-5 rounded-lg bg-[#E8944A] text-sm font-semibold text-white hover:bg-[#D8843A] disabled:opacity-50"
            >
              {submitting ? '提交中...' : (editingTodo ? '保存' : '创建待办')}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto border-r border-[#1A1D2E10]">
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A1D2E] mb-2">
                  任务名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入任务名称..."
                  className="w-full h-[38px] px-3.5 rounded-[10px] bg-[#F5F0F0] text-sm text-[#1A1D2E] placeholder-[#1A1D2E55] focus:outline-none focus:ring-2 focus:ring-[#E8944A]"
                />
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                  style={{ backgroundColor: statusOption.bgColor, color: statusOption.color }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusOption.color }} />
                  {statusOption.label}
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                  style={{ backgroundColor: priorityOption.bgColor, color: priorityOption.color }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityOption.color }} />
                  {priorityOption.label}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#1A1D2E88]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {dueDate || '未设置'}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#E8944A] font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {points} 积分
                </div>
              </div>

              <div className="h-px bg-[#1A1D2E10]" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1D2E] mb-1.5">状态</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TodoStatus)}
                    className="w-full h-[38px] px-3 rounded-[10px] bg-[#F5F0F0] text-sm text-[#1A1D2E] focus:outline-none focus:ring-2 focus:ring-[#E8944A]"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1D2E] mb-1.5">优先级</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TodoPriority)}
                    className="w-full h-[38px] px-3 rounded-[10px] bg-[#F5F0F0] text-sm text-[#1A1D2E] focus:outline-none focus:ring-2 focus:ring-[#E8944A]"
                  >
                    {PRIORITY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1D2E] mb-1.5">负责人</label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="输入负责人"
                    className="w-full h-[38px] px-3 rounded-[10px] bg-[#F5F0F0] text-sm text-[#1A1D2E] placeholder-[#1A1D2E55] focus:outline-none focus:ring-2 focus:ring-[#E8944A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1D2E] mb-1.5">积分奖励</label>
                  <select
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full h-[38px] px-3 rounded-[10px] bg-[#F5F0F0] text-sm text-[#1A1D2E] focus:outline-none focus:ring-2 focus:ring-[#E8944A]"
                  >
                    {POINTS_OPTIONS.map(p => (
                      <option key={p} value={p}>{p} 积分</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1D2E] mb-1.5">开始时间</label>
                  <input
                    type="date"
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value || null)}
                    className="w-full h-[38px] px-3 rounded-[10px] bg-[#F5F0F0] text-sm text-[#1A1D2E] focus:outline-none focus:ring-2 focus:ring-[#E8944A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1D2E] mb-1.5">截止时间</label>
                  <input
                    type="date"
                    value={dueDate || ''}
                    onChange={(e) => setDueDate(e.target.value || null)}
                    className="w-full h-[38px] px-3 rounded-[10px] bg-[#F5F0F0] text-sm text-[#1A1D2E] focus:outline-none focus:ring-2 focus:ring-[#E8944A]"
                  />
                </div>
              </div>

              <div className="h-px bg-[#1A1D2E10]" />

              <div>
                <label className="block text-sm font-semibold text-[#1A1D2E] mb-2">描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="添加任务描述..."
                  rows={4}
                  className="w-full px-3.5 py-3 rounded-[10px] bg-[#F5F0F0] text-sm text-[#1A1D2E] placeholder-[#1A1D2E55] focus:outline-none focus:ring-2 focus:ring-[#E8944A] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1D2E] mb-2">标签</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3B82F622] text-[#3B82F6] text-xs font-medium"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-[#1A1D2E]">
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="添加标签"
                      className="h-7 px-2 rounded-lg bg-[#F5F0F0] text-xs text-[#1A1D2E] placeholder-[#1A1D2E55] focus:outline-none"
                    />
                    <button onClick={handleAddTag} className="text-xs text-[#E8944A] font-medium hover:underline">
                      + 添加
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[360px] flex flex-col">
            <div className="flex h-11 border-b border-[#1A1D2E10]">
              {[
                { key: 'subtasks', label: '子任务', count: subtasks.length },
                { key: 'related', label: '关联任务', count: links.length },
                { key: 'comments', label: '评论', count: comments.length },
                { key: 'history', label: '操作记录' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`flex items-center h-full px-4 text-sm ${
                    activeTab === tab.key
                      ? 'text-[#E8944A] font-semibold border-b-2 border-[#E8944A]'
                      : 'text-[#1A1D2E88] font-medium hover:text-[#1A1D2E]'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`ml-1 text-xs ${activeTab === tab.key ? 'text-[#E8944A88]' : 'text-[#1A1D2E55]'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'subtasks' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1A1D2E]">子任务</span>
                    <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F5F0F0] text-xs text-[#1A1D2E] hover:bg-[#E8E8E8]">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      添加
                    </button>
                  </div>
                  <div className="flex items-center h-[38px] px-3.5 rounded-[10px] bg-[#F5F0F0]">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                      placeholder="输入子任务名称后回车创建..."
                      className="flex-1 bg-transparent text-xs text-[#1A1D2E] placeholder-[#1A1D2E55] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    {subtasks.map(st => (
                      <div
                        key={st.id}
                        className="flex items-center gap-3 p-3 rounded-[10px] bg-[#F5F0F0]"
                      >
                        <button
                          onClick={() => handleToggleSubtask(st.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center ${
                            st.completed ? 'bg-[#10B981]' : 'bg-white border-2 border-[#E8E8E8]'
                          }`}
                        >
                          {st.completed && <CheckCircleIcon className="w-4 h-4 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${st.completed ? 'line-through text-[#1A1D2E55]' : 'text-[#1A1D2E]'}`}>
                          {st.title}
                        </span>
                        <button onClick={() => handleRemoveSubtask(st.id)} className="text-[#1A1D2E55] hover:text-[#EF4444]">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {subtasks.length === 0 && (
                      <div className="py-8 text-center text-sm text-[#1A1D2E55]">暂无子任务</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'related' && (
                <div className="py-8 text-center text-sm text-[#1A1D2E55]">暂无关联任务</div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-3">
                  <div className="flex items-end gap-3 p-3 rounded-[10px] bg-[#F5F0F0]">
                    <div className="w-8 h-8 rounded-full bg-[#E8944A] flex items-center justify-center text-white text-xs font-medium">
                      我
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="发表评论..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-white text-xs text-[#1A1D2E] placeholder-[#1A1D2E55] focus:outline-none border border-[#E8E8E8]"
                      />
                    </div>
                  </div>
                  {comments.length === 0 && (
                    <div className="py-8 text-center text-sm text-[#1A1D2E55]">暂无评论</div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                editingTodo ? (
                  <FieldChangeLog entityType="task" entityId={editingTodo.id} />
                ) : (
                  <div className="py-8 text-center text-sm text-[#1A1D2E55]">
                    保存后可查看操作记录
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
