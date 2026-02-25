'use client';

interface StatsCardProps {
  streak: number;
  totalGold: number;
  totalCount: number;
}

export function StatsCard({ streak, totalGold, totalCount }: StatsCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#1A1D2E',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      data-testid="stats-card"
    >
      <div
        className="flex"
        style={{ gap: '12px' }}
      >
        {/* Streak Box */}
        <StatBox 
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF9800" stroke="none">
              <path d="M12 2c0 0-1.5 3-1.5 5.5 0 2 1 3.5 2 4.5-1-1-3-2-5-2-2.5 0-4.5 2-4.5 4.5 0 4 4 8 9 8s9-4 9-8c0-2.5-2-4.5-4.5-4.5-2 0-4 1-5 2 1-1 2-2.5 2-4.5C13.5 5 12 2 12 2z"/>
            </svg>
          }
          label="连击"
          value={`${streak} 天`}
          dataTestId="streak-box"
        />

        {/* Gold Box */}
        <StatBox 
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="none">
              <circle cx="12" cy="12" r="10"/>
              <text x="12" y="16" textAnchor="middle" fill="#B8860B" fontSize="10" fontWeight="bold">$</text>
            </svg>
          }
          label="总金币"
          value={`${Math.floor(totalGold)} G`}
          dataTestId="gold-box"
        />

        {/* Count Box */}
        <StatBox 
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#4CAF50" stroke="none">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          }
          label="完成次数"
          value={`${totalCount} 次`}
          dataTestId="count-box"
        />
      </div>
    </div>
  );
}

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  dataTestId?: string;
}

function StatBox({ icon, label, value, dataTestId }: StatBoxProps) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF10',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      data-testid={dataTestId}
    >
      <div className="flex items-center" style={{ gap: '6px' }}>
        {icon}
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            color: '#FFFFFF88',
          }}
        >
          {label}
        </span>
      </div>
      
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#FFFFFF',
        }}
      >
        {value}
      </span>
    </div>
  );
}
