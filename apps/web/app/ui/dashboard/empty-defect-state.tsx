'use client';

interface EmptyDefectStateProps {
  onAddClick?: () => void;
  className?: string;
}

export default function EmptyDefectState({ onAddClick, className = '' }: EmptyDefectStateProps) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      {/* 简约几何风格 SVG 插图 */}
      <div className="relative mb-8 group">
        <svg
          width="160"
          height="120"
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        >
          {/* 背景装饰 */}
          <defs>
            <pattern id="defectGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" strokeOpacity="0.3"/>
            </pattern>
          </defs>
          <rect width="160" height="120" fill="url(#defectGrid)" />

          {/* 警告三角形 */}
          <path
            d="M80 25 L115 85 L45 85 Z"
            fill="#FEF3C7"
            stroke="#F59E0B"
            strokeWidth="2"
          />
          
          {/* 感叹号 */}
          <line x1="80" y1="45" x2="80" y2="65" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="80" cy="73" r="3" fill="#F59E0B"/>
          
          {/* 加号图标 */}
          <g className="animate-pulse">
            <circle cx="120" cy="32" r="16" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="2 2"/>
            <line x1="120" y1="26" x2="120" y2="38" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
            <line x1="114" y1="32" x2="126" y2="32" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </g>
          
          {/* 装饰点 */}
          <circle cx="30" cy="70" r="3" fill="#D1D5DB" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          <circle cx="130" cy="80" r="2" fill="#D1D5DB" className="animate-pulse" style={{ animationDelay: '0.7s' }} />
        </svg>
      </div>

      {/* 文字内容 */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-gray-900 tracking-tight">
          暂无缺陷
        </h3>
        <p className="text-sm text-gray-400 font-light">
          项目运行良好，暂无缺陷记录
        </p>
      </div>

      {/* 可选的提示动作 */}
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100">Tab</span>
        <span>切换筛选</span>
        <span className="mx-2 text-gray-300">|</span>
        <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100">+</span>
        <span>新建缺陷</span>
      </div>
    </div>
  );
}
