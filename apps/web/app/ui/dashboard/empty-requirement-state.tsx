'use client';

interface EmptyRequirementStateProps {
  onAddClick?: () => void;
  className?: string;
}

export default function EmptyRequirementState({ onAddClick, className = '' }: EmptyRequirementStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
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
          {/* 背景装饰 - 淡淡的网格 */}
          <defs>
            <pattern id="reqGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" strokeOpacity="0.3"/>
            </pattern>
          </defs>
          <rect width="160" height="120" fill="url(#reqGrid)" />

          {/* 主图形 - 需求文档列表 */}
          {/* 底部文档阴影 */}
          <rect
            x="56"
            y="58"
            width="48"
            height="56"
            rx="4"
            fill="#E5E7EB"
            className="transition-all duration-500 delay-100"
          />
          
          {/* 中间文档 */}
          <rect
            x="52"
            y="48"
            width="48"
            height="56"
            rx="4"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="1.5"
            className="transition-all duration-500 delay-75"
          />
          
          {/* 顶部文档 - 主文档 */}
          <rect
            x="48"
            y="36"
            width="48"
            height="56"
            rx="4"
            fill="#F9FAFB"
            stroke="#D1D5DB"
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          
          {/* 文档头部 */}
          <rect
            x="48"
            y="36"
            width="48"
            height="14"
            rx="4"
            fill="#E5E7EB"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />

          {/* 文档内容线条 */}
          <line x1="56" y1="58" x2="88" y2="58" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="56" y1="68" x2="84" y2="68" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="56" y1="78" x2="80" y2="78" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />

          {/* 加号图标 - 表示添加 */}
          <g className="animate-pulse">
            <circle
              cx="112"
              cy="32"
              r="16"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeDasharray="2 2"
            />
            <circle
              cx="112"
              cy="32"
              r="10"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
            />
            <line
              x1="112"
              y1="26"
              x2="112"
              y2="38"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="106"
              y1="32"
              x2="118"
              y2="32"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* 装饰性小点 */}
          <circle cx="32" cy="80" r="3" fill="#D1D5DB" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          <circle cx="128" cy="72" r="2" fill="#D1D5DB" className="animate-pulse" style={{ animationDelay: '0.7s' }} />
          <circle cx="136" cy="88" r="2" fill="#D1D5DB" className="animate-pulse" style={{ animationDelay: '0.9s' }} />

          {/* 左侧装饰线 */}
          <line x1="28" y1="48" x2="28" y2="72" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* 悬浮时的微妙光晕效果 */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
      </div>

      {/* 文字内容 */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-gray-900 tracking-tight">
          暂无需求
        </h3>
        <p className="text-sm text-gray-400 font-light">
          点击右上角按钮创建您的第一个需求
        </p>
      </div>

      {/* 可选的提示动作 */}
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100">Tab</span>
        <span>切换筛选</span>
        <span className="mx-2 text-gray-300">|</span>
        <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100">+</span>
        <span>新建需求</span>
      </div>
    </div>
  );
}
