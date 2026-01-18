'use client';

import { useState } from 'react';
import { FarmPlot as FarmPlotType, Crop as CropType, CROPS, Season } from './types';
import Crop from './Crop';

interface FarmPlotProps {
  plot: FarmPlotType;
  onPlotClick: (plotId: number) => void;
  selectedCrop: CropType | null;
  season?: Season;
}

export default function FarmPlot({ plot, onPlotClick, selectedCrop, season = 'spring' }: FarmPlotProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getBorderColor = () => {
    if (plot.status === 'ready') return 'border-yellow-400 animate-pulse';
    if (plot.status === 'growing') return 'border-green-400';
    if (plot.status === 'harvested') return 'border-green-300';
    return 'border-amber-600';
  };

  const getBackgroundColor = () => {
    if (plot.isWatered) return 'bg-amber-800';
    return 'bg-amber-700';
  };

  const handleClick = () => {
    onPlotClick(plot.id);
  };

  return (
    <div
      className={`
        relative w-24 h-24
        border-4 rounded-lg
        cursor-pointer
        transition-all duration-200
        ${getBorderColor()}
        ${getBackgroundColor()}
        ${isHovered ? 'scale-105 shadow-lg' : ''}
        pixel-plot
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-2 rounded"
        style={{
          background: plot.isWatered
            ? 'linear-gradient(135deg, #5d4037 25%, #4e342e 25%, #4e342e 50%, #5d4037 50%, #5d4037 75%, #4e342e 75%, #4e342e 100%)'
            : 'linear-gradient(135deg, #8d6e63 25%, #795548 25%, #795548 50%, #8d6e63 50%, #8d6e63 75%, #795548 75%, #795548 100%)',
          backgroundSize: '8px 8px',
        }}
      />

      {plot.crop && plot.status !== 'empty' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Crop crop={plot.crop} growthProgress={plot.growthProgress} />
        </div>
      )}

      {plot.status === 'empty' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl text-amber-600 opacity-50">+</span>
        </div>
      )}

      {plot.status === 'ready' && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow">
          <span className="text-xs">!</span>
        </div>
      )}

      {plot.status === 'growing' && (
        <div className="absolute bottom-1 left-1 right-1 h-1 bg-amber-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all duration-300"
            style={{ width: `${plot.growthProgress}%` }}
          />
        </div>
      )}

      {plot.status === 'empty' && selectedCrop && (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-900/50 rounded">
          <span className="text-xs text-amber-200 pixel-font">
            -{selectedCrop.cost} ☀️
          </span>
        </div>
      )}
    </div>
  );
}
