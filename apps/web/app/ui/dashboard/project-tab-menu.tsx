'use client';

/**
 * ProjectTabMenu 组件 - 项目详情页面的 Tab 切换菜单
 * 
 * 设计特点：
 * - 使用胶囊形状按钮组，与整体设计风格一致
 * - 滑动指示器使用糖果色渐变（粉色 → 紫色 → 蓝色）
 * - 平滑的过渡动画（cubic-bezier 缓动函数）
 * - 响应式布局适配移动端
 */

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/app/lib/i18n';

type TabType = 'requirement' | 'task' | 'defect';

interface TabItem {
  key: TabType;
  label: string;
}

interface ProjectTabMenuProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showDefectTab?: boolean;
}

export default function ProjectTabMenu({
  activeTab,
  onTabChange,
  showDefectTab = false,
}: ProjectTabMenuProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  // 定义 Tab 列表
  const tabs: TabItem[] = [
    { key: 'requirement', label: t('dashboard.nav.requirement') },
    { key: 'task', label: t('dashboard.nav.task') },
    ...(showDefectTab ? [{ key: 'defect' as TabType, label: t('dashboard.nav.defect') }] : []),
  ];

  // 计算滑动指示器位置
  useEffect(() => {
    if (containerRef.current) {
      const activeButton = containerRef.current.querySelector(
        `[data-tab="${activeTab}"]`
      ) as HTMLElement;
      
      if (activeButton) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        // 触发移动动画
        setIsAnimating(true);
        
        setIndicatorStyle({
          left: buttonRect.left - containerRect.left,
          width: buttonRect.width,
        });

        // 动画结束后重置状态
        const timer = setTimeout(() => setIsAnimating(false), 400);
        return () => clearTimeout(timer);
      }
    }
  }, [activeTab, tabs.length]);

  return (
    <div
      ref={containerRef}
      className="
        relative inline-flex items-center
        p-1 rounded-full
        bg-gray-100/80 backdrop-blur-sm
        border border-gray-200/50
      "
    >
      {/* 滑动指示器 - 糖果色渐变 */}
      <div
        className={`
          absolute h-[calc(100%-8px)] top-1 rounded-full
          bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400
          shadow-md shadow-purple-200/50
          transition-all duration-300 ease-out
          ${isAnimating ? 'scale-105' : 'scale-100'}
        `}
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* 高光效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
      </div>

      {/* Tab 按钮 */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            data-tab={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              relative z-10 px-4 py-1.5 text-sm font-medium rounded-full
              transition-colors duration-300 ease-out
              ${isActive
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
