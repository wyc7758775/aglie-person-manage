import { NextRequest, NextResponse } from 'next/server';
import { getRequirements, createRequirement } from '@/app/lib/requirements';
import { RequirementStatus, RequirementPriority, RequirementType } from '@/app/lib/definitions';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: {
      status?: RequirementStatus;
      priority?: RequirementPriority;
      type?: RequirementType;
    } = {};

    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as RequirementStatus;
    }
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority') as RequirementPriority;
    }
    if (searchParams.get('type')) {
      filters.type = searchParams.get('type') as RequirementType;
    }

    const requirements = await getRequirements(filters);

    return NextResponse.json(
      { success: true, requirements },
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

    const { title, description, type, status, priority, assignee, reporter, createdDate, dueDate, storyPoints, tags } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '需求标题不能为空' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { success: false, message: '需求标题不能超过200个字符' },
        { status: 400 }
      );
    }

    if (!type || !['feature', 'enhancement', 'bugfix', 'research'].includes(type)) {
      return NextResponse.json(
        { success: false, message: '无效的需求类型' },
        { status: 400 }
      );
    }

    if (!status || !['draft', 'review', 'approved', 'development', 'testing', 'completed', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: '无效的需求状态' },
        { status: 400 }
      );
    }

    if (!priority || !['critical', 'high', 'medium', 'low'].includes(priority)) {
      return NextResponse.json(
        { success: false, message: '无效的需求优先级' },
        { status: 400 }
      );
    }

    const requirement = await createRequirement({
      title: title.trim(),
      description: description || '',
      type,
      status,
      priority,
      assignee: assignee || '',
      reporter: reporter || '',
      createdDate: createdDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || '',
      storyPoints: storyPoints || 0,
      tags: tags || []
    });

    return NextResponse.json(
      { success: true, requirement },
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
