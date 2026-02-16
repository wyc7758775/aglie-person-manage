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
    <div className="h-full flex flex-col">
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
          flex-1 rounded-lg border-2 border-dashed flex flex-col items-center justify-center
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
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
            {/* 背景模糊层 */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-60"
              style={{ backgroundImage: `url(${previewUrl})` }}
              aria-hidden
            />
            {/* 主图 */}
            <img
              src={previewUrl}
              alt=""
              className="relative z-10 w-full h-full object-contain object-center"
            />
          </div>
        )}
      </div>

      {/* 图片删除按钮 - 浮动在右上角 */}
      {previewUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewUrl(undefined);
            onChange(undefined);
            setFileList([]);
          }}
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors z-10"
          aria-label={t('common.buttons.delete')}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
