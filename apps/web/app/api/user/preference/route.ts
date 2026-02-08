import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale } = body;

    if (!['zh-CN', 'en-US'].includes(locale)) {
      return NextResponse.json(
        { success: false, message: 'Invalid locale' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, locale });
  } catch (error) {
    console.error('Failed to update preference:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update preference' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ locale: 'zh-CN' });
}
