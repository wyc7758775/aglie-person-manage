'use client';

import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { Requirement, RequirementStatus } from './requirement-table';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from './requirement-table';
import DropdownOptions from '@/app/ui/dropdown-options';
import SaveStatusIndicator, { SaveStatus } from '@/app/dashboard/project/components/SaveStatusIndicator';
import UnsavedChangesDialog from '@/app/dashboard/project/components/UnsavedChangesDialog';
import MarkdownEditorField from './markdown-editor-field';
import CommentSection from './comment-section';
import SubRequirementModal, { SubRequirementFormData } from './sub-requirement-modal';
import { convertToExtendedRequirement } from '@/app/lib/requirement-utils';

interface RequirementSlidePanelProps {
  open: boolean;
  onClose: () => void;
  requirement?: Requirement;
  onSave?: (requirement: Requirement) => void;
  onDelete?: (id: string) => void;
  projectId?: string;
  onRequirementCreated?: () => void;
}

const statusMap: Record<RequirementStatus, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  'todo': { label: '待办', dotColor: '#64748B', bgColor: '#F1F5F9', textColor: '#64748B' },
  'in_progress': { label: '进行中', dotColor: '#3B82F6', bgColor: '#EFF6FF', textColor: '#3B82F6' },
  'done': { label: '已完成', dotColor: '#22C55E', bgColor: '#F0FDF4', textColor: '#22C55E' },
  'cancelled': { label: '已取消', dotColor: '#6B7280', bgColor: '#F3F4F6', textColor: '#6B7280' },
  'accepted': { label: '已验收', dotColor: '#A855F7', bgColor: '#FAF5FF', textColor: '#A855F7' },
  'closed': { label: '已关闭', dotColor: '#6B7280', bgColor: '#F3F4F6', textColor: '#6B7280' },
};

const priorityMap: Record<string, { label: string; color: string; bgColor: string }> = {
  'p0': { label: 'P0', color: '#EF4444', bgColor: '#FEF2F2' },
  'p1': { label: 'P1', color: '#F97316', bgColor: '#FFF7ED' },
  'p2': { label: 'P2', color: '#EAB308', bgColor: '#FEFCE8' },
  'p3': { label: 'P3', color: '#3B82F6', bgColor: '#EFF6FF' },
  'p4': { label: 'P4', color: '#64748B', bgColor: '#F1F5F9' },
};

export default function RequirementSlidePanel({ 
  open, 
  onClose, 
  requirement, 
  onSave, 
  onDelete,
  projectId = '',
  onRequirementCreated
}: RequirementSlidePanelProps) {
  const [localRequirement, setLocalRequirement] = useState<Partial<Requirement>>({});
  const [globalSaveStatus, setGlobalSaveStatus] = useState<SaveStatus>('idle');
  const [globalErrorMessage, setGlobalErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isCreateMode = !requirement;
  const [initialRequirement, setInitialRequirement] = useState<Partial<Requirement>>({});
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
  const [commentCount, setCommentCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<{ nickname: string } | null>(null);
  
  // 子需求弹窗状态
  const [showSubRequirementModal, setShowSubRequirementModal] = useState(false);
  
  // 子需求列表
  const [subRequirements, setSubRequirements] = useState<Requirement[]>([]);
  const [loadingSubRequirements, setLoadingSubRequirements] = useState(false);
  
  // 所有需求列表（用于查找父需求）
  const [allRequirements, setAllRequirements] = useState<Requirement[]>([]);
  
  // 当前显示的需求（可能是父需求或选中的子需求）
  const [displayedRequirement, setDisplayedRequirement] = useState<Requirement | null>(null);
  const [viewStack, setViewStack] = useState<Requirement[]>([]); // 用于记录查看历史，支持返回

  // 获取当前登录用户
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (error) {
        console.error('获取当前用户失败:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  // 加载子需求列表
  const loadSubRequirements = useCallback(async () => {
    // 使用当前显示的需求ID（可能是父需求或子需求）
    const currentRequirementId = displayedRequirement?.id || requirement?.id;
    if (!currentRequirementId || !projectId) return;
    
    setLoadingSubRequirements(true);
    try {
      const response = await fetch(`/api/requirements?projectId=${projectId}`);
      const data = await response.json();
      if (data.success) {
        // 转换后端数据到前端格式
        const allReqs = (data.requirements || []).map((req: Requirement) => convertToExtendedRequirement(req));
        // 保存所有需求列表
        setAllRequirements(allReqs);
        // 过滤出当前需求的子需求
        const subs = allReqs.filter((req: Requirement) => req.parentId === currentRequirementId);
        setSubRequirements(subs);
      }
    } catch (error) {
      console.error('加载子需求失败:', error);
    } finally {
      setLoadingSubRequirements(false);
    }
  }, [displayedRequirement?.id, requirement?.id, projectId]);

  // 当显示的需求变化时，加载子需求
  useEffect(() => {
    if (open && (displayedRequirement || requirement)) {
      loadSubRequirements();
    }
  }, [open, displayedRequirement?.id, requirement?.id, loadSubRequirements]);

  // 初始化显示的需求
  useEffect(() => {
    if (open && requirement) {
      setDisplayedRequirement(requirement);
      setViewStack([]);
    }
  }, [open, requirement]);

  useEffect(() => {
    if (!open) return;
    if (displayedRequirement) {
      setLocalRequirement(displayedRequirement);
      setInitialRequirement(displayedRequirement);
    } else if (requirement) {
      setLocalRequirement(requirement);
      setInitialRequirement(requirement);
    } else {
      // 新建模式：设置默认报告人为当前登录用户
      const defaultReporter = currentUser ? { nickname: currentUser.nickname } : undefined;
      setLocalRequirement({ 
        status: 'todo', 
        priority: 'p2', 
        points: 200, 
        name: '', 
        description: '',
        reporter: defaultReporter 
      });
      setInitialRequirement({ 
        status: 'todo', 
        priority: 'p2', 
        points: 200, 
        name: '', 
        description: '',
        reporter: defaultReporter 
      });
    }
    setGlobalSaveStatus('idle');
    setGlobalErrorMessage(null);
    setSubmitting(false);
  }, [open, requirement, displayedRequirement, currentUser]);

  const hasUnsavedChanges = useCallback(() => {
    if (!localRequirement || !initialRequirement) return false;
    return JSON.stringify(localRequirement) !== JSON.stringify(initialRequirement);
  }, [localRequirement, initialRequirement]);

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  // 复制工作项 ID
  const handleCopyWorkItemId = async () => {
    if (requirement?.workItemId) {
      try {
        await navigator.clipboard.writeText(requirement.workItemId);
        // 可以添加一个简单的提示，如果需要的话
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  const handleFieldChange = (fieldName: string, value: string | number | null) => {
    setLocalRequirement(prev => ({ ...prev, [fieldName]: value }));
  };

  // 检测是否为本地/Mock 数据模式
  const isLocalMode = requirement?.id?.startsWith('req-') || requirement?.id?.startsWith('mock-');

  const handleSave = async (fieldName: string, value: string | number | null) => {
    if (isCreateMode) return;
    
    setGlobalSaveStatus('saving');
    
    // Mock/本地模式：直接更新本地状态
    if (isLocalMode) {
      // 更新 localStorage
      try {
        const storageKey = `requirement_${requirement!.id}`;
        const stored = localStorage.getItem(storageKey);
        let updatedData = stored ? JSON.parse(stored) : { ...requirement };
        updatedData[fieldName] = value;
        updatedData.updatedAt = new Date().toISOString();
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
      } catch (e) {
        console.error('保存到 localStorage 失败:', e);
      }
      
      setTimeout(() => {
        setGlobalSaveStatus('saved');
        setInitialRequirement(prev => ({ ...prev, [fieldName]: value }));
        if (onSave) onSave({ ...requirement!, ...localRequirement, [fieldName]: value } as Requirement);
        setTimeout(() => setGlobalSaveStatus('idle'), 2000);
      }, 300);
      return;
    }
    
    // 正常 API 模式
    try {
      const apiFieldName = fieldName === 'name' ? 'title' : fieldName;
      let apiValue = value;
      
      if (fieldName === 'status') {
        const map: Record<string, string> = { 'todo': 'draft', 'in_progress': 'development', 'done': 'completed', 'cancelled': 'rejected', 'accepted': 'completed', 'closed': 'rejected' };
        apiValue = map[String(value)] || 'draft';
      }
      if (fieldName === 'priority') {
        const map: Record<string, string> = { 'p0': 'critical', 'p1': 'high', 'p2': 'medium', 'p3': 'low', 'p4': 'low' };
        apiValue = map[String(value)] || 'medium';
      }

      const response = await fetch(`/api/requirements/${requirement!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [apiFieldName]: apiValue })
      });

      const result = await response.json();
      if (result.success) {
        setGlobalSaveStatus('saved');
        setInitialRequirement(prev => ({ ...prev, [fieldName]: value }));
        if (onSave) onSave({ ...requirement!, ...localRequirement, [fieldName]: value } as Requirement);
        setTimeout(() => setGlobalSaveStatus('idle'), 2000);
      }
    } catch (error) {
      setGlobalSaveStatus('error');
      setGlobalErrorMessage('保存失败');
    }
  };

  const handleCreate = async () => {
    if (!localRequirement?.name?.trim()) return;

    setSubmitting(true);
    try {
      const apiData = {
        projectId,
        title: localRequirement.name,
        description: localRequirement.description || '',
        type: 'feature' as const,
        status: (() => {
          const map: Record<string, string> = { 'todo': 'draft', 'in_progress': 'development', 'done': 'completed', 'cancelled': 'rejected', 'accepted': 'completed', 'closed': 'rejected' };
          return map[localRequirement.status || 'todo'] || 'draft';
        })(),
        priority: (() => {
          const map: Record<string, string> = { 'p0': 'critical', 'p1': 'high', 'p2': 'medium', 'p3': 'low', 'p4': 'low' };
          return map[localRequirement.priority || 'p2'] || 'medium';
        })(),
        assignee: localRequirement.assignee?.nickname || '',
        reporter: currentUser?.nickname || '',
        dueDate: localRequirement.deadline || '',
        storyPoints: 0,
        points: localRequirement.points || 0,
        tags: [],
      };

      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();
      if (result.success) {
        if (onSave) onSave(result.requirement);
        onClose();
      } else {
        alert(result.message || '创建需求失败');
      }
    } catch (error) {
      console.error('创建需求失败:', error);
      alert('创建需求失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理子需求点击 - 进入子需求详情
  const handleSubRequirementClick = (sub: Requirement) => {
    if (displayedRequirement) {
      setViewStack(prev => [...prev, displayedRequirement]);
    }
    setDisplayedRequirement(sub);
  };

  // 返回上一级需求
  const handleBackToParent = () => {
    if (viewStack.length > 0) {
      const parent = viewStack[viewStack.length - 1];
      setViewStack(prev => prev.slice(0, -1));
      setDisplayedRequirement(parent);
    } else {
      // 从所有需求中查找父需求
      const parentId = displayedRequirement?.parentId || requirement?.parentId;
      if (parentId) {
        const parent = allRequirements.find(req => req.id === parentId);
        if (parent) {
          setDisplayedRequirement(parent);
          return;
        }
      }
      // 如果找不到父需求，返回到原始需求
      if (requirement) {
        setDisplayedRequirement(requirement);
      }
    }
  };

  // 获取父需求名称
  const getParentRequirementName = () => {
    // 优先从 viewStack 获取
    if (viewStack.length > 0) {
      return viewStack[viewStack.length - 1].name;
    }
    // 从所有需求中查找父需求
    const parentId = displayedRequirement?.parentId || requirement?.parentId;
    if (parentId) {
      const parent = allRequirements.find(req => req.id === parentId);
      if (parent) {
        return parent.name;
      }
    }
    return '父需求';
  };

  // 处理子需求创建
  const handleCreateSubRequirement = async (formData: SubRequirementFormData) => {
    try {
      const apiData = {
        projectId: formData.projectId,
        title: formData.name,
        description: formData.description || '',
        type: 'feature' as const,
        status: (() => {
          const map: Record<string, string> = { 'todo': 'draft', 'in_progress': 'development', 'done': 'completed', 'cancelled': 'rejected', 'accepted': 'completed', 'closed': 'rejected' };
          return map[formData.status || 'todo'] || 'draft';
        })(),
        priority: (() => {
          const map: Record<string, string> = { 'p0': 'critical', 'p1': 'high', 'p2': 'medium', 'p3': 'low', 'p4': 'low' };
          return map[formData.priority || 'p2'] || 'medium';
        })(),
        assignee: '',
        reporter: currentUser?.nickname || '',
        createdDate: formData.startDate,
        dueDate: formData.endDate,
        storyPoints: 0,
        points: formData.points || 0,
        tags: [],
        parentId: formData.parentId,
      };

      const response = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();
      if (result.success) {
        // 使用全局 Toast 提示
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('子需求创建成功', 'success');
        }
        // 刷新子需求列表
        await loadSubRequirements();
        // 刷新外部需求列表
        onRequirementCreated?.();
      } else {
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast(result.message || '创建子需求失败', 'error');
        }
        throw new Error(result.message || '创建子需求失败');
      }
    } catch (error) {
      console.error('创建子需求失败:', error);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('创建子需求失败，请稍后重试', 'error');
      }
      throw error;
    }
  };

  if (!open) return null;

  const status = (localRequirement.status || 'todo') as RequirementStatus;
  const priority = localRequirement.priority || 'p2';
  const statusStyle = statusMap[status] || statusMap['todo'];
  const priorityStyle = priorityMap[priority] || priorityMap['p2'];

  // Status Badge Component
  const StatusBadge = ({ statusKey }: { statusKey: RequirementStatus }) => {
    const style = statusMap[statusKey] || statusMap['todo'];
    return (
      <div 
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
        style={{ backgroundColor: style.bgColor, color: style.textColor }}
      >
        <span 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: style.dotColor }}
        />
        <span>{style.label}</span>
      </div>
    );
  };

  // Priority Badge Component
  const PriorityBadge = ({ priorityKey }: { priorityKey: string }) => {
    const style = priorityMap[priorityKey] || priorityMap['p2'];
    return (
      <div 
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium hover:opacity-80 transition-opacity"
        style={{ backgroundColor: style.bgColor, color: style.color }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
        <span>{style.label}</span>
      </div>
    );
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/40"
        onClick={handleClose} 
      />
      
      {/* Panel */}
      <div 
        className="fixed inset-y-0 right-0 z-50 flex flex-col bg-white animate-in slide-in-from-right duration-300"
        style={{
          width: '900px',
          boxShadow: '-8px 0 40px rgba(26, 29, 46, 0.3)'
        }}
      >
        {/* Header - 56px height */}
        <div 
          className="flex items-center justify-between px-6 flex-shrink-0"
          style={{ height: '56px', borderBottom: '1px solid rgba(26, 29, 46, 0.06)' }}
        >
          <div className="flex items-center gap-3">
            {/* 返回按钮 - 当查看子需求时显示 */}
            {viewStack.length > 0 && (
              <button
                onClick={handleBackToParent}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-gray-100"
                style={{ color: '#E8944A' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回
              </button>
            )}
            
            {!isCreateMode && displayedRequirement && (
              <>
                <span className="text-sm font-medium text-gray-900">
                  {viewStack.length > 0 ? '子需求' : '需求'}
                </span>
                <span 
                  onClick={handleCopyWorkItemId}
                  className="font-mono text-xs px-2 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#F5F0F0', color: '#1A1D2E' }}
                  title="点击复制"
                >
                  {displayedRequirement.workItemId}
                </span>
              </>
            )}
            {isCreateMode && (
              <span className="text-sm font-medium text-gray-900">新建需求</span>
            )}
            <SaveStatusIndicator status={globalSaveStatus} errorMessage={globalErrorMessage || undefined} className="text-xs" />
          </div>
          
          <div className="flex items-center gap-1">
            {!isCreateMode && onDelete && (
              <button 
                onClick={() => onDelete(requirement!.id)} 
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button 
              onClick={handleClose} 
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - Flexible width with right border */}
          <div 
            className="flex-1 flex flex-col overflow-hidden"
            style={{ borderRight: '1px solid rgba(26, 29, 46, 0.06)' }}
          >
            <div 
              className="flex-1 overflow-y-auto"
              style={{ padding: '20px 24px' }}
            >
              {/* Title */}
              <div className="mb-4">
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  className="text-lg font-bold outline-none"
                  style={{ color: '#1A1D2E' }}
                  onBlur={(e) => {
                    const value = e.currentTarget.textContent || '';
                    handleFieldChange('name', value);
                    handleSave('name', value);
                  }}
                >
                  {localRequirement.name || ''}
                </div>
                {!localRequirement.name && isCreateMode && (
                  <div className="text-gray-400 text-sm mt-1">点击输入需求名称</div>
                )}
              </div>

              {/* Status Row */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {/* Status */}
                <DropdownOptions
                  options={STATUS_OPTIONS}
                  value={status}
                  onChange={(value) => {
                    handleFieldChange('status', value);
                    handleSave('status', value);
                  }}
                  minWidth={100}
                  renderTrigger={(selectedOption) => <StatusBadge statusKey={status} />}
                  renderOption={(option) => {
                    const style = statusMap[option.value as RequirementStatus] || statusMap['todo'];
                    return (
                      <div 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: style.bgColor, color: style.textColor }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: style.dotColor }}
                        />
                        <span>{style.label}</span>
                      </div>
                    );
                  }}
                />

                {/* Priority */}
                <DropdownOptions
                  options={PRIORITY_OPTIONS}
                  value={priority}
                  onChange={(value) => {
                    handleFieldChange('priority', value);
                    handleSave('priority', value);
                  }}
                  minWidth={80}
                  renderTrigger={(selectedOption) => <PriorityBadge priorityKey={priority} />}
                  renderOption={(option) => {
                    const style = priorityMap[option.value] || priorityMap['p2'];
                    return (
                      <div 
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                        style={{ backgroundColor: style.bgColor, color: style.color }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 19V5M5 12l7-7 7 7"/>
                        </svg>
                        <span>{style.label}</span>
                      </div>
                    );
                  }}
                />

                {/* Date Range */}
                <div className="flex items-center text-xs" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>
                  <input
                    type="date"
                    value={localRequirement.deadline || ''}
                    onChange={(e) => {
                      handleFieldChange('deadline', e.target.value);
                      handleSave('deadline', e.target.value);
                    }}
                    className="bg-transparent border-0 p-0 text-xs focus:ring-0 cursor-pointer"
                    style={{ color: 'rgba(26, 29, 46, 0.5)' }}
                  />
                </div>

                {/* Points */}
                <div className="flex items-center gap-1 text-xs" style={{ color: '#E8944A' }}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input
                    type="number"
                    value={localRequirement.points || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      handleFieldChange('points', val);
                      handleSave('points', val);
                    }}
                    className="w-10 bg-transparent border-0 p-0 text-xs font-medium focus:ring-0"
                    style={{ color: '#E8944A' }}
                  />
                  <span className="text-xs">积分</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px mb-4" style={{ backgroundColor: 'rgba(26, 29, 46, 0.06)' }} />

              {/* Info Grid - 2 columns */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>负责人</span>
                  <span className="text-xs font-medium" style={{ color: '#1A1D2E' }}>
                    {currentUser?.nickname || '未分配'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>创建时间</span>
                  <span className="text-xs font-medium" style={{ color: '#1A1D2E' }}>
                    {localRequirement.createdAt ? new Date(localRequirement.createdAt).toLocaleDateString('zh-CN') : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>更新时间</span>
                  <span className="text-xs font-medium" style={{ color: '#1A1D2E' }}>
                    {localRequirement.updatedAt ? new Date(localRequirement.updatedAt).toLocaleDateString('zh-CN') : '-'}
                  </span>
                </div>
              </div>

              {/* 父需求字段 - 仅子需求显示 */}
              {displayedRequirement?.parentId && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>父需求</span>
                    <button
                      onClick={handleBackToParent}
                      className="text-xs font-medium hover:underline transition-colors"
                      style={{ color: '#E8944A' }}
                    >
                      {getParentRequirementName()}
                    </button>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="w-full h-px mb-4" style={{ backgroundColor: 'rgba(26, 29, 46, 0.06)' }} />

              {/* Description Section */}
              <div className="mb-4">
                <div className="text-xs font-semibold mb-2" style={{ color: '#1A1D2E' }}>描述</div>
                <div className="text-sm leading-relaxed" style={{ color: '#1A1D2E' }}>
                  <MarkdownEditorField
                    value={localRequirement.description || ''}
                    fieldName="description"
                    label=""
                    placeholder="添加需求描述..."
                    onSave={(field, value) => {
                      handleFieldChange(field, value);
                      return handleSave(field, value);
                    }}
                    minRows={6}
                    maxRows={15}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px mb-4" style={{ backgroundColor: 'rgba(26, 29, 46, 0.06)' }} />

              {/* Sub Requirements Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgba(26, 29, 46, 0.5)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: '#1A1D2E' }}>子需求</span>
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(26, 29, 46, 0.06)', color: 'rgba(26, 29, 46, 0.6)' }}
                    >
                      {subRequirements.length}
                    </span>
                  </div>
                  {/* 只在查看父需求时显示新建按钮 */}
                  {viewStack.length === 0 && (
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                      style={{ color: '#E8944A' }}
                      onClick={() => setShowSubRequirementModal(true)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(232, 148, 74, 0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      新建
                    </button>
                  )}
                </div>
                
                {/* Sub Requirements List */}
                {loadingSubRequirements ? (
                  <div className="text-center py-2 text-xs text-gray-400">加载中...</div>
                ) : subRequirements.length === 0 ? (
                  <div 
                    className="rounded-lg p-3 text-center text-xs"
                    style={{ backgroundColor: '#F5F0F0', color: 'rgba(26, 29, 46, 0.5)' }}
                  >
                    暂无子需求
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subRequirements.map((sub) => (
                      <div 
                        key={sub.id}
                        className="rounded-lg p-2 text-xs cursor-pointer hover:bg-gray-100 transition-colors"
                        style={{ backgroundColor: '#F5F0F0' }}
                        onClick={() => handleSubRequirementClick(sub)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate" style={{ color: '#1A1D2E' }}>
                            {sub.name}
                          </span>
                          <span 
                            className="px-1.5 py-0.5 rounded text-[10px]"
                            style={{ 
                              backgroundColor: sub.status === 'done' ? '#F0FDF4' : sub.status === 'in_progress' ? '#EFF6FF' : '#F1F5F9',
                              color: sub.status === 'done' ? '#22C55E' : sub.status === 'in_progress' ? '#3B82F6' : '#64748B'
                            }}
                          >
                            {sub.status === 'done' ? '已完成' : sub.status === 'in_progress' ? '进行中' : '待办'}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px]" style={{ color: 'rgba(26, 29, 46, 0.5)' }}>
                          <span>{sub.workItemId}</span>
                          <span>·</span>
                          <span>{sub.points} 积分</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-full h-px mb-4" style={{ backgroundColor: 'rgba(26, 29, 46, 0.06)' }} />

              {/* Related Tasks Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: 'rgba(26, 29, 46, 0.5)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: '#1A1D2E' }}>关联任务</span>
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(26, 29, 46, 0.06)', color: 'rgba(26, 29, 46, 0.6)' }}
                    >
                      0
                    </span>
                  </div>
                  <button
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                    style={{ color: '#E8944A' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(232, 148, 74, 0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    新建
                  </button>
                </div>
                
                {/* Empty State */}
                <div 
                  className="rounded-lg p-3 text-center text-xs"
                  style={{ backgroundColor: '#F5F0F0', color: 'rgba(26, 29, 46, 0.5)' }}
                >
                  暂无关联任务
                </div>
              </div>
            </div>

            {isCreateMode && (
              <div 
                className="flex justify-end gap-2 px-6 py-3 flex-shrink-0"
                style={{ borderTop: '1px solid rgba(26, 29, 46, 0.06)', backgroundColor: '#FAFAFA' }}
              >
                <button 
                  onClick={handleClose} 
                  className="px-4 py-1.5 text-sm rounded-lg transition-colors"
                  style={{ color: 'rgba(26, 29, 46, 0.6)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(26, 29, 46, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  取消
                </button>
                <button 
                  onClick={handleCreate} 
                  disabled={submitting || !localRequirement.name?.trim()}
                  className="px-4 py-1.5 text-sm text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#E8944A' }}
                  onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#D4843A')}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8944A'}
                >
                  {submitting ? '创建中...' : '创建需求'}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Fixed width 360px - 创建模式下隐藏 */}
          {!isCreateMode && (
          <div 
            className="flex flex-col overflow-hidden"
            style={{ width: '360px' }}
          >
            {/* Tab Bar - 44px height */}
            <div 
              className="flex items-center flex-shrink-0"
              style={{ height: '44px', borderBottom: '1px solid rgba(26, 29, 46, 0.06)' }}
            >
              <button
                onClick={() => setActiveTab('comments')}
                className="flex items-center gap-1 px-4 h-full text-sm font-medium transition-colors relative"
                style={{ 
                  color: activeTab === 'comments' ? '#E8944A' : 'rgba(26, 29, 46, 0.5)',
                }}
              >
                <span>评论</span>
                <span style={{ color: activeTab === 'comments' ? 'rgba(232, 148, 74, 0.5)' : 'rgba(26, 29, 46, 0.3)' }}>
                  {commentCount}
                </span>
                {activeTab === 'comments' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#E8944A' }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className="flex items-center px-4 h-full text-sm font-medium transition-colors relative"
                style={{ 
                  color: activeTab === 'activity' ? '#E8944A' : 'rgba(26, 29, 46, 0.5)',
                }}
              >
                <span>操作记录</span>
                {activeTab === 'activity' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#E8944A' }}
                  />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto" style={{ padding: '16px' }}>
              {!isCreateMode && (displayedRequirement || requirement) ? (
                activeTab === 'comments' ? (
                  <CommentSection 
                    requirementId={displayedRequirement?.id || requirement!.id} 
                    onCountChange={setCommentCount}
                  />
                ) : (
                  <div 
                    className="text-center py-8 text-sm"
                    style={{ color: 'rgba(26, 29, 46, 0.4)' }}
                  >
                    暂无操作记录
                  </div>
                )
              ) : (
                <div 
                  className="flex items-center justify-center h-full text-sm text-center"
                  style={{ color: 'rgba(26, 29, 46, 0.4)' }}
                >
                  <div>
                    <svg className="w-10 h-10 mx-auto mb-2" style={{ color: 'rgba(26, 29, 46, 0.15)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    创建后可查看
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onDiscard={() => { setShowUnsavedDialog(false); onClose(); }}
        onCancel={() => setShowUnsavedDialog(false)}
      />

      {/* 子需求创建弹窗 */}
      {requirement && (
        <SubRequirementModal
          isOpen={showSubRequirementModal}
          onClose={() => setShowSubRequirementModal(false)}
          onSubmit={handleCreateSubRequirement}
          parentRequirement={{
            id: requirement.id,
            workItemId: requirement.workItemId,
            name: requirement.name,
            priority: requirement.priority,
          }}
          projectId={projectId}
        />
      )}
    </>
  );
}
