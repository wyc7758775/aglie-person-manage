import { NextRequest, NextResponse } from 'next/server';
import { getTodoById, updateTodo, deleteTodo, createOperationLog, updateUserTotalPoints } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todo = await getTodoById(id);

    if (!todo) {
      return NextResponse.json(
        { success: false, message: '待办事项不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, todo },
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

export async function PUT(
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
    const existingTodo = await getTodoById(id);
    if (!existingTodo) {
      return NextResponse.json(
        { success: false, message: '待办事项不存在' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const oldStatus = existingTodo.status;

    const todo = await updateTodo(id, body);

    if (!todo) {
      return NextResponse.json(
        { success: false, message: '更新失败' },
        { status: 500 }
      );
    }

    if (body.status && body.status !== oldStatus) {
      await createOperationLog({
        entityType: 'task',
        entityId: id,
        userId: currentUser.id,
        action: 'status_change',
        fieldName: 'status',
        oldValue: oldStatus,
        newValue: body.status,
      });

      if (body.status === 'done' && oldStatus !== 'done') {
        await updateUserTotalPoints(currentUser.id, existingTodo.points);
        await createOperationLog({
          entityType: 'task',
          entityId: id,
          userId: currentUser.id,
          action: 'update',
          fieldName: 'points',
          oldValue: '0',
          newValue: String(existingTodo.points),
        });
      }
    }

    // 记录其他字段变更
    const fieldsToLog = ['title', 'description', 'priority', 'assignee', 'dueDate', 'points'] as const;
    for (const field of fieldsToLog) {
      if (body[field] !== undefined && body[field] !== existingTodo[field]) {
        await createOperationLog({
          entityType: 'task',
          entityId: id,
          userId: currentUser.id,
          action: 'update',
          fieldName: field,
          oldValue: String(existingTodo[field] || ''),
          newValue: String(body[field] || ''),
        });
      }
    }

    return NextResponse.json(
      { success: true, todo },
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
    const todo = await getTodoById(id);
    if (!todo) {
      return NextResponse.json(
        { success: false, message: '待办事项不存在' },
        { status: 404 }
      );
    }

    if (todo.status === 'done') {
      return NextResponse.json(
        { success: false, message: '已完成的待办事项不可删除，仅可归档' },
        { status: 400 }
      );
    }

    const deleted = await deleteTodo(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: '删除失败' },
        { status: 500 }
      );
    }

    // 记录删除操作日志
    try {
      await createOperationLog({
        entityType: 'task',
        entityId: id,
        userId: currentUser.id,
        action: 'delete',
        fieldName: undefined,
        oldValue: undefined,
        newValue: undefined,
      });
    } catch (logError) {
      console.error('记录操作日志失败:', logError);
    }

    return NextResponse.json(
      { success: true, message: '待办事项已删除' },
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
