import { NextRequest, NextResponse } from 'next/server';
import { getSubtasks, createSubtask } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subtasks = await getSubtasks(id);

    return NextResponse.json(
      { success: true, subtasks },
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?.id) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, completed, assignee } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '子任务标题不能为空' },
        { status: 400 }
      );
    }

    const subtask = await createSubtask(id, {
      title: title.trim(),
      completed: completed ?? false,
      assignee,
    });

    return NextResponse.json(
      { success: true, subtask },
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
