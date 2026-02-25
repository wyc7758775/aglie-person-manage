import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HeatmapSection } from '@/app/ui/habits/HeatmapSection';

describe('HeatmapSection', () => {
  const mockData = {
    currentWeekCount: 12,
    completionRate: 78,
    longestStreak: 7,
    days: Array.from({ length: 90 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 8),
    })).reverse(),
  };

  it('应正确渲染标题', () => {
    render(
      <HeatmapSection data={mockData} isLoading={false} />
    );
    
    expect(screen.getByText('习惯热力图')).toBeInTheDocument();
    expect(screen.getByText(/每格代表当天完成次数，颜色越深表示完成越高/i)).toBeInTheDocument();
  });

  it('应显示KPI指标', () => {
    render(
      <HeatmapSection data={mockData} isLoading={false} />
    );
    
    expect(screen.getByText('本周完成')).toBeInTheDocument();
    expect(screen.getByText('12 次')).toBeInTheDocument();
    
    expect(screen.getByText('完成率')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    
    expect(screen.getByText('最长连击')).toBeInTheDocument();
    expect(screen.getByText('7 天')).toBeInTheDocument();
  });

  it('KPI指标应使用正确的颜色', () => {
    const { container } = render(
      <HeatmapSection data={mockData} isLoading={false} />
    );
    
    // 绿色背景 - 本周完成
    const weekCountBox = screen.getByText('本周完成').parentElement;
    expect(weekCountBox).toHaveStyle({ backgroundColor: '#F3FAF4' });
    
    // 橙色背景 - 完成率
    const rateBox = screen.getByText('完成率').parentElement;
    expect(rateBox).toHaveStyle({ backgroundColor: '#FFF7EE' });
    
    // 蓝色背景 - 最长连击
    const streakBox = screen.getByText('最长连击').parentElement;
    expect(streakBox).toHaveStyle({ backgroundColor: '#EEF5FF' });
  });

  it('应显示热力图网格', () => {
    const { container } = render(
      <HeatmapSection data={mockData} isLoading={false} />
    );
    
    // 检查是否有热力图单元格
    const heatmapCells = container.querySelectorAll('[style*="border-radius: 3px"]');
    expect(heatmapCells.length).toBeGreaterThan(0);
  });

  it('应显示星期标签', () => {
    render(
      <HeatmapSection data={mockData} isLoading={false} />
    );
    
    expect(screen.getByText('周一')).toBeInTheDocument();
    expect(screen.getByText('周三')).toBeInTheDocument();
    expect(screen.getByText('周五')).toBeInTheDocument();
  });

  it('应显示图例', () => {
    render(
      <HeatmapSection data={mockData} isLoading={false} />
    );
    
    expect(screen.getByText(/今日已高亮，可点击格子看记录/i)).toBeInTheDocument();
    expect(screen.getByText('强度')).toBeInTheDocument();
  });

  it('应显示滚动提示', () => {
    render(
      <HeatmapSection data={mockData} isLoading={false} />
    );
    
    expect(screen.getByText(/向下滚动可查看周趋势/i)).toBeInTheDocument();
  });

  it('当没有数据时应显示空的热力图', () => {
    const { container } = render(
      <HeatmapSection data={null} isLoading={false} />
    );
    
    // 应该仍然显示热力图（但所有单元格都是0次）
    expect(screen.getByText('习惯热力图')).toBeInTheDocument();
    
    // 检查热力图单元格是否存在
    const heatmapCells = container.querySelectorAll('[data-testid="heatmap-cell"]');
    expect(heatmapCells.length).toBeGreaterThan(0);
  });

  it('hover单元格时应显示tooltip', async () => {
    const { container } = render(
      <HeatmapSection data={mockData} isLoading={false} />
    );
    
    const cells = container.querySelectorAll('[style*="border-radius: 3px"]');
    if (cells.length > 0) {
      fireEvent.mouseEnter(cells[0]);
      
      await waitFor(() => {
        // Tooltip应该在body中创建
        const tooltip = document.querySelector('[style*="z-index: 1000"]');
        expect(tooltip).toBeTruthy();
      });
    }
  });
});
