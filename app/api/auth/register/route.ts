import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequest, RegisterResponse } from '@/app/lib/definitions';
import { registerUser, getSafeUserInfo } from '@/app/lib/auth-db';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { nickname, password } = body;

    // 注册用户
    const result = await registerUser(nickname, password);
    
    if (!result.success) {
      const response: RegisterResponse = {
        success: false,
        message: result.message,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 注册成功
    const response: RegisterResponse = {
      success: true,
      message: result.message,
      user: getSafeUserInfo(result.user!),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('注册接口错误:', error);
    const response: RegisterResponse = {
      success: false,
      message: '服务器内部错误',
    };
    return NextResponse.json(response, { status: 500 });
  }
}