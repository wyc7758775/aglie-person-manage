import { NextResponse } from 'next/server';
import { users } from '@/app/lib/placeholder-data';

// 获取所有用户（不包含密码）
export async function GET() {
  try {
    const safeUsers = users.map(user => ({
      id: user.id,
      nickname: user.nickname,
    }));

    return NextResponse.json({
      success: true,
      data: safeUsers,
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: '服务器内部错误',
      },
      { status: 500 }
    );
  }
}