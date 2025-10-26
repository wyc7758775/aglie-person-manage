import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { User } from './definitions';

// 创建数据库连接
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * 初始化数据库表结构
 */
export async function initializeDatabase() {
  try {
    // 创建UUID扩展
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    // 删除旧的users表（如果存在）
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    
    // 创建新的users表，使用nickname字段
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        nickname VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('数据库表结构初始化完成');
    return { success: true };
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

/**
 * 根据昵称查找用户
 */
export async function findUserByNickname(nickname: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, nickname, password 
      FROM users 
      WHERE nickname = ${nickname}
      LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return {
      id: result[0].id,
      nickname: result[0].nickname,
      password: result[0].password,
    };
  } catch (error) {
    console.error('查找用户失败:', error);
    throw error;
  }
}

/**
 * 根据ID查找用户
 */
export async function findUserById(id: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, nickname, password 
      FROM users 
      WHERE id = ${id}
      LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return {
      id: result[0].id,
      nickname: result[0].nickname,
      password: result[0].password,
    };
  } catch (error) {
    console.error('查找用户失败:', error);
    throw error;
  }
}

/**
 * 创建新用户
 */
export async function createUser(nickname: string, password: string): Promise<User> {
  try {
    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await sql`
      INSERT INTO users (nickname, password)
      VALUES (${nickname}, ${hashedPassword})
      RETURNING id, nickname, password
    `;
    
    return {
      id: result[0].id,
      nickname: result[0].nickname,
      password: result[0].password,
    };
  } catch (error) {
    console.error('创建用户失败:', error);
    if (error instanceof Error && error.message?.includes('duplicate key')) {
      throw new Error('用户昵称已存在');
    }
    throw error;
  }
}

/**
 * 验证用户密码
 */
export async function verifyUserPassword(user: User, password: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error('密码验证失败:', error);
    return false;
  }
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
 * 检查数据库连接
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    return false;
  }
}

/**
 * 关闭数据库连接
 */
export async function closeDatabaseConnection() {
  try {
    await sql.end();
  } catch (error) {
    console.error('关闭数据库连接失败:', error);
  }
}