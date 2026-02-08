'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '@/app/lib/i18n';

type FileItemStatus = 'uploading' | 'success' | 'error';

interface FileItem {
  id: string;
  name: string;
  status: FileItemStatus;
  progress: number;
  url?: string;
}

interface CoverImageUploadProps {
  value?: string | null;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
}

// 使用 data URL 持久化到内存库；模拟失败（如大文件模拟失败）
const SIMULATE_FAIL_SIZE_BYTES = 8 * 1024 * 1024; // 8MB 以上模拟失败

export default function CoverImageUpload({ value, onChange, disabled }: CoverImageUploadProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value ?? undefined);

  useEffect(() => {
    setPreviewUrl(value ?? undefined);
  }, [value]);

  const removeFile = useCallback((id: string) => {
    setFileList((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.status === 'success' && item.url) {
        if (item.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
        if (previewUrl === item.url) {
          setPreviewUrl(undefined);
          onChange(undefined);
        }
      }
      return prev.filter((f) => f.id !== id);
    });
  }, [onChange, previewUrl]);

  const processFile = useCallback(
    (file: File) => {
      const id = `file-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const name = file.name;

      setFileList((prev) => [
        ...prev,
        { id, name, status: 'uploading', progress: 0 }
      ]);

      const simulateFail = file.size > SIMULATE_FAIL_SIZE_BYTES;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setFileList((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: 'success' as const, progress: 100, url: dataUrl } : f
          )
        );
        setPreviewUrl(dataUrl);
        onChange(dataUrl);
      };
      reader.onerror = () => {
        setFileList((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: 'error' as const, progress: 100 } : f
          )
        );
      };

      if (simulateFail) {
        setFileList((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: 'error' as const, progress: 100 } : f
          )
        );
        return;
      }

      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          clearInterval(progressInterval);
          reader.readAsDataURL(file);
          return;
        }
        setFileList((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      }, 100);
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith('image/')) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const showPlaceholder = !previewUrl;

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* 上方投放区 / 预览区 */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          rounded-lg border-2 border-dashed min-h-[160px] flex flex-col items-center justify-center
          transition-colors cursor-pointer
          ${showPlaceholder ? 'bg-gray-100 border-gray-300 hover:border-blue-400 hover:bg-gray-50' : 'border-gray-300 bg-gray-50'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        {showPlaceholder ? (
          <>
            <div className="text-blue-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-900 font-medium text-center px-4">
              {t('project.coverImage.uploadHint')}
            </p>
            <p className="text-sm text-gray-500 mt-1 text-center px-4">
              {t('project.coverImage.uploadHintSecondary')}
            </p>
          </>
        ) : (
          <div className="relative w-full h-full min-h-[160px] rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}
      </div>

      {/* 下方文件列表 */}
      {fileList.length > 0 && (
        <div className="border-t border-gray-200 pt-3 space-y-3">
          {fileList.map((item) => (
            <div key={item.id}>
              <div className="flex items-center gap-2 text-sm">
                {item.status === 'error' ? (
                  <span className="text-red-500 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </span>
                ) : null}
                <span
                  className={
                    item.status === 'error' ? 'text-red-600 flex-1 truncate' : 'text-gray-700 flex-1 truncate'
                  }
                >
                  {item.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className={`flex-shrink-0 p-1 rounded ${item.status === 'error' ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}
                  aria-label={t('common.buttons.delete')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {item.status === 'uploading' && (
                <div className="mt-1 w-full">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
