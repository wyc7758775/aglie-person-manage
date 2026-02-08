import { NextResponse } from 'next/server';
import { getUserBackend } from '@/app/lib/db-backend';
import type { UserRole } from '@/app/lib/definitions';

const defaultUsers: { nickname: string; password: string; role: UserRole }[] = [
  { nickname: 'admin', password: '123456', role: 'user' },
  { nickname: 'testuser', password: 'password123', role: 'user' },
  { nickname: '敏捷小助手', password: 'agile2024', role: 'user' },
  { nickname: 'developer', password: 'dev123', role: 'user' },
  { nickname: 'wuyucun', password: 'wyc7758775', role: 'superadmin' },
];

export async function GET() {
  try {
    const backend = await getUserBackend();
    await backend.initializeDatabase();
    let created = 0;
    for (const u of defaultUsers) {
      try {
        await backend.createUser(u.nickname, u.password, u.role);
        created++;
      } catch {
        // 用户已存在则跳过
      }
    }
    return NextResponse.json({
      success: true,
      message: 'Seed 完成',
      data: { usersCreated: created },
    });
  } catch (error) {
    console.error('Seed 失败:', error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: msg.includes('POSTGRES_URL') ? '未配置 POSTGRES_URL' : 'Seed 失败',
        error: msg,
      },
      { status: msg.includes('POSTGRES_URL') ? 400 : 500 }
    );
  }
}
