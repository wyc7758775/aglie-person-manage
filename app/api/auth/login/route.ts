import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, LoginResponse } from "@/app/lib/definitions";
import {
  findUserByNickname,
  verifyUserPassword,
  getSafeUserInfo,
  validateNickname,
  validatePassword,
} from "@/app/lib/auth-db";

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { nickname, password } = body;

    // 验证输入格式
    const nicknameValidation = validateNickname(nickname);
    if (!nicknameValidation.valid) {
      const response: LoginResponse = {
        success: false,
        message: nicknameValidation.message!,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      const response: LoginResponse = {
        success: false,
        message: passwordValidation.message!,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 查找用户
    const user = await findUserByNickname(nickname);
    if (!user) {
      const response: LoginResponse = {
        success: false,
        message: "用户不存在",
      };
      return NextResponse.json(response, { status: 401 });
    }

    // 验证密码
    if (!(await verifyUserPassword(user, password))) {
      const response: LoginResponse = {
        success: false,
        message: "密码错误",
      };
      return NextResponse.json(response, { status: 401 });
    }

    // 登录成功
    const response: LoginResponse = {
      success: true,
      message: "登录成功",
      user: getSafeUserInfo(user),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("登录接口错误:", error);
    const response: LoginResponse = {
      success: false,
      message: "服务器内部错误",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
