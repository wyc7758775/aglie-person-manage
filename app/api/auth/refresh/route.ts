import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: '无效的刷新令牌' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      accessToken: 'new_access_token_' + Date.now(),
      refreshToken: 'new_refresh_token_' + Date.now(),
    });
  } catch (error) {
    console.error('Token刷新失败:', error);
    return NextResponse.json(
      { success: false, message: 'Token刷新失败' },
      { status: 500 }
    );
  }
}
