'use client';

interface TitleRowProps {
  title: string;
  currentCount: number;
  targetCount: number;
  direction: 'positive' | 'negative';
  onIncrement: () => void;
  onDecrement: () => void;
}

export function TitleRow({ 
  title, 
  currentCount, 
  targetCount, 
  direction,
  onIncrement, 
  onDecrement 
}: TitleRowProps) {
  const displayTargetCount = direction === 'negative' ? -targetCount : targetCount;
  return (
    <div 
      className="flex items-center justify-between"
      style={{ width: '100%' }}
      data-testid="title-row"
    >
      {/* Title */}
      <h1
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          color: '#1A1D2E',
          margin: 0,
        }}
        data-testid="habit-title"
      >
        {title}
      </h1>

      {/* Completion Counter */}
      <div
        className="flex items-center"
        style={{
          backgroundColor: '#4CAF5015',
          borderRadius: '10px',
          padding: '6px 10px',
          gap: '8px',
        }}
        data-testid="completion-counter"
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: '#2E7D32',
          }}
        >
          完成
        </span>

        {/* Minus Button */}
        <button
          onClick={onDecrement}
          disabled={currentCount <= 0}
          className="flex items-center justify-center"
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '999px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #4CAF5033',
            cursor: currentCount <= 0 ? 'not-allowed' : 'pointer',
            opacity: currentCount <= 0 ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
          data-testid="decrement-btn"
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#2E7D32"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
          </svg>
        </button>

        {/* Count */}
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            color: '#2E7D32',
            minWidth: '30px',
            textAlign: 'center',
          }}
        >
          {currentCount}/{displayTargetCount}
        </span>

        {/* Plus Button */}
        <button
          onClick={onIncrement}
          className="flex items-center justify-center"
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '999px',
            backgroundColor: '#2E7D32',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          data-testid="increment-btn"
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
