import bcrypt from 'bcrypt';
import { User, UserRole } from './definitions';
import { users as placeholderUsers } from './placeholder-data';

// 使用 globalThis 避免开发模式热重载导致数据丢失
const globalForDb = globalThis as unknown as {
  users: (User & { role: UserRole })[];
  isInitialized: boolean;
};

if (!globalForDb.users) {
  globalForDb.users = [];
}
if (!globalForDb.isInitialized) {
  globalForDb.isInitialized = false;
}

const users = globalForDb.users;
let isInitialized = globalForDb.isInitialized;

// 自动初始化数据库
async function autoInitialize() {
  if (!isInitialized) {
    try {
      users.length = 0;
      
      for (const user of placeholderUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        users.push({
          ...user,
          password: hashedPassword,
        });
      }
      
      isInitialized = true;
      globalForDb.isInitialized = true;
      console.log('内存数据库自动初始化完成');
    } catch (error) {
      console.error('内存数据库自动初始化失败:', error);
    }
  }
}

// 在模块加载时尝试初始化（仅在服务器端）
if (typeof window === 'undefined') {
  autoInitialize();
}

/**
 * 初始化数据库表结构
 */
export async function initializeDatabase() {
  try {
    if (!isInitialized) {
      users.length = 0;
      isInitialized = true;
      globalForDb.isInitialized = true;

      // 从 placeholder-data.ts 加载初始用户
      for (const user of placeholderUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        users.push({
          ...user,
          password: hashedPassword,
        });
      }

      console.log('内存数据库初始化完成');
    }
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
    const user = users.find(u => u.nickname === nickname);
    return user || null;
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
    const user = users.find(u => u.id === id);
    return user || null;
  } catch (error) {
    console.error('查找用户失败:', error);
    throw error;
  }
}

/**
 * 创建新用户
 */
export async function createUser(nickname: string, password: string, role?: UserRole): Promise<User & { role: UserRole }> {
  try {
    // 检查用户是否已存在
    const existingUser = await findUserByNickname(nickname);
    if (existingUser) {
      throw new Error('用户昵称已存在');
    }
    
    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 生成简单的UUID
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newUser: User & { role: UserRole } = {
      id,
      nickname,
      password: hashedPassword,
      role: role || 'user',
    };
    
    users.push(newUser);
    
    return newUser;
  } catch (error) {
    console.error('创建用户失败:', error);
    if (error instanceof Error && error.message.includes('已存在')) {
      throw new Error('用户昵称已存在');
    }
    throw error;
  }
}

/**
 * 验证用户密码
 */
export async function verifyUserPassword(user: User & { role: UserRole }, password: string): Promise<boolean> {
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
    isAdmin: user.role === 'superadmin',
  };
}

/**
 * 检查数据库连接
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // 内存数据库总是可用的
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
    // 内存数据库不需要关闭连接
    console.log('内存数据库连接已关闭');
  } catch (error) {
    console.error('关闭数据库连接失败:', error);
  }
}

/**
 * 获取所有用户（仅用于调试）
 */
export async function getAllUsers(): Promise<User[]> {
  return [...users];
}

/**
 * 清空所有用户数据（仅用于测试）
 */
export async function clearAllUsers(): Promise<void> {
  users.length = 0;
}