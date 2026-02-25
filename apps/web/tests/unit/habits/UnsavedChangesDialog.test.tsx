import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnsavedChangesDialog } from '@/app/ui/habits/UnsavedChangesDialog';

describe('UnsavedChangesDialog', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('当isOpen为false时不应渲染', () => {
    const { container } = render(
      <UnsavedChangesDialog
        isOpen={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('当isOpen为true时应渲染对话框', () => {
    render(
      <UnsavedChangesDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText('有未保存的更改')).toBeInTheDocument();
    expect(screen.getByText(/确定要关闭吗？未保存的更改将会丢失/i)).toBeInTheDocument();
  });

  it('应显示警告图标', () => {
    const { container } = render(
      <UnsavedChangesDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    // 检查是否有橙色背景的图标容器
    const iconContainer = container.querySelector('[style*="#FFF3E0"]');
    expect(iconContainer).toBeTruthy();
  });

  it('应显示取消和确认按钮', () => {
    render(
      <UnsavedChangesDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText('取消')).toBeInTheDocument();
    expect(screen.getByText('确认关闭')).toBeInTheDocument();
  });

  it('点击取消按钮应触发onCancel', () => {
    render(
      <UnsavedChangesDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    const cancelButton = screen.getByText('取消');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('点击确认按钮应触发onConfirm', () => {
    render(
      <UnsavedChangesDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    const confirmButton = screen.getByText('确认关闭');
    fireEvent.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('确认按钮应使用橙色背景', () => {
    render(
      <UnsavedChangesDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    const confirmButton = screen.getByText('确认关闭');
    expect(confirmButton).toHaveStyle({ backgroundColor: '#E8944A' });
  });

  it('点击遮罩层应触发onCancel', () => {
    const { container } = render(
      <UnsavedChangesDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('对话框应有正确的z-index', () => {
    const { container } = render(
      <UnsavedChangesDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );
    
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('z-[100]');
  });
});
