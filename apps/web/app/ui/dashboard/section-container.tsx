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
    <div className={clsx('bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col min-h-0', className)}>
      {/* 头部区域 */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
        {/* 左侧：标题和徽章 */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
          {badge !== undefined && (
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
              {badge}
            </span>
          )}
        </div>

        {/* 右侧：过滤标签组 */}
        {(filters || filterGroups) && (
          <div className="flex items-center gap-3">
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
                        'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200',
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
                          'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200',
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
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* 添加按钮 - 卡片式样式 */}
        {onAddClick && (
          <button
            onClick={onClick || onAddClick}
            className={clsx(
              'mb-4 flex w-full items-center justify-center gap-2',
              'rounded-xl border-2 border-dashed border-slate-200',
              'bg-slate-50/50 py-3.5 text-sm font-medium text-slate-500',
              'transition-all duration-300 ease-out',
              'hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600',
              'hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5',
              'active:translate-y-0 active:shadow-none',
              'group'
            )}
          >
            <div className={clsx(
              'flex items-center justify-center w-6 h-6 rounded-full',
              'bg-slate-200 text-slate-500',
              'transition-all duration-300',
              'group-hover:bg-indigo-100 group-hover:text-indigo-600'
            )}>
              <PlusIcon className="h-3.5 w-3.5" />
            </div>
            <span>{addButtonText}</span>
          </button>
        )}

        {/* 内容区域 */}
        {children}
      </div>
    </div>
  );
}
