import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequest, RegisterResponse } from '@/app/lib/definitions';
import { registerUser, getSafeUserInfo } from '@/app/lib/auth-db';
import { User } from '@/app/lib/definitions';
import { getUserBackend, isConnectionError } from '@/app/lib/db-backend';
import { getApiMessage } from '@/app/lib/i18n/api-messages';

export async function POST(request: NextRequest) {
  let body: RegisterRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: '请求体无效' } as RegisterResponse,
      { status: 400 }
    );
  }

  const { nickname, password } = body;

  const doRegister = async () => {
    const result = await registerUser(nickname, password);
    if (!result.success) {
      let errorMessage = getApiMessage('zh-CN', 'registerFailed');
      if (result.message.includes('已存在')) errorMessage = getApiMessage('zh-CN', 'userAlreadyExists');
      else if (result.message.includes('昵称')) errorMessage = getApiMessage('zh-CN', 'nicknameRequired');
      else if (result.message.includes('密码')) errorMessage = getApiMessage('zh-CN', 'passwordTooShort');
      return NextResponse.json({ success: false, message: errorMessage } as RegisterResponse, { status: 400 });
    }
    return NextResponse.json(
      {
        success: true,
        message: getApiMessage('zh-CN', 'registerSuccess'),
        user: getSafeUserInfo(result.user as User & { role: 'user' }),
      } as RegisterResponse,
      { status: 201 }
    );
  };

  try {
    const backend = await getUserBackend();
    await backend.initializeDatabase();
    return await doRegister();
  } catch (error) {
    console.error('注册接口错误:', error);
    const message =
      isConnectionError(error) || (error instanceof Error && error.message?.includes('POSTGRES_URL'))
        ? '数据库不可用，请确认已配置 POSTGRES_URL 且 PostgreSQL 已启动'
        : (error instanceof Error ? error.message : getApiMessage('zh-CN', 'serverError') ?? '服务器内部错误');
    return NextResponse.json({ success: false, message } as RegisterResponse, { status: 503 });
  }
}