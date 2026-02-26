import { NextRequest, NextResponse } from 'next/server';
import { deleteTodoLink, createOperationLog } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth-utils';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; linkId: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?.id) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const { id, linkId } = await params;
    const deleted = await deleteTodoLink(linkId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: '关联不存在或已删除' },
        { status: 404 }
      );
    }

    await createOperationLog({
      entityType: 'task',
      entityId: id,
      userId: currentUser.id,
      action: 'delete',
      fieldName: 'link',
      oldValue: '已删除的关联',
      newValue: undefined,
    });

    return NextResponse.json(
      { success: true, message: '关联已删除' },
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
