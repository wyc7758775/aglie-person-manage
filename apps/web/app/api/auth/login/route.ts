import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, LoginResponse } from "@/app/lib/definitions";
import {
  findUserByNickname,
  verifyUserPassword,
  getSafeUserInfo,
  validateNickname,
  validatePassword,
} from "@/app/lib/auth-db";
import { getUserBackend, isConnectionError } from "@/app/lib/db-backend";
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
    console.error("登录接口错误:", error);
    const message =
      isConnectionError(error) || (error instanceof Error && error.message?.includes("POSTGRES_URL"))
        ? "数据库不可用，请确认已配置 POSTGRES_URL 且 PostgreSQL 已启动"
        : (error instanceof Error ? error.message : getApiMessage("zh-CN", "serverError") ?? "服务器内部错误");
    return NextResponse.json(
      { success: false, message } as LoginResponse,
      { status: 503 }
    );
  }
}
