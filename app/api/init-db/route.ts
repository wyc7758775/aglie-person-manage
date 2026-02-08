import { NextResponse } from 'next/server';
import { getUserBackend } from '@/app/lib/db-backend';
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

  return NextResponse.json({
    success: true,
    message: '数据库初始化完成',
    data: {
      backend: 'postgres',
      usersCreated: createdUsers.length,
      users: createdUsers,
    },
  });
}

function handleInitDbError(error: unknown) {
  console.error('数据库初始化失败:', error);
  const msg = error instanceof Error ? error.message : '未知错误';
  const isNoDb = msg.includes('POSTGRES_URL') || msg.includes('未配置');
  return NextResponse.json(
    {
      success: false,
      message: isNoDb ? '未配置数据库，请在 .env 中设置 POSTGRES_URL' : '数据库初始化失败',
      error: msg,
    },
    { status: isNoDb ? 400 : 500 }
  );
}

export async function GET() {
  try {
    return await runInitDb();
  } catch (error) {
    return handleInitDbError(error);
  }
}

export async function POST() {
  try {
    return await runInitDb();
  } catch (error) {
    return handleInitDbError(error);
  }
}