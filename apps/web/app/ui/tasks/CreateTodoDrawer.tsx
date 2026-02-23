'use client';

import { useState, useEffect } from 'react';
import { TaskStatus, TaskPriority, Requirement } from '@/app/lib/definitions';
import { 
  XMarkIcon, 
  ChevronDownIcon, 
  PlusIcon, 
  CalendarIcon, 
  StarIcon,
  ArrowUpIcon,
  LinkIcon,
  PaperClipIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import LinkParentRequirementModal from './LinkParentRequirementModal';

interface CreateTodoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onTaskCreated?: () => void;
}

type TabType = 'comments' | 'history';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  time: string;
  avatar: string;
}

interface HistoryItem {
  id: string;
  action: string;
  user: string;
  time: string;
}

// 模拟数据
const mockComments: Comment[] = [
  { id: '1', author: '我', content: 'OAuth部分需要支持Google和GitHub两个平台，记得处理token刷新逻辑。', time: '2025-02-15 14:30', avatar: '#E8944A' },
  { id: '2', author: '张三', content: '登录页面原型已完成，附件中有设计稿参考。', time: '2025-02-16 10:20', avatar: '#3B82F6' },
];

const mockHistory: HistoryItem[] = [
  { id: '1', action: '创建任务', user: '张三', time: '今天 10:30' },
  { id: '2', action: '修改优先级', user: '李四', time: '今天 11:00' },
  { id: '3', action: '更新状态', user: '王五', time: '今天 14:20' },
];

export default function CreateTodoDrawer({ isOpen, onClose, projectId, onTaskCreated }: CreateTodoDrawerProps) {
  // 表单状态
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('p2');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [points, setPoints] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Tab 状态
  const [activeTab, setActiveTab] = useState<TabType>('comments');

  // 子任务
  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: '1', title: '子任务 1', completed: false },
    { id: '2', title: '子任务 2', completed: true },
  ]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // 关联任务
  const [linkedTasks] = useState<string[]>([]);

  // 父需求关联
  const [linkedParentRequirements, setLinkedParentRequirements] = useState<string[]>([]);
  const [linkedRequirementsData, setLinkedRequirementsData] = useState<Requirement[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);

  // 评论
  const [commentText, setCommentText] = useState('');

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('p2');
      setDueDate(null);
      setPoints(10);
      setError('');
      setActiveTab('comments');
      setSubtasks([
        { id: '1', title: '子任务 1', completed: false },
        { id: '2', title: '子任务 2', completed: true },
      ]);
      setNewSubtaskTitle('');
      setCommentText('');
      setLinkedParentRequirements([]);
      setLinkedRequirementsData([]);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('事项标题不能为空');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title: title.trim(),
          description,
          type: 'task',
          status,
          priority,
          points,
          dueDate,
          subtasks: subtasks.filter(s => s.title.trim()),
          parentRequirementIds: linkedParentRequirements,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onTaskCreated?.();
        onClose();
      } else {
        setError(data.message || '创建待办事项失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 关联父需求
  const handleLinkRequirement = async (requirementId: string) => {
    setLinkedParentRequirements(prev => [...prev, requirementId]);
    try {
      const response = await fetch(`/api/requirements/${requirementId}`);
      const data = await response.json();
      if (data.success && data.requirement) {
        setLinkedRequirementsData(prev => [...prev, data.requirement]);
      }
    } catch (err) {
      console.error('加载需求详情失败:', err);
    }
  };

  // 解除关联父需求
  const handleUnlinkRequirement = (requirementId: string) => {
    setLinkedParentRequirements(prev => prev.filter(id => id !== requirementId));
    setLinkedRequirementsData(prev => prev.filter(req => req.id !== requirementId));
  };

  // 添加子任务
  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks(prev => [...prev, {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        completed: false
      }]);
      setNewSubtaskTitle('');
    }
  };

  // 切换子任务完成状态
  const toggleSubtask = (id: string) => {
    setSubtasks(prev => prev.map(s =>
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  // 获取状态样式
  const getStatusStyle = (s: TaskStatus) => {
    const styles: Record<TaskStatus, { bg: string; text: string; label: string; dot: string }> = {
      'todo': { bg: 'rgba(59, 130, 246, 0.13)', text: '#3B82F6', label: '待处理', dot: '#3B82F6' },
      'in_progress': { bg: 'rgba(59, 130, 246, 0.13)', text: '#3B82F6', label: '进行中', dot: '#3B82F6' },
      'completed': { bg: 'rgba(16, 185, 129, 0.13)', text: '#10B981', label: '已完成', dot: '#10B981' },
      'cancelled': { bg: 'rgba(156, 163, 175, 0.13)', text: '#6B7280', label: '已取消', dot: '#6B7280' },
    };
    return styles[s] || styles['todo'];
  };

  // 获取优先级样式
  const getPriorityStyle = (p: TaskPriority) => {
    const styles: Record<TaskPriority, { bg: string; text: string; label: string }> = {
      'p0': { bg: 'rgba(239, 68, 68, 0.13)', text: '#EF4444', label: '紧急' },
      'p1': { bg: 'rgba(249, 115, 22, 0.13)', text: '#F97316', label: '高' },
      'p2': { bg: 'rgba(234, 179, 8, 0.13)', text: '#EAB308', label: '中' },
      'p3': { bg: 'rgba(59, 130, 246, 0.13)', text: '#3B82F6', label: '低' },
    };
    return styles[p] || styles['p2'];
  };

  // 获取需求状态样式
  const getRequirementStatusStyle = (status: string) => {
    const styles: Record<string, { text: string; label: string }> = {
      'todo': { text: '#3B82F6', label: '待办' },
      'in_progress': { text: '#4F46E5', label: '进行中' },
      'review': { text: '#D97706', label: '审核中' },
      'done': { text: '#059669', label: '已完成' },
      'cancelled': { text: '#DC2626', label: '已取消' },
    };
    return styles[status] || styles['todo'];
  };

  if (!isOpen) return null;

  const statusStyle = getStatusStyle(status);
  const priorityStyle = getPriorityStyle(priority);
  const currentDate = new Date().toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-');

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end"
      style={{ backgroundColor: 'rgba(26, 29, 46, 0.27)' }}
      onClick={handleOverlayClick}
    >
      {/* Drawer 主体 - 900px 宽度 */}
      <div 
        className="h-full flex flex-col bg-white"
        style={{ 
          width: '900px',
          boxShadow: '-8px 0 40px rgba(26, 29, 46, 0.18)',
        }}
      >
        {/* Header - 56px 高度 */}
        <div 
          className="flex items-center justify-between shrink-0"
          style={{ 
            height: '56px',
            padding: '0 24px',
            borderBottom: '1px solid rgba(26, 29, 46, 0.1)',
          }}
        >
          <span 
            style={{ 
              fontSize: '16px', 
              fontWeight: 700, 
              color: '#1A1D2E',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            新建代办事项
          </span>
          <div className="flex items-center" style={{ gap: '8px' }}>
            {/* 关闭按钮 */}
            <button 
              onClick={onClose}
              className="flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ 
                width: '32px', 
                height: '32px',
                borderRadius: '10px',
                backgroundColor: '#F5F0F0',
              }}
            >
              <XMarkIcon className="w-4 h-4" style={{ color: '#1A1D2E88' }} />
            </button>
            {/* 取消按钮 */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="hover:opacity-80 transition-opacity"
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                backgroundColor: '#F5F0F0',
                fontSize: '13px',
                fontWeight: 500,
                color: '#1A1D2E',
                fontFamily: 'Inter, sans-serif',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              取消
            </button>
            {/* 创建按钮 */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="hover:opacity-90 transition-opacity"
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                backgroundColor: '#E8944A',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isLoading ? '创建中...' : '创建代办'}
            </button>
          </div>
        </div>

        {/* Body - 双列布局 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧面板 */}
          <div 
            className="flex flex-col overflow-y-auto"
            style={{ 
              flex: 1,
              padding: '20px 24px',
              borderRight: '1px solid rgba(26, 29, 46, 0.1)',
              gap: '18px',
            }}
          >
            {/* 错误提示 */}
            {error && (
              <div 
                className="rounded-lg text-sm"
                style={{ 
                  padding: '12px 16px',
                  backgroundColor: '#FEE2E2', 
                  color: '#DC2626',
                }}
              >
                {error}
              </div>
            )}

            {/* 任务名称 */}
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label 
                style={{ 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#1A1D2E',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                任务名称
              </label>
              <div 
                className="flex items-center"
                style={{ 
                  height: '38px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  backgroundColor: '#F5F0F0',
                }}
              >
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入任务名称..."
                  className="flex-1 bg-transparent focus:outline-none"
                  style={{ 
                    fontSize: '13px',
                    color: '#1A1D2E',
                    fontFamily: 'Inter, sans-serif',
                    border: 'none',
                  }}
                />
              </div>
            </div>

            {/* 状态行 - 横向排列的徽章 */}
            <div className="flex items-center" style={{ gap: '12px' }}>
              {/* 状态徽章 */}
              <div 
                className="flex items-center"
                style={{ 
                  padding: '4px 12px',
                  borderRadius: '12px',
                  backgroundColor: statusStyle.bg,
                  gap: '6px',
                }}
              >
                <div 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '4px',
                    backgroundColor: statusStyle.dot,
                  }} 
                />
                <span 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: 500, 
                    color: statusStyle.text,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {statusStyle.label}
                </span>
              </div>

              {/* 优先级徽章 */}
              <div 
                className="flex items-center"
                style={{ 
                  padding: '4px 12px',
                  borderRadius: '12px',
                  backgroundColor: priorityStyle.bg,
                  gap: '6px',
                }}
              >
                <ArrowUpIcon className="w-3 h-3" style={{ color: priorityStyle.text }} />
                <span 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: 500, 
                    color: priorityStyle.text,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {priorityStyle.label}
                </span>
              </div>

              {/* 日期徽章 */}
              <div className="flex items-center" style={{ gap: '6px' }}>
                <CalendarIcon className="w-3.5 h-3.5" style={{ color: '#1A1D2E88' }} />
                <span 
                  style={{ 
                    fontSize: '12px', 
                    color: dueDate ? '#1A1D2E' : '#1A1D2E88',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {dueDate || '未设置'}
                </span>
              </div>

              {/* 积分徽章 */}
              <div className="flex items-center" style={{ gap: '4px' }}>
                <StarIcon className="w-3.5 h-3.5" style={{ color: '#E8944A' }} />
                <span 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: 500,
                    color: '#E8944A',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {points} 积分
                </span>
              </div>
            </div>

            {/* 分割线 */}
            <div style={{ height: '1px', backgroundColor: 'rgba(26, 29, 46, 0.1)' }} />

            {/* 信息网格 */}
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {/* 第1行: 父需求 + 工作项ID */}
              <div className="flex" style={{ gap: '16px' }}>
                {/* 父需求 */}
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <span 
                      style={{ 
                        fontSize: '12px', 
                        color: '#1A1D2E88',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      父需求
                    </span>
                    {linkedRequirementsData.length > 0 ? (
                      <span 
                        style={{ 
                          fontSize: '12px', 
                          fontWeight: 500,
                          color: '#1A1D2E',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {linkedRequirementsData[0].title}
                      </span>
                    ) : (
                      <span 
                        style={{ 
                          fontSize: '12px', 
                          color: '#1A1D2E55',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        未关联
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="flex items-center hover:opacity-80 transition-opacity"
                    style={{ 
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(232, 148, 74, 0.15)',
                      gap: '4px',
                    }}
                  >
                    <LinkIcon className="w-3.5 h-3.5" style={{ color: '#E8944A' }} />
                    <span 
                      style={{ 
                        fontSize: '12px', 
                        fontWeight: 500,
                        color: '#E8944A',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      关联父需求
                    </span>
                  </button>
                </div>

                {/* 工作项 ID */}
                <div className="flex-1 flex items-center" style={{ gap: '8px' }}>
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      color: '#1A1D2E88',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    工作项 ID
                  </span>
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      fontWeight: 600,
                      color: '#1A1D2E',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    REQ-001
                  </span>
                </div>
              </div>

              {/* 第2行: 创建时间 + 更新时间 */}
              <div className="flex" style={{ gap: '16px' }}>
                {/* 创建时间 */}
                <div className="flex-1 flex items-center" style={{ gap: '8px' }}>
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      color: '#1A1D2E88',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    创建时间
                  </span>
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      color: '#1A1D2EAA',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    2025-01-10 09:30
                  </span>
                </div>

                {/* 更新时间 */}
                <div className="flex-1 flex items-center" style={{ gap: '8px' }}>
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      color: '#1A1D2E88',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    更新时间
                  </span>
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      color: '#1A1D2EAA',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    2025-02-18 14:22
                  </span>
                </div>
              </div>
            </div>

            {/* 分割线 */}
            <div style={{ height: '1px', backgroundColor: 'rgba(26, 29, 46, 0.1)' }} />

            {/* 描述 */}
            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label 
                style={{ 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  color: '#1A1D2E',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="添加任务描述..."
                rows={3}
                className="w-full focus:outline-none resize-none"
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#1A1D2E',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              />
            </div>

            {/* 分割线 */}
            <div style={{ height: '1px', backgroundColor: 'rgba(26, 29, 46, 0.1)' }} />

            {/* 子任务 */}
            <div className="flex flex-col" style={{ gap: '10px' }}>
              {/* 子任务头部 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#1A1D2E88' }}>
                    <circle cx="12" cy="18" r="3"/>
                    <circle cx="6" cy="6" r="3"/>
                    <circle cx="18" cy="6" r="3"/>
                    <path d="M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"/>
                  </svg>
                  <span 
                    style={{ 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#1A1D2E',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    子任务
                  </span>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 600,
                      color: '#1A1D2E88',
                      padding: '1px 7px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(26, 29, 46, 0.1)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {subtasks.length}
                  </span>
                </div>
                <button
                  className="flex items-center hover:opacity-80 transition-opacity"
                  style={{ gap: '4px' }}
                >
                  <PlusIcon className="w-3.5 h-3.5" style={{ color: '#E8944A' }} />
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      fontWeight: 500,
                      color: '#E8944A',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    新建
                  </span>
                </button>
              </div>

              {/* 子任务输入框 */}
              <div 
                className="flex items-center"
                style={{ 
                  height: '38px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  backgroundColor: '#F5F0F0',
                }}
              >
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  placeholder="输入子任务名称后回车创建..."
                  className="flex-1 bg-transparent focus:outline-none"
                  style={{ 
                    fontSize: '12px',
                    color: '#1A1D2E',
                    fontFamily: 'Inter, sans-serif',
                    border: 'none',
                  }}
                />
              </div>

              {/* 子任务列表 */}
              <div className="flex flex-col" style={{ gap: '8px' }}>
                {subtasks.map((subtask) => (
                  <div 
                    key={subtask.id}
                    className="flex items-center justify-between"
                    style={{ 
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#F5F0F0',
                    }}
                  >
                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <button
                        onClick={() => toggleSubtask(subtask.id)}
                        className="flex items-center justify-center"
                        style={{ 
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          backgroundColor: subtask.completed ? '#10B981' : 'transparent',
                          border: subtask.completed ? 'none' : '1.5px solid rgba(26, 29, 46, 0.2)',
                        }}
                      >
                        {subtask.completed && <CheckIcon className="w-3 h-3 text-white" />}
                      </button>
                      <span 
                        style={{ 
                          fontSize: '13px', 
                          color: subtask.completed ? '#1A1D2E55' : '#1A1D2E',
                          textDecoration: subtask.completed ? 'line-through' : 'none',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 分割线 */}
            <div style={{ height: '1px', backgroundColor: 'rgba(26, 29, 46, 0.1)' }} />

            {/* 关联任务 */}
            <div className="flex flex-col" style={{ gap: '10px' }}>
              {/* 关联任务头部 */}
              <div className="flex items-center">
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#1A1D2E88' }}>
                    <path d="m9 11 3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  <span 
                    style={{ 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: '#1A1D2E',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    关联任务
                  </span>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 600,
                      color: '#1A1D2E88',
                      padding: '1px 7px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(26, 29, 46, 0.1)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {linkedTasks.length}
                  </span>
                </div>
                <button
                  className="flex items-center hover:opacity-80 transition-opacity ml-auto"
                  style={{ gap: '4px' }}
                >
                  <LinkIcon className="w-3.5 h-3.5" style={{ color: '#E8944A' }} />
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      fontWeight: 500,
                      color: '#E8944A',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    关联
                  </span>
                </button>
              </div>

              {/* 空状态提示 */}
              {linkedTasks.length === 0 && (
                <div 
                  className="flex items-center justify-center"
                  style={{ 
                    padding: '20px 0',
                  }}
                >
                  <span 
                    style={{ 
                      fontSize: '12px', 
                      color: '#1A1D2E88',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    暂无关联任务
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 右侧面板 - 360px 固定宽度 */}
          <div 
            className="flex flex-col overflow-hidden"
            style={{ width: '360px' }}
          >
            {/* Tab 栏 - 44px 高度 */}
            <div 
              className="flex items-center shrink-0"
              style={{ 
                height: '44px',
                padding: '0 16px',
                borderBottom: '1px solid rgba(26, 29, 46, 0.1)',
                gap: '4px',
              }}
            >
              {/* 评论 Tab */}
              <button
                onClick={() => setActiveTab('comments')}
                className="flex items-center hover:opacity-80 transition-opacity"
                style={{
                  height: '100%',
                  padding: '0 12px',
                  borderBottom: activeTab === 'comments' ? '2px solid #E8944A' : '2px solid transparent',
                  gap: '4px',
                }}
              >
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: activeTab === 'comments' ? 600 : 500,
                  color: activeTab === 'comments' ? '#E8944A' : '#1A1D2E88',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  评论
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 500,
                  color: activeTab === 'comments' ? '#E8944A88' : '#1A1D2E88',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {' '}2
                </span>
              </button>

              {/* 操作记录 Tab */}
              <button
                onClick={() => setActiveTab('history')}
                className="flex items-center hover:opacity-80 transition-opacity"
                style={{
                  height: '100%',
                  padding: '0 12px',
                  borderBottom: activeTab === 'history' ? '2px solid #E8944A' : '2px solid transparent',
                  gap: '4px',
                }}
              >
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: activeTab === 'history' ? 600 : 500,
                  color: activeTab === 'history' ? '#E8944A' : '#1A1D2E88',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  操作记录
                </span>
              </button>
            </div>

            {/* Tab 内容 */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'comments' && (
                <div className="flex flex-col h-full">
                  {/* 评论列表 */}
                  <div className="flex-1" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {mockComments.map((comment, index) => (
                      <div key={comment.id} className="flex flex-col" style={{ gap: '8px' }}>
                        <div className="flex items-start" style={{ gap: '10px' }}>
                          <div 
                            className="flex items-center justify-center shrink-0"
                            style={{ 
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: comment.avatar,
                            }}
                          >
                            <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 600 }}>
                              {comment.author.charAt(0)}
                            </span>
                          </div>
                          <div className="flex flex-col flex-1" style={{ gap: '4px' }}>
                            <div className="flex items-center justify-between">
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1D2E', fontFamily: 'Inter, sans-serif' }}>
                                {comment.author}
                              </span>
                              <span style={{ fontSize: '11px', color: '#1A1D2E55', fontFamily: 'Inter, sans-serif' }}>
                                {comment.time}
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#1A1D2E', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
                              {comment.content}
                            </p>
                          </div>
                        </div>
                        {index < mockComments.length - 1 && (
                          <div style={{ height: '1px', backgroundColor: 'rgba(26, 29, 46, 0.08)', marginTop: '8px' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 评论输入框 */}
                  <div 
                    className="flex flex-col shrink-0"
                    style={{ 
                      padding: '12px 16px',
                      borderTop: '1px solid rgba(26, 29, 46, 0.1)',
                      gap: '8px',
                    }}
                  >
                    <div 
                      className="flex flex-col"
                      style={{ 
                        padding: '10px 14px',
                        borderRadius: '10px',
                        backgroundColor: '#F5F0F0',
                        gap: '8px',
                      }}
                    >
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="添加评论..."
                        rows={2}
                        className="w-full bg-transparent focus:outline-none resize-none"
                        style={{
                          fontSize: '13px',
                          color: '#1A1D2E',
                          fontFamily: 'Inter, sans-serif',
                          border: 'none',
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center" style={{ gap: '8px' }}>
                          <button className="hover:opacity-70 transition-opacity">
                            <PaperClipIcon className="w-4 h-4" style={{ color: '#1A1D2E55' }} />
                          </button>
                          <button className="hover:opacity-70 transition-opacity">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#1A1D2E55' }}>
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                              <line x1="9" x2="9.01" y1="9" y2="9"/>
                              <line x1="15" x2="15.01" y1="9" y2="9"/>
                            </svg>
                          </button>
                        </div>
                        <button 
                          className="hover:opacity-80 transition-opacity"
                          style={{
                            padding: '6px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#E8944A',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#FFFFFF',
                          }}
                        >
                          发送
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="flex flex-col" style={{ padding: '16px', gap: '16px' }}>
                  {mockHistory.map((history) => (
                    <div key={history.id} className="flex items-start" style={{ gap: '10px' }}>
                      <div 
                        style={{ 
                          width: '8px',
                          height: '8px',
                          borderRadius: '4px',
                          backgroundColor: history.id === '1' ? '#E8944A' : 'rgba(26, 29, 46, 0.2)',
                          marginTop: '6px',
                          flexShrink: 0,
                        }} 
                      />
                      <div className="flex flex-col" style={{ gap: '2px' }}>
                        <span style={{ fontSize: '13px', color: '#1A1D2E', fontFamily: 'Inter, sans-serif' }}>
                          {history.action}
                        </span>
                        <span style={{ fontSize: '11px', color: '#1A1D2E88', fontFamily: 'Inter, sans-serif' }}>
                          {history.user} · {history.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 关联父需求弹窗 */}
      <LinkParentRequirementModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        projectId={projectId}
        linkedRequirementIds={linkedParentRequirements}
        onLinkRequirement={handleLinkRequirement}
        onUnlinkRequirement={handleUnlinkRequirement}
      />
    </div>
  );
}
