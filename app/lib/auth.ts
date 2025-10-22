import { users } from './placeholder-data';
import { User } from './definitions';

/**
 * 根据昵称查找用户
 */
export function findUserByNickname(nickname: string): User | undefined {
  return users.find(user => user.nickname === nickname);
}

/**
 * 根据ID查找用户
 */
export function findUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

/**
 * 验证用户密码
 */
export function verifyUserPassword(user: User, password: string): boolean {
  // 这里简化处理，直接比较明文密码
  // 实际项目中应该使用 bcrypt.compare() 比较哈希密码
  return user.password === password;
}

/**
 * 获取安全的用户信息（不包含密码）
 */
export function getSafeUserInfo(user: User) {
  return {
    id: user.id,
    nickname: user.nickname,
  };
}

/**
 * 验证用户昵称格式
 */
export function validateNickname(nickname: string): { valid: boolean; message?: string } {
  if (!nickname) {
    return { valid: false, message: '用户昵称不能为空' };
  }
  
  if (nickname.length < 2) {
    return { valid: false, message: '用户昵称至少需要2个字符' };
  }
  
  if (nickname.length > 20) {
    return { valid: false, message: '用户昵称不能超过20个字符' };
  }
  
  // 检查是否包含特殊字符（只允许字母、数字、中文、下划线）
  const validPattern = /^[a-zA-Z0-9\u4e00-\u9fa5_]+$/;
  if (!validPattern.test(nickname)) {
    return { valid: false, message: '用户昵称只能包含字母、数字、中文和下划线' };
  }
  
  return { valid: true };
}

/**
 * 验证密码格式
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password) {
    return { valid: false, message: '密码不能为空' };
  }
  
  if (password.length < 6) {
    return { valid: false, message: '密码至少需要6个字符' };
  }
  
  if (password.length > 50) {
    return { valid: false, message: '密码不能超过50个字符' };
  }
  
  return { valid: true };
}