'use client';

import { Squares2X2Icon, RectangleStackIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export type ViewType = 'list' | 'kanban';
export type KanbanGroupBy = 'status' | 'priority';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  kanbanGroupBy?: KanbanGroupBy;
  onKanbanGroupChange?: (groupBy: KanbanGroupBy) => void;
  showKanbanGroupToggle?: boolean;
}

export default function ViewSwitcher({
  currentView,
  onViewChange,
  kanbanGroupBy = 'status',
  onKanbanGroupChange,
  showKanbanGroupToggle = false
}: ViewSwitcherProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* 视图切换按钮 */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onViewChange('list')}
          className={clsx(
            'p-2 rounded-md transition-colors',
            {
              'bg-white text-purple-700 shadow-sm': currentView === 'list',
              'text-gray-600 hover:text-gray-900': currentView !== 'list',
            }
          )}
          title="列表视图"
        >
          <Squares2X2Icon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewChange('kanban')}
          className={clsx(
            'p-2 rounded-md transition-colors',
            {
              'bg-white text-purple-700 shadow-sm': currentView === 'kanban',
              'text-gray-600 hover:text-gray-900': currentView !== 'kanban',
            }
          )}
          title="看板视图"
        >
          <RectangleStackIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 看板分组切换（仅在看板视图时显示） */}
      {showKanbanGroupToggle && currentView === 'kanban' && onKanbanGroupChange && (
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onKanbanGroupChange('status')}
            className={clsx(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              {
                'bg-white text-purple-700 shadow-sm': kanbanGroupBy === 'status',
                'text-gray-600 hover:text-gray-900': kanbanGroupBy !== 'status',
              }
            )}
          >
            按状态
          </button>
          <button
            onClick={() => onKanbanGroupChange('priority')}
            className={clsx(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              {
                'bg-white text-purple-700 shadow-sm': kanbanGroupBy === 'priority',
                'text-gray-600 hover:text-gray-900': kanbanGroupBy !== 'priority',
              }
            )}
          >
            按优先级
          </button>
        </div>
      )}
    </div>
  );
}
