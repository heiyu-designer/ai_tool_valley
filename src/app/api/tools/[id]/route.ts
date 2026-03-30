import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const tool = await prisma.tool.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tool) {
      return NextResponse.json({ error: '工具不存在' }, { status: 404 });
    }

    return NextResponse.json({
      ...tool,
      url: session ? tool.url : null,
    });
  } catch (error) {
    console.error('获取工具详情失败:', error);
    return NextResponse.json(
      { error: '获取工具详情失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const tool = await prisma.tool.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json(tool);
  } catch (error) {
    console.error('更新工具失败:', error);
    return NextResponse.json(
      { error: '更新工具失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.tool.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除工具失败:', error);
    return NextResponse.json(
      { error: '删除工具失败' },
      { status: 500 }
    );
  }
}
