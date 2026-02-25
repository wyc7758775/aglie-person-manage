'use client';

import { useState } from 'react';
import { TaskDifficulty } from '@/app/lib/definitions';

interface InfoGridProps {
  difficulty: TaskDifficulty;
  frequency: 'daily' | 'weekly' | 'monthly';
  goldReward: number;
  onDifficultyChange: (value: TaskDifficulty) => void;
  onFrequencyChange: (value: 'daily' | 'weekly' | 'monthly') => void;
  onGoldRewardChange: (value: number) => void;
}

const difficultyOptions: { value: TaskDifficulty; label: string }[] = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' },
];

const frequencyOptions: { value: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
  { value: 'daily', label: '每日' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
];

export function InfoGrid({
  difficulty,
  frequency,
  goldReward,
  onDifficultyChange,
  onFrequencyChange,
  onGoldRewardChange,
}: InfoGridProps) {
  return (
    <div
      style={{
        backgroundColor: '#F5F0F0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div className="flex" style={{ gap: '12px' }}>
        {/* Difficulty */}
        <EditableBox
          label="难度"
          value={difficultyOptions.find(o => o.value === difficulty)?.label || '中等'}
          options={difficultyOptions}
          onChange={(value) => onDifficultyChange(value as TaskDifficulty)}
          isSelect={true}
        />

        {/* Frequency */}
        <EditableBox
          label="频率"
          value={frequencyOptions.find(o => o.value === frequency)?.label || '每日'}
          options={frequencyOptions}
          onChange={(value) => onFrequencyChange(value as 'daily' | 'weekly' | 'monthly')}
          isSelect={true}
        />

        {/* Gold Reward */}
        <EditableBox
          label="单次奖励"
          value={`+${goldReward} G / 次`}
          onChange={(value) => onGoldRewardChange(parseFloat(value) || 0)}
          isSelect={false}
          numericValue={goldReward}
        />
      </div>

      {/* Hint */}
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          color: '#1A1D2E66',
        }}
      >
        编辑规则：今日预计 = 频率 × 单次奖励（自动换算）
      </span>
    </div>
  );
}

interface EditableBoxProps {
  label: string;
  value: string;
  options?: { value: string; label: string }[];
  onChange: (value: string) => void;
  isSelect: boolean;
  numericValue?: number;
}

function EditableBox({ label, value, options, onChange, isSelect, numericValue }: EditableBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(numericValue?.toString() || value);

  const handleSave = () => {
    if (isSelect && options) {
      // 选择器不需要单独保存，onChange 已经在选择时调用
    } else {
      onChange(editValue);
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div
      className="relative"
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Edit Icon */}
      {isHovered && !isEditing && (
        <button
          className="absolute flex items-center justify-center"
          style={{
            top: '8px',
            right: '8px',
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            backgroundColor: '#F5F0F0',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setIsEditing(true)}
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#1A1D2E88"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      )}

      {/* Label */}
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          fontWeight: 500,
          color: '#1A1D2E88',
        }}
      >
        {label}
      </span>

      {/* Value / Edit Input */}
      {isEditing ? (
        isSelect && options ? (
          <select
            value={options.find(o => o.label === value)?.value || options[0].value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsEditing(false);
            }}
            onBlur={handleBlur}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: label === '单次奖励' ? '#E8944A' : '#1A1D2E',
              border: '1px solid #E8944A',
              borderRadius: '6px',
              padding: '4px 8px',
              outline: 'none',
              width: '100%',
            }}
            autoFocus
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: '#E8944A',
              border: '1px solid #E8944A',
              borderRadius: '6px',
              padding: '4px 8px',
              outline: 'none',
              width: '100%',
            }}
            autoFocus
            step="0.1"
          />
        )
      ) : (
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            fontWeight: 700,
            color: label === '单次奖励' ? '#E8944A' : '#1A1D2E',
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
