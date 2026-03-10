/**
 * PostgreSQL User Repository 实现
 */

import bcrypt from 'bcrypt';
import { sql } from '../../db';
import { PostgresRepository, generateUUID } from './base-postgres-repository';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserCredentials,
  AuthResult,
  UserRepository,
} from '../interfaces/user-repository';

export class PostgresUserRepository extends PostgresRepository<User, string> implements UserRepository {
  constructor() {
    super(sql, 'users', 'id');
  }

  protected mapToEntity(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      nickname: row.nickname as string,
      password: row.password as string,
      role: (row.role as 'user' | 'superadmin') || 'user',
      totalPoints: (row.total_points as number) || 0,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  protected mapToRow(entity: Partial<User>): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    
    if (entity.nickname !== undefined) row.nickname = entity.nickname;
    if (entity.password !== undefined) row.password = entity.password;
    if (entity.role !== undefined) row.role = entity.role;
    if (entity.totalPoints !== undefined) row.total_points = entity.totalPoints;
    if (entity.createdAt !== undefined) row.created_at = entity.createdAt;
    if (entity.updatedAt !== undefined) row.updated_at = entity.updatedAt;
    
    return row;
  }

  protected generateId(): string {
    return generateUUID();
  }

  async findByNickname(nickname: string): Promise<User | null> {
    const rows = await this.sql`
      SELECT * FROM users
      WHERE nickname = ${nickname}
      LIMIT 1
    `;
    
    if (rows.length === 0) return null;
    return this.mapToEntity(rows[0] as Record<string, unknown>);
  }

  async validateCredentials(credentials: UserCredentials): Promise<AuthResult> {
    const user = await this.findByNickname(credentials.nickname);
    
    if (!user) {
      return {
        success: false,
        message: '用户不存在',
      };
    }

    const isValid = await bcrypt.compare(credentials.password, user.password);
    
    if (!isValid) {
      return {
        success: false,
        message: '密码错误',
      };
    }

    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      user: userWithoutPassword,
      message: '登录成功',
    };
  }

  async updatePoints(userId: string, points: number): Promise<User | null> {
    const result = await this.sql`
      UPDATE users
      SET total_points = total_points + ${points},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING *
    `;
    
    if (result.length === 0) return null;
    return this.mapToEntity(result[0] as Record<string, unknown>);
  }

  async isNicknameExists(nickname: string, excludeUserId?: string): Promise<boolean> {
    let query = this.sql`
      SELECT 1 FROM users
      WHERE nickname = ${nickname}
    `;
    
    if (excludeUserId) {
      query = this.sql`${query} AND id != ${excludeUserId}`;
    }
    
    query = this.sql`${query} LIMIT 1`;
    
    const result = await query;
    return result.length > 0;
  }

  /**
   * 创建用户（自动哈希密码）
   */
  async create(entity: Omit<User, 'id'>): Promise<User> {
    // 如果传入的密码不是哈希值，进行哈希
    let password = entity.password;
    if (!password.startsWith('$2')) {
      password = await bcrypt.hash(password, 10);
    }

    const id = this.generateId();
    const now = new Date();
    
    const result = await this.sql`
      INSERT INTO users (id, nickname, password, role, total_points, created_at, updated_at)
      VALUES (${id}, ${entity.nickname}, ${password}, ${entity.role || 'user'}, ${entity.totalPoints || 0}, ${now}, ${now})
      RETURNING *
    `;

    return this.mapToEntity(result[0] as Record<string, unknown>);
  }

  /**
   * 更新用户（支持密码哈希）
   */
  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const row: Record<string, unknown> = {};
    
    if (updates.nickname !== undefined) row.nickname = updates.nickname;
    if (updates.password !== undefined) {
      // 如果密码不是哈希值，进行哈希
      row.password = updates.password.startsWith('$2')
        ? updates.password
        : await bcrypt.hash(updates.password, 10);
    }
    if (updates.role !== undefined) row.role = updates.role;
    if (updates.totalPoints !== undefined) row.total_points = updates.totalPoints;
    
    row.updated_at = new Date();

    const entries = Object.entries(row);
    if (entries.length === 0) {
      return this.findById(id);
    }

    const result = await this.sql`
      UPDATE users
      SET ${this.sql(entries.map(([k]) => k).join(', '))} = ${entries.map(([_, v]) => v)}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) return null;
    return this.mapToEntity(result[0] as Record<string, unknown>);
  }
}

// 单例实例
export const userRepository = new PostgresUserRepository();
