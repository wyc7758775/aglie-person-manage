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
        current_count
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
    
    // 检查是否已经为0
    if ((task.current_count || 0) <= 0) {
      return NextResponse.json(
        { success: false, message: '计数已经为0，无法减少' },
        { status: 400 }
      );
    }

    // 计算新的值
    const newCurrentCount = Math.max(0, (task.current_count || 0) - 1);
    const newTotalCount = Math.max(0, (task.total_count || 0) - 1);
    const deductedGold = task.gold_reward || 0;

    // 更新任务
    await sql`
      UPDATE tasks
      SET 
        current_count = ${newCurrentCount},
        total_count = ${newTotalCount},
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
        'updated',
        ${`减少完成计数，扣除 ${deductedGold} 金币`},
        NOW()
      )
    `;

    // 同时插入 completed 记录，让 heatmap 能够统计本周完成数
    await sql`
      INSERT INTO task_history (
        task_id,
        action,
        description,
        timestamp
      ) VALUES (
        ${taskId},
        'completed',
        ${`坚持习惯，减少计数`},
        NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      data: {
        currentCount: newCurrentCount,
        totalCount: newTotalCount,
        deductedGold,
      },
    });
  } catch (error) {
    console.error('减少计数失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
