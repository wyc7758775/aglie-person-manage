import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatsCard } from '@/app/ui/habits/StatsCard';

describe('StatsCard', () => {
  it('应正确渲染三个统计项', () => {
    render(
      <StatsCard
        streak={7}
        totalGold={128}
        totalCount={45}
      />
    );
    
    expect(screen.getByText('连击')).toBeInTheDocument();
    expect(screen.getByText('7 天')).toBeInTheDocument();
    
    expect(screen.getByText('总金币')).toBeInTheDocument();
    expect(screen.getByText('128 G')).toBeInTheDocument();
    
    expect(screen.getByText('完成次数')).toBeInTheDocument();
    expect(screen.getByText('45 次')).toBeInTheDocument();
  });

  it('深色卡片应使用正确的背景色', () => {
    const { container } = render(
      <StatsCard
        streak={7}
        totalGold={128}
        totalCount={45}
      />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ backgroundColor: '#1A1D2E' });
  });

  it('统计框应使用半透明白色背景', () => {
    const { container } = render(
      <StatsCard
        streak={7}
        totalGold={128}
        totalCount={45}
      />
    );
    
    const statBoxes = container.querySelectorAll('[style*="#FFFFFF10"]');
    expect(statBoxes.length).toBe(3);
  });

  it('数值应使用白色大号字体', () => {
    const { container } = render(
      <StatsCard
        streak={7}
        totalGold={128}
        totalCount={45}
      />
    );
    
    const values = container.querySelectorAll('[style*="font-size: 24px"]');
    expect(values.length).toBeGreaterThanOrEqual(3);
  });

  it('应显示金币图标', () => {
    const { container } = render(
      <StatsCard
        streak={7}
        totalGold={128}
        totalCount={45}
      />
    );
    
    // 检查是否有金币颜色的元素
    const goldElements = container.querySelectorAll('[fill="#FFD700"]');
    expect(goldElements.length).toBeGreaterThan(0);
  });

  it('应显示连击图标（火焰色）', () => {
    const { container } = render(
      <StatsCard
        streak={7}
        totalGold={128}
        totalCount={45}
      />
    );
    
    const fireElements = container.querySelectorAll('[fill="#FF9800"]');
    expect(fireElements.length).toBeGreaterThan(0);
  });

  it('应显示完成图标（绿色）', () => {
    const { container } = render(
      <StatsCard
        streak={7}
        totalGold={128}
        totalCount={45}
      />
    );
    
    const checkElements = container.querySelectorAll('[fill="#4CAF50"]');
    expect(checkElements.length).toBeGreaterThan(0);
  });
});
