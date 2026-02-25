import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 添加缺失的字段到 tasks 表
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'tasks' AND column_name = 'current_count') THEN
          ALTER TABLE tasks ADD COLUMN current_count INT NOT NULL DEFAULT 0;
        END IF;
      EXCEPTION WHEN others THEN
        NULL;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'tasks' AND column_name = 'target_count') THEN
          ALTER TABLE tasks ADD COLUMN target_count INT NOT NULL DEFAULT 12;
        END IF;
      EXCEPTION WHEN others THEN
        NULL;
      END $$;
    `;

    // 创建 task_history 表
    await sql`
      CREATE TABLE IF NOT EXISTS task_history (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL,
        description TEXT DEFAULT '',
        user_id UUID,
        user_nickname VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 创建索引
    await sql`
      CREATE INDEX IF NOT EXISTS idx_task_history_task_id ON task_history(task_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_task_history_timestamp ON task_history(timestamp);
    `;

    return NextResponse.json({
      success: true,
      message: '数据库初始化成功',
    });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '数据库初始化失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
