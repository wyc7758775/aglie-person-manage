import { PlusIcon } from "@/app/ui/icons";
import clsx from 'clsx';

interface FilterGroup {
  label: string;
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

interface SectionContainerProps {
  title: string;
  badge?: number;
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  filterGroups?: FilterGroup[];
  onAddClick?: () => void;
  onClick?: () => void;
  addButtonText?: string;
  className?: string;
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
  filterGroups,
  onAddClick,
  onClick,
  addButtonText = `Add a ${title.slice(0, -1)}`,
  className,
  children
}: SectionContainerProps) {
  return (
    <div className={clsx('bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col min-h-0', className)}>
      {/* 头部区域 */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2 flex-shrink-0">
        {/* 左侧：标题和徽章 */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
          {badge !== undefined && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
              {badge}
            </span>
          )}
        </div>

        {/* 右侧：过滤标签组 + 添加按钮 */}
        <div className="flex items-center gap-3">
          {/* 迷你胶囊添加按钮 */}
          {onAddClick && (
            <button
              onClick={onClick || onAddClick}
              className={clsx(
                'flex items-center justify-center gap-1.5',
                'px-3 py-1.5 rounded-full',
                'text-xs font-semibold text-white',
                'bg-gradient-to-r from-indigo-500 to-blue-500',
                'shadow-lg shadow-indigo-500/25',
                'transition-all duration-300 ease-out',
                'hover:from-indigo-600 hover:to-blue-600',
                'hover:shadow-indigo-500/40 hover:-translate-y-0.5',
                'hover:scale-105',
                'active:scale-95 active:translate-y-0',
                'group'
              )}
            >
              <PlusIcon className="h-3 w-3 transition-transform group-hover:rotate-90" />
              <span>{addButtonText}</span>
            </button>
          )}

          {(filters || filterGroups) && (
            <>
              {/* 单个筛选器组（向后兼容） */}
              {filters && (
              <div className="flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-xl">
                {filters.map((filter) => {
                  const isActive = filter === activeFilter;
                  return (
                    <button
                      key={filter}
                      onClick={() => onFilterChange && onFilterChange(filter)}
                      className={clsx(
                        'px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                        {
                          // 选中状态：填充色 + 阴影
                          'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200': isActive,
                          // 未选中状态：透明 + hover 效果
                          'text-slate-500 hover:text-slate-700 hover:bg-slate-100': !isActive,
                        }
                      )}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* 多个筛选器组 */}
            {filterGroups?.map((group, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">{group.label}</span>
                <div className="flex items-center gap-1 bg-slate-50/80 p-1 rounded-xl border border-slate-100">
                  {group.filters.map((filter) => {
                    const isActive = filter === group.activeFilter;
                    return (
                      <button
                        key={filter}
                        onClick={() => group.onFilterChange(filter)}
                        className={clsx(
                          'px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                          {
                            // 选中状态：填充色 + 阴影
                            'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200': isActive,
                            // 未选中状态：透明 + hover 效果
                            'text-slate-500 hover:text-slate-700 hover:bg-slate-100': !isActive,
                          }
                        )}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* 内容区域 */}
        {children}
      </div>
    </div>
  );
}
