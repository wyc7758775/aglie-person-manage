'use client';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsavedChangesDialog({ 
  isOpen, 
  onConfirm, 
  onCancel 
}: UnsavedChangesDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(26, 29, 46, 0.5)' }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          width: '360px',
          maxWidth: '90vw',
          boxShadow: '0 20px 60px rgba(26, 29, 46, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#FFF3E0',
            margin: '0 auto 16px',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E8944A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#1A1D2E',
            textAlign: 'center',
            margin: '0 0 8px 0',
          }}
        >
          有未保存的更改
        </h3>

        {/* Message */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            color: '#1A1D2E88',
            textAlign: 'center',
            margin: '0 0 24px 0',
            lineHeight: 1.5,
          }}
        >
          确定要关闭吗？未保存的更改将会丢失。
        </p>

        {/* Buttons */}
        <div className="flex" style={{ gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#F5F0F0',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#1A1D2E',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EBE5E5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F0F0';
            }}
          >
            取消
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#E8944A',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D9843A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E8944A';
            }}
          >
            确认关闭
          </button>
        </div>
      </div>
    </div>
  );
}
