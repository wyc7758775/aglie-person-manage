'use client';

import { useMemo } from 'react';

interface TrendWeek {
  week: number;
  completed: number;
}

interface TrendSectionProps {
  data: TrendWeek[];
  isLoading: boolean;
}

export function TrendSection({ data, isLoading }: TrendSectionProps) {
  // 计算图表尺寸
  const chartWidth = 320;
  const chartHeight = 64;
  const paddingX = 14;
  const paddingY = 12;
  const availableWidth = chartWidth - paddingX * 2;
  const availableHeight = chartHeight - paddingY * 2;

  // 使用真实数据
  const trendData = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }
    // 如果没有数据，返回空数组（不显示示例数据）
    return [];
  }, [data]);

  // 计算最大值用于缩放
  const maxValue = useMemo(() => {
    return Math.max(...trendData.map(d => d.completed), 1);
  }, [trendData]);

  // 生成折线点
  const points = useMemo(() => {
    if (trendData.length === 0) return [];
    return trendData.map((d, i) => {
      const x = paddingX + (trendData.length > 1 ? (i / (trendData.length - 1)) : 0.5) * availableWidth;
      const y = chartHeight - paddingY - (d.completed / maxValue) * availableHeight;
      return { x, y, value: d.completed, week: d.week };
    });
  }, [trendData, maxValue, availableWidth, availableHeight]);

  // 生成 SVG path
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }
    
    return points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      
      // 使用贝塞尔曲线使线条更平滑
      const prev = points[i - 1];
      const cp1x = prev.x + (point.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = prev.x + (point.x - prev.x) * 0.5;
      const cp2y = point.y;
      
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    }, '');
  }, [points]);

  // 生成区域填充路径
  const areaPathD = useMemo(() => {
    if (points.length === 0) return '';
    
    const linePath = pathD;
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    const bottomY = chartHeight - paddingY;
    
    return `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;
  }, [points, pathD]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 pt-2" data-testid="trend-section">
        <span className="text-xs font-semibold text-[#1A1D2E]">
          周完成趋势线
        </span>
        <div className="bg-[#F7FAFF] rounded-lg border border-[#1E6FD922] p-4 h-20 flex items-center justify-center">
          <span className="text-xs text-[#1A1D2E66]">加载中...</span>
        </div>
      </div>
    );
  }

  // 如果没有数据，显示空状态
  if (trendData.length === 0) {
    return (
      <div className="flex flex-col gap-2 pt-2" data-testid="trend-section">
        <span className="text-xs font-semibold text-[#1A1D2E]">
          周完成趋势线
        </span>
        <div className="bg-[#F7FAFF] rounded-lg border border-[#1E6FD922] p-4 h-20 flex items-center justify-center">
          <span className="text-xs text-[#1A1D2E66]">暂无趋势数据</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pt-2" data-testid="trend-section">
      {/* Title */}
      <span className="text-xs font-semibold text-[#1A1D2E]">
        周完成趋势线
      </span>

      {/* Chart Container */}
      <div className="bg-[#F7FAFF] rounded-lg border border-[#1E6FD922] p-3 relative">
        {/* Baseline */}
        <div
          className="absolute left-3 right-3 h-px bg-[#1A1D2E1A]"
          style={{ top: '50%' }}
        />

        {/* SVG Chart */}
        <svg
          className="w-full"
          style={{ height: '64px' }}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Area Fill */}
          <path
            d={areaPathD}
            fill="url(#trendGradient)"
          />
          
          {/* Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#4CAF50"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              {/* 数值标签 */}
              <text
                x={point.x}
                y={point.y - 8}
                textAnchor="middle"
                className="text-[8px] fill-[#4CAF50] font-medium"
              >
                {point.value}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between px-3">
        {trendData.map((d, i) => (
          <span
            key={i}
            className="text-[10px] font-medium text-[#1A1D2E55]"
          >
            W{d.week}
          </span>
        ))}
      </div>
    </div>
  );
}
