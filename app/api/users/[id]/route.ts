import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/app/lib/placeholder-data';

// 根据ID获取用户信息
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: '用户ID不能为空',
        },
        { status: 400 }
      );
    }

    const user = users.find(u => u.id === id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: '用户不存在',
        },
        { status: 404 }
      );
    }

    // 返回用户信息（不包含密码）
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: '服务器内部错误',
      },
      { status: 500 }
    );
  }
}