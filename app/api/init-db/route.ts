import { NextResponse } from 'next/server';
import { createUser, checkDatabaseConnection } from '@/app/lib/db-memory';
import { UserRole } from '@/app/lib/definitions';

// 默认用户数据
const defaultUsers: { nickname: string; password: string; role: UserRole }[] = [
  {
    nickname: "admin",
    password: "123456",
    role: "user",
  },
  {
    nickname: "testuser",
    password: "password123",
    role: "user",
  },
  {
    nickname: "敏捷小助手",
    password: "agile2024",
    role: "user",
  },
  {
    nickname: "developer",
    password: "dev123",
    role: "user",
  },
  {
    nickname: "wuyucun",
    password: "wyc7758775",
    role: "superadmin",
  },
];

export async function POST() {
  try {
    // 检查数据库连接
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, message: '数据库连接失败' },
        { status: 500 }
      );
    }

    // 创建默认用户
    const createdUsers = [];
    for (const userData of defaultUsers) {
      try {
        const user = await createUser(userData.nickname, userData.password, userData.role);
        createdUsers.push({
          id: user.id,
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
        usersCreated: createdUsers.length,
        users: createdUsers,
      },
    });

  } catch (error) {
    console.error('数据库初始化失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '数据库初始化失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}