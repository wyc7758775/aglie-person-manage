import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DescSection } from '@/app/ui/habits/DescSection';

describe('DescSection', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应正确渲染标题', () => {
    render(
      <DescSection
        description="测试描述"
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText(/备注说明（可直接编辑）/i)).toBeInTheDocument();
  });

  it('应显示描述内容', () => {
    render(
      <DescSection
        description="这是一个测试描述"
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('这是一个测试描述')).toBeInTheDocument();
  });

  it('当没有描述时应显示占位符', () => {
    render(
      <DescSection
        description=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('点击编辑备注...')).toBeInTheDocument();
  });

  it('点击描述区域应进入编辑模式', () => {
    render(
      <DescSection
        description="测试描述"
        onChange={mockOnChange}
      />
    );
    
    const descriptionDiv = screen.getByText('测试描述');
    fireEvent.click(descriptionDiv);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('编辑后失去焦点应保存内容', async () => {
    render(
      <DescSection
        description="初始描述"
        onChange={mockOnChange}
      />
    );
    
    const descriptionDiv = screen.getByText('初始描述');
    fireEvent.click(descriptionDiv);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '新的描述' } });
    fireEvent.blur(textarea);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('新的描述');
    });
  });

  it('应显示提示文本', () => {
    render(
      <DescSection
        description="测试描述"
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('备注可直接编辑，无需切换编辑状态')).toBeInTheDocument();
  });

  it('编辑框应有正确的边框样式', () => {
    const { container } = render(
      <DescSection
        description="测试描述"
        onChange={mockOnChange}
      />
    );
    
    const descriptionDiv = screen.getByText('测试描述');
    fireEvent.click(descriptionDiv);
    
    const card = container.querySelector('[style*="#1E6FD930"]');
    expect(card).toBeTruthy();
  });

  it('保存时应显示保存中状态', async () => {
    mockOnChange.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(
      <DescSection
        description="初始描述"
        onChange={mockOnChange}
      />
    );
    
    const descriptionDiv = screen.getByText('初始描述');
    fireEvent.click(descriptionDiv);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '新的描述' } });
    fireEvent.blur(textarea);
    
    await waitFor(() => {
      expect(screen.getByText(/保存中/i)).toBeInTheDocument();
    });
  });
});
