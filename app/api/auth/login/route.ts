import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, LoginResponse } from "@/app/lib/definitions";
import {
  findUserByNickname,
  verifyUserPassword,
  getSafeUserInfo,
  validateNickname,
  validatePassword,
} from "@/app/lib/auth-db";
import { getUserBackend, isConnectionError, forceMemoryBackend } from "@/app/lib/db-backend";
import { getApiMessage } from "@/app/lib/i18n/api-messages";

const LOGIN_FAIL_MESSAGE = "昵称或密码错误";

async function doLogin(body: LoginRequest): Promise<{ response: LoginResponse; status: number }> {
  const { nickname, password } = body;
  const nicknameValidation = validateNickname(nickname);
  if (!nicknameValidation.valid) {
    return {
      response: { success: false, message: getApiMessage("zh-CN", "nicknameRequired") },
      status: 400,
    };
  }
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return {
      response: { success: false, message: getApiMessage("zh-CN", "passwordRequired") },
      status: 400,
    };
  }
  const user = await findUserByNickname(nickname);
  if (!user) {
    return { response: { success: false, message: LOGIN_FAIL_MESSAGE }, status: 401 };
  }
  if (!(await verifyUserPassword(user, password))) {
    return { response: { success: false, message: LOGIN_FAIL_MESSAGE }, status: 401 };
  }
  return {
    response: {
      success: true,
      message: getApiMessage("zh-CN", "loginSuccess"),
      user: getSafeUserInfo(user),
    },
    status: 200,
  };
}

export async function POST(request: NextRequest) {
  let body: LoginRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "请求体无效" } as LoginResponse,
      { status: 400 }
    );
  }

  const setLoginCookie = (res: NextResponse, nickname: string) => {
    res.cookies.set("lastLoginNickname", nickname, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 天
      sameSite: "lax",
    });
    return res;
  };

  try {
    const backend = await getUserBackend();
    await backend.initializeDatabase();
    const { response, status } = await doLogin(body);
    const res = NextResponse.json(response, { status });
    if (response.success && body.nickname) setLoginCookie(res, body.nickname);
    return res;
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn("PostgreSQL 不可用，已自动切换为内存模式");
      forceMemoryBackend();
      try {
        const backend = await getUserBackend();
        await backend.initializeDatabase();
        const { response, status } = await doLogin(body);
        const res = NextResponse.json(response, { status });
        if (response.success && body.nickname) setLoginCookie(res, body.nickname);
        return res;
      } catch (retryError) {
        console.error("登录接口错误（内存模式）:", retryError);
        return NextResponse.json(
          { success: false, message: getApiMessage("zh-CN", "serverError") ?? "服务器内部错误" } as LoginResponse,
          { status: 500 }
        );
      }
    }
    console.error("登录接口错误:", error);
    let message = "服务器内部错误";
    try {
      message = getApiMessage("zh-CN", "serverError") ?? message;
    } catch {
      // 使用默认文案
    }
    return NextResponse.json(
      { success: false, message } as LoginResponse,
      { status: 500 }
    );
  }
}
