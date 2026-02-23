'use client';

import { Defect } from '@/app/lib/definitions';
import { useLanguage } from '@/app/lib/i18n';
import EmptyDefectState from '@/app/ui/dashboard/empty-defect-state';

interface DefectTabContentProps {
  defects: Defect[];
}

export default function DefectTabContent({ defects }: DefectTabContentProps) {
  const { t } = useLanguage();

  if (defects.length === 0) {
    return <EmptyDefectState />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* 筛选器和新建按钮栏 */}
      <div 
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(26, 29, 46, 0.06)' }}
      >
        {/* 左侧：筛选器 */}
        <div className="flex items-center gap-3">
          {/* 状态筛选 */}
          <div 
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ backgroundColor: 'rgba(26, 29, 46, 0.04)' }}
          >
            {['全部', '待处理', '处理中', '已解决'].map((filter, index) => (
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

          {/* 严重程度筛选 */}
          <div 
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ backgroundColor: 'rgba(26, 29, 46, 0.04)' }}
          >
            {['全部', '致命', '严重', '一般'].slice(0, 3).map((filter, index) => (
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

        {/* 右侧：新建按钮 */}
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
          新建缺陷
        </button>
      </div>

      {/* 缺陷列表 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {defects.map((defect) => (
            <div key={defect.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-mono text-gray-500">{defect.id}</span>
                <span className="px-2 py-1 rounded text-xs bg-gray-100">{t(`defect.type.${defect.type}`)}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{defect.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{defect.description}</p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-gray-100">{t(`defect.filters.${defect.status}`)}</span>
                <span className="px-2 py-1 rounded bg-gray-100">{t(`defect.severity.${defect.severity}`)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
