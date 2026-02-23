'use client';

interface EmptyTaskStateProps {
  onAddClick?: () => void;
  className?: string;
}

export default function EmptyTaskState({ onAddClick, className = '' }: EmptyTaskStateProps) {
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
            <pattern id="taskGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" strokeOpacity="0.3"/>
            </pattern>
          </defs>
          <rect width="160" height="120" fill="url(#taskGrid)" />

          {/* 任务卡片堆叠 */}
          <rect x="40" y="20" width="80" height="80" rx="8" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5"/>
          <rect x="50" y="30" width="60" height="12" rx="4" fill="#E5E7EB"/>
          <rect x="50" y="50" width="50" height="8" rx="2" fill="#E5E7EB"/>
          <rect x="50" y="64" width="40" height="8" rx="2" fill="#E5E7EB"/>
          
          {/* 复选框 */}
          <rect x="50" y="80" width="16" height="16" rx="4" fill="white" stroke="#D1D5DB" strokeWidth="1.5"/>
          
          {/* 加号图标 */}
          <g className="animate-pulse">
            <circle cx="120" cy="32" r="16" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="2 2"/>
            <line x1="120" y1="26" x2="120" y2="38" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
            <line x1="114" y1="32" x2="126" y2="32" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </g>
        </svg>
      </div>

      {/* 文字内容 */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-gray-900 tracking-tight">
          暂无任务
        </h3>
        <p className="text-sm text-gray-400 font-light">
          点击右上角按钮创建您的第一个任务
        </p>
      </div>

      {/* 可选的提示动作 */}
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100">Tab</span>
        <span>切换筛选</span>
        <span className="mx-2 text-gray-300">|</span>
        <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100">+</span>
        <span>新建任务</span>
      </div>
    </div>
  );
}
