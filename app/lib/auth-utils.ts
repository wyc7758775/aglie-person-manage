import { NextRequest } from 'next/server';
import { findUserByNickname } from './auth-db';
import { User } from './definitions';

/**
 * 从请求中获取当前用户
 * 尝试从 cookie 或请求头中获取用户信息
 * 注意：如果无法获取用户，返回 null（不会报错，积分累加会被跳过）
 */
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  try {
    // 尝试从 cookie 中获取 nickname
    const nickname = request.cookies.get('lastLoginNickname')?.value || 
                     request.headers.get('x-user-nickname');
    
    if (!nickname) {
      // 如果无法获取用户，返回 null（不会影响其他功能）
      return null;
    }

    const user = await findUserByNickname(nickname);
    return user;
  } catch (error) {
    console.error('获取当前用户失败:', error);
    // 返回 null 而不是抛出错误，这样即使无法获取用户，其他功能仍可正常工作
    return null;
  }
}
