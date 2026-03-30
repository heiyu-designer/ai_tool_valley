import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to: email,
    subject: 'AI Tool Valley - 验证码',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563EB;">AI Tool Valley</h1>
        <p>您好！</p>
        <p>感谢您注册 AI Tool Valley，您的验证码是：</p>
        <div style="background: #F8FAFC; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0; border-radius: 8px;">
          ${code}
        </div>
        <p>验证码有效期为 10 分钟，请及时完成验证。</p>
        <p style="color: #64748B; font-size: 14px;">如果您没有注册，请忽略此邮件。</p>
      </div>
    `,
  });

  if (error) {
    console.error('发送邮件失败:', error);
    return { success: false, error };
  }

  return { success: true, data };
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
