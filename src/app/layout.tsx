import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AI Tool Valley - AI 工具集合站',
  description: '发现并管理优质 AI 工具，按功能分类展示',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
