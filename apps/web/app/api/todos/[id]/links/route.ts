import { NextRequest, NextResponse } from 'next/server';
import { getTodoLinks, createTodoLink, getTodoById, createTodoActivity } from '@/app/lib/db';
import { LinkType } from '@/app/lib/definitions';
import { getCurrentUser } from '@/app/lib/auth-utils';

const validLinkTypes: LinkType[] = ['blocks', 'blocked_by', 'related_to'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const links = await getTodoLinks(id);

    const linksWithDetails = await Promise.all(
      links.map(async (link) => {
        const targetId = link.sourceId === id ? link.targetId : link.sourceId;
        const targetTodo = await getTodoById(targetId);
        return {
          ...link,
          direction: link.sourceId === id ? 'outgoing' : 'incoming',
          linkedTodo: targetTodo ? { id: targetTodo.id, title: targetTodo.title, status: targetTodo.status } : null,
        };
      })
    );

    return NextResponse.json(
      { success: true, links: linksWithDetails },
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?.id) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { targetId, linkType } = body;

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: '目标待办事项ID不能为空' },
        { status: 400 }
      );
    }

    if (!linkType || !validLinkTypes.includes(linkType)) {
      return NextResponse.json(
        { success: false, message: '无效的关联类型' },
        { status: 400 }
      );
    }

    if (targetId === id) {
      return NextResponse.json(
        { success: false, message: '不能关联自身' },
        { status: 400 }
      );
    }

    const targetTodo = await getTodoById(targetId);
    if (!targetTodo) {
      return NextResponse.json(
        { success: false, message: '目标待办事项不存在' },
        { status: 400 }
      );
    }

    const link = await createTodoLink(id, { targetId, linkType });

    await createTodoActivity(id, currentUser.id, 'link_created', `创建关联: ${linkType} -> "${targetTodo.title}"`);

    return NextResponse.json(
      { success: true, link },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '服务器内部错误';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
