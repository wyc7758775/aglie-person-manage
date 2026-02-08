/**
 * 纯逻辑：用户角色与格式校验。用户查找、注册、密码验证请使用 auth-db（数据库）。
 */
import { User, UserRole } from './definitions';

export function isSuperAdmin(user: User): boolean {
  return user.role === 'superadmin';
}

export function getUserRole(user: User): 'user' | 'superadmin' {
  return user.role || 'user';
}

export function getSafeUserInfo(user: User & { role?: UserRole }) {
  return {
    id: user.id,
    nickname: user.nickname,
    isAdmin: user.role === 'superadmin',
  };
}

export function validateNickname(nickname: string): {
  valid: boolean;
  message?: string;
} {
  if (!nickname) {
    return { valid: false, message: '用户昵称不能为空' };
  }
  if (nickname.length < 2) {
    return { valid: false, message: '用户昵称至少需要2个字符' };
  }
  if (nickname.length > 50) {
    return { valid: false, message: '用户昵称不能超过50个字符' };
  }
  const validPattern = /^[a-zA-Z0-9\u4e00-\u9fa5_]+$/;
  if (!validPattern.test(nickname)) {
    return {
      valid: false,
      message: '用户昵称只能包含字母、数字、中文和下划线',
    };
  }
  return { valid: true };
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (!password) {
    return { valid: false, message: '密码不能为空' };
  }
  if (password.length < 6) {
    return { valid: false, message: '密码至少需要6个字符' };
  }
  if (password.length > 100) {
    return { valid: false, message: '密码不能超过100个字符' };
  }
  return { valid: true };
}
