import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TitleRow } from '@/app/ui/habits/TitleRow';

describe('TitleRow', () => {
  const mockOnIncrement = vi.fn();
  const mockOnDecrement = vi.fn();

  beforeEach(() => {
    mockOnIncrement.mockClear();
    mockOnDecrement.mockClear();
  });

  it('应正确渲染任务标题', () => {
    render(
      <TitleRow
        title="每日代码审查"
        currentCount={7}
        targetCount={12}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );
    
    expect(screen.getByText('每日代码审查')).toBeInTheDocument();
  });

  it('应显示正确的完成计数', () => {
    render(
      <TitleRow
        title="每日代码审查"
        currentCount={7}
        targetCount={12}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );
    
    expect(screen.getByText('7/12')).toBeInTheDocument();
    expect(screen.getByText('完成')).toBeInTheDocument();
  });

  it('点击增加按钮应触发onIncrement', () => {
    render(
      <TitleRow
        title="每日代码审查"
        currentCount={7}
        targetCount={12}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );
    
    // 找到加号按钮（绿色背景）
    const buttons = screen.getAllByRole('button');
    const plusButton = buttons.find(btn => 
      btn.getAttribute('style')?.includes('#2E7D32')
    ) || buttons[buttons.length - 1];
    
    fireEvent.click(plusButton);
    expect(mockOnIncrement).toHaveBeenCalledTimes(1);
  });

  it('点击减少按钮应触发onDecrement', () => {
    render(
      <TitleRow
        title="每日代码审查"
        currentCount={7}
        targetCount={12}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );
    
    // 找到减号按钮
    const buttons = screen.getAllByRole('button');
    const minusButton = buttons[0];
    
    fireEvent.click(minusButton);
    expect(mockOnDecrement).toHaveBeenCalledTimes(1);
  });

  it('当计数为0时，减少按钮应被禁用', () => {
    render(
      <TitleRow
        title="每日代码审查"
        currentCount={0}
        targetCount={12}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    const minusButton = buttons[0];
    
    expect(minusButton).toHaveStyle({ opacity: '0.5' });
    expect(minusButton).toHaveStyle({ cursor: 'not-allowed' });
  });

  it('计数器应使用绿色样式', () => {
    const { container } = render(
      <TitleRow
        title="每日代码审查"
        currentCount={7}
        targetCount={12}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );
    
    const counter = container.querySelector('[style*="#4CAF5015"]');
    expect(counter).toBeTruthy();
  });
});
