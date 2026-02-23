'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '@/app/lib/definitions';

interface RelatedTaskListProps {
  requirementId: string;
  projectId: string;
  relatedTasks?: string[];
  onUpdateRelatedTasks?: (taskIds: string[]) => void;
}

// 状态映射
const statusMap: Record<TaskStatus, { label: string; color: string }> = {
  'todo': { label: '待办', color: 'bg-slate-100 text-slate-600' },
  'in_progress': { label: '进行中', color: 'bg-blue-100 text-blue-600' },
  'review': { label: '审核中', color: 'bg-yellow-100 text-yellow-600' },
  'done': { label: '已完成', color: 'bg-green-100 text-green-600' },
};

export default function RelatedTaskList({ 
  requirementId, 
  projectId,
  relatedTasks = [],
  onUpdateRelatedTasks 
}: RelatedTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [saving, setSaving] = useState(false);

  // 加载任务列表
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      // 加载关联的任务详情
      if (relatedTasks.length > 0) {
        const taskPromises = relatedTasks.map(id => 
          fetch(`/api/tasks/${id}`).then(res => res.json())
        );
        const taskResults = await Promise.all(taskPromises);
        const relatedTaskList = taskResults
          .filter(r => r.success)
          .map(r => r.task);
        setTasks(relatedTaskList);
      } else {
        setTasks([]);
      }

      // 加载项目所有任务（用于选择器）
      const projectResponse = await fetch(`/api/tasks?projectId=${projectId}`);
      const projectData = await projectResponse.json();
      if (projectData.success) {
        setProjectTasks(projectData.tasks || []);
      }
    } catch (err) {
      console.error('加载任务失败:', err);
    } finally {
      setLoading(false);
    }
  }, [relatedTasks, projectId]);

  useEffect(() => {
    if (requirementId && projectId) {
      loadTasks();
    }
  }, [requirementId, projectId, loadTasks]);

  // 添加关联任务
  const handleAddTask = async (taskId: string) => {
    if (relatedTasks.includes(taskId)) return;
    
    const newRelatedTasks = [...relatedTasks, taskId];
    await saveRelatedTasks(newRelatedTasks);
  };

  // 移除关联任务
  const handleRemoveTask = async (taskId: string) => {
    const newRelatedTasks = relatedTasks.filter(id => id !== taskId);
    await saveRelatedTasks(newRelatedTasks);
  };

  // 保存关联任务
  const saveRelatedTasks = async (taskIds: string[]) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/requirements/${requirementId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relatedTasks: taskIds }),
      });

      const data = await response.json();
      if (data.success) {
        onUpdateRelatedTasks?.(taskIds);
        setShowSelector(false);
        // 重新加载任务列表
        loadTasks();
      } else {
        alert(data.message || '更新关联任务失败');
      }
    } catch (err) {
      alert('更新关联任务失败');
    } finally {
      setSaving(false);
    }
  };

  // 可选任务（排除已关联的）
  const availableTasks = projectTasks.filter(task => 
    !relatedTasks.includes(task.id)
  );

  if (loading) {
    return (
      <div className="text-center py-4 text-slate-400">
        <div className="animate-spin h-5 w-5 border-2 border-slate-300 border-t-indigo-500 rounded-full mx-auto mb-2"></div>
        加载中...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">关联任务</span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <button
          onClick={() => setShowSelector(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加关联
        </button>
      </div>

      {/* 任务列表 */}
      {tasks.length === 0 ? (
        <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-xl">
          <svg className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p className="text-sm">暂无关联任务</p>
          <button
            onClick={() => setShowSelector(true)}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
          >
            添加关联
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-slate-50 rounded-xl p-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-900 truncate">{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{task.id}</p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${statusMap[task.status]?.color || 'bg-slate-100 text-slate-600'}`}>
                    {statusMap[task.status]?.label || task.status}
                  </span>
                  
                  <button
                    onClick={() => handleRemoveTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all"
                    title="解除关联"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {task.assignee && (
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {task.assignee}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 任务选择器弹窗 */}
      {showSelector && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => !saving && setShowSelector(false)}
          />
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">选择要关联的任务</h3>
              <button
                onClick={() => setShowSelector(false)}
                disabled={saving}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {availableTasks.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>暂无可关联的任务</p>
                  <p className="text-sm mt-1">所有任务都已关联或项目中暂无任务</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleAddTask(task.id)}
                      disabled={saving}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100 rounded-xl p-3 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-900 truncate">{task.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{task.id}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${statusMap[task.status]?.color || 'bg-slate-100 text-slate-600'}`}>
                          {statusMap[task.status]?.label || task.status}
                        </span>
                      </div>
                      
                      {task.assignee && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {task.assignee}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
