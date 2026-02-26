'use client';

import { useState, useEffect, useCallback } from 'react';
import { OperationLog } from '@/app/lib/definitions';

interface FieldChangeLogProps {
  entityType: 'task' | 'requirement' | 'defect' | 'project';
  entityId: string;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

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

function getFieldName(fieldName?: string): string {
  const fieldMap: Record<string, string> = {
    'title': '标题',
    'description': '描述',
    'status': '状态',
    'priority': '优先级',
    'assignee': '负责人',
    'dueDate': '截止时间',
    'points': '积分',
    'subtask': '子任务',
    'link': '关联',
  };
  return fieldMap[fieldName || ''] || fieldName || '字段';
}

function getEntityName(entityType: string): string {
  const entityMap: Record<string, string> = {
    'task': '任务',
    'requirement': '需求',
    'defect': '缺陷',
    'project': '项目',
  };
  return entityMap[entityType] || '项目';
}

function getAvatarColor(nickname: string): string {
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
}

function LogItem({ log, entityType }: { log: OperationLog; entityType: string }) {
  const renderLogContent = () => {
    if (log.action === 'create') {
      return <span style={{ color: 'rgba(26, 29, 46, 0.6)' }}>创建了{getEntityName(entityType)}</span>;
    }

    if (log.action === 'delete') {
      return <span style={{ color: 'rgba(26, 29, 46, 0.6)' }}>删除了{getEntityName(entityType)}</span>;
    }

    if (log.fieldName) {
      const fieldText = getFieldName(log.fieldName);
      const oldValue = log.oldValue || '(空)';
      const newValue = log.newValue || '(空)';

      return (
        <span style={{ color: 'rgba(26, 29, 46, 0.6)' }}>
          修改了 <span style={{ fontWeight: 500, color: '#1A1D2E' }}>{fieldText}</span>：
          <span style={{ color: 'rgba(26, 29, 46, 0.4)', textDecoration: 'line-through' }}>{oldValue}</span>
          <span style={{ color: 'rgba(26, 29, 46, 0.4)', margin: '0 4px' }}>→</span>
          <span style={{ color: '#E8944A', fontWeight: 500 }}>{newValue}</span>
        </span>
      );
    }

    return <span style={{ color: 'rgba(26, 29, 46, 0.6)' }}>进行了操作</span>;
  };

  return (
    <div className="relative">
      <div 
        className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-sm" 
        style={{ backgroundColor: getActionColor(log.action).split(' ')[0] }}
      >
        {getActionIcon(log.action)}
      </div>
      <div style={{ marginLeft: '44px', backgroundColor: '#F5F0F0', borderRadius: '12px', padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              className="w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-medium"
              style={{ background: getAvatarColor(log.userNickname).replace('from-', '').replace(' to-', '/') }}
            >
              {log.userNickname.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: 500, color: '#1A1D2E' }}>{log.userNickname}</span>
            <span 
              style={{ 
                fontSize: '10px', 
                padding: '2px 6px', 
                borderRadius: '9999px', 
                backgroundColor: 'white', 
                border: '1px solid rgba(26, 29, 46, 0.1)', 
                color: 'rgba(26, 29, 46, 0.6)' 
              }}
            >
              {getActionText(log.action)}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(26, 29, 46, 0.4)' }}>{formatTime(log.createdAt)}</span>
        </div>
        <div style={{ fontSize: '13px' }}>{renderLogContent()}</div>
      </div>
    </div>
  );
}

export default function FieldChangeLog({ entityType, entityId }: FieldChangeLogProps) {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = useCallback(async () => {
    if (!entityId) return;
    
    setLoading(true);
    try {
      const entityTypePlural = entityType === 'task' ? 'todos' : 'requirements';
      const response = await fetch(`/api/${entityTypePlural}/${entityId}/logs`);
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('加载操作记录失败:', error);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    if (entityId) {
      loadLogs();
    }
  }, [entityId, loadLogs]);

  if (loading) {
    return (
      <div className="text-center py-8 text-sm" style={{ color: 'rgba(26, 29, 46, 0.4)' }}>
        加载中...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-sm" style={{ color: 'rgba(26, 29, 46, 0.4)' }}>
        暂无操作记录
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <LogItem key={log.id} log={log} entityType={entityType} />
      ))}
    </div>
  );
}
