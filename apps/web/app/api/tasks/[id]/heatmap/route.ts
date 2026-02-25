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

    // 获取最近90天的历史记录
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const historyResult = await sql`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM task_history
      WHERE 
        task_id = ${taskId}
        AND action = 'completed'
        AND timestamp >= ${ninetyDaysAgo}
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;

    // 生成最近90天的日期数据
    const days: { date: string; count: number }[] = [];
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // 查找该日期的完成记录
      const record = historyResult.find((r: any) => {
        const recordDate = new Date(r.date).toISOString().split('T')[0];
        return recordDate === dateStr;
      });
      
      days.push({
        date: dateStr,
        count: record ? parseInt(record.count) : 0,
      });
    }

    // 计算本周完成数（从今天倒推到本周一）
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7)); // 本周一
    weekStart.setHours(0, 0, 0, 0);
    
    const currentWeekCount = days
      .filter((d) => new Date(d.date) >= weekStart)
      .reduce((sum, d) => sum + d.count, 0);

    // 计算完成率（最近90天中有完成的天数 / 90）
    const daysWithCompletion = days.filter((d) => d.count > 0).length;
    const completionRate = Math.round((daysWithCompletion / days.length) * 100);

    // 计算最长连击
    let longestStreak = 0;
    let currentStreak = 0;
    
    for (const day of days) {
      if (day.count > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        currentWeekCount,
        completionRate,
        longestStreak,
        days,
      },
    });
  } catch (error) {
    console.error('获取热力图数据失败:', error);
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
