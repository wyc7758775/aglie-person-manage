import { NextRequest, NextResponse } from 'next/server';
import { getDefects, createDefect } from '@/app/lib/defects';
import { DefectStatus, DefectSeverity, DefectType } from '@/app/lib/definitions';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: {
      projectId?: string;
      status?: DefectStatus;
      severity?: DefectSeverity;
      type?: DefectType;
    } = {};

    if (searchParams.get('projectId')) {
      filters.projectId = searchParams.get('projectId') as string;
    }
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as DefectStatus;
    }
    if (searchParams.get('severity')) {
      filters.severity = searchParams.get('severity') as DefectSeverity;
    }
    if (searchParams.get('type')) {
      filters.type = searchParams.get('type') as DefectType;
    }

    const defects = await getDefects(filters);

    return NextResponse.json(
      { success: true, defects },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { projectId, title, description, status, severity, type, assignee, reporter, createdDate, dueDate, environment, steps } = body;

    if (!projectId || typeof projectId !== 'string' || projectId.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '项目ID不能为空' },
        { status: 400 }
      );
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '缺陷标题不能为空' },
        { status: 400 }
      );
    }

    const defect = await createDefect({
      projectId: projectId.trim(),
      title: title.trim(),
      description: description || '',
      status: status || 'open',
      severity: severity || 'medium',
      type: type || 'bug',
      assignee: assignee || '',
      reporter: reporter || '',
      createdDate: createdDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || '',
      environment: environment || '',
      steps: steps || [],
    });

    return NextResponse.json(
      { success: true, defect },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
