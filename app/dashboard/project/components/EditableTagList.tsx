'use client';

import { useState, useRef, useEffect } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface EditableTagListProps {
  tags: string[];
  label: string;
  placeholder?: string;
  onSave: (fieldName: string, value: string[]) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function EditableTagList({
  tags,
  label,
  placeholder = '输入标签后按 Enter 添加',
  onSave,
  disabled = false,
  className = '',
}: EditableTagListProps) {
  const [localTags, setLocalTags] = useState<string[]>(tags);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步外部值变化
  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const performSave = async (newTags: string[]) => {
    setStatus('saving');
    setErrorMessage(null);

    try {
      await onSave('tags', newTags);
      setStatus('saved');
      
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '保存失败');
      // 失败时恢复原值
      setLocalTags(tags);
    }
  };

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) return;
    
    // 检查是否已存在
    if (localTags.includes(trimmedValue)) {
      setInputValue('');
      return;
    }

    const newTags = [...localTags, trimmedValue];
    setLocalTags(newTags);
    setInputValue('');
    performSave(newTags);
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = localTags.filter((_, index) => index !== indexToRemove);
    setLocalTags(newTags);
    performSave(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // 状态指示器
  const renderStatusIcon = () => {
    if (status === 'saving') {
      return (
        <svg 
          className="animate-spin h-4 w-4 text-gray-400" 
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
        <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    if (status === 'error') {
      return (
        <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {renderStatusIcon()}
      </div>
      
      {/* 标签列表 */}
      <div className="flex flex-wrap gap-2 mb-2">
        {localTags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm group"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="text-blue-600 hover:text-blue-800 ml-1 opacity-60 group-hover:opacity-100 transition-opacity"
              >
                <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </span>
        ))}
        
        {localTags.length === 0 && (
          <span className="text-sm text-gray-400">暂无标签</span>
        )}
      </div>
      
      {/* 添加标签输入框 */}
      {!disabled && (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!inputValue.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            添加
          </button>
        </div>
      )}
      
      {errorMessage && status === 'error' && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
