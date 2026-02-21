'use client';

import { useLanguage } from '@/app/lib/i18n';

interface EmptyProjectStateProps {
  className?: string;
}

export default function EmptyProjectState({ className = '' }: EmptyProjectStateProps) {
  const { t } = useLanguage();

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
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" strokeOpacity="0.3"/>
            </pattern>
          </defs>
          <rect width="160" height="120" fill="url(#grid)" />

          {/* 主图形 - 抽象的项目/文件夹形状 */}
          {/* 底部阴影层 */}
          <rect
            x="48"
            y="52"
            width="64"
            height="48"
            rx="4"
            fill="#E5E7EB"
            className="transition-all duration-500 delay-100"
          />
          
          {/* 主文件夹主体 */}
          <rect
            x="44"
            y="40"
            width="64"
            height="48"
            rx="4"
            fill="#F9FAFB"
            stroke="#D1D5DB"
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          
          {/* 文件夹标签/标签页 */}
          <path
            d="M44 50 L44 44 C44 41.7909 45.7909 40 48 40 L56 40 C58.2091 40 60 41.7909 60 44 L60 50"
            fill="#F3F4F6"
            stroke="#D1D5DB"
            strokeWidth="1.5"
          />

          {/* 内部内容线条 - 表示空的文档 */}
          <line x1="52" y1="60" x2="100" y2="60" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="52" y1="70" x2="88" y2="70" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="52" y1="80" x2="76" y2="80" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />

          {/* 搜索放大镜图标 - 表示正在寻找 */}
          <g className="animate-pulse">
            <circle
              cx="108"
              cy="36"
              r="16"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeDasharray="2 2"
            />
            <circle
              cx="108"
              cy="36"
              r="10"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
            />
            <line
              x1="116"
              y1="44"
              x2="124"
              y2="52"
              stroke="#6B7280"
              strokeWidth="2.5"
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
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
      </div>

      {/* 文字内容 */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-gray-900 tracking-tight">
          {t('project.empty')}
        </h3>
        <p className="text-sm text-gray-400 font-light">
          {t('project.emptyHint') || '尝试调整筛选条件或创建一个新项目'}
        </p>
      </div>

      {/* 可选的提示动作 */}
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100">Tab</span>
        <span>切换筛选</span>
        <span className="mx-2 text-gray-300">|</span>
        <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100">+</span>
        <span>新建项目</span>
      </div>
    </div>
  );
}
