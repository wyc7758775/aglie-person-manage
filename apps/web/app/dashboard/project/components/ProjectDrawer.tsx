'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectCreateRequest, ProjectStatus, ProjectType, ProjectPriority, ProjectIndicator } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import EditableField from './EditableField';
import MarkdownEditorField from '@/app/ui/dashboard/markdown-editor-field';
import SaveStatusIndicator, { SaveStatus } from './SaveStatusIndicator';
import CoverImageUpload from './CoverImageUpload';
import UnsavedChangesDialog from './UnsavedChangesDialog';


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
  type: 'sprint-project',
  priority: 'medium',
  status: 'normal',
  startDate: new Date().toISOString().split('T')[0],
  endDate: null,
  goals: [],
  tags: [],
  points: 200,
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
  
  
  // 自动计算积分
  const [autoCalculatePoints, setAutoCalculatePoints] = useState(true);
  
  // Tooltip 显示状态
  const [showPointsTooltip, setShowPointsTooltip] = useState(false);

  // 指标管理状态
  const [indicators, setIndicators] = useState<ProjectIndicator[]>([]);

  // 是否是新建模式
  const isCreateMode = !project;

  // 初始数据快照（用于变更检测）
  const [initialProject, setInitialProject] = useState<ProjectCreateRequest | null>(null);
  const [initialIndicators, setInitialIndicators] = useState<ProjectIndicator[]>([]);

  // 确认弹窗状态
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // 初始化本地数据和快照
  useEffect(() => {
    // 只有在抽屉打开时才初始化
    if (!open) return;
    
    if (project) {
      const projectData = {
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
      };
      const projectIndicators = project.indicators || [];
      
      setLocalProject(projectData);
      setInitialProject(projectData);
      setIndicators(projectIndicators);
      setInitialIndicators(projectIndicators);
    } else {
      // 创建模式：重置为默认值
      const defaultData = getDefaultProjectData();
      setLocalProject(defaultData);
      setInitialProject(defaultData);
      setIndicators([]);
      setInitialIndicators([]);
    }
    
    // 重置其他状态
    setGlobalSaveStatus('idle');
    setGlobalErrorMessage(null);
    setSubmitting(false);
    setAutoCalculatePoints(true);
  }, [open, project]);

  // 检测是否有未保存的更改
  const hasUnsavedChanges = useCallback(() => {
    if (!localProject || !initialProject) return false;
    
    // 比较项目数据
    const projectChanged = JSON.stringify(localProject) !== JSON.stringify(initialProject);
    // 比较指标数据
    const indicatorsChanged = JSON.stringify(indicators) !== JSON.stringify(initialIndicators);
    
    return projectChanged || indicatorsChanged;
  }, [localProject, initialProject, indicators, initialIndicators]);

  // 处理关闭抽屉
  const handleClose = useCallback(() => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  // 放弃更改并关闭
  const handleDiscardAndClose = useCallback(() => {
    setShowUnsavedDialog(false);
    onClose();
  }, [onClose]);

  // 取消关闭
  const handleCancelClose = useCallback(() => {
    setShowUnsavedDialog(false);
  }, []);

  // 监听 ESC 键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !showUnsavedDialog) {
        handleClose();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, showUnsavedDialog, handleClose]);



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

  // 项目类型切换处理（需同步更新 endDate 和 indicators）
  const handleTypeChange = useCallback(async (_fieldName: string, value: string | string[] | null) => {
    const newType = value as ProjectType;

    // 更新本地状态：类型 + endDate
    setLocalProject(prev => prev ? {
      ...prev,
      type: newType,
      endDate: newType === 'slow-burn' ? null : prev.endDate,
    } : prev);

    // 切换到 slow-burn 且没有指标时，自动添加一个默认指标
    if (newType === 'slow-burn') {
      setIndicators(prev => prev.length === 0 ? [{
        id: crypto.randomUUID(),
        name: '',
        value: 0,
        target: 100,
        weight: 0,
      }] : prev);
    }

    // 编辑模式：保存到服务端
    if (!isCreateMode && project) {
      setGlobalSaveStatus('saving');
      setGlobalErrorMessage(null);
      try {
        const updateBody: Record<string, unknown> = { type: newType };
        if (newType === 'slow-burn') {
          updateBody.endDate = null;
        }
        const response = await fetch(`/api/projects/${project.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateBody)
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
    }
  }, [isCreateMode, project, onSave, t]);

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
          autoCalculatePoints: autoCalculatePoints,
          ...(localProject.type === 'slow-burn' ? { indicators } : {}),
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

  // 计算总权重
  const totalWeight = indicators.reduce((sum, ind) => sum + (ind.weight || 0), 0);

  // 计算指标进度
  const calculateProgress = (): number => {
    if (indicators.length === 0) return 0;
    let total = 0;
    for (const ind of indicators) {
      const { value = 0, target = 0, weight = 0 } = ind;
      const progress = target > 0 ? Math.min(100, (value / target) * 100) : 0;
      total += progress * weight;
    }
    return Math.round(total / 100);
  };

  const addIndicator = () => {
    if (indicators.length >= 10) return;
    setIndicators([...indicators, {
      id: crypto.randomUUID(),
      name: '',
      value: 0,
      target: 100,
      weight: 0,
    }]);
  };

  const updateIndicator = (index: number, field: keyof ProjectIndicator, value: string | number) => {
    const updated = [...indicators];
    updated[index] = { ...updated[index], [field]: value };
    setIndicators(updated);
  };

  const removeIndicator = (index: number) => {
    if (indicators.length <= 1) return;
    setIndicators(indicators.filter((_, i) => i !== index));
  };

  if (!open) return null;

  // 类型选项
  const typeOptions = [
    { value: 'sprint-project', label: t('project.type.sprint') },
    { value: 'slow-burn', label: t('project.type.slowBurn') }
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
          onClick={handleClose}
        />
      </div>

      {/* Drawer 主体 */}
      <div data-testid="project-drawer" className={`fixed inset-y-0 right-0 z-50 w-full md:w-[600px] shadow-2xl bg-white flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              {isCreateMode ? t('project.drawer.createTitle') : t('project.drawer.editTitle')}
            </h2>
            <SaveStatusIndicator 
              status={globalSaveStatus} 
              errorMessage={globalErrorMessage || undefined}
            />
          </div>
          <button
            data-testid="drawer-close-button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* 主体内容 - 移除编辑态动画 */}
        <div className="flex-1 overflow-y-auto p-5 [scrollbar-gutter:stable]">
          {localProject && (
            <div className="space-y-5">
              {/* 1. 背景图 - 有图片时保持宽高比，无图片时高度自适应 */}
              <div 
                className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100 relative"
                style={localProject.coverImageUrl ? { aspectRatio: '1.4677' } : undefined}
              >
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

              {/* 2. 项目名称 */}
              <div className="flex items-start gap-4">
                <div className="text-4xl">
                  {localProject.type === 'sprint-project' ? '⚡' : '🌱'}
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

              {/* 3. 项目类型 & 4. 优先级 */}
              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  value={localProject.type}
                  fieldName="type"
                  label={t('project.form.type')}
                  type="select"
                  options={typeOptions}
                  required
                  onSave={handleTypeChange}
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

              {/* 5. 积分与项目状态 - 并列布局 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 积分 */}
                <div>
                  {/* Label 和勾选框并列 - 勾选框挨着积分 label 旁边 */}
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      积分
                    </label>
                    <input
                      type="checkbox"
                      id="autoCalculatePoints"
                      checked={autoCalculatePoints}
                      onChange={(e) => {
                        setAutoCalculatePoints(e.target.checked);
                        if (e.target.checked && localProject) {
                          const pointsMap: Record<ProjectPriority, number> = {
                            high: 300,
                            medium: 200,
                            low: 100
                          };
                          setLocalProject({ ...localProject, points: pointsMap[localProject.priority] });
                        }
                      }}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="autoCalculatePoints" className="text-sm font-medium text-gray-700">
                      自动计算
                    </label>
                    {/* Tooltip 图标 */}
                    <div
                      className="relative"
                      onMouseEnter={() => setShowPointsTooltip(true)}
                      onMouseLeave={() => setShowPointsTooltip(false)}
                    >
                      <svg
                        className="w-4 h-4 text-gray-400 cursor-help"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip 提示 */}
                      {showPointsTooltip && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap z-10">
                          根据项目优先级自动计算积分值
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <EditableField
                    value={String(localProject.points || 0)}
                    fieldName="points"
                    label=""
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
                </div>

                {/* 项目状态 */}
                <EditableField
                  value={localProject.status}
                  fieldName="status"
                  label={t('modal.project.status')}
                  type="select"
                  options={statusOptions}
                  required
                  onSave={handleFieldSave}
                />
              </div>

              {/* 6. 开始时间 & 7. 结束时间（slow-burn 不显示结束时间） */}
              <div className={`grid gap-4 ${localProject.type !== 'slow-burn' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <EditableField
                  value={localProject.startDate}
                  fieldName="startDate"
                  label={t('project.startTime')}
                  type="date"
                  required
                  onSave={handleFieldSave}
                />
                {localProject.type !== 'slow-burn' && (
                  <EditableField
                    value={localProject.endDate}
                    fieldName="endDate"
                    label={t('project.deadline')}
                    type="date"
                    onSave={handleFieldSave}
                  />
                )}
              </div>

              {/* 8. 积累指标区域 - 仅 slow-burn 项目显示 */}
              {localProject.type === 'slow-burn' && (
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('modal.project.indicators')}
                    </label>
                    <span className={`text-sm ${totalWeight === 100 ? 'text-green-500' : 'text-red-500'}`}>
                      {t('modal.project.indicatorsTotalWeight')}: {totalWeight}%
                      {totalWeight === 100 && ' ✓'}
                    </span>
                  </div>

                  {/* 指标表头 */}
                  <div className="grid grid-cols-4 gap-2 mb-2 text-xs text-gray-500">
                    <div>{t('modal.project.indicatorName')}</div>
                    <div>{t('modal.project.indicatorValue')}</div>
                    <div>{t('modal.project.indicatorTarget')}</div>
                    <div>{t('modal.project.indicatorWeight')}</div>
                  </div>

                  {/* 指标列表 */}
                  <div className="space-y-3 mb-3">
                    {indicators.map((indicator, index) => (
                      <div key={indicator.id} className="grid grid-cols-4 gap-2 items-center">
                        <div>
                          <input
                            type="text"
                            value={indicator.name}
                            onChange={(e) => updateIndicator(index, 'name', e.target.value)}
                            placeholder={t('modal.project.indicatorName')}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={indicator.value}
                            onChange={(e) => updateIndicator(index, 'value', parseInt(e.target.value) || 0)}
                            placeholder={t('modal.project.indicatorValue')}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={indicator.target}
                            onChange={(e) => updateIndicator(index, 'target', parseInt(e.target.value) || 0)}
                            placeholder={t('modal.project.indicatorTarget')}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 relative">
                            <input
                              type="number"
                              value={indicator.weight}
                              onChange={(e) => updateIndicator(index, 'weight', parseInt(e.target.value) || 0)}
                              placeholder={t('modal.project.indicatorWeight')}
                              className="w-full px-2 py-1.5 pr-6 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
                          </div>
                          {indicators.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeIndicator(index)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                              title={t('common.buttons.delete')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 添加指标按钮 */}
                  {indicators.length < 10 && (
                    <button
                      type="button"
                      onClick={addIndicator}
                      className="text-orange-500 hover:text-orange-700 text-sm"
                    >
                      + {t('modal.project.addIndicator')}
                    </button>
                  )}

                  {/* 进度预览 */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {t('modal.project.indicatorsProgress')}: {calculateProgress()}%
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            calculateProgress() >= 70 ? 'bg-green-500' :
                            calculateProgress() >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${calculateProgress()}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. 描述 */}
              <MarkdownEditorField
                value={localProject.description}
                fieldName="description"
                label={t('project.form.description')}
                placeholder={t('project.form.descriptionPlaceholder')}
                onSave={handleFieldSave}
              />

              {/* 进度（只读） */}
              {project && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('project.progress')}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              )}

              {/* 时间戳（只读） */}
              {project && (
                <div className="text-xs text-gray-500 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>{t('project.createdAt')}：{new Date(project.createdAt).toLocaleDateString('zh-CN')}</span>
                    <span>{t('project.updatedAt')}：{new Date(project.updatedAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部操作栏 - 仅新建模式显示 */}
        {isCreateMode && (
          <div className="flex justify-end items-center px-5 py-3 border-t bg-gray-50">
            <button
              onClick={handleCreate}
              disabled={submitting || !localProject?.name?.trim()}
              className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? t('project.creating') : t('project.create')}
            </button>
          </div>
        )}
      </div>

      {/* 未保存更改确认弹窗 */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onDiscard={handleDiscardAndClose}
        onCancel={handleCancelClose}
      />
    </>
  );
}
