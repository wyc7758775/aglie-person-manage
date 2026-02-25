'use client';

import { useState } from 'react';

interface PanelHeaderProps {
  taskId: string;
  onClose: () => void;
}

export function PanelHeader({ taskId, onClose }: PanelHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(taskId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div 
      className="flex items-center justify-between shrink-0"
      style={{ 
        height: '60px',
        padding: '0 24px',
        borderBottom: '1px solid #1A1D2E15',
      }}
    >
      {/* Left: Type Badge + Task ID */}
      <div className="flex items-center" style={{ gap: '12px' }}>
        {/* Type Badge */}
        <div
          className="flex items-center"
          style={{
            backgroundColor: '#E8944A15',
            borderRadius: '8px',
            padding: '4px 10px',
            gap: '4px',
          }}
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#E8944A" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#E8944A',
            }}
          >
            习惯
          </span>
        </div>

        {/* Task ID */}
        <div
          className="flex items-center cursor-pointer"
          style={{
            backgroundColor: '#F5F0F0',
            borderRadius: '8px',
            padding: '4px 10px',
            gap: '6px',
          }}
          onClick={handleCopy}
          title="点击复制"
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#1A1D2E',
            }}
          >
            任务 ID: {taskId}
          </span>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={copied ? '#4CAF50' : '#1A1D2E88'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {copied ? (
              <>
                <path d="M20 6L9 17l-5-5" />
              </>
            ) : (
              <>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Right: Close Button */}
      <button
        onClick={onClose}
        className="flex items-center justify-center"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F5F0F0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        data-testid="close-drawer-btn"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#1A1D2E88"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
