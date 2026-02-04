import { NextResponse } from 'next/server';
import { getUserBackend, getShouldUseMemoryBackend } from '@/app/lib/db-backend';
import { UserRole } from '@/app/lib/definitions';

// 默认用户数据（含超级管理员）
const defaultUsers: { nickname: string; password: string; role: UserRole }[] = [
  { nickname: "admin", password: "123456", role: "user" },
  { nickname: "testuser", password: "password123", role: "user" },
  { nickname: "敏捷小助手", password: "agile2024", role: "user" },
  { nickname: "developer", password: "dev123", role: "user" },
  { nickname: "wuyucun", password: "wyc7758775", role: "superadmin" },
];

async function runInitDb() {
  const backend = await getUserBackend();
  await backend.initializeDatabase();
    const isConnected = await backend.checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, message: '数据库连接失败' },
        { status: 500 }
      );
    }

    const createdUsers: { id: string; nickname: string; role: UserRole }[] = [];
    for (const userData of defaultUsers) {
      try {
        const user = await backend.createUser(userData.nickname, userData.password, userData.role);
        createdUsers.push({
          id: String(user.id),
          nickname: user.nickname,
          role: user.role,
        });
      } catch (error) {
        console.log(`用户 ${userData.nickname} 可能已存在，跳过创建`);
      }
    }

  const usingMemory = getShouldUseMemoryBackend();
  return NextResponse.json({
    success: true,
    message: '数据库初始化完成',
    data: {
      backend: usingMemory ? 'memory' : 'postgres',
      usersCreated: createdUsers.length,
      users: createdUsers,
    },
    ...(usingMemory && { hint: '当前使用内存后端。如需持久化，请在 .env 中配置 POSTGRES_URL 并重启后再次访问 init-db。' }),
  });
}

export async function GET() {
  try {
    return await runInitDb();
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '数据库初始化失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    return await runInitDb();
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '数据库初始化失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}