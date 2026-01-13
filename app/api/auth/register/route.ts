import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequest, RegisterResponse } from '@/app/lib/definitions';
import { registerUser, getSafeUserInfo } from '@/app/lib/auth-db';
import { User } from '@/app/lib/definitions';
import { initializeDatabase } from '@/app/lib/db-memory';
import { getApiMessage } from '@/app/lib/i18n/api-messages';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body: RegisterRequest = await request.json();
    const { nickname, password } = body;

    const result = await registerUser(nickname, password);
    
    if (!result.success) {
      let errorMessage = getApiMessage('zh-CN', 'registerFailed');
      if (result.message.includes('已存在')) {
        errorMessage = getApiMessage('zh-CN', 'userAlreadyExists');
      } else if (result.message.includes('昵称')) {
        errorMessage = getApiMessage('zh-CN', 'nicknameRequired');
      } else if (result.message.includes('密码')) {
        errorMessage = getApiMessage('zh-CN', 'passwordTooShort');
      }
      
      const response: RegisterResponse = {
        success: false,
        message: errorMessage,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: RegisterResponse = {
      success: true,
      message: getApiMessage('zh-CN', 'registerSuccess'),
      user: getSafeUserInfo(result.user as User & { role: 'user' }),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('注册接口错误:', error);
    const response: RegisterResponse = {
      success: false,
      message: getApiMessage('zh-CN', 'serverError'),
    };
    return NextResponse.json(response, { status: 500 });
  }
}