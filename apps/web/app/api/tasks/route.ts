import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask } from '@/app/lib/tasks';
import { TaskStatus, TaskPriority, TaskType, TaskDifficulty, TaskFrequency, TaskDirection, ResetPeriod } from '@/app/lib/definitions';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: {
      projectId?: string;
      type?: TaskType;
      status?: TaskStatus;
      priority?: TaskPriority;
      search?: string;
    } = {};

    if (searchParams.get('projectId')) {
      filters.projectId = searchParams.get('projectId') as string;
    }
    if (searchParams.get('type')) {
      filters.type = searchParams.get('type') as TaskType;
    }
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as TaskStatus;
    }
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority') as TaskPriority;
    }
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search') as string;
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

    const {
      projectId,
      title,
      description,
      type,
      status,
      priority,
      difficulty,
      assignee,
      points,
      goldReward,
      goldPenalty,
      frequency,
      repeatDays,
      startDate,
      dueDate,
      tags,
      direction,
      resetPeriod,
    } = body;

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
      type: type || 'task',
      status: status || 'todo',
      priority: priority || 'p2',
      difficulty: difficulty || 'medium',
      assignee: assignee || null,
      points: points ?? 0,
      goldReward: goldReward ?? 0,
      goldPenalty: goldPenalty ?? 0,
      frequency: frequency || 'daily',
      repeatDays: repeatDays || [],
      startDate: startDate || null,
      dueDate: dueDate || null,
      tags: tags || [],
      direction: direction || 'positive',
      resetPeriod: resetPeriod || 'daily',
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
