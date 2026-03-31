import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { CategoryValue } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // 未登录用户只能查看工具列表，不能点击跳转
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as CategoryValue | null;
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const tools = await prisma.tool.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // 如果未登录，不返回完整 URL
    const sanitizedTools = tools.map((tool) => ({
      ...tool,
      url: session ? tool.url : null, // 未登录用户不返回链接
    }));

    return NextResponse.json(sanitizedTools);
  } catch (error) {
    console.error('获取工具列表失败:', error);
    return NextResponse.json(
      { error: '获取工具列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, icon, category, description, pricing, featured } = body;

    if (!name || !url || !category) {
      return NextResponse.json(
        { error: '请填写必填信息' },
        { status: 400 }
      );
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        url,
        icon: icon || null,
        category,
        description: description || null,
        pricing: pricing || 'free',
        featured: featured || false,
      },
    });

    return NextResponse.json(tool);
  } catch (error) {
    console.error('添加工具失败:', error);
    return NextResponse.json(
      { error: '添加工具失败' },
      { status: 500 }
    );
  }
}
