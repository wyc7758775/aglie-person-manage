import { NextResponse } from 'next/server';
import { getUsers } from '@/app/lib/db';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({
      success: true,
      data: users.map((u) => ({ id: u.id, nickname: u.nickname, role: u.role, totalPoints: u.totalPoints })),
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error && error.message?.includes('POSTGRES_URL') ? '数据库未配置' : '服务器内部错误',
      },
      { status: error instanceof Error && error.message?.includes('POSTGRES_URL') ? 503 : 500 }
    );
  }
}
