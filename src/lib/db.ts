import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // 支持环境变量 DATABASE_URL
  // Docker 部署: file:/app/data/${PROJECT_NAME}.db
  // 本地开发: file:./dev.db
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

  const adapter = new PrismaLibSql({
    url: databaseUrl,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
