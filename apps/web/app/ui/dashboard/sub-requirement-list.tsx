'use client';

import { useState, useEffect, useCallback } from 'react';
import { Requirement } from '@/app/lib/definitions';
import { StatusBadge, PriorityBadge } from './requirement-badges';

interface SubRequirementListProps {
  requirementId: string;
  projectId: string;
  onCreateSubRequirement?: () => void;
  onViewSubRequirement?: (req: Requirement) => void;
}

export default function SubRequirementList({ 
  requirementId, 
  projectId,
  onCreateSubRequirement,
  onViewSubRequirement 
}: SubRequirementListProps) {
  const [subRequirements, setSubRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载子需求列表
  const loadSubRequirements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 目前通过查询所有需求并过滤 parent_id 来实现
      // 后续可以添加专门的 API
      const response = await fetch(`/api/requirements?projectId=${projectId}`);
      const data = await response.json();
      if (data.success) {
        // 过滤出当前需求的子需求
        // 注意：这里假设后端 API 支持返回 parent_id 字段
        const subs = (data.requirements || []).filter(
          (req: Requirement & { parentId?: string }) => req.parentId === requirementId
        );
        setSubRequirements(subs);
      } else {
        setError(data.message || '加载子需求失败');
      }
    } catch (err) {
      setError('加载子需求失败');
    } finally {
      setLoading(false);
    }
  }, [requirementId, projectId]);

  // 初始加载
  useEffect(() => {
    if (requirementId && projectId) {
      loadSubRequirements();
    }
  }, [requirementId, projectId, loadSubRequirements]);

  // 获取状态标签颜色
  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'development':
        return 'info';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  // 获取优先级标签颜色
  const getPriorityVariant = (priority: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (priority) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  // 状态映射（后端 -> 前端）
  const statusMap: Record<string, string> = {
    'draft': 'todo',
    'review': 'todo',
    'approved': 'todo',
    'development': 'in_progress',
    'testing': 'done',
    'completed': 'done',
    'rejected': 'cancelled',
  };

  // 优先级映射（后端 -> 前端）
  const priorityMap: Record<string, string> = {
    'critical': 'p0',
    'high': 'p1',
    'medium': 'p2',
    'low': 'p3',
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-slate-400">
        <div className="animate-spin h-5 w-5 border-2 border-slate-300 border-t-indigo-500 rounded-full mx-auto mb-2"></div>
        加载中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">子需求</span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
            {subRequirements.length}
          </span>
        </div>
        
        <button
          onClick={onCreateSubRequirement}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          创建子需求
        </button>
      </div>

      {/* 子需求列表 */}
      {subRequirements.length === 0 ? (
        <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-xl">
          <svg className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">暂无子需求</p>
          <button
            onClick={onCreateSubRequirement}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
          >
            创建一个
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {subRequirements.map((req) => (
            <div 
              key={req.id} 
              onClick={() => onViewSubRequirement?.(req)}
              className="bg-slate-50 rounded-xl p-3 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-900 truncate">{req.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{req.id}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={statusMap[req.status] || req.status} />
                  <PriorityBadge priority={priorityMap[req.priority] || req.priority} />
                </div>
              </div>
              
              {req.assignee && (
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {req.assignee}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
