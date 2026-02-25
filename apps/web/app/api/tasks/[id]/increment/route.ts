import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    // 获取当前任务信息
    const taskResult = await sql`
      SELECT 
        id,
        gold_reward,
        streak,
        total_count,
        current_count,
        target_count
      FROM tasks
      WHERE id = ${taskId}
    `;

    if (taskResult.length === 0) {
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      );
    }

    const task = taskResult[0];
    
    // 计算新的值
    const newCurrentCount = (task.current_count || 0) + 1;
    const newTotalCount = (task.total_count || 0) + 1;
    const newStreak = (task.streak || 0) + 1;
    const earnedGold = task.gold_reward || 0;

    // 更新任务
    await sql`
      UPDATE tasks
      SET 
        current_count = ${newCurrentCount},
        total_count = ${newTotalCount},
        streak = ${newStreak},
        updated_at = NOW()
      WHERE id = ${taskId}
    `;

    // 添加历史记录
    await sql`
      INSERT INTO task_history (
        task_id,
        action,
        description,
        timestamp
      ) VALUES (
        ${taskId},
        'completed',
        ${`完成习惯，获得 ${earnedGold} 金币`},
        NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      data: {
        currentCount: newCurrentCount,
        totalCount: newTotalCount,
        streak: newStreak,
        earnedGold,
      },
    });
  } catch (error) {
    console.error('增加计数失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
