import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '@/app/lib/projects';
import { ProjectType, ProjectStatus, ProjectPriority } from '@/app/lib/definitions';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: {
      status?: ProjectStatus;
      type?: ProjectType;
      priority?: ProjectPriority;
    } = {};

    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as ProjectStatus;
    }
    if (searchParams.get('type')) {
      filters.type = searchParams.get('type') as ProjectType;
    }
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority') as ProjectPriority;
    }

    const projects = await getProjects(filters);

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

    const { name, description, type, priority, startDate, endDate, goals, tags } = body;

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

    if (!type || (type !== 'life' && type !== 'code')) {
      return NextResponse.json(
        { success: false, message: '无效的项目类型' },
        { status: 400 }
      );
    }

    if (!startDate) {
      return NextResponse.json(
        { success: false, message: '开始日期不能为空' },
        { status: 400 }
      );
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      return NextResponse.json(
        { success: false, message: '结束日期不能早于开始日期' },
        { status: 400 }
      );
    }

    const project = await createProject({
      name: name.trim(),
      description: description || '',
      type,
      priority: priority || 'medium',
      status: 'planning',
      startDate,
      endDate: endDate || null,
      goals: goals || [],
      tags: tags || []
    });

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
