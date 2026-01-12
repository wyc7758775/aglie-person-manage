import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface SectionContainerProps {
  title: string;
  badge?: number;
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  onAddClick?: () => void;
  onClick?: () => void;
  addButtonText?: string;
  children: React.ReactNode;
}

/**
 * 区域容器组件
 * 用于展示应用中的各个主要内容区域，包括标题、筛选器和添加按钮
 */
export default function SectionContainer({
  title,
  badge,
  filters,
  activeFilter,
  onFilterChange,
  onAddClick,
  onClick,
  addButtonText = `Add a ${title.slice(0, -1)}`,
  children
}: SectionContainerProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#EE3F4D]/10">
      <div className="mb-1 flex items-center justify-between border-b border-[#EE3F4D]/20 pb-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-[#333]">{title}</h2>
          {badge !== undefined && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              {badge}
            </span>
          )}
        </div>
        {filters && (
          <div className="flex space-x-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange && onFilterChange(filter)}
                className={clsx(
                  'rounded-md px-2 py-0.5 text-xs font-medium',
                  {
                    'bg-purple-100 text-purple-700': filter === activeFilter,
                    'text-gray-500 hover:bg-gray-100': filter !== activeFilter,
                  }
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div>
        {/* 添加按钮 */}
        {onAddClick && (
          <button
            onClick={onClick || onAddClick}
            className="mb-3 flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <PlusIcon className="mr-1 h-4 w-4" />
            {addButtonText}
          </button>
        )}
      
        {/* 内容区域 */}
        {children}
      </div>
    </div>
  );
}
