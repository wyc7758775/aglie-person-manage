'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress: number;
}

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-green-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8 pixel-font tracking-wider">
          我的农场
        </h1>

        <div className="w-64 h-8 bg-amber-900 border-4 border-amber-700 relative">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-4 text-amber-300 pixel-font text-sm">
          加载中{dots} {Math.round(progress)}%
        </p>

        <div className="mt-8 flex gap-2 justify-center">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-yellow-400 animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
