import { NextRequest, NextResponse } from 'next/server';
import { getSubtaskById, updateSubtask, deleteSubtask, createTodoActivity } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth-utils';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?.id) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const { id, subtaskId } = await params;
    const body = await request.json();

    const existingSubtask = await getSubtaskById(subtaskId);
    if (!existingSubtask) {
      return NextResponse.json(
        { success: false, message: '子任务不存在' },
        { status: 404 }
      );
    }

    const subtask = await updateSubtask(subtaskId, body);

    if (!subtask) {
      return NextResponse.json(
        { success: false, message: '更新失败' },
        { status: 500 }
      );
    }

    if (body.completed !== undefined && body.completed !== existingSubtask.completed) {
      await createTodoActivity(
        id,
        currentUser.id,
        body.completed ? 'subtask_completed' : 'subtask_uncompleted',
        `${body.completed ? '完成' : '取消完成'}子任务"${subtask.title}"`
      );
    }

    return NextResponse.json(
      { success: true, subtask },
      { status: 200 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subtaskId: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?.id) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const { id, subtaskId } = await params;
    const subtask = await getSubtaskById(subtaskId);
    if (!subtask) {
      return NextResponse.json(
        { success: false, message: '子任务不存在' },
        { status: 404 }
      );
    }

    const deleted = await deleteSubtask(subtaskId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: '删除失败' },
        { status: 500 }
      );
    }

    await createTodoActivity(id, currentUser.id, 'subtask_deleted', `删除子任务"${subtask.title}"`);

    return NextResponse.json(
      { success: true, message: '子任务已删除' },
      { status: 200 }
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
