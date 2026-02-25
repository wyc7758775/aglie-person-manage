import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HabitDetailDrawer from '@/app/ui/habits/HabitDetailDrawer';
import { Task, TaskDifficulty } from '@/app/lib/definitions';

// Mock fetch
global.fetch = vi.fn();

describe('HabitDetailDrawer', () => {
  const mockTask: Task = {
    id: 'test-habit-001',
    title: '每日代码审查',
    description: '测试描述',
    type: 'habit',
    status: 'todo',
    priority: 'p2',
    difficulty: 'medium',
    projectId: 'test-project',
    assignee: null,
    points: 10,
    goldReward: 3.5,
    goldPenalty: 0,
    streak: 7,
    totalCount: 45,
    currentCount: 7,
    targetCount: 12,
    direction: 'positive',
    resetPeriod: 'daily',
    frequency: 'daily',
    repeatDays: [],
    startDate: null,
    dueDate: null,
    tags: [],
    subTasks: [],
    comments: [],
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOnClose = vi.fn();
  const mockOnTaskUpdated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API responses
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/heatmap')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              currentWeekCount: 12,
              completionRate: 78,
              longestStreak: 7,
              days: [],
            },
          }),
        });
      }
      if (url.includes('/trends')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              weeks: [
                { week: 1, completed: 3 },
                { week: 2, completed: 5 },
              ],
            },
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应正确渲染抽屉', () => {
    render(
      <HabitDetailDrawer
        isOpen={true}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    expect(screen.getByTestId('habit-detail-drawer')).toBeInTheDocument();
    expect(screen.getByText('每日代码审查')).toBeInTheDocument();
  });

  it('当isOpen为false时不应渲染', () => {
    const { container } = render(
      <HabitDetailDrawer
        isOpen={false}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('应显示正确的完成计数', () => {
    render(
      <HabitDetailDrawer
        isOpen={true}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    expect(screen.getByText('7/12')).toBeInTheDocument();
  });

  it('点击增加按钮应调用API并更新计数', async () => {
    (global.fetch as any).mockImplementation((url: string, options: any) => {
      if (url.includes('/increment')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              currentCount: 8,
              totalCount: 46,
              streak: 8,
              earnedGold: 3.5,
            },
          }),
        });
      }
      // Default mock for other calls
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} }),
      });
    });

    render(
      <HabitDetailDrawer
        isOpen={true}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    const incrementBtn = screen.getByTestId('increment-btn');
    fireEvent.click(incrementBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks/test-habit-001/increment',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('点击减少按钮应调用API', async () => {
    (global.fetch as any).mockImplementation((url: string, options: any) => {
      if (url.includes('/decrement')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: {
              currentCount: 6,
              totalCount: 44,
              deductedGold: 3.5,
            },
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} }),
      });
    });

    render(
      <HabitDetailDrawer
        isOpen={true}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    const decrementBtn = screen.getByTestId('decrement-btn');
    fireEvent.click(decrementBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks/test-habit-001/decrement',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('点击关闭按钮应触发onClose', () => {
    render(
      <HabitDetailDrawer
        isOpen={true}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    const closeBtn = screen.getByTestId('close-drawer-btn');
    fireEvent.click(closeBtn);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('抽屉应有正确的宽度', () => {
    render(
      <HabitDetailDrawer
        isOpen={true}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    const drawer = screen.getByTestId('habit-detail-drawer');
    expect(drawer).toHaveStyle({ width: '561px' });
  });

  it('应加载热力图和趋势数据', async () => {
    render(
      <HabitDetailDrawer
        isOpen={true}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks/test-habit-001/heatmap'
      );
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks/test-habit-001/trends'
      );
    });
  });

  it('应显示统计卡片', () => {
    render(
      <HabitDetailDrawer
        isOpen={true}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    expect(screen.getByTestId('stats-card')).toBeInTheDocument();
    expect(screen.getByTestId('streak-box')).toBeInTheDocument();
    expect(screen.getByTestId('gold-box')).toBeInTheDocument();
    expect(screen.getByTestId('count-box')).toBeInTheDocument();
  });

  it('应显示热力图部分', async () => {
    render(
      <HabitDetailDrawer
        isOpen={true}
        onClose={mockOnClose}
        task={mockTask}
        projectId="test-project"
        onTaskUpdated={mockOnTaskUpdated}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('heatmap-section')).toBeInTheDocument();
    });
  });
});
