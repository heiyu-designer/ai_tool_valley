# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 开发命令

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:3000)
npm run build        # 生产环境构建
npm run lint         # 运行 ESLint
```

### 数据库命令

```bash
npx prisma migrate dev --name init   # 创建初始迁移
npx prisma generate                  # 重新生成 Prisma 客户端
npx prisma studio                   # 打开 Prisma Studio（数据库 GUI）
```

### Next.js 特性

本项目使用 **Next.js 16 (App Router)** + Turbopack。与旧版本的主要区别：
- Server Components 是默认的
- API 路由使用 `route.ts` 文件而非 `pages/api/`
- 路由组使用 `(文件夹)` 命名规范

## 架构概览

### 技术栈
- **框架**: Next.js 16 (App Router) + React 19
- **样式**: Tailwind CSS v4（使用 `@import "tailwindcss/theme"` 访问主题值）
- **数据库**: SQLite + Prisma ORM + `@prisma/adapter-libsql`
- **认证**: NextAuth.js v5 (beta) + Credentials Provider
- **邮件**: Resend 发送事务邮件
- **图标**: Lucide React

### 路由结构
```
src/app/
├── (auth)/           # 公开认证页面（登录、注册）
│   ├── login/
│   └── register/
├── (main)/           # 受保护页面（需登录）
│   ├── manage/       # 工具管理（添加、编辑）
│   └── page.tsx      # 首页
├── api/              # API 路由
│   ├── auth/         # NextAuth 处理器
│   ├── tools/        # 工具 CRUD 操作
│   └── verification/ # 邮箱验证码
└── layout.tsx        # 根布局（含 SessionProvider）
```

### 数据模型（Prisma）
- **User**: id, email, password（bcrypt 加密）, createdAt
- **Tool**: id, name, url, icon, category, description, pricing, createdAt
- **VerificationCode**: id, email, code, expiresAt, used, createdAt

### 关键类型（`src/types/index.ts`）
- `CategoryValue`: 'productivity' | 'coding' | 'content' | 'chat'（对应：办公提效、代码编程、自媒体、AI聊天）
- `PricingType`: 'free' | 'paid' | 'freemium'（对应：免费、付费、免费/付费）
- `Tool`: 数据库中的完整工具对象

### 认证流程
1. 用户注册时填写邮箱，发送 6 位数字验证码
2. 验证码存储在 `VerificationCode` 表（有效期 10 分钟）
3. 验证通过后创建用户记录（密码 bcrypt 加密存储）
4. NextAuth 使用 JWT Session 进行认证
5. 受保护路由未登录时重定向至 `/login`

### 工具图标
- **预定义图标**: `ToolCard.tsx` 中的 `knownToolIcons` 为热门 AI 工具提供 SVG 图标
- **Clearbit Logo API**: 有 URL 的工具使用 `https://logo.clearbit.com/${domain}` 获取图标
- **生成图标**: 根据分类生成渐变色背景 + 字母的 SVG 图标作为默认图标

## 重要实现说明

### Tailwind CSS v4
```css
/* 使用以下语法访问主题值 */
@import "tailwindcss/theme";
/* 然后使用 var(--color-*) 或直接使用 Tailwind 类 */
```

### Prisma 客户端
生成的客户端位于 `src/generated/prisma/client.ts`，导入路径为 `@/generated/prisma/client`。

### NextAuth v5
- 使用 JWT 策略（无需数据库存储 session）
- Credentials Provider 处理邮箱/密码登录
- Session 通过 token callback 包含用户 `id`

### API 响应模式
- GET `/api/tools` 返回工具数组（未登录用户不返回 URL）
- POST/PUT/DELETE 需要认证
- 验证码使用 6 位数字格式

## 环境变量

```
DATABASE_URL="file:./prisma/dev.db"    # 本地 SQLite
AUTH_SECRET=<openssl rand -base64 32>   # NextAuth 必需
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_xxxxxx"              # Resend API 密钥
EMAIL_FROM="AI Tool Valley <noreply@...>"
```
