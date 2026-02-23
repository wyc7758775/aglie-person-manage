import { NextRequest, NextResponse } from 'next/server';
import { getTodos, createTodo } from '@/app/lib/db';
import { TodoStatus, TodoPriority } from '@/app/lib/definitions';
import { getCurrentUser } from '@/app/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: {
      userId?: string;
      projectId?: string;
      status?: TodoStatus;
      priority?: TodoPriority;
      assignee?: string;
    } = {};

    const currentUser = await getCurrentUser(request);
    if (currentUser?.id) {
      filters.userId = currentUser.id;
    }

    if (searchParams.get('projectId')) {
      filters.projectId = searchParams.get('projectId') as string;
    }
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as TodoStatus;
    }
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority') as TodoPriority;
    }
    if (searchParams.get('assignee')) {
      filters.assignee = searchParams.get('assignee') as string;
    }

    const todos = await getTodos(filters);

    return NextResponse.json(
      { success: true, todos },
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
    const currentUser = await getCurrentUser(request);
    if (!currentUser?.id) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, status, priority, assignee, startDate, dueDate, points, tags, projectId } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '标题不能为空' },
        { status: 400 }
      );
    }

    if (title.length > 500) {
      return NextResponse.json(
        { success: false, message: '标题不能超过500个字符' },
        { status: 400 }
      );
    }

    const validStatuses: TodoStatus[] = ['todo', 'in_progress', 'blocked', 'done', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: '无效的状态' },
        { status: 400 }
      );
    }

    const validPriorities: TodoPriority[] = ['low', 'medium', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { success: false, message: '无效的优先级' },
        { status: 400 }
      );
    }

    if (points !== undefined && points < 0) {
      return NextResponse.json(
        { success: false, message: '积分不能为负数' },
        { status: 400 }
      );
    }

    const todo = await createTodo({
      title: title.trim(),
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      assignee: assignee || currentUser.nickname,
      startDate: startDate || null,
      dueDate: dueDate || null,
      points: points ?? 0,
      tags: tags || [],
      projectId: projectId || undefined,
    }, currentUser.id);

    return NextResponse.json(
      { success: true, todo },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '服务器内部错误';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
