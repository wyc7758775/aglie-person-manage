/**
 * User Repository 接口
 * 用户数据访问抽象
 */

import { Repository, FilterOptions } from './base-repository';

/**
 * 用户实体（领域模型）
 */
export interface User {
  id: string;
  nickname: string;
  password: string; // 存储哈希值
  role: 'user' | 'superadmin';
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建用户请求
 */
export interface CreateUserRequest {
  nickname: string;
  password: string; // 明文，Repository负责哈希
  role?: 'user' | 'superadmin';
}

/**
 * 更新用户请求
 */
export interface UpdateUserRequest {
  nickname?: string;
  password?: string; // 明文，Repository负责哈希
  totalPoints?: number;
}

/**
 * 用户凭据
 */
export interface UserCredentials {
  nickname: string;
  password: string; // 明文
}

/**
 * 认证结果
 */
export interface AuthResult {
  success: boolean;
  user?: Omit<User, 'password'>;
  message?: string;
}

/**
 * 用户 Repository 接口
 */
export interface UserRepository extends Repository<User, string> {
  /**
   * 根据昵称查找用户
   */
  findByNickname(nickname: string): Promise<User | null>;

  /**
   * 验证用户凭据
   */
  validateCredentials(credentials: UserCredentials): Promise<AuthResult>;

  /**
   * 更新用户积分
   */
  updatePoints(userId: string, points: number): Promise<User | null>;

  /**
   * 检查昵称是否已存在
   */
  isNicknameExists(nickname: string, excludeUserId?: string): Promise<boolean>;
}
