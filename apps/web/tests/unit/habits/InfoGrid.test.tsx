import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InfoGrid } from '@/app/ui/habits/InfoGrid';
import { TaskDifficulty } from '@/app/lib/definitions';

describe('InfoGrid', () => {
  const mockOnDifficultyChange = vi.fn();
  const mockOnFrequencyChange = vi.fn();
  const mockOnGoldRewardChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应正确渲染三个信息项', () => {
    render(
      <InfoGrid
        difficulty="medium"
        frequency="daily"
        goldReward={3.5}
        onDifficultyChange={mockOnDifficultyChange}
        onFrequencyChange={mockOnFrequencyChange}
        onGoldRewardChange={mockOnGoldRewardChange}
      />
    );
    
    expect(screen.getByText('难度')).toBeInTheDocument();
    expect(screen.getByText('中等')).toBeInTheDocument();
    
    expect(screen.getByText('频率')).toBeInTheDocument();
    expect(screen.getByText('每日')).toBeInTheDocument();
    
    expect(screen.getByText('单次奖励')).toBeInTheDocument();
    expect(screen.getByText('+3.5 G / 次')).toBeInTheDocument();
  });

  it('应显示编辑规则提示', () => {
    render(
      
        difficulty="medium"
        frequency="daily"
        goldReward={3.5}
        onDifficultyChange={mockOnDifficultyChange}
        onFrequencyChange={mockOnFrequencyChange}
        onGoldRewardChange={mockOnGoldRewardChange}
      />
    );
    
    expect(screen.getByText(/编辑规则：今日预计 = 频率 × 单次奖励/i)).toBeInTheDocument();
  });

  it('hover时应显示编辑按钮', () => {
    render(
      <InfoGrid
        difficulty="medium"
        frequency="daily"
        goldReward={3.5}
        onDifficultyChange={mockOnDifficultyChange}
        onFrequencyChange={mockOnFrequencyChange}
        onGoldRewardChange={mockOnGoldRewardChange}
      />
    );
    
    const difficultyBox = screen.getByText('难度').parentElement?.parentElement;
    fireEvent.mouseEnter(difficultyBox!);
    
    // 编辑按钮应该在hover时出现
    const editButtons = screen.getAllByRole('button');
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it('点击编辑按钮后应显示下拉选择器', async () => {
    render(
      <InfoGrid
        difficulty="medium"
        frequency="daily"
        goldReward={3.5}
        onDifficultyChange={mockOnDifficultyChange}
        onFrequencyChange={mockOnFrequencyChange}
        onGoldRewardChange={mockOnGoldRewardChange}
      />
    );
    
    const difficultyBox = screen.getByText('难度').parentElement?.parentElement;
    fireEvent.mouseEnter(difficultyBox!);
    
    // 找到并点击编辑按钮
    const editButton = difficultyBox?.querySelector('button');
    if (editButton) {
      fireEvent.click(editButton);
      
      // 应该出现select元素
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
      });
    }
  });

  it('金币奖励应显示为橙色', () => {
    const { container } = render(
      <InfoGrid
        difficulty="medium"
        frequency="daily"
        goldReward={3.5}
        onDifficultyChange={mockOnDifficultyChange}
        onFrequencyChange={mockOnFrequencyChange}
        onGoldRewardChange={mockOnGoldRewardChange}
      />
    );
    
    const goldValue = screen.getByText('+3.5 G / 次');
    expect(goldValue).toHaveStyle({ color: '#E8944A' });
  });

  it('浅色卡片应使用正确的背景色', () => {
    const { container } = render(
      <InfoGrid
        difficulty="medium"
        frequency="daily"
        goldReward={3.5}
        onDifficultyChange={mockOnDifficultyChange}
        onFrequencyChange={mockOnFrequencyChange}
        onGoldRewardChange={mockOnGoldRewardChange}
      />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ backgroundColor: '#F5F0F0' });
  });

  it('更改难度应触发onDifficultyChange', async () => {
    render(
      <InfoGrid
        difficulty="medium"
        frequency="daily"
        goldReward={3.5}
        onDifficultyChange={mockOnDifficultyChange}
        onFrequencyChange={mockOnFrequencyChange}
        onGoldRewardChange={mockOnGoldRewardChange}
      />
    );
    
    const difficultyBox = screen.getByText('难度').parentElement?.parentElement;
    fireEvent.mouseEnter(difficultyBox!);
    
    const editButton = difficultyBox?.querySelector('button');
    if (editButton) {
      fireEvent.click(editButton);
      
      const select = await screen.findByRole('combobox');
      fireEvent.change(select, { target: { value: 'hard' } });
      
      expect(mockOnDifficultyChange).toHaveBeenCalledWith('hard');
    }
  });
});
