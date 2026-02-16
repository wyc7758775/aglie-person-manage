'use client';

import { useState, useCallback, useEffect } from 'react';
import { Project, ProjectCreateRequest, ProjectType, ProjectPriority, ProjectStatus, ProjectIndicator } from '@/app/lib/definitions';
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
  
  // 指标管理状态
  const initialIndicators = project?.indicators || [];
  const [indicators, setIndicators] = useState<ProjectIndicator[]>(initialIndicators);

  // 积分自动计算状态，默认选中
  const [autoCalculatePoints, setAutoCalculatePoints] = useState(true);
  
  // Tooltip 显示状态
  const [showTooltip, setShowTooltip] = useState(false);

  // 编辑态检测 - 包含 formData 和 indicators
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData) ||
                  JSON.stringify(indicators) !== JSON.stringify(initialIndicators);
  
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
      newErrors.startDate = t('validation.project.startDateRequired');
    }

    // slow-burn 项目只验证开始时间，不验证结束时间
    if (formData.type !== 'slow-burn' && formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = t('validation.project.timeInvalid');
    }

    // slow-burn 项目验证指标
    if (formData.type === 'slow-burn') {
      if (indicators.length === 0) {
        newErrors.indicators = t('validation.project.indicatorRequired');
      } else {
        // 验证每个指标
        for (let i = 0; i < indicators.length; i++) {
          const ind = indicators[i];
          if (!ind.name || ind.name.trim().length === 0) {
            newErrors[`indicator_${i}_name`] = t('validation.project.indicatorNameRequired');
          } else if (ind.name.length > 50) {
            newErrors[`indicator_${i}_name`] = t('validation.project.indicatorNameMaxLength');
          }
          if (!ind.target || ind.target <= 0) {
            newErrors[`indicator_${i}_target`] = t('validation.project.indicatorTargetRequired');
          }
          if (ind.weight < 0 || ind.weight > 100) {
            newErrors[`indicator_${i}_weight`] = t('validation.project.indicatorWeightRange');
          }
        }
        if (totalWeight !== 100) {
          newErrors.indicatorsWeight = t('validation.project.indicatorWeightSum').replace('{total}', String(totalWeight));
        }
      }
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

    // 准备提交数据
    const submitData: ProjectCreateRequest = {
      ...formData,
      // slow-burn 项目设置指标
      ...(formData.type === 'slow-burn' ? {
        indicators,
        progress: calculateProgress(),
      } : {}),
    };

    setSubmitting(true);
    try {
      await onSubmit(submitData);
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

  // 计算总权重
  const totalWeight = indicators.reduce((sum, ind) => sum + (ind.weight || 0), 0);

  // 计算进度
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

  // 添加指标
  const addIndicator = () => {
    if (indicators.length >= 10) return;
    const newIndicator: ProjectIndicator = {
      id: crypto.randomUUID(),
      name: '',
      value: 0,
      target: 100,
      weight: 0,
    };
    setIndicators([...indicators, newIndicator]);
  };

  // 更新指标
  const updateIndicator = (index: number, field: keyof ProjectIndicator, value: string | number) => {
    const updated = [...indicators];
    updated[index] = { ...updated[index], [field]: value };
    setIndicators(updated);
  };

  // 删除指标
  const removeIndicator = (index: number) => {
    if (indicators.length <= 1) return;
    setIndicators(indicators.filter((_, i) => i !== index));
  };

  // 判断是否为 slow-burn 项目
  const isSlowBurn = formData.type === 'slow-burn';

  // 项目类型选项
  const typeOptions = [
    { value: 'sprint-project', label: t('project.type.sprint') },
    { value: 'slow-burn', label: t('project.type.slowBurn') },
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
      {/* DEBUG 信息 - 可见的调试 */}
      <div style={{background: '#ffeb3b', padding: '10px', marginBottom: '10px', fontSize: '12px'}}>
        <strong>DEBUG:</strong> type={formData.type} | isSlowBurn={String(isSlowBurn)} | indicators={indicators.length}
      </div>
      
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
        onChange={(value) => {
          const newType = value as ProjectType;
          
          // 更新类型和 endDate
          setFormData(prev => ({
            ...prev,
            type: newType,
            endDate: newType === 'slow-burn' ? null : prev.endDate,
          }));
          
          // 切换到 slow-burn 且没有指标时，自动添加一个
          if (newType === 'slow-burn') {
            setIndicators(prev => {
              if (prev.length === 0) {
                return [{
                  id: crypto.randomUUID(),
                  name: '',
                  value: 0,
                  target: 100,
                  weight: 0,
                }];
              }
              return prev;
            });
          }
        }}
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

      {/* 5. 开始时间 & 6. 结束时间/指标区域 */}
      <div className="grid grid-cols-2 gap-4">
        <FormDatePicker
          id="startDate"
          label={t('modal.project.startTime')}
          value={formData.startDate}
          onChange={(value) => setFormData({ ...formData, startDate: value })}
          required
          error={errors.startDate}
        />

        {isSlowBurn ? (
          // slow-burn 项目显示积累指标提示
          <div className="flex items-end">
            <span className="text-sm text-gray-400">
              {t('modal.project.indicatorsTip')}
            </span>
          </div>
        ) : (
          // sprint-project 项目显示结束时间
          <FormDatePicker
            id="endDate"
            label={t('modal.project.endTime')}
            value={formData.endDate || ''}
            onChange={(value) => setFormData({ ...formData, endDate: value || null })}
            min={formData.startDate}
            error={errors.endDate}
          />
        )}
      </div>

      {/* 积累指标区域 - 仅 slow-burn 项目显示 */}
      {isSlowBurn && (
        <div className="border border-gray-200 rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-400">
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
              <span className="text-sm text-gray-400">
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

          {/* 错误提示 */}
          {(errors.indicators || errors.indicatorsWeight) && (
            <p className="text-red-500 text-sm mt-2">
              {errors.indicators || errors.indicatorsWeight}
            </p>
          )}
        </div>
      )}

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
