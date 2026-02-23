'use client';

import { useLanguage } from '@/app/lib/i18n';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onDiscard: () => void;
  onCancel: () => void;
}

export default function UnsavedChangesDialog({
  isOpen,
  onDiscard,
  onCancel,
}: UnsavedChangesDialogProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div data-testid="unsaved-changes-dialog" className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />
      
      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* 警告图标 */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
          <svg
            className="h-6 w-6 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* 标题 */}
        <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
          {t('project.unsavedChanges.title') || '未保存的更改'}
        </h3>

        {/* 描述 */}
        <p className="text-sm text-center text-gray-500 mb-6">
          {t('project.unsavedChanges.description') || '您有未保存的更改，确定要放弃吗？'}
        </p>

        {/* 按钮组 */}
        <div className="flex flex-row gap-3">
          {/* 取消按钮 */}
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {t('common.buttons.cancel')}
          </button>

          {/* 放弃更改按钮 */}
          <button
            onClick={onDiscard}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
          >
            {t('project.unsavedChanges.discard')}
          </button>
        </div>
      </div>
    </div>
  );
}
