'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from '@/app/lib/hooks/useDebounce';

export type FieldType = 'text' | 'textarea' | 'select' | 'date';
export type FieldStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SelectOption {
  value: string;
  label: string;
}

interface EditableFieldProps {
  value: string | null;
  fieldName: string;
  label: string;
  type?: FieldType;
  options?: SelectOption[];
  required?: boolean;
  placeholder?: string;
  onSave: (fieldName: string, value: string | null) => Promise<void>;
  disabled?: boolean;
  className?: string;
  displayFormatter?: (value: string | null) => string;
}

export default function EditableField({
  value,
  fieldName,
  label,
  type = 'text',
  options = [],
  required = false,
  placeholder = '',
  onSave,
  disabled = false,
  className = '',
  displayFormatter,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [originalValue, setOriginalValue] = useState(value);
  const [status, setStatus] = useState<FieldStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  // 同步外部值变化
  useEffect(() => {
    setLocalValue(value);
    setOriginalValue(value);
  }, [value]);

  // 进入编辑模式时自动聚焦
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 文本类型选中所有内容
      if (type === 'text' || type === 'textarea') {
        (inputRef.current as HTMLInputElement | HTMLTextAreaElement).select();
      }
    }
  }, [isEditing, type]);

  // 防抖保存（用于文本类型）
  const debouncedSave = useDebouncedCallback(async (newValue: string | null) => {
    await performSave(newValue);
  }, 500);

  const performSave = useCallback(async (newValue: string | null) => {
    // 值没有变化，不需要保存
    if (newValue === originalValue) {
      setStatus('idle');
      return;
    }

    // 必填验证
    if (required && (!newValue || newValue.trim() === '')) {
      setStatus('error');
      setErrorMessage('此字段为必填项');
      return;
    }

    setStatus('saving');
    setErrorMessage(null);

    try {
      await onSave(fieldName, newValue);
      setOriginalValue(newValue);
      setStatus('saved');
      
      // 2秒后重置状态
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '保存失败');
    }
  }, [fieldName, onSave, originalValue, required]);

  const handleClick = () => {
    if (disabled) return;
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // 对于 select 和 date 类型，立即保存
    if (type === 'select' || type === 'date') {
      performSave(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // 取消编辑，恢复原值
      setLocalValue(originalValue);
      setIsEditing(false);
      setStatus('idle');
      setErrorMessage(null);
    } else if (e.key === 'Enter' && type === 'text') {
      // Enter 键保存（仅文本类型）
      e.preventDefault();
      setIsEditing(false);
      performSave(localValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value || null;
    setLocalValue(newValue);
    
    // 对于 select 类型，onChange 时就保存
    if (type === 'select') {
      performSave(newValue);
    }
    // 对于文本类型，使用防抖保存
    else if (type === 'text' || type === 'textarea') {
      setStatus('saving');
      debouncedSave(newValue);
    }
  };

  // 格式化日期为年月日
  const formatDate = (value: string | null): string => {
    if (!value) return placeholder || '-';
    
    // 如果值已经是 YYYY-MM-DD 格式，直接返回
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    
    // 尝试解析日期字符串
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return value;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return value;
    }
  };

  // 获取显示值
  const getDisplayValue = () => {
    if (displayFormatter) {
      return displayFormatter(localValue);
    }
    
    if (type === 'select' && options.length > 0) {
      const option = options.find(opt => opt.value === localValue);
      return option?.label || localValue || placeholder || '-';
    }
    
    if (type === 'date') {
      return formatDate(localValue);
    }
    
    return localValue || placeholder || '-';
  };

  // 基础样式 - 移除了编辑态动画
  const baseInputClass = `
    w-full px-3 py-2 border rounded-md
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${status === 'error' ? 'border-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
  `;

  const displayClass = `
    px-3 py-2 rounded-md cursor-pointer
    hover:bg-gray-100 group
    ${disabled ? 'cursor-not-allowed opacity-60' : ''}
  `;

  // 状态指示器
  const renderStatusIcon = () => {
    if (status === 'saving') {
      return (
        <svg 
          className="animate-spin h-4 w-4 text-gray-400 ml-2" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    }
    if (status === 'saved') {
      return (
        <svg className="h-4 w-4 text-green-500 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    if (status === 'error') {
      return (
        <svg className="h-4 w-4 text-red-500 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {isEditing ? (
        <div className="relative">
          {type === 'text' && (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={localValue || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={baseInputClass}
              data-testid={`project-${fieldName}-input`}
            />
          )}
          
          {type === 'textarea' && (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={localValue || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={3}
              className={baseInputClass}
            />
          )}
          
          {type === 'select' && (
            <select
              ref={inputRef as React.RefObject<HTMLSelectElement>}
              value={localValue || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className={baseInputClass}
              data-testid={`project-${fieldName}-select`}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {type === 'date' && (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="date"
              value={localValue || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className={baseInputClass}
            />
          )}
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className={displayClass}
        >
          <div className="flex items-center justify-between">
            <span className={`${!localValue ? 'text-gray-400' : 'text-gray-900'}`}>
              {getDisplayValue()}
            </span>
            <div className="flex items-center">
              {renderStatusIcon()}
              {!disabled && (
                <svg 
                  className="h-4 w-4 text-gray-400 ml-2 opacity-0 group-hover:opacity-100" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}
      
      {errorMessage && status === 'error' && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
