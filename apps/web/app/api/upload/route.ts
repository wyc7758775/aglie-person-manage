import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// 允许的文件类型
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/markdown',
  'text/plain',
];

// 最大文件大小：20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entityType = formData.get('entityType') as string || 'requirement_comment';
    const entityId = formData.get('entityId') as string || 'temp';

    if (!file) {
      return NextResponse.json(
        { success: false, message: '未找到文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: '不支持的文件类型' },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: '文件大小超过 20MB 限制' },
        { status: 400 }
      );
    }

    // 生成文件名
    const timestamp = Date.now();
    const originalName = file.name;
    const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${safeName}`;

    // 确定上传目录
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', entityType, entityId);
    
    // 确保目录存在
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 文件路径
    const filePath = path.join(uploadDir, fileName);
    
    // 写入文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 生成访问 URL
    const fileUrl = `/uploads/${entityType}/${entityId}/${fileName}`;

    return NextResponse.json({
      success: true,
      file: {
        fileName: originalName,
        fileUrl,
        fileSize: file.size,
      },
    });
  } catch (error) {
    console.error('上传文件失败:', error);
    return NextResponse.json(
      { success: false, message: '上传文件失败' },
      { status: 500 }
    );
  }
}
