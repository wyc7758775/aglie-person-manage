'use client';

import { useState, useEffect, useCallback } from 'react';
import { OperationLog } from '@/app/lib/definitions';

interface OperationLogListProps {
  requirementId: string;
}

// 格式化时间
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// 获取操作类型图标
function getActionIcon(action: string): string {
  switch (action) {
    case 'create':
      return '✨';
    case 'update':
      return '✏️';
    case 'delete':
      return '🗑️';
    case 'status_change':
      return '🔄';
    default:
      return '📝';
  }
}

// 获取操作类型颜色
function getActionColor(action: string): string {
  switch (action) {
    case 'create':
      return 'bg-green-100 text-green-700';
    case 'update':
      return 'bg-blue-100 text-blue-700';
    case 'delete':
      return 'bg-red-100 text-red-700';
    case 'status_change':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

// 获取操作类型文本
function getActionText(action: string): string {
  switch (action) {
    case 'create':
      return '创建';
    case 'update':
      return '更新';
    case 'delete':
      return '删除';
    case 'status_change':
      return '状态变更';
    default:
      return '操作';
  }
}

// 获取字段显示名称
function getFieldName(fieldName?: string): string {
  const fieldMap: Record<string, string> = {
    'title': '标题',
    'description': '描述',
    'status': '状态',
    'priority': '优先级',
    'assignee': '负责人',
    'dueDate': '截止时间',
    'points': '积分',
  };
  return fieldMap[fieldName || ''] || fieldName || '字段';
}

export default function OperationLogList({ requirementId }: OperationLogListProps) {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载操作记录
  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/requirements/${requirementId}/logs`);
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs || []);
      } else {
        setError(data.message || '加载操作记录失败');
      }
    } catch (err) {
      setError('加载操作记录失败');
    } finally {
      setLoading(false);
    }
  }, [requirementId]);

  // 初始加载
  useEffect(() => {
    if (requirementId) {
      loadLogs();
    }
  }, [requirementId, loadLogs]);

  // 获取头像首字母
  const getAvatarLetter = (nickname: string): string => {
    return nickname.charAt(0).toUpperCase();
  };

  // 生成头像背景色
  const getAvatarColor = (nickname: string): string => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-indigo-400 to-indigo-600',
      'from-red-400 to-red-600',
      'from-teal-400 to-teal-600',
    ];
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // 渲染操作内容
  const renderLogContent = (log: OperationLog) => {
    if (log.action === 'create') {
      return <span className="text-slate-600">创建了需求</span>;
    }

    if (log.action === 'delete') {
      return <span className="text-slate-600">删除了需求</span>;
    }

    if (log.fieldName) {
      const fieldText = getFieldName(log.fieldName);
      const oldValue = log.oldValue || '(空)';
      const newValue = log.newValue || '(空)';

      return (
        <span className="text-slate-600">
          修改了 <span className="font-medium text-slate-800">{fieldText}</span>：
          <span className="text-slate-400 line-through">{oldValue}</span>
          <span className="mx-1 text-slate-400">→</span>
          <span className="text-indigo-600 font-medium">{newValue}</span>
        </span>
      );
    }

    return <span className="text-slate-600">进行了操作</span>;
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

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl">
        <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>暂无操作记录</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 时间线 */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200"></div>

      <div className="space-y-4">
        {logs.map((log, index) => (
          <div key={log.id} className="relative pl-12">
            {/* 时间线节点 */}
            <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center text-sm ${getActionColor(log.action)}`}>
              {getActionIcon(log.action)}
            </div>

            {/* 内容卡片 */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* 用户头像 */}
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarColor(log.userNickname)} flex items-center justify-center text-white text-xs font-medium`}>
                    {getAvatarLetter(log.userNickname)}
                  </div>
                  <span className="font-medium text-slate-900">{log.userNickname}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                    {getActionText(log.action)}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{formatTime(log.createdAt)}</span>
              </div>

              {/* 操作详情 */}
              <div className="text-sm">{renderLogContent(log)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
