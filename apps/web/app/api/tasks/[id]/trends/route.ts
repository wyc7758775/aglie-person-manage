import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    // 首先检查任务是否存在
    const taskCheck = await sql`
      SELECT id FROM tasks WHERE id = ${taskId}
    `;

    if (taskCheck.length === 0) {
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      );
    }

    // 获取所有历史记录
    const historyResult = await sql`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM task_history
      WHERE 
        task_id = ${taskId}
        AND action = 'completed'
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;

    // 如果没有历史数据，返回空数组
    if (historyResult.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          weeks: [],
        },
      });
    }

    // 按周分组计算每周完成数
    const weeks: { week: number; completed: number }[] = [];
    let currentWeek = 1;
    let weekTotal = 0;
    let weekDayCount = 0;

    // 获取最早的记录日期
    const firstRecord = new Date(historyResult[0].date);
    const firstDayOfWeek = firstRecord.getDay(); // 0=周日, 1=周一, ...
    const daysFromMonday = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // 调整到本周一
    const weekStartDate = new Date(firstRecord);
    weekStartDate.setDate(weekStartDate.getDate() - daysFromMonday);
    weekStartDate.setHours(0, 0, 0, 0);

    for (const record of historyResult) {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      
      // 计算这是第几周
      const daysDiff = Math.floor((recordDate.getTime() - weekStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const weekNumber = Math.floor(daysDiff / 7) + 1;
      
      // 如果是新的一周
      if (weekNumber > currentWeek) {
        // 保存前一周的数据
        weeks.push({
          week: currentWeek,
          completed: weekTotal,
        });
        
        // 开始新的一周
        currentWeek = weekNumber;
        weekTotal = parseInt(record.count);
      } else {
        // 同一周，累加
        weekTotal += parseInt(record.count);
      }
    }

    // 添加最后一周
    if (weekTotal > 0 || weeks.length === 0) {
      weeks.push({
        week: currentWeek,
        completed: weekTotal,
      });
    }

    // 只返回最近12周的数据
    const recentWeeks = weeks.slice(-12);

    return NextResponse.json({
      success: true,
      data: {
        weeks: recentWeeks,
      },
    });
  } catch (error) {
    console.error('获取趋势数据失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '服务器内部错误',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
