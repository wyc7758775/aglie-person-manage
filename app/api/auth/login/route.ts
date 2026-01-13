import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, LoginResponse } from "@/app/lib/definitions";
import {
  findUserByNickname,
  verifyUserPassword,
  getSafeUserInfo,
  validateNickname,
  validatePassword,
} from "@/app/lib/auth-db";
import { initializeDatabase } from "@/app/lib/db-memory";
import { getApiMessage } from "@/app/lib/i18n/api-messages";

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body: LoginRequest = await request.json();
    const { nickname, password } = body;

    const nicknameValidation = validateNickname(nickname);
    if (!nicknameValidation.valid) {
      const response: LoginResponse = {
        success: false,
        message: getApiMessage('zh-CN', 'nicknameRequired'),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      const response: LoginResponse = {
        success: false,
        message: getApiMessage('zh-CN', 'passwordRequired'),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const user = await findUserByNickname(nickname);
    if (!user) {
      const response: LoginResponse = {
        success: false,
        message: getApiMessage('zh-CN', 'userNotFound'),
      };
      return NextResponse.json(response, { status: 401 });
    }

    if (!(await verifyUserPassword(user, password))) {
      const response: LoginResponse = {
        success: false,
        message: getApiMessage('zh-CN', 'wrongPassword'),
      };
      return NextResponse.json(response, { status: 401 });
    }

    const response: LoginResponse = {
      success: true,
      message: getApiMessage('zh-CN', 'loginSuccess'),
      user: getSafeUserInfo(user),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("登录接口错误:", error);
    const response: LoginResponse = {
      success: false,
      message: getApiMessage('zh-CN', 'serverError'),
    };
    return NextResponse.json(response, { status: 500 });
  }
}
