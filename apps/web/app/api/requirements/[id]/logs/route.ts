import { NextRequest, NextResponse } from 'next/server';
import { getOperationLogs } from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const logs = await getOperationLogs('requirement', id);
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('获取操作日志失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
