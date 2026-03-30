import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendVerificationEmail, generateCode } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已注册，请直接登录' },
        { status: 400 }
      );
    }

    // 生成 6 位验证码
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 分钟后过期

    // 删除该邮箱之前的验证码
    await prisma.verificationCode.deleteMany({
      where: { email },
    });

    // 保存新验证码
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // 发送邮件
    const result = await sendVerificationEmail(email, code);

    if (!result.success) {
      // 开发模式下直接返回验证码，方便测试
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          message: '验证码已生成（开发模式）',
          code,
        });
      }
      return NextResponse.json(
        { error: '发送验证码失败，请稍后重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '验证码已发送到您的邮箱' });
  } catch (error) {
    console.error('发送验证码失败:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
