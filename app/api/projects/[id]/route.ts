import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/app/lib/projects';
import { getCurrentUser } from '@/app/lib/auth-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }
    const { id } = await params;
    const project = await getProjectById(id, user.id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: '项目不存在或无权访问' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, project },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }
    const { id } = await params;
    const body = await request.json();

    if (body.name && body.name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '项目名称不能为空' },
        { status: 400 }
      );
    }

    if (body.name && body.name.length > 100) {
      return NextResponse.json(
        { success: false, message: '项目名称不能超过100个字符' },
        { status: 400 }
      );
    }

    if (body.endDate && body.startDate && new Date(body.endDate) < new Date(body.startDate)) {
      return NextResponse.json(
        { success: false, message: '截止时间不能早于开始时间' },
        { status: 400 }
      );
    }

    // 积分验证
    if (body.points !== undefined && body.points < 0) {
      return NextResponse.json(
        { success: false, message: '积分不能为负数' },
        { status: 400 }
      );
    }

    if (body.status && !['normal', 'at_risk', 'out_of_control'].includes(body.status)) {
      return NextResponse.json(
        { success: false, message: '无效的项目状态' },
        { status: 400 }
      );
    }

    const project = await updateProject(id, body, user.id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: '项目不存在或无权访问' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, project },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '请先登录' },
        { status: 401 }
      );
    }
    const { id } = await params;
    const success = await deleteProject(id, user.id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: '项目不存在或无权访问' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: '项目已删除' },
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
