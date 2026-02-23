import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RequirementSlidePanel from '@/app/ui/dashboard/requirement-slide-panel';
import { Requirement } from '@/app/ui/dashboard/requirement-table';

// Mock fetch
global.fetch = vi.fn();

const mockParentRequirement: Requirement = {
  id: 'parent-1',
  workItemId: 'REQ-001',
  name: '父需求标题',
  description: '父需求描述',
  status: 'todo',
  priority: 'p1',
  points: 100,
  projectId: 'project-1',
  reporter: { nickname: '张三' },
};

const mockSubRequirement: Requirement = {
  id: 'sub-1',
  workItemId: 'REQ-002',
  name: '子需求标题',
  description: '子需求描述',
  status: 'in_progress',
  priority: 'p2',
  points: 50,
  projectId: 'project-1',
  parentId: 'parent-1',
  reporter: { nickname: '李四' },
};

describe('RequirementSlidePanel - 子需求切换', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('点击子需求后应刷新抽屉显示子需求详情', async () => {
    // Mock API 响应
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          requirements: [
            {
              id: 'sub-1',
              work_item_id: 'REQ-002',
              title: '子需求标题',
              description: '子需求描述',
              status: 'in_progress',
              priority: 'medium',
              story_points: 50,
              project_id: 'project-1',
              parent_id: 'parent-1',
              reporter: '李四',
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: { nickname: '测试用户' },
        }),
      });

    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <RequirementSlidePanel
        open={true}
        onClose={onClose}
        requirement={mockParentRequirement}
        onSave={onSave}
        projectId="project-1"
      />
    );

    // 等待子需求列表加载
    await waitFor(() => {
      expect(screen.getByText('子需求标题')).toBeInTheDocument();
    });

    // 验证父需求详情显示
    expect(screen.getByText('父需求标题')).toBeInTheDocument();
    expect(screen.getByText('REQ-001')).toBeInTheDocument();

    // 点击子需求
    const subRequirementItem = screen.getByText('子需求标题');
    fireEvent.click(subRequirementItem);

    // 验证抽屉切换到子需求详情
    await waitFor(() => {
      // 标题应变为子需求标题
      expect(screen.getByText('子需求标题')).toBeInTheDocument();
      // 工作项 ID 应变为子需求 ID
      expect(screen.getByText('REQ-002')).toBeInTheDocument();
      // 应显示"子需求"标签
      expect(screen.getByText('子需求')).toBeInTheDocument();
    });

    // 验证返回按钮出现
    expect(screen.getByText('返回')).toBeInTheDocument();
  });

  it('子需求切换时应正确刷新所有字段', async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          requirements: [
            {
              id: 'sub-1',
              work_item_id: 'REQ-002',
              title: '子需求标题',
              description: '子需求描述内容',
              status: 'in_progress',
              priority: 'p2',
              story_points: 50,
              project_id: 'project-1',
              parent_id: 'parent-1',
              reporter: '李四',
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: { nickname: '测试用户' },
        }),
      })
      // 第二次加载子需求（点击子需求后，加载该子需求的子需求）
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          requirements: [], // 子需求没有子需求
        }),
      });

    render(
      <RequirementSlidePanel
        open={true}
        onClose={vi.fn()}
        requirement={mockParentRequirement}
        projectId="project-1"
      />
    );

    // 等待子需求加载
    await waitFor(() => {
      expect(screen.getByText('子需求标题')).toBeInTheDocument();
    });

    // 点击子需求前记录父需求积分
    const parentPointsInput = screen.getByDisplayValue('100');
    expect(parentPointsInput).toBeInTheDocument();

    // 点击子需求
    fireEvent.click(screen.getByText('子需求标题'));

    // 验证所有字段已刷新为子需求数据
    await waitFor(() => {
      // 积分应变为子需求积分 (50)
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
      // 标题应变为子需求标题
      expect(screen.getByText('子需求标题')).toBeInTheDocument();
      // 子需求数量应为 0（子需求没有自己的子需求）
      expect(screen.getByText('暂无子需求')).toBeInTheDocument();
    });

    // 父需求的积分 100 不应再显示
    expect(screen.queryByDisplayValue('100')).not.toBeInTheDocument();
  });

  it('点击返回按钮应回到父需求', async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          requirements: [
            {
              id: 'sub-1',
              work_item_id: 'REQ-002',
              title: '子需求标题',
              description: '子需求描述',
              status: 'in_progress',
              priority: 'medium',
              story_points: 50,
              project_id: 'project-1',
              parent_id: 'parent-1',
              reporter: '李四',
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: { nickname: '测试用户' },
        }),
      });

    render(
      <RequirementSlidePanel
        open={true}
        onClose={vi.fn()}
        requirement={mockParentRequirement}
        projectId="project-1"
      />
    );

    // 等待并点击子需求
    await waitFor(() => {
      expect(screen.getByText('子需求标题')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('子需求标题'));

    // 验证已切换到子需求
    await waitFor(() => {
      expect(screen.getByText('REQ-002')).toBeInTheDocument();
    });

    // 点击返回按钮
    fireEvent.click(screen.getByText('返回'));

    // 验证回到父需求
    await waitFor(() => {
      expect(screen.getByText('REQ-001')).toBeInTheDocument();
      expect(screen.getByText('父需求标题')).toBeInTheDocument();
      // 返回按钮应消失
      expect(screen.queryByText('返回')).not.toBeInTheDocument();
    });
  });
});
