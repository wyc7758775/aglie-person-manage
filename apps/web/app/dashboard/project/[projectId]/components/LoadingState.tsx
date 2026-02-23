'use client';

import { useLanguage } from '@/app/lib/i18n';

export default function LoadingState() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col h-full">
      {/* 筛选器和新建按钮栏 - 骨架屏 */}
      <div 
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(26, 29, 46, 0.06)' }}
      >
        {/* 左侧：筛选器骨架 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="px-3 py-1.5 rounded-lg bg-gray-200 animate-pulse"
                style={{ width: `${40 + i * 10}px` }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="px-3 py-1.5 rounded-lg bg-gray-200 animate-pulse"
                style={{ width: `${30 + i * 8}px` }}
              />
            ))}
          </div>
        </div>

        {/* 右侧：按钮骨架 */}
        <div className="px-4 py-2 rounded-full bg-gray-200 animate-pulse w-24 h-9" />
      </div>

      {/* 内容区域加载动画 */}
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        {/* 主加载动画 */}
        <div className="relative mb-8">
          {/* 外圈旋转 */}
          <div className="w-16 h-16 rounded-full border-4 border-gray-100" />
          <div 
            className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-[#E8944A] animate-spin"
            style={{ animationDuration: '1s' }}
          />
          
          {/* 内圈反向旋转 */}
          <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-gray-100" />
          <div 
            className="absolute inset-2 w-12 h-12 rounded-full border-4 border-transparent border-b-[#E8944A] animate-spin"
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          />
          
          {/* 中心点 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#E8944A] animate-pulse" />
          </div>
        </div>

        {/* 加载文字 */}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-gray-700">{t('project.loading')}</p>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8944A] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8944A] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8944A] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
