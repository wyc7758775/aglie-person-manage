'use client';

import { useState, useCallback, useEffect } from 'react';
import { Project, ProjectCreateRequest, ProjectType, ProjectPriority, ProjectStatus } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import FormInput from '@/app/components/ui/form-input';
import FormSelect from '@/app/components/ui/form-select';
import FormRadio from '@/app/components/ui/form-radio';
import FormDatePicker from '@/app/components/ui/form-date-picker';

// 积分基数乘以10后的映射表
const POINTS_BY_PRIORITY: Record<ProjectPriority, number> = {
  low: 100,
  medium: 200,
  high: 300,
};

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectCreateRequest) => Promise<void>;
  onCancel: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export default function ProjectForm({ project, onSubmit, onCancel, onDirtyChange }: ProjectFormProps) {
  const { t } = useLanguage();
  
  // 初始表单数据
  const initialData: ProjectCreateRequest = {
    name: project?.name || '',
    description: project?.description || '',
    type: project?.type || 'sprint-project',
    priority: project?.priority || 'medium',
    status: project?.status || 'normal',
    startDate: project?.startDate || new Date().toISOString().split('T')[0],
    endDate: project?.endDate || '',
    goals: project?.goals || [],
    tags: project?.tags || [],
    points: project?.points || POINTS_BY_PRIORITY['medium'],
  };

  const [formData, setFormData] = useState<ProjectCreateRequest>(initialData);
  const [newGoal, setNewGoal] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  
  // 积分自动计算状态，默认选中
  const [autoCalculatePoints, setAutoCalculatePoints] = useState(true);
  
  // Tooltip 显示状态
  const [showTooltip, setShowTooltip] = useState(false);

  // 编辑态检测
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);
  
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // 当优先级变化且自动计算开启时，更新积分
  useEffect(() => {
    if (autoCalculatePoints) {
      setFormData(prev => ({
        ...prev,
        points: POINTS_BY_PRIORITY[prev.priority],
      }));
    }
  }, [formData.priority, autoCalculatePoints]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = t('validation.project.nameRequired');
    } else if (formData.name.length > 200) {
      newErrors.name = t('validation.project.nameMaxLength');
    }

    if (!formData.type) {
      newErrors.type = t('validation.project.typeRequired');
    }

    if (!formData.startDate) {
      newErrors.startDate = t('validation.project.nameRequired');
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = t('validation.project.timeInvalid');
    }

    if (!autoCalculatePoints) {
      if (!formData.points) {
        newErrors.points = t('validation.project.pointsRequired');
      } else if (formData.points <= 0 || !Number.isInteger(formData.points)) {
        newErrors.points = t('validation.project.pointsPositive');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData({
        ...formData,
        goals: [...formData.goals, newGoal.trim()],
      });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  // 项目类型选项
  const typeOptions = [
    { value: 'sprint-project', label: t('project.type.sprint') },
    { value: 'slow-project', label: t('project.type.slow') },
  ];

  // 优先级选项
  const priorityOptions = [
    { value: 'high', label: t('project.priority.high') },
    { value: 'medium', label: t('project.priority.medium') },
    { value: 'low', label: t('project.priority.low') },
  ];
  
  // 项目状态选项
  const statusOptions = [
    { value: 'normal', label: t('project.status.normal') },
    { value: 'at_risk', label: t('project.status.at_risk') },
    { value: 'out_of_control', label: t('project.status.out_of_control') },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. 项目名称 */}
      <FormInput
        id="name"
        label={t('modal.project.name')}
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
        placeholder={t('project.form.namePlaceholder')}
        required
        error={errors.name}
      />

      {/* 2. 项目类型 */}
      <FormSelect
        id="type"
        label={t('modal.project.type')}
        value={formData.type}
        onChange={(value) => setFormData({ ...formData, type: value as ProjectType })}
        options={typeOptions}
        required
        error={errors.type}
      />

      {/* 3. 优先级 */}
      <FormSelect
        id="priority"
        label={t('modal.project.priority')}
        value={formData.priority}
        onChange={(value) => setFormData({ ...formData, priority: value as ProjectPriority })}
        options={priorityOptions}
        required
      />

      {/* 4. 积分与项目状态（并列） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 积分设置区域 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-400">
              {t('modal.project.points')}
            </label>
            <div className="flex items-center gap-1">
              <FormRadio
                id="auto-calculate-points"
                label={t('modal.project.pointsAutoCalculate')}
                checked={autoCalculatePoints}
                onChange={setAutoCalculatePoints}
              />
              {/* Tooltip 图标 */}
              <div 
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
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
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap z-10">
                    {t('modal.project.pointsTooltip')}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
            disabled={autoCalculatePoints}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900
              ${autoCalculatePoints ? 'bg-gray-100 cursor-not-allowed' : ''}
            `}
          />
          {errors.points && <p className="text-red-500 text-sm mt-1">{errors.points}</p>}
        </div>

        {/* 项目状态 */}
        <FormSelect
          id="status"
          label={t('modal.project.status')}
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as ProjectStatus })}
          options={statusOptions}
          required
        />
      </div>

      {/* 5. 开始时间 & 6. 结束时间 */}
      <div className="grid grid-cols-2 gap-4">
        <FormDatePicker
          id="startDate"
          label={t('modal.project.startTime')}
          value={formData.startDate}
          onChange={(value) => setFormData({ ...formData, startDate: value })}
          required
          error={errors.startDate}
        />

        <FormDatePicker
          id="endDate"
          label={t('modal.project.endTime')}
          value={formData.endDate || ''}
          onChange={(value) => setFormData({ ...formData, endDate: value || null })}
          min={formData.startDate}
          error={errors.endDate}
        />
      </div>

      {/* 7. 背景图（封面） */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {t('project.form.coverImage')}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={formData.coverImageUrl || ''}
            onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
            placeholder={t('project.coverImage.uploadHint')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
          />
        </div>
      </div>

      {/* 8. 描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {t('project.form.description')}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={t('project.form.descriptionPlaceholder')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
        />
      </div>

      {/* 目标 */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {t('project.form.goals')}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder={t('project.form.addGoal')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
          />
          <button
            type="button"
            onClick={addGoal}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            {t('common.buttons.confirm')}
          </button>
        </div>
        <div className="space-y-1">
          {formData.goals.map((goal, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
              <span className="text-sm text-gray-900">{goal}</span>
              <button
                type="button"
                onClick={() => removeGoal(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                {t('common.buttons.delete')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {t('project.form.tags')}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder={t('project.form.addTag')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            {t('common.buttons.confirm')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 按钮区域 - 右下角对齐 */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 disabled:opacity-50"
        >
          {t('modal.project.cancelButton')}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
        >
          {submitting ? '...' : (project ? t('modal.project.saveButton') : t('modal.project.createButton'))}
        </button>
      </div>
    </form>
  );
}
