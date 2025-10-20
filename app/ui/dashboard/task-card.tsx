import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface TaskCardProps {
  title: string;
  description?: string;
  color?: 'purple' | 'orange' | 'blue' | 'green' | 'yellow';
  completed?: boolean;
  points?: number;
  onClick?: () => void;
}

/**
 * 任务卡片组件
 * 用于显示习惯、每日任务和待办事项
 */
export default function TaskCard({
  title,
  description,
  color = 'orange',
  completed = false,
  points,
  onClick,
}: TaskCardProps) {
  // 根据颜色设置不同的样式类
  const colorClasses = {
    purple: 'bg-purple-50 border-l-4 border-l-purple-400 border-t border-r border-b border-gray-200',
    orange: 'bg-orange-50 border-l-4 border-l-orange-400 border-t border-r border-b border-gray-200',
    blue: 'bg-blue-50 border-l-4 border-l-blue-400 border-t border-r border-b border-gray-200',
    green: 'bg-green-50 border-l-4 border-l-green-400 border-t border-r border-b border-gray-200',
    yellow: 'bg-yellow-50 border-l-4 border-l-yellow-400 border-t border-r border-b border-gray-200',
  };

  // 复选框样式
  const checkboxClasses = {
    purple: 'border-purple-500 hover:border-purple-600',
    orange: 'border-orange-500 hover:border-orange-600',
    blue: 'border-blue-500 hover:border-blue-600',
    green: 'border-green-500 hover:border-green-600',
    yellow: 'border-yellow-500 hover:border-yellow-600',
  };

  return (
    <div
      className={clsx(
        'relative rounded-md shadow-sm transition-all mb-2',
        colorClasses[color],
        {
          'opacity-60': completed,
        }
      )}
    >
      <div className="flex items-start justify-between p-3">
        <div className="flex items-start space-x-3">
          <button
            onClick={onClick}
            className={clsx(
              'mt-0.5 flex h-5 w-5 items-center justify-center rounded border',
              checkboxClasses[color]
            )}
          >
            {completed && <CheckIcon className="h-4 w-4 text-gray-700" />}
          </button>
          
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            {description && (
              <p className="mt-0.5 text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
        
        {points !== undefined && (
          <div className="flex h-5 items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-medium text-gray-700">
            {points}
          </div>
        )}
      </div>
    </div>
  );
}