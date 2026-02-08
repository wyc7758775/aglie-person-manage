"use client";

import { useEffect, useState } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const baseStyles = "flex items-center gap-3 px-3 py-2 rounded-lg shadow-lg backdrop-blur-md border text-sm font-medium transition-all duration-300 ease-out min-w-[200px] max-w-[400px]";
  
  const typeStyles = {
    success: "bg-green-50/90 border-green-200/50 text-green-800",
    error: "bg-red-50/90 border-red-200/50 text-red-800", 
    info: "bg-blue-50/90 border-blue-200/50 text-blue-800"
  };

  const iconStyles = {
    success: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const animationClass = isVisible 
    ? (isExiting ? "animate-toast-exit" : "animate-toast-enter")
    : "opacity-0 translate-x-full";

  return (
    <div className={`${baseStyles} ${typeStyles[type]} ${animationClass}`}>
      {iconStyles[type]}
      <span className="flex-1 text-xs leading-relaxed">{message}</span>
      <button
        onClick={handleClose}
        className="text-current hover:opacity-70 transition-opacity duration-200 flex-shrink-0 ml-2"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <style jsx>{`
        @keyframes toast-enter {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
          50% {
            opacity: 0.8;
            transform: translateX(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes toast-exit {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
        }
        
        .animate-toast-enter {
          animation: toast-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-toast-exit {
          animation: toast-exit 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0) scale(1);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-1px) scale(1.01);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(1px) scale(1.01);
          }
          40%, 43% {
            transform: translateX(-2px) scale(1.02);
          }
          70% {
            transform: translateX(-1px) scale(1.01);
          }
          90% {
            transform: translateX(-0.5px) scale(1.005);
          }
        }
      `}</style>
    </div>
  );
}

// Toast 管理器组件
export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const addToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      ...toast,
      id,
      onClose: () => removeToast(id)
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 将 addToast 方法暴露到全局 window 对象
  useEffect(() => {
    window.showToast = (message: string, type: 'success' | 'error' | 'info', duration?: number) => {
      addToast({ message, type, duration });
    };
    
    return () => {
      if (window.showToast) {
        delete window.showToast;
      }
    };
  }, []);

  // 计算每个toast的位置 - Element UI风格：从右上角开始，向下排列
  const getToastPosition = (index: number) => {
    const baseTop = 16; // 距离顶部16px
    const baseRight = 16; // 距离右边16px
    const toastHeight = 48; // 每个toast的高度
    const gap = 8; // toast之间的间距
    
    return {
      top: baseTop + index * (toastHeight + gap),
      right: baseRight
    };
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {toasts.map((toast, index) => {
        const position = getToastPosition(index);
        return (
          <div 
            key={toast.id} 
            className="absolute pointer-events-auto"
            style={{ 
              top: `${position.top}px`,
              right: `${position.right}px`,
              transition: 'all 0.3s ease-out'
            }}
          >
            <Toast {...toast} />
          </div>
        );
      })}
    </div>
  );
}