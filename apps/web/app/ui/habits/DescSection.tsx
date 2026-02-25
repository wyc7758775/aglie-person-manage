'use client';

import { useState } from 'react';

interface DescSectionProps {
  description: string;
  onChange: (value: string) => void;
}

export function DescSection({ description, onChange }: DescSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(description);
  const [isSaving, setIsSaving] = useState(false);

  const handleBlur = async () => {
    if (editValue !== description) {
      setIsSaving(true);
      await onChange(editValue);
      setIsSaving(false);
    }
    setIsEditing(false);
  };

  const handleFocus = () => {
    setEditValue(description);
    setIsEditing(true);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Header */}
      <div className="flex items-center" style={{ gap: '8px' }}>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#1A1D2E88"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#1A1D2E',
          }}
        >
          备注说明（可直接编辑）
          {isSaving && <span style={{ color: '#E8944A', marginLeft: '8px' }}>保存中...</span>}
        </span>
      </div>

      {/* Editor */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid #1E6FD930',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {isEditing ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 400,
              color: '#1A1D2E',
              lineHeight: 1.6,
              border: 'none',
              outline: 'none',
              resize: 'none',
              width: '100%',
              minHeight: '80px',
            }}
            autoFocus
          />
        ) : (
          <div
            onClick={handleFocus}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 400,
              color: '#1A1D2E',
              lineHeight: 1.6,
              minHeight: '40px',
              cursor: 'text',
              whiteSpace: 'pre-wrap',
            }}
          >
            {description || <span style={{ color: '#1A1D2E66' }}>点击编辑备注...</span>}
          </div>
        )}

        {/* Hint */}
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            color: '#1A1D2E66',
          }}
        >
          备注可直接编辑，无需切换编辑状态
        </span>
      </div>
    </div>
  );
}
