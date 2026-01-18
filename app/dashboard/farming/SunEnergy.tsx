'use client';

import { useEffect, useState } from 'react';

interface SunEnergyProps {
  sunEnergy: number;
}

export default function SunEnergy({ sunEnergy }: SunEnergyProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (sunEnergy > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [sunEnergy]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          flex items-center gap-3 px-6 py-3
          bg-amber-100 border-4 border-amber-600
          rounded-lg shadow-lg
          pixel-panel
          transition-transform duration-300
          ${isAnimating ? 'scale-110' : 'scale-100'}
        `}
      >
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse" />
          <div
            className="absolute inset-1 bg-yellow-300 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #fff9c4, #ffeb3b)',
            }}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-200 rounded-full animate-ping"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-amber-700 pixel-font">阳光</span>
          <span className="text-2xl font-bold text-amber-800 pixel-font tabular-nums">
            {sunEnergy}
          </span>
        </div>
      </div>
    </div>
  );
}
