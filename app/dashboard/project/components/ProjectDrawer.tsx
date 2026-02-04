'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectCreateRequest, ProjectStatus, ProjectType, ProjectPriority } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import EditableField from './EditableField';
import MarkdownEditorField from './MarkdownEditorField';
import EditableTagList from './EditableTagList';
import EditableGoalList from './EditableGoalList';
import SaveStatusIndicator, { SaveStatus } from './SaveStatusIndicator';
import CoverImageUpload from './CoverImageUpload';
import './animations.css';

interface ProjectDrawerProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
  onSave?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

// 默认新项目数据
const getDefaultProjectData = (): ProjectCreateRequest => ({
  name: '',
  description: '',
  type: 'code',
  priority: 'medium',
  status: 'normal',
  startDate: new Date().toISOString().split('T')[0],
  endDate: null,
  goals: [],
  tags: [],
  points: 0,
  coverImageUrl: undefined
});

export default function ProjectDrawer({ 
  open, 
  onClose, 
  project, 
  onSave, 
  onDelete 
}: ProjectDrawerProps) {
  const { t } = useLanguage();
  
  // 本地项目数据
  const [localProject, setLocalProject] = useState<ProjectCreateRequest | null>(null);
  
  // 全局保存状态
  const [globalSaveStatus, setGlobalSaveStatus] = useState<SaveStatus>('idle');
  const [globalErrorMessage, setGlobalErrorMessage] = useState<string | null>(null);
  
  // 提交状态（用于新建项目）
  const [submitting, setSubmitting] = useState(false);
  
  
  // 动画状态
  const [isAnimating, setIsAnimating] = useState(false);
  // 内容区域动画状态
  const [contentVisible, setContentVisible] = useState(false);
  
  // 自动计算积分
  const [autoCalculatePoints, setAutoCalculatePoints] = useState(false);

  // 是否是新建模式
  const isCreateMode = !project;

  // 初始化本地数据
  useEffect(() => {
    if (project) {
      setLocalProject({
        name: project.name,
        description: project.description || '',
        type: project.type,
        priority: project.priority,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        goals: project.goals || [],
        tags: project.tags || [],
        points: project.points || 0,
        coverImageUrl: project.coverImageUrl
      });
    } else {
      setLocalProject(getDefaultProjectData());
    }
  }, [project]);

  // 动画控制
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      // 延迟显示内容区域，让抽屉先滑入
      setTimeout(() => {
        setContentVisible(true);
      }, 100);
    } else {
      setContentVisible(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [open]);

  // 单字段保存（编辑模式）
  const handleFieldSave = useCallback(async (fieldName: string, value: string | string[] | null) => {
    // 更新本地状态
    setLocalProject(prev => prev ? { ...prev, [fieldName]: value } : prev);

    // 新建模式下不调用 API
    if (isCreateMode) {
      return;
    }

    // 编辑模式：调用 API 保存
    setGlobalSaveStatus('saving');
    setGlobalErrorMessage(null);

    try {
      const response = await fetch(`/api/projects/${project!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldName]: value })
      });

      const result = await response.json();
      if (response.status === 401) {
        window.location.href = `/?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (result.success) {
        setGlobalSaveStatus('saved');
        if (onSave && result.project) onSave(result.project);
        setTimeout(() => setGlobalSaveStatus('idle'), 2000);
      } else {
        throw new Error(result.message || t('project.saveFailed'));
      }
    } catch (error) {
      setGlobalSaveStatus('error');
      setGlobalErrorMessage(error instanceof Error ? error.message : t('project.saveFailed'));
    }
  }, [isCreateMode, project, onSave]);

  // 创建新项目
  const handleCreate = async () => {
    if (!localProject || !localProject.name.trim()) {
      setGlobalSaveStatus('error');
      setGlobalErrorMessage(t('project.nameRequired'));
      return;
    }

    setSubmitting(true);
    setGlobalSaveStatus('saving');
    setGlobalErrorMessage(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...localProject,
          autoCalculatePoints: autoCalculatePoints
        })
      });

      const result = await response.json();
      if (response.status === 401) {
        window.location.href = `/?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (result.success) {
        setGlobalSaveStatus('saved');
        if (onSave && result.project) {
          onSave(result.project);
        }
        onClose();
      } else {
        throw new Error(result.message || t('project.createFailed'));
      }
    } catch (error) {
      setGlobalSaveStatus('error');
      setGlobalErrorMessage(error instanceof Error ? error.message : t('project.createFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAnimating) return null;

  // 类型选项
  const typeOptions = [
    { value: 'code', label: t('project.type.code') },
    { value: 'life', label: t('project.type.life') }
  ];

  // 优先级选项
  const priorityOptions = [
    { value: 'high', label: t('project.priority.high') },
    { value: 'medium', label: t('project.priority.medium') },
    { value: 'low', label: t('project.priority.low') }
  ];

  // 状态选项
  const statusOptions = [
    { value: 'normal', label: t('project.status.normal') },
    { value: 'at_risk', label: t('project.status.at_risk') },
    { value: 'out_of_control', label: t('project.status.out_of_control') }
  ];

  return (
    <>
      {/* 背景遮罩 */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}>
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
      </div>

      {/* Drawer 主体 */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[600px] shadow-2xl bg-white flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">
              {isCreateMode ? t('project.drawer.createTitle') : t('project.drawer.editTitle')}
            </h2>
            <SaveStatusIndicator 
              status={globalSaveStatus} 
              errorMessage={globalErrorMessage || undefined}
            />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* 主体内容 */}
        <div className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ease-out ${
          contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {localProject && (
            <div className="space-y-6">
              {/* 项目头部信息 */}
              <div className="flex items-start gap-4">
                <div className="text-4xl">
                  {project?.avatar || (localProject.type === 'code' ? '💻' : '🏠')}
                </div>
                <div className="flex-1">
                  <EditableField
                    value={localProject.name}
                    fieldName="name"
                    label={t('project.form.name')}
                    type="text"
                    required
                    placeholder={t('project.form.namePlaceholder')}
                    onSave={handleFieldSave}
                  />
                </div>
              </div>

              {/* 描述 */}
              <MarkdownEditorField
                value={localProject.description}
                fieldName="description"
                label={t('project.form.description')}
                placeholder={t('project.form.descriptionPlaceholder')}
                onSave={handleFieldSave}
              />

              {/* 背景图 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('project.form.coverImage')}
                </label>
                <CoverImageUpload
                  value={localProject.coverImageUrl}
                  onChange={(url) => {
                    setLocalProject(prev => prev ? { ...prev, coverImageUrl: url } : prev);
                    if (!isCreateMode && project) {
                      handleFieldSave('coverImageUrl', url ?? null);
                    }
                  }}
                />
              </div>

              {/* 类型和优先级 */}
              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  value={localProject.type}
                  fieldName="type"
                  label={t('project.form.type')}
                  type="select"
                  options={typeOptions}
                  required
                  onSave={handleFieldSave}
                />
                <EditableField
                  value={localProject.priority}
                  fieldName="priority"
                  label={t('project.form.priority')}
                  type="select"
                  options={priorityOptions}
                  required
                  onSave={handleFieldSave}
                />
              </div>

              {/* 状态 */}
              <EditableField
                value={localProject.status}
                fieldName="status"
                label={t('project.status')}
                type="select"
                options={statusOptions}
                required
                onSave={handleFieldSave}
              />

              {/* 日期 */}
              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  value={localProject.startDate}
                  fieldName="startDate"
                  label={t('project.startTime')}
                  type="date"
                  required
                  onSave={handleFieldSave}
                />
                <EditableField
                  value={localProject.endDate}
                  fieldName="endDate"
                  label={t('project.deadline')}
                  type="date"
                  onSave={handleFieldSave}
                />
              </div>

              {/* 进度（只读） */}
              {project && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('project.progress')}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              )}

              {/* 积分 */}
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="autoCalculatePoints"
                    checked={autoCalculatePoints}
                    onChange={(e) => {
                      setAutoCalculatePoints(e.target.checked);
                      if (e.target.checked && localProject) {
                        const pointsMap: Record<ProjectPriority, number> = {
                          high: 20,
                          medium: 10,
                          low: 5
                        };
                        setLocalProject({ ...localProject, points: pointsMap[localProject.priority] });
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="autoCalculatePoints" className="text-sm font-medium text-gray-700">
                    根据优先级自动计算积分
                  </label>
                </div>
                <EditableField
                  value={String(localProject.points || 0)}
                  fieldName="points"
                  label="积分"
                  type="text"
                  placeholder="输入积分值"
                  disabled={autoCalculatePoints}
                  onSave={async (fieldName, value) => {
                    // 将字符串转换为数字
                    const numValue = value ? parseInt(value) || 0 : 0;
                    if (numValue < 0) {
                      throw new Error('积分不能为负数');
                    }
                    await handleFieldSave(fieldName, String(numValue));
                  }}
                />
                {autoCalculatePoints && localProject && (
                  <p className="text-xs text-gray-500 mt-1">
                    当前优先级 {localProject.priority === 'high' ? '高' : localProject.priority === 'medium' ? '中' : '低'} 对应积分: {localProject.points}
                  </p>
                )}
              </div>

              {/* 目标 */}
              <EditableGoalList
                goals={localProject.goals}
                label={t('project.form.goals')}
                placeholder={t('project.form.goalPlaceholder')}
                onSave={handleFieldSave}
              />

              {/* 标签 */}
              <EditableTagList
                tags={localProject.tags}
                label={t('project.form.tags')}
                placeholder={t('project.form.addTag')}
                onSave={handleFieldSave}
              />

              {/* 时间戳（只读） */}
              {project && (
                <div className="text-xs text-gray-500 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>{t('project.createdAt')}：{new Date(project.createdAt).toLocaleString()}</span>
                    <span>{t('project.updatedAt')}：{new Date(project.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          {/* 新建模式：显示创建按钮 */}
          {isCreateMode && (
            <button
              onClick={handleCreate}
              disabled={submitting || !localProject?.name?.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? t('project.creating') : t('project.create')}
            </button>
          )}
          
          {/* 编辑模式：显示删除按钮 */}
        </div>
      </div>
    </>
  );
}
