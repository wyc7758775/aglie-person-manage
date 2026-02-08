'use client';

import { useEffect, useRef } from 'react';
import { Crop as CropType, PIXEL_SCALE } from './types';

interface CropProps {
  crop: CropType;
  growthProgress: number;
}

export default function Crop({ crop, growthProgress }: CropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const stage = Math.min(
      Math.floor(growthProgress / (100 / crop.growthStages)),
      crop.growthStages - 1
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const baseSize = 16;
    const scale = PIXEL_SCALE;
    const size = baseSize * scale;

    ctx.fillStyle = '#6abe30';
    ctx.fillRect(8 * scale, 20 * scale, 4 * scale, 8 * scale);

    ctx.fillStyle = '#37946e';
    const stemHeight = 8 + (stage * 4);
    ctx.fillRect(9 * scale, (24 - stemHeight) * scale, 2 * scale, stemHeight * scale);

    ctx.fillStyle = '#4b692f';
    for (let i = 0; i <= stage; i++) {
      const leafY = (20 - i * 4) * scale;
      ctx.fillRect(6 * scale, leafY, 2 * scale, 3 * scale);
      ctx.fillRect(12 * scale, leafY, 2 * scale, 3 * scale);
    }

    if (growthProgress >= 100) {
      ctx.fillStyle = '#fcd34d';
      ctx.beginPath();
      ctx.arc(10 * scale, 8 * scale, 5 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#d97706';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = 10 * scale + Math.cos(angle) * 8 * scale;
        const y = 8 * scale + Math.sin(angle) * 8 * scale;
        ctx.fillRect(x - 1 * scale, y - 1 * scale, 2 * scale, 2 * scale);
      }
    } else if (crop.id === 'carrot') {
      ctx.fillStyle = '#e65100';
      ctx.fillRect(8 * scale, 10 * scale, 4 * scale, 6 * scale);
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(8 * scale, 6 * scale, 2 * scale, 4 * scale);
      ctx.fillRect(12 * scale, 6 * scale, 2 * scale, 4 * scale);
    } else if (crop.id === 'corn') {
      ctx.fillStyle = '#fcd34d';
      ctx.fillRect(8 * scale, 8 * scale, 6 * scale, 8 * scale);
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(9 * scale, 4 * scale, 4 * scale, 4 * scale);
    } else if (crop.id === 'watermelon') {
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(6 * scale, 10 * scale, 8 * scale, 6 * scale);
      ctx.fillStyle = '#ff5252';
      ctx.fillRect(7 * scale, 11 * scale, 6 * scale, 4 * scale);
    }
  }, [crop, growthProgress]);

  return (
    <canvas
      ref={canvasRef}
      width={64}
      height={64}
      className="pixelated w-16 h-16"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
