import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask } from '@/app/lib/tasks';
import { TaskStatus, TaskPriority } from '@/app/lib/definitions';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: {
      projectId?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
    } = {};

    if (searchParams.get('projectId')) {
      filters.projectId = searchParams.get('projectId') as string;
    }
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as TaskStatus;
    }
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority') as TaskPriority;
    }

    const tasks = await getTasks(filters);

    return NextResponse.json(
      { success: true, tasks },
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

    const { projectId, title, description, status, priority, assignee, dueDate, estimatedHours, completedHours, tags } = body;

    if (!projectId || typeof projectId !== 'string' || projectId.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '项目ID不能为空' },
        { status: 400 }
      );
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '任务标题不能为空' },
        { status: 400 }
      );
    }

    const task = await createTask({
      projectId: projectId.trim(),
      title: title.trim(),
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      assignee: assignee || '',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      estimatedHours: estimatedHours ?? 0,
      completedHours: completedHours ?? 0,
      tags: tags || [],
    });

    return NextResponse.json(
      { success: true, task },
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
