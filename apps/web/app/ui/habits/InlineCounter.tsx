'use client';

interface InlineCounterProps {
  currentCount: number;
  targetCount: number;
  direction: 'positive' | 'negative';
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

export function InlineCounter({
  currentCount,
  targetCount,
  direction,
  onIncrement,
  onDecrement,
  disabled = false,
}: InlineCounterProps) {
  const displayTargetCount = direction === 'negative' ? -targetCount : targetCount;
  
  // 根据方向定义颜色主题
  const theme = direction === 'positive' ? {
    // 好习惯（正向）- 绿色调
    containerBg: '#22C55E18',
    containerBorder: 'none',
    textColor: '#166534',
    buttonBg: '#2E7D32',
    buttonIconColor: '#FFFFFF',
    countColor: '#166534',
  } : {
    // 坏习惯（反向）- 红色调
    containerBg: '#FEE2E2',
    containerBorder: 'none',
    textColor: '#991B1B',
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
      className="flex items-center"
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: theme.containerBg,
        borderRadius: '9px',
        padding: '4px 10px',
        gap: '10px',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
      data-testid="inline-counter"
    >
      {/* Minus Button - 仅坏习惯显示 */}
      {direction === 'negative' && (
        <button
          onClick={(e) => handleButtonClick(e, onDecrement)}
          disabled={disabled || currentCount <= 0}
          className="flex items-center justify-center"
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '999px',
            backgroundColor: theme.buttonBg,
            border: 'none',
            cursor: currentCount <= 0 ? 'not-allowed' : 'pointer',
            opacity: currentCount <= 0 ? 0.5 : 1,
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          data-testid="inline-decrement-btn"
        >
          <svg 
            width="12" 
            height="12" 
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
          fontSize: '12px',
          fontWeight: 600,
          color: theme.countColor,
          minWidth: '36px',
          textAlign: 'center',
        }}
      >
        {currentCount}/{displayTargetCount}
      </span>

      {/* Plus Button - 仅好习惯显示 */}
      {direction === 'positive' && (
        <button
          onClick={(e) => handleButtonClick(e, onIncrement)}
          disabled={disabled}
          className="flex items-center justify-center"
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '999px',
            backgroundColor: theme.buttonBg,
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          data-testid="inline-increment-btn"
        >
          <svg 
            width="12" 
            height="12" 
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
  );
}
