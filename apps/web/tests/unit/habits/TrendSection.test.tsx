import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrendSection } from '@/app/ui/habits/TrendSection';

describe('TrendSection', () => {
  const mockData = [
    { week: 1, completed: 3 },
    { week: 2, completed: 5 },
    { week: 3, completed: 4 },
    { week: 4, completed: 6 },
    { week: 5, completed: 5 },
    { week: 6, completed: 7 },
  ];

  it('应正确渲染标题', () => {
    render(<TrendSection data={mockData} isLoading={false} />);
    
    expect(screen.getByText('周完成趋势线')).toBeInTheDocument();
  });

  it('应显示周标签', () => {
    render(<TrendSection data={mockData} isLoading={false} />);
    
    mockData.forEach(week => {
      expect(screen.getByText(`W${week.week}`)).toBeInTheDocument();
    });
  });

  it('应渲染SVG图表', () => {
    const { container } = render(<TrendSection data={mockData} isLoading={false} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('应渲染折线', () => {
    const { container } = render(<TrendSection data={mockData} isLoading={false} />);
    
    const path = container.querySelector('path[stroke="#4CAF50"]');
    expect(path).toBeInTheDocument();
  });

  it('应渲染数据点', () => {
    const { container } = render(<TrendSection data={mockData} isLoading={false} />);
    
    const circles = container.querySelectorAll('circle[fill="#4CAF50"]');
    expect(circles.length).toBe(mockData.length);
  });

  it('图表容器应有正确的样式', () => {
    const { container } = render(<TrendSection data={mockData} isLoading={false} />);
    
    const chartContainer = container.querySelector('[style*="#F7FAFF"]');
    expect(chartContainer).toBeTruthy();
  });

  it('当没有数据时应显示空状态提示', () => {
    render(<TrendSection data={[]} isLoading={false} />);
    
    // 应该显示"暂无趋势数据"提示
    expect(screen.getByText('暂无趋势数据')).toBeInTheDocument();
  });

  it('应渲染基线', () => {
    const { container } = render(<TrendSection data={mockData} isLoading={false} />);
    
    const baseline = container.querySelector('[style*="#1A1D2E1A"]');
    expect(baseline).toBeTruthy();
  });
});
