'use client';

import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, CalendarIcon, ChevronDownIcon, XMarkIcon } from '@/app/ui/icons';
import { RequirementStatus, RequirementPriority } from './requirement-badges';
import DropdownOptions from '@/app/ui/dropdown-options';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from './requirement-table';

// Git Branch Icon SVG
const GitBranchIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10v10M7 17V7h10v10" />
    <circle cx="7" cy="7" r="2" />
    <circle cx="17" cy="7" r="2" />
    <circle cx="7" cy="17" r="2" />
  </svg>
);

// Corner Down Right Icon SVG
const CornerDownRightIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l5 5-5 5M20 15H9a5 5 0 01-5-5V4" />
  </svg>
);

interface SubRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubRequirementFormData) => Promise<void>;
  parentRequirement: {
    id: string;
    workItemId: string;
    name: string;
    priority: RequirementPriority;
  };
  projectId: string;
}

export interface SubRequirementFormData {
  name: string;
  status: RequirementStatus;
  priority: RequirementPriority;
  startDate: string;
  endDate: string;
  points: number;
  description: string;
  parentId: string;
  projectId: string;
}

interface FormErrors {
  name?: string;
  endDate?: string;
  points?: string;
}

export default function SubRequirementModal({
  isOpen,
  onClose,
  onSubmit,
  parentRequirement,
  projectId,
}: SubRequirementModalProps) {
  // 表单状态
  const [formData, setFormData] = useState<SubRequirementFormData>({
    name: '',
    status: 'todo',
    priority: parentRequirement.priority || 'p2',
    startDate: '',
    endDate: '',
    points: 0,
    description: '',
    parentId: parentRequirement.id,
    projectId: projectId,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isLoading]);

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        status: 'todo',
        priority: parentRequirement.priority || 'p2',
        startDate: '',
        endDate: '',
        points: 0,
        description: '',
        parentId: parentRequirement.id,
        projectId: projectId,
      });
      setErrors({});
      setIsClosing(false);
    }
  }, [isOpen, parentRequirement, projectId]);

  // 关闭动画
  const handleClose = useCallback(() => {
    if (isLoading) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose, isLoading]);

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 名称验证
    if (!formData.name.trim()) {
      newErrors.name = '子需求名称不能为空';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '子需求名称至少需要2个字符';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = '子需求名称不能超过100个字符';
    }

    // 时间验证
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = '截止时间不能早于开始时间';
      }
    }

    // 积分验证
    if (formData.points < 0) {
      newErrors.points = '积分不能为负数';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理提交
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('创建子需求失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理输入变化
  const handleChange = (field: keyof SubRequirementFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(26, 29, 46, 0.33)' }}
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className={`relative bg-white overflow-hidden transition-all duration-200 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          width: '520px',
          borderRadius: '16px',
          boxShadow: '0 8px 60px rgba(26, 29, 46, 0.19)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6"
          style={{ 
            height: '56px',
            borderBottom: '1px solid rgba(26, 29, 46, 0.06)',
          }}
        >
          {/* Header Left */}
          <div className="flex items-center gap-2.5">
            <GitBranchIcon 
              className="w-[18px] h-[18px]" 
              style={{ color: '#E8944A' }}
            />
            <span 
              className="text-base font-bold"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#1A1D2E',
              }}
            >
              新增子需求
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex items-center justify-center p-1.5 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50"
            style={{ borderRadius: '8px' }}
          >
            <XMarkIcon 
              className="w-4 h-4" 
              style={{ color: 'rgba(26, 29, 46, 0.53)' }}
            />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {/* Parent Info */}
          <div 
            className="flex items-center gap-2 px-3.5 py-2.5"
            style={{
              backgroundColor: 'rgba(232, 148, 74, 0.03)',
              border: '1px solid rgba(232, 148, 74, 0.13)',
              borderRadius: '10px',
            }}
          >
            <CornerDownRightIcon 
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: '#E8944A' }}
            />
            <span 
              className="text-xs font-medium whitespace-nowrap"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: 'rgba(26, 29, 46, 0.53)',
              }}
            >
              父需求：
            </span>
            <span 
              className="text-xs font-semibold truncate"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#1A1D2E',
              }}
            >
              {parentRequirement.workItemId} {parentRequirement.name}
            </span>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <label 
                className="text-xs font-semibold"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#1A1D2E',
                }}
              >
                子需求名称
              </label>
              <span 
                className="text-xs font-semibold"
                style={{ color: '#F44336' }}
              >
                *
              </span>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              onBlur={() => {
                if (formData.name && formData.name.trim().length < 2) {
                  setErrors(prev => ({ ...prev, name: '子需求名称至少需要2个字符' }));
                }
              }}
              placeholder="请输入子需求名称"
              disabled={isLoading}
              className="w-full px-3.5 text-xs outline-none transition-all disabled:opacity-50"
              style={{
                height: '38px',
                backgroundColor: '#F5F0F0',
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                color: '#1A1D2E',
              }}
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: '#F44336' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status Field */}
            <div className="space-y-1.5">
              <label 
                className="text-xs font-semibold block"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#1A1D2E',
                }}
              >
                状态
              </label>
              <DropdownOptions
                options={STATUS_OPTIONS}
                value={formData.status}
                onChange={(value) => handleChange('status', value)}
                minWidth="100%"
                disabled={isLoading}
                renderTrigger={(selectedOption, isOpen) => (
                  <div
                    className="w-full flex items-center justify-between px-3.5 text-xs outline-none transition-all"
                    style={{
                      height: '38px',
                      backgroundColor: '#F5F0F0',
                      borderRadius: '10px',
                      fontFamily: 'Inter, sans-serif',
                      color: '#1A1D2E',
                    }}
                  >
                    <span>{selectedOption.label}</span>
                    <ChevronDownIcon className="w-4 h-4" style={{ color: 'rgba(26, 29, 46, 0.33)' }} />
                  </div>
                )}
                renderOption={(option) => (
                  <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {option.label}
                  </span>
                )}
              />
            </div>

            {/* Priority Field */}
            <div className="space-y-1.5">
              <label 
                className="text-xs font-semibold block"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#1A1D2E',
                }}
              >
                优先级
              </label>
              <DropdownOptions
                options={PRIORITY_OPTIONS}
                value={formData.priority}
                onChange={(value) => handleChange('priority', value)}
                minWidth="100%"
                disabled={isLoading}
                renderTrigger={(selectedOption, isOpen) => (
                  <div
                    className="w-full flex items-center justify-between px-3.5 text-xs outline-none transition-all"
                    style={{
                      height: '38px',
                      backgroundColor: '#F5F0F0',
                      borderRadius: '10px',
                      fontFamily: 'Inter, sans-serif',
                      color: '#1A1D2E',
                    }}
                  >
                    <span>{selectedOption.label}</span>
                    <ChevronDownIcon className="w-4 h-4" style={{ color: 'rgba(26, 29, 46, 0.33)' }} />
                  </div>
                )}
                renderOption={(option) => (
                  <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {option.label}
                  </span>
                )}
              />
            </div>
          </div>

          {/* Date Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label 
                className="text-xs font-semibold block"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#1A1D2E',
                }}
              >
                开始时间
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => handleChange('startDate', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 pr-10 text-xs outline-none transition-all disabled:opacity-50"
                  style={{
                    height: '38px',
                    backgroundColor: '#F5F0F0',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    color: '#1A1D2E',
                  }}
                />
                <CalendarIcon 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: 'rgba(26, 29, 46, 0.33)' }}
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label 
                className="text-xs font-semibold block"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#1A1D2E',
                }}
              >
                截止时间
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => handleChange('endDate', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 pr-10 text-xs outline-none transition-all disabled:opacity-50"
                  style={{
                    height: '38px',
                    backgroundColor: '#F5F0F0',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    color: '#1A1D2E',
                  }}
                />
                <CalendarIcon 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: 'rgba(26, 29, 46, 0.33)' }}
                />
              </div>
              {errors.endDate && (
                <p className="text-xs mt-1" style={{ color: '#F44336' }}>
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Points Field */}
          <div className="space-y-1.5">
            <label 
              className="text-xs font-semibold block"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#1A1D2E',
              }}
            >
              可获得积分
            </label>
            <input
              type="number"
              min={0}
              value={formData.points}
              onChange={e => handleChange('points', parseInt(e.target.value) || 0)}
              disabled={isLoading}
              placeholder="0"
              className="w-full px-3.5 text-xs outline-none transition-all disabled:opacity-50"
              style={{
                height: '38px',
                backgroundColor: '#F5F0F0',
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                color: '#1A1D2E',
              }}
            />
            {errors.points && (
              <p className="text-xs mt-1" style={{ color: '#F44336' }}>
                {errors.points}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label 
              className="text-xs font-semibold block"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#1A1D2E',
              }}
            >
              描述
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              disabled={isLoading}
              placeholder="简要描述子需求内容..."
              rows={3}
              className="w-full px-3.5 py-3 text-xs outline-none resize-none transition-all disabled:opacity-50"
              style={{
                minHeight: '72px',
                backgroundColor: '#F5F0F0',
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                color: '#1A1D2E',
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-end px-6 gap-3"
          style={{ 
            height: '60px',
            borderTop: '1px solid rgba(26, 29, 46, 0.06)',
          }}
        >
          {/* Cancel Button */}
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-5 py-2 text-xs font-medium rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: '#F5F0F0',
              color: '#1A1D2E',
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            取消
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: '#E8944A',
              color: '#FFFFFF',
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <PlusIcon className="w-3.5 h-3.5" />
            {isLoading ? '创建中...' : '创建子需求'}
          </button>
        </div>
      </div>
    </div>
  );
}
