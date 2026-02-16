import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject, calculateProjectPoints } from '@/app/lib/projects';
import { ProjectType, ProjectStatus, ProjectPriority, ProjectIndicator } from '@/app/lib/definitions';
import { getCurrentUser } from '@/app/lib/auth-utils';

function calculateProgress(indicators: ProjectIndicator[]): number {
  if (!indicators || indicators.length === 0) return 0;

  let totalProgress = 0;
  for (const ind of indicators) {
    const { value = 0, target = 0, weight = 0 } = ind;
    // 单个指标完成度上限 100%
    const indicatorProgress = target > 0 ? Math.min(100, (value / target) * 100) : 0;
    totalProgress += indicatorProgress * weight;
  }

  // 除以 100 得到最终进度
  return Math.round(totalProgress / 100);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const filters: {
      status?: ProjectStatus;
      type?: ProjectType;
      priority?: ProjectPriority;
    } = {};
    if (searchParams.get('status')) filters.status = searchParams.get('status') as ProjectStatus;
    if (searchParams.get('type')) filters.type = searchParams.get('type') as ProjectType;
    if (searchParams.get('priority')) filters.priority = searchParams.get('priority') as ProjectPriority;

    const projects = await getProjects(filters, user.id);

    return NextResponse.json(
      { success: true, projects },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, description, type, priority, startDate, endDate, goals, tags, points, autoCalculatePoints, coverImageUrl } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '项目名称不能为空' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { success: false, message: '项目名称不能超过100个字符' },
        { status: 400 }
      );
    }

    if (!type || (type !== 'sprint-project' && type !== 'slow-burn')) {
      return NextResponse.json(
        { success: false, message: '无效的项目类型' },
        { status: 400 }
      );
    }

    // slow-burn 项目必须有指标
    if (type === 'slow-burn') {
      const indicators = body.indicators as ProjectIndicator[] | undefined;
      if (!indicators || !Array.isArray(indicators) || indicators.length === 0) {
        return NextResponse.json(
          { success: false, message: '慢燃项目至少需要设置一个积累指标' },
          { status: 400 }
        );
      }

      // 验证指标权重总和为 100
      const totalWeight = indicators.reduce((sum: number, ind: ProjectIndicator) => sum + (ind.weight || 0), 0);
      if (totalWeight !== 100) {
        return NextResponse.json(
          { success: false, message: '所有指标权重之和必须等于 100%' },
          { status: 400 }
        );
      }
    }

    if (!startDate) {
      return NextResponse.json(
        { success: false, message: '开始日期不能为空' },
        { status: 400 }
      );
    }

    // sprint-project 项目验证结束日期
    if (type === 'sprint-project' && endDate && new Date(endDate) < new Date(startDate)) {
      return NextResponse.json(
        { success: false, message: '结束日期不能早于开始日期' },
        { status: 400 }
      );
    }

    // slow-burn 项目：endDate 设为 null
    const finalEndDate = type === 'slow-burn' ? null : (endDate || null);

    // 积分验证
    let finalPoints = points ?? 0;
    if (points !== undefined && points < 0) {
      return NextResponse.json(
        { success: false, message: '积分不能为负数' },
        { status: 400 }
      );
    }

    // 自动计算积分
    if (autoCalculatePoints && priority) {
      finalPoints = calculateProjectPoints(priority);
    }

    // 处理指标和进度
    const indicators = body.indicators as ProjectIndicator[] | undefined;
    let finalProgress = 0;
    let finalIndicators: ProjectIndicator[] | undefined;

    if (type === 'slow-burn' && indicators && indicators.length > 0) {
      finalIndicators = indicators.map((ind: ProjectIndicator) => ({
        ...ind,
        id: ind.id || crypto.randomUUID(),
      }));
      // 计算进度
      finalProgress = calculateProgress(finalIndicators);
    }

    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }

    const project = await createProject(
      {
        name: name.trim(),
        description: description || '',
        type,
        priority: priority || 'medium',
        status: 'normal',
        startDate,
        endDate: finalEndDate,
        goals: goals || [],
        tags: tags || [],
        points: finalPoints,
        progress: finalProgress,
        indicators: finalIndicators,
        coverImageUrl: coverImageUrl || undefined,
      },
      user.id
    );

    return NextResponse.json(
      { success: true, project },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
