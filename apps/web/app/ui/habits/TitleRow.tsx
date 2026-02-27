'use client';

interface TitleRowProps {
  title: string;
  currentCount: number;
  targetCount: number;
  direction: 'positive' | 'negative';
  onIncrement: () => void;
  onDecrement: () => void;
  showLabel?: boolean;
}

export function TitleRow({ 
  title, 
  currentCount, 
  targetCount, 
  direction,
  onIncrement, 
  onDecrement,
  showLabel = true,
}: TitleRowProps) {
  const displayTargetCount = direction === 'negative' ? -targetCount : targetCount;
  
  // 根据方向定义颜色主题
  const theme = direction === 'positive' ? {
    // 好习惯（正向）- 绿色调
    containerBg: '#F0FDF4',
    containerBorder: '#22C55E33',
    textColor: '#166534',
    labelColor: '#16A34A',
    buttonBg: '#2E7D32',
    buttonIconColor: '#FFFFFF',
    countColor: '#166534',
  } : {
    // 坏习惯（反向）- 红色调
    containerBg: '#FEF2F2',
    containerBorder: '#DC262633',
    textColor: '#991B1B',
    labelColor: '#DC2626',
    buttonBg: '#DC2626',
    buttonIconColor: '#FFFFFF',
    countColor: '#991B1B',
  };

  // 阻止事件冒泡，防止触发行点击
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation();
    callback();
  };

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
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.containerBg,
          borderRadius: '10px',
          padding: '4px 10px',
          gap: '8px',
          border: `1px solid ${theme.containerBorder}`,
        }}
        data-testid="completion-counter"
      >
        {showLabel && (
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: theme.labelColor,
            }}
          >
            完成
          </span>
        )}

        {/* Minus Button - 仅坏习惯显示 */}
        {direction === 'negative' && (
          <button
            onClick={(e) => handleButtonClick(e, onDecrement)}
            disabled={currentCount <= 0}
            className="flex items-center justify-center"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '999px',
              backgroundColor: theme.buttonBg,
              border: 'none',
              cursor: currentCount <= 0 ? 'not-allowed' : 'pointer',
              opacity: currentCount <= 0 ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
            data-testid="decrement-btn"
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={theme.buttonIconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
            </svg>
          </button>
        )}

        {/* Count */}
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 700,
            color: theme.countColor,
            minWidth: '40px',
            textAlign: 'center',
          }}
        >
          {currentCount}/{displayTargetCount}
        </span>

        {/* Plus Button - 仅好习惯显示 */}
        {direction === 'positive' && (
          <button
            onClick={(e) => handleButtonClick(e, onIncrement)}
            className="flex items-center justify-center"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '999px',
              backgroundColor: theme.buttonBg,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            data-testid="increment-btn"
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={theme.buttonIconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
