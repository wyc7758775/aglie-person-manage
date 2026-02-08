import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({ success: true, message: '退出成功' });
    res.cookies.set('lastLoginNickname', '', { path: '/', maxAge: 0 });
    return res;
  } catch (error) {
    console.error('退出失败:', error);
    return NextResponse.json(
      { success: false, message: '退出失败' },
      { status: 500 }
    );
  }
}
