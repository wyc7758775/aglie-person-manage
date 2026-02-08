import { NextRequest, NextResponse } from 'next/server';
import { findUserById } from '@/app/lib/auth-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: '用户ID不能为空' },
        { status: 400 }
      );
    }

    const user = await findUserById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        nickname: user.nickname,
        role: user.role,
        totalPoints: user.totalPoints ?? 0,
      },
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error && error.message?.includes('POSTGRES_URL')
            ? '数据库未配置'
            : '服务器内部错误',
      },
      {
        status:
          error instanceof Error && error.message?.includes('POSTGRES_URL')
            ? 503
            : 500,
      }
    );
  }
}
