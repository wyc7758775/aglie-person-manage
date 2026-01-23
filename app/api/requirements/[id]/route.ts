import { NextRequest, NextResponse } from 'next/server';
import { getRequirementById, updateRequirement, deleteRequirement } from '@/app/lib/requirements';
import { RequirementStatus, RequirementPriority, RequirementType } from '@/app/lib/definitions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requirement = await getRequirementById(id);

    if (!requirement) {
      return NextResponse.json(
        { success: false, message: '需求不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, requirement },
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
    const { id } = await params;
    const body = await request.json();

    if (body.title && body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: '需求标题不能为空' },
        { status: 400 }
      );
    }

    if (body.title && body.title.length > 200) {
      return NextResponse.json(
        { success: false, message: '需求标题不能超过200个字符' },
        { status: 400 }
      );
    }

    if (body.type && !['feature', 'enhancement', 'bugfix', 'research'].includes(body.type)) {
      return NextResponse.json(
        { success: false, message: '无效的需求类型' },
        { status: 400 }
      );
    }

    if (body.status && !['draft', 'review', 'approved', 'development', 'testing', 'completed', 'rejected'].includes(body.status)) {
      return NextResponse.json(
        { success: false, message: '无效的需求状态' },
        { status: 400 }
      );
    }

    if (body.priority && !['critical', 'high', 'medium', 'low'].includes(body.priority)) {
      return NextResponse.json(
        { success: false, message: '无效的需求优先级' },
        { status: 400 }
      );
    }

    const requirement = await updateRequirement(id, body);

    if (!requirement) {
      return NextResponse.json(
        { success: false, message: '需求不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, requirement },
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
    const { id } = await params;
    const success = await deleteRequirement(id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: '需求不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: '需求已删除' },
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
