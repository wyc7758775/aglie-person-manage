import { NextRequest, NextResponse } from 'next/server';
import { getRequirementComments, createRequirementComment, deleteRequirementComment } from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await getRequirementComments(id);
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('获取评论失败:', error);
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
    const { id } = await params;
    const body = await request.json();
    const { content, attachments } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '评论内容不能为空' },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const comment = await createRequirementComment({
      requirementId: id,
      userId: currentUser.id,
      content: content.trim(),
      attachments: attachments || [],
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error('创建评论失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
