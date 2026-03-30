FROM node:20-alpine AS base

# ==================== 依赖安装 ====================
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /build

COPY package.json package-lock.json* ./
RUN npm ci

# ==================== 构建 ====================
FROM base AS builder
WORKDIR /build
COPY --from=deps /build/node_modules ./node_modules
COPY . .

# 安装 Prisma CLI 并生成客户端
RUN npm install prisma
RUN npx prisma generate

# 构建
ENV NEXT_DISABLE_TURBOPACK=1
RUN npm run build

# ==================== 生产镜像 ====================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制 public
COPY --from=builder /build/public ./public

# 复制 standalone 构建产物
COPY --from=builder /build/.next/standalone ./server

# 复制 static
COPY --from=builder /build/.next/static ./static

# 复制启动脚本
COPY --from=builder /build/start.sh ./start.sh
RUN chmod +x ./start.sh

# 设置权限
RUN chown -R nextjs:nodejs /app

# 数据目录
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
VOLUME ["/app/data"]

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./start.sh"]
