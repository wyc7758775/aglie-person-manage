'use client';

import { Task } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';

interface TaskTabContentProps {
  tasks: Task[];
}

export default function TaskTabContent({ tasks }: TaskTabContentProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(26, 29, 46, 0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ backgroundColor: 'rgba(26, 29, 46, 0.04)' }}
          >
            {['全部', '待办', '进行中', '已完成'].map((filter, index) => (
              <button
                key={filter}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: index === 0 ? 'white' : 'transparent',
                  color: index === 0 ? '#E8944A' : 'rgba(26, 29, 46, 0.6)',
                  boxShadow: index === 0 ? '0 1px 3px rgba(26, 29, 46, 0.1)' : 'none',
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div 
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ backgroundColor: 'rgba(26, 29, 46, 0.04)' }}
          >
            {['全部类型', '爱好', '习惯', '任务', '欲望'].slice(0, 3).map((filter, index) => (
              <button
                key={filter}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: index === 0 ? 'white' : 'transparent',
                  color: index === 0 ? '#E8944A' : 'rgba(26, 29, 46, 0.6)',
                  boxShadow: index === 0 ? '0 1px 3px rgba(26, 29, 46, 0.1)' : 'none',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all"
          style={{ 
            backgroundColor: '#E8944A',
            boxShadow: '0 2px 8px rgba(232, 148, 74, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D4843A';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E8944A';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建任务
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
          <div className="relative mb-8 group">
            <svg
              width="160"
              height="120"
              viewBox="0 0 160 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-500 ease-out group-hover:scale-105"
            >
              <defs>
                <pattern id="taskGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" strokeOpacity="0.3"/>
                </pattern>
              </defs>
              <rect width="160" height="120" fill="url(#taskGrid)" />
              <rect x="40" y="20" width="80" height="80" rx="8" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5"/>
              <rect x="50" y="30" width="60" height="12" rx="4" fill="#E5E7EB"/>
              <rect x="50" y="50" width="50" height="8" rx="2" fill="#E5E7EB"/>
              <rect x="50" y="64" width="40" height="8" rx="2" fill="#E5E7EB"/>
              <rect x="50" y="80" width="16" height="16" rx="4" fill="white" stroke="#D1D5DB" strokeWidth="1.5"/>
              <g className="animate-pulse">
                <circle cx="120" cy="32" r="16" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="2 2"/>
                <line x1="120" y1="26" x2="120" y2="38" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                <line x1="114" y1="32" x2="126" y2="32" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
              </g>
            </svg>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-gray-900 tracking-tight">
              暂无任务
            </h3>
            <p className="text-sm text-gray-400 font-light">
              点击上方按钮创建您的第一个任务
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-gray-100">{t(`task.filters.${task.status}`)}</span>
                  <span className="px-2 py-1 rounded bg-gray-100">{t(`task.priority.${task.priority}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
