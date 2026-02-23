'use client';

import { useState, useEffect, useCallback } from 'react';
import { Requirement } from '@/app/lib/definitions';
import { XMarkIcon, MagnifyingGlassIcon, CheckIcon, LinkIcon } from '@heroicons/react/24/outline';

interface LinkParentRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentRequirementId?: string | null;
  linkedRequirementIds: string[];
  onLinkRequirement: (requirementId: string) => void;
  onUnlinkRequirement: (requirementId: string) => void;
}

export default function LinkParentRequirementModal({
  isOpen,
  onClose,
  projectId,
  currentRequirementId,
  linkedRequirementIds,
  onLinkRequirement,
  onUnlinkRequirement,
}: LinkParentRequirementModalProps) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 加载需求列表
  const loadRequirements = useCallback(async () => {
    if (!isOpen || !projectId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/requirements?projectId=${projectId}`);
      const data = await response.json();
      if (data.success) {
        // 过滤掉当前需求本身（避免自关联）
        const filtered = (data.requirements || []).filter(
          (req: Requirement) => req.id !== currentRequirementId
        );
        setRequirements(filtered);
      }
    } catch (err) {
      console.error('加载需求列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, [isOpen, projectId, currentRequirementId]);

  useEffect(() => {
    if (isOpen) {
      loadRequirements();
      setSelectedIds(linkedRequirementIds);
    }
  }, [isOpen, linkedRequirementIds, loadRequirements]);

  // 搜索过滤
  const filteredRequirements = requirements.filter(req => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      req.title.toLowerCase().includes(query) ||
      req.id.toLowerCase().includes(query)
    );
  });

  // 已关联的需求
  const linkedRequirements = requirements.filter(req => 
    linkedRequirementIds.includes(req.id)
  );

  // 可关联的需求
  const availableRequirements = filteredRequirements.filter(req => 
    !linkedRequirementIds.includes(req.id)
  );

  // 切换选择
  const toggleSelection = (reqId: string) => {
    if (linkedRequirementIds.includes(reqId)) {
      onUnlinkRequirement(reqId);
    } else {
      onLinkRequirement(reqId);
    }
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      'todo': { bg: '#F5F5F5', text: '#666666', label: '待办' },
      'in_progress': { bg: '#EEF2FF', text: '#4F46E5', label: '进行中' },
      'review': { bg: '#FEF3C7', text: '#D97706', label: '审核中' },
      'done': { bg: '#D1FAE5', text: '#059669', label: '已完成' },
      'cancelled': { bg: '#FEE2E2', text: '#DC2626', label: '已取消' },
    };
    return styles[status] || styles['todo'];
  };

  // 获取优先级样式
  const getPriorityStyle = (priority: string) => {
    const styles: Record<string, { color: string; label: string }> = {
      'p0': { color: '#EF4444', label: '紧急' },
      'p1': { color: '#F97316', label: '高' },
      'p2': { color: '#EAB308', label: '中' },
      'p3': { color: '#3B82F6', label: '低' },
      'p4': { color: '#9CA3AF', label: '最低' },
    };
    return styles[priority] || styles['p2'];
  };

  if (!isOpen) return null;

  const newlyLinkedCount = linkedRequirementIds.filter(id => 
    !selectedIds.includes(id)
  ).length;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      
      {/* 弹窗主体 */}
      <div 
        className="relative bg-white flex flex-col"
        style={{ 
          width: '520px',
          maxHeight: '80vh',
          borderRadius: '16px',
          boxShadow: '0 8px 60px rgba(26, 29, 46, 0.3)',
        }}
      >
        {/* Header - 56px */}
        <div 
          className="flex items-center justify-between shrink-0"
          style={{ 
            height: '56px',
            padding: '0 24px',
            borderBottom: '1px solid rgba(26, 29, 46, 0.1)',
          }}
        >
          <div className="flex items-center" style={{ gap: '10px' }}>
            <LinkIcon className="w-5 h-5" style={{ color: '#E8944A' }} />
            <span 
              style={{ 
                fontSize: '16px', 
                fontWeight: 700, 
                color: '#1A1D2E',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              关联父需求
            </span>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ 
              width: '32px', 
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F5F5F5',
            }}
          >
            <XMarkIcon className="w-4 h-4" style={{ color: '#1A1D2E' }} />
          </button>
        </div>

        {/* Body */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{ padding: '20px 24px', gap: '16px', display: 'flex', flexDirection: 'column' }}
        >
          {/* 搜索框 */}
          <div 
            className="flex items-center"
            style={{ 
              height: '40px',
              padding: '0 14px',
              borderRadius: '10px',
              backgroundColor: '#F5F5F5',
              gap: '10px',
            }}
          >
            <MagnifyingGlassIcon className="w-4 h-4" style={{ color: '#1A1D2E88' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索需求名称或 ID..."
              className="flex-1 bg-transparent focus:outline-none"
              style={{ 
                fontSize: '13px',
                color: '#1A1D2E',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400">
              <div 
                className="animate-spin mx-auto mb-2"
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid #E5E7EB',
                  borderTopColor: '#E8944A',
                  borderRadius: '50%',
                }}
              />
              <p style={{ fontSize: '13px' }}>加载中...</p>
            </div>
          ) : (
            <>
              {/* 已关联父需求 */}
              {linkedRequirements.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 600, 
                      color: '#1A1D2E88',
                      letterSpacing: '0.5px',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    已关联父需求
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {linkedRequirements.map((req) => {
                      const statusStyle = getStatusStyle(req.status);
                      return (
                        <div
                          key={req.id}
                          onClick={() => toggleSelection(req.id)}
                          className="flex items-center justify-between cursor-pointer"
                          style={{ 
                            padding: '10px 14px',
                            borderRadius: '10px',
                            backgroundColor: '#F5F5F5',
                          }}
                        >
                          <div className="flex items-center" style={{ gap: '10px' }}>
                            <div 
                              className="flex items-center justify-center"
                              style={{ 
                                width: '20px', 
                                height: '20px',
                                borderRadius: '4px',
                                backgroundColor: '#E8944A',
                              }}
                            >
                              <CheckIcon className="w-3 h-3 text-white" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span 
                                style={{ 
                                  fontSize: '13px', 
                                  fontWeight: 500, 
                                  color: '#1A1D2E',
                                  fontFamily: 'Inter, sans-serif',
                                }}
                              >
                                {req.title}
                              </span>
                              <span 
                                style={{ 
                                  fontSize: '11px', 
                                  color: '#1A1D2E55',
                                  fontFamily: 'Inter, sans-serif',
                                }}
                              >
                                {req.id}
                              </span>
                            </div>
                          </div>
                          <span 
                            style={{ 
                              fontSize: '11px', 
                              fontWeight: 500,
                              color: statusStyle.text,
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {statusStyle.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 可关联父需求 */}
              {availableRequirements.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 600, 
                      color: '#1A1D2E88',
                      letterSpacing: '0.5px',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    可关联父需求
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {availableRequirements.map((req) => {
                      const statusStyle = getStatusStyle(req.status);
                      const priorityStyle = getPriorityStyle(req.priority);
                      return (
                        <div
                          key={req.id}
                          onClick={() => toggleSelection(req.id)}
                          className="flex items-center justify-between cursor-pointer"
                          style={{ 
                            padding: '10px 14px',
                            borderRadius: '10px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid rgba(26, 29, 46, 0.1)',
                          }}
                        >
                          <div className="flex items-center" style={{ gap: '10px' }}>
                            <div 
                              className="flex items-center justify-center"
                              style={{ 
                                width: '20px', 
                                height: '20px',
                                borderRadius: '4px',
                                border: '1.5px solid rgba(26, 29, 46, 0.2)',
                              }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span 
                                style={{ 
                                  fontSize: '13px', 
                                  fontWeight: 500, 
                                  color: '#1A1D2E',
                                  fontFamily: 'Inter, sans-serif',
                                }}
                              >
                                {req.title}
                              </span>
                              <div className="flex items-center" style={{ gap: '6px' }}>
                                <span 
                                  style={{ 
                                    fontSize: '11px', 
                                    color: '#1A1D2E55',
                                    fontFamily: 'Inter, sans-serif',
                                  }}
                                >
                                  {req.id}
                                </span>
                                <span 
                                  style={{ 
                                    fontSize: '10px', 
                                    fontWeight: 500,
                                    color: priorityStyle.color,
                                    fontFamily: 'Inter, sans-serif',
                                  }}
                                >
                                  {priorityStyle.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span 
                            style={{ 
                              fontSize: '11px', 
                              fontWeight: 500,
                              color: statusStyle.text,
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {statusStyle.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 空状态 */}
              {filteredRequirements.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p style={{ fontSize: '13px', color: '#1A1D2E55' }}>
                    {searchQuery ? '未找到匹配的需求' : '暂无可关联的需求'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - 60px */}
        <div 
          className="flex items-center justify-between shrink-0"
          style={{ 
            height: '60px',
            padding: '0 24px',
            borderTop: '1px solid rgba(26, 29, 46, 0.1)',
          }}
        >
          <div className="flex items-center" style={{ gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#1A1D2E88', fontFamily: 'Inter, sans-serif' }}>
              已选择
            </span>
            <span 
              style={{ 
                fontSize: '12px', 
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#E8944A',
                padding: '1px 8px',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {linkedRequirementIds.length}
            </span>
            <span style={{ fontSize: '12px', color: '#1A1D2E88', fontFamily: 'Inter, sans-serif' }}>
              个父需求
              {newlyLinkedCount > 0 && `（新增 ${newlyLinkedCount} 个）`}
            </span>
          </div>
          
          <div className="flex items-center" style={{ gap: '12px' }}>
            <button
              onClick={onClose}
              className="hover:opacity-80 transition-opacity"
              style={{ 
                padding: '8px 20px',
                borderRadius: '10px',
                backgroundColor: '#F5F5F5',
                fontSize: '13px',
                fontWeight: 500,
                color: '#1A1D2E',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              取消
            </button>
            <button
              onClick={onClose}
              className="hover:opacity-80 transition-opacity flex items-center"
              style={{ 
                padding: '8px 20px',
                borderRadius: '10px',
                backgroundColor: '#E8944A',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                gap: '6px',
              }}
            >
              <CheckIcon className="w-4 h-4" />
              确认关联
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
