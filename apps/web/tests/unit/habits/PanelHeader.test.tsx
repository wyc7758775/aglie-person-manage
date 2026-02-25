import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PanelHeader } from '@/app/ui/habits/PanelHeader';

describe('PanelHeader', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('应正确渲染任务ID', () => {
    render(<PanelHeader taskId="HB-001" onClose={mockOnClose} />);
    
    expect(screen.getByText(/任务 ID: HB-001/i)).toBeInTheDocument();
  });

  it('应显示习惯类型标签', () => {
    render(<PanelHeader taskId="HB-001" onClose={mockOnClose} />);
    
    expect(screen.getByText('习惯')).toBeInTheDocument();
  });

  it('点击关闭按钮应触发onClose', () => {
    render(<PanelHeader taskId="HB-001" onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('点击任务ID应复制到剪贴板', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(<PanelHeader taskId="HB-001" onClose={mockOnClose} />);
    
    const taskIdElement = screen.getByText(/任务 ID: HB-001/i).parentElement;
    fireEvent.click(taskIdElement!);
    
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith('HB-001');
    });
  });

  it('头部高度应为60px', () => {
    const { container } = render(<PanelHeader taskId="HB-001" onClose={mockOnClose} />);
    
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveStyle({ height: '60px' });
  });

  it('习惯标签应使用正确的颜色', () => {
    const { container } = render(<PanelHeader taskId="HB-001" onClose={mockOnClose} />);
    
    const typeBadge = container.querySelector('[style*="background-color: rgb(232, 148, 74)"]') || 
                      container.querySelector('[style*="#E8944A"]');
    expect(typeBadge).toBeTruthy();
  });
});
