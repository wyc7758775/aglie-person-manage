'use client';

import { useState, useRef, useEffect } from 'react';
import { useDebouncedCallback } from '@/app/lib/hooks/useDebounce';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface EditableGoalListProps {
  goals: string[];
  label: string;
  placeholder?: string;
  onSave: (fieldName: string, value: string[]) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function EditableGoalList({
  goals,
  label,
  placeholder = '输入目标内容',
  onSave,
  disabled = false,
  className = '',
}: EditableGoalListProps) {
  const [localGoals, setLocalGoals] = useState<string[]>(goals);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newGoalValue, setNewGoalValue] = useState('');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const editInputRef = useRef<HTMLInputElement>(null);
  const newInputRef = useRef<HTMLInputElement>(null);

  // 同步外部值变化
  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  // 编辑时自动聚焦
  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingIndex]);

  const performSave = async (newGoals: string[]) => {
    setStatus('saving');
    setErrorMessage(null);

    try {
      await onSave('goals', newGoals);
      setStatus('saved');
      
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '保存失败');
      // 失败时恢复原值
      setLocalGoals(goals);
    }
  };

  // 防抖保存（用于编辑目标内容）
  const debouncedSave = useDebouncedCallback(async (newGoals: string[]) => {
    await performSave(newGoals);
  }, 500);

  const handleAddGoal = () => {
    const trimmedValue = newGoalValue.trim();
    if (!trimmedValue) return;

    const newGoals = [...localGoals, trimmedValue];
    setLocalGoals(newGoals);
    setNewGoalValue('');
    performSave(newGoals);
  };

  const handleRemoveGoal = (indexToRemove: number) => {
    const newGoals = localGoals.filter((_, index) => index !== indexToRemove);
    setLocalGoals(newGoals);
    setEditingIndex(null);
    performSave(newGoals);
  };

  const handleGoalChange = (index: number, newValue: string) => {
    const newGoals = [...localGoals];
    newGoals[index] = newValue;
    setLocalGoals(newGoals);
    setStatus('saving');
    debouncedSave(newGoals);
  };

  const handleGoalBlur = () => {
    setEditingIndex(null);
  };

  const handleGoalKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Escape') {
      // 取消编辑，恢复原值
      setLocalGoals(goals);
      setEditingIndex(null);
      setStatus('idle');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setEditingIndex(null);
    }
  };

  const handleNewGoalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddGoal();
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
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {renderStatusIcon()}
      </div>
      
      {/* 目标列表 */}
      <div className="space-y-2 mb-3">
        {localGoals.map((goal, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <span className="text-gray-400 text-sm w-5">{index + 1}.</span>
            
            {editingIndex === index ? (
              <input
                ref={editInputRef}
                type="text"
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                onBlur={handleGoalBlur}
                onKeyDown={(e) => handleGoalKeyDown(e, index)}
                className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div
                onClick={() => !disabled && setEditingIndex(index)}
                className={`flex-1 px-3 py-2 rounded-md transition-colors ${
                  disabled 
                    ? 'cursor-default' 
                    : 'cursor-pointer hover:bg-gray-100'
                }`}
              >
                <span className="text-gray-700">{goal}</span>
              </div>
            )}
            
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveGoal(index)}
                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1"
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        ))}
        
        {localGoals.length === 0 && (
          <p className="text-sm text-gray-400 px-3 py-2">暂无目标</p>
        )}
      </div>
      
      {/* 添加新目标 */}
      {!disabled && (
        <div className="flex gap-2">
          <input
            ref={newInputRef}
            type="text"
            value={newGoalValue}
            onChange={(e) => setNewGoalValue(e.target.value)}
            onKeyDown={handleNewGoalKeyDown}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            type="button"
            onClick={handleAddGoal}
            disabled={!newGoalValue.trim()}
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
