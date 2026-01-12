import { User, UserRole } from "./definitions";
import {
  findUserByNickname as dbFindUserByNickname,
  findUserById as dbFindUserById,
  createUser as dbCreateUser,
  verifyUserPassword as dbVerifyUserPassword,
  getSafeUserInfo as dbGetSafeUserInfo,
} from "./db-memory";

/**
 * 根据昵称查找用户
 */
export async function findUserByNickname(
  nickname: string
): Promise<(User & { role: UserRole }) | null> {
  return await dbFindUserByNickname(nickname) as (User & { role: UserRole }) | null;
}

/**
 * 根据ID查找用户
 */
export async function findUserById(id: string): Promise<(User & { role: UserRole }) | null> {
  return await dbFindUserById(id) as (User & { role: UserRole }) | null;
}

/**
 * 验证用户密码
 */
export async function verifyUserPassword(
  user: User & { role: UserRole },
  password: string
): Promise<boolean> {
  return await dbVerifyUserPassword(user, password);
}

/**
 * 获取安全的用户信息（不包含密码）
 */
export function getSafeUserInfo(user: User & { role: UserRole }) {
  return dbGetSafeUserInfo(user);
}

/**
 * 验证用户昵称格式
 */
export function validateNickname(nickname: string): {
  valid: boolean;
  message?: string;
} {
  if (!nickname) {
    return { valid: false, message: "用户昵称不能为空" };
  }

  if (nickname.length < 2) {
    return { valid: false, message: "用户昵称至少需要2个字符" };
  }

  if (nickname.length > 50) {
    return { valid: false, message: "用户昵称不能超过50个字符" };
  }

  // 检查是否包含特殊字符（只允许字母、数字、中文、下划线）
  const validPattern = /^[a-zA-Z0-9\u4e00-\u9fa5_]+$/;
  if (!validPattern.test(nickname)) {
    return {
      valid: false,
      message: "用户昵称只能包含字母、数字、中文和下划线",
    };
  }

  return { valid: true };
}

/**
 * 验证密码格式
 */
export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (!password) {
    return { valid: false, message: "密码不能为空" };
  }

  if (password.length < 6) {
    return { valid: false, message: "密码至少需要6个字符" };
  }

  if (password.length > 100) {
    return { valid: false, message: "密码不能超过100个字符" };
  }

  return { valid: true };
}

/**
 * 注册新用户
 */
export async function registerUser(
  nickname: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  user?: User;
}> {
  // 验证昵称格式
  const nicknameValidation = validateNickname(nickname);
  if (!nicknameValidation.valid) {
    return {
      success: false,
      message: nicknameValidation.message || "昵称格式不正确",
    };
  }

  // 验证密码格式
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return {
      success: false,
      message: passwordValidation.message || "密码格式不正确",
    };
  }

  try {
    // 检查用户是否已存在
    const existingUser = await findUserByNickname(nickname);
    if (existingUser) {
      return {
        success: false,
        message: "用户昵称已存在",
      };
    }

    // 创建新用户
    const newUser = await dbCreateUser(nickname, password);

    return {
      success: true,
      message: "注册成功",
      user: newUser,
    };
  } catch (error) {
    console.error("注册用户失败:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "注册失败，请稍后重试",
    };
  }
}
