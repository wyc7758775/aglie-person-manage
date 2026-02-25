'use client';

import { useState, useMemo, useCallback } from 'react';

interface HeatmapDay {
  date: string;
  count: number;
}

interface HeatmapData {
  currentWeekCount: number;
  completionRate: number;
  longestStreak: number;
  days: HeatmapDay[];
}

interface HeatmapSectionProps {
  data: HeatmapData | null;
  isLoading: boolean;
}

// GitHub风格的贡献等级颜色
const CONTRIBUTION_COLORS = {
  0: '#ebedf0',      // 无贡献 - 浅灰
  1: '#9be9a8',      // 1-2次 - 浅绿
  2: '#40c463',      // 3-5次 - 中绿
  3: '#30a14e',      // 6-8次 - 深绿
  4: '#216e39',      // 9+次 - 最深绿
};

// 根据完成次数获取颜色等级
function getContributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
}

// 获取颜色
function getColorForCount(count: number): string {
  const level = getContributionLevel(count);
  return CONTRIBUTION_COLORS[level as keyof typeof CONTRIBUTION_COLORS];
}

// 生成最近一年的日期数据
function generateLastYearData(days: HeatmapDay[]): Map<string, number> {
  const dataMap = new Map<string, number>();
  
  // 初始化所有日期为0
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(oneYearAgo.getDate() - 364);
  
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dataMap.set(dateStr, 0);
  }
  
  // 填充实际数据
  days.forEach(day => {
    dataMap.set(day.date, day.count);
  });
  
  return dataMap;
}

export function HeatmapSection({ data, isLoading }: HeatmapSectionProps) {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    date: string;
    count: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    date: '',
    count: 0,
  });

  // 使用真实数据或生成空数据
  const heatmapData = useMemo(() => {
    if (data?.days && data.days.length > 0) {
      return generateLastYearData(data.days);
    }
    // 如果没有数据，生成空的热力图
    return generateLastYearData([]);
  }, [data]);

  // KPI数据
  const kpiData = useMemo(() => {
    if (data) {
      return {
        currentWeekCount: data.currentWeekCount,
        completionRate: data.completionRate,
        longestStreak: data.longestStreak,
      };
    }
    return {
      currentWeekCount: 0,
      completionRate: 0,
      longestStreak: 0,
    };
  }, [data]);

  // 生成周数据（从一年前的今天开始）
  const weeks = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(oneYearAgo.getDate() - 364);
    
    // 调整到周一开始
    const startOfWeek = new Date(oneYearAgo);
    const dayOfWeek = startOfWeek.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);
    
    const weeksData: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];
    
    for (let d = new Date(startOfWeek); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const count = heatmapData.get(dateStr) || 0;
      
      currentWeek.push({ date: dateStr, count });
      
      if (currentWeek.length === 7) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      weeksData.push(currentWeek);
    }
    
    return weeksData;
  }, [heatmapData]);

  // 生成月份标签
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(oneYearAgo.getDate() - 364);
    
    let currentMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = new Date(week[0].date);
      const month = firstDayOfWeek.getMonth();
      
      if (month !== currentMonth) {
        currentMonth = month;
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                          '七月', '八月', '九月', '十月', '十一月', '十二月'];
        labels.push({
          month: monthNames[month],
          weekIndex,
        });
      }
    });
    
    return labels;
  }, [weeks]);

  // 格式化日期显示
  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[date.getDay()];
    return `${year}年${month}月${day}日 ${weekDay}`;
  }, []);

  // 处理鼠标进入
  const handleMouseEnter = useCallback((e: React.MouseEvent, date: string, count: number) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      date,
      count,
    });
  }, []);

  // 处理鼠标离开
  const handleMouseLeave = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  // 周标签
  const weekDayLabels = ['周一', '周三', '周五'];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3" data-testid="heatmap-section">
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-400">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" data-testid="heatmap-section">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg 
          className="w-4 h-4" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#1A1D2E88"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="text-sm font-semibold text-[#1A1D2E]">
          习惯热力图
        </span>
      </div>

      <p className="text-xs text-[#1A1D2E88]">
        每格代表当天完成次数，颜色越深表示完成越高
      </p>

      {/* Heatmap Card */}
      <div className="bg-white rounded-xl p-4 border border-[#2E7D322E]">
        {/* KPI Row */}
        <div className="flex gap-2 mb-4">
          <KpiBox 
            label="本周完成"
            value={`${kpiData.currentWeekCount} 次`}
            bgColor="#F3FAF4"
            textColor="#2E7D32"
          />
          <KpiBox 
            label="完成率"
            value={`${kpiData.completionRate}%`}
            bgColor="#FFF7EE"
            textColor="#E8944A"
          />
          <KpiBox 
            label="最长连击"
            value={`${kpiData.longestStreak} 天`}
            bgColor="#EEF5FF"
            textColor="#1E6FD9"
          />
        </div>

        {/* GitHub Style Heatmap */}
        <div className="overflow-hidden">
          <div className="flex gap-1 overflow-x-auto pb-2" style={{ maxWidth: '100%' }}>
            {/* Week Labels */}
            <div className="flex flex-col gap-1 pr-2 shrink-0">
              {weekDayLabels.map((day, i) => (
                <span 
                  key={i}
                  className="text-[10px] text-[#1A1D2E66] w-6 flex items-center"
                  style={{ height: '10px' }}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-[3px] shrink-0">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => {
                    // 只显示周一、周三、周五的左侧标签对应的行
                    const shouldShow = dayIndex % 2 === 0;
                    return (
                      <div
                        key={dayIndex}
                        className="w-[10px] h-[10px] rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-[#1A1D2E33]"
                        style={{
                          backgroundColor: getColorForCount(day.count),
                          opacity: shouldShow ? 1 : 0.3,
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, day.date, day.count)}
                        onMouseLeave={handleMouseLeave}
                        data-testid="heatmap-cell"
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Month Labels */}
          <div className="mt-1 overflow-x-auto" style={{ maxWidth: '100%', marginLeft: '32px' }}>
            <div className="relative" style={{ width: `${weeks.length * 13}px`, minWidth: 'fit-content' }}>
              {monthLabels.map((label, i) => (
                <span 
                  key={i}
                  className="absolute text-[10px] text-[#1A1D2E66] whitespace-nowrap"
                  style={{ 
                    left: `${label.weekIndex * 13}px`,
                  }}
                >
                  {label.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1A1D2E15]">
          <span className="text-[10px] text-[#1A1D2E66]">
            今日已高亮，可点击格子看记录
          </span>
          
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#1A1D2E88] mr-1">少</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-[10px] h-[10px] rounded-sm"
                style={{
                  backgroundColor: CONTRIBUTION_COLORS[level as keyof typeof CONTRIBUTION_COLORS],
                  border: level === 0 ? '1px solid #e1e4e8' : 'none',
                }}
              />
            ))}
            <span className="text-[10px] text-[#1A1D2E88] ml-1">多</span>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <p className="text-xs text-[#1A1D2E66]">
        向下滚动可查看周趋势
      </p>

      {/* Tooltip - 使用Portal方式避免闪烁 */}
      {tooltip.visible && (
        <div
          className="fixed z-[9999] pointer-events-none px-2 py-1 bg-[#1A1D2E] text-white text-xs rounded shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="font-medium">{formatDate(tooltip.date)}</div>
          <div className="text-[#FFFFFFCC]">
            {tooltip.count === 0 ? '无完成' : `完成 ${tooltip.count} 次`}
          </div>
        </div>
      )}
    </div>
  );
}

interface KpiBoxProps {
  label: string;
  value: string;
  bgColor: string;
  textColor: string;
}

function KpiBox({ label, value, bgColor, textColor }: KpiBoxProps) {
  return (
    <div
      className="flex-1 rounded-lg py-2 px-3 flex flex-col gap-0.5"
      style={{ backgroundColor: bgColor }}
    >
      <span className="text-[11px] font-medium text-[#1A1D2E88]">
        {label}
      </span>
      <span 
        className="text-sm font-bold"
        style={{ color: textColor }}
      >
        {value}
      </span>
    </div>
  );
}
