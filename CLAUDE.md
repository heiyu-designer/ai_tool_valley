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
- `CategoryValue`: 'chat' | 'creation' | 'coding' | 'design' | 'learning' | 'marketing'（AI对话、AI创作、编程开发、设计创意、学习研究、营销效率）
- `PricingType`: 'free' | 'paid' | 'freemium'（对应：免费、付费、免费/付费）
- `Tool`: 数据库中的完整工具对象（含 featured 字段）

### 认证流程
1. 用户注册时填写邮箱，发送 6 位数字验证码
2. 验证码存储在 `VerificationCode` 表（有效期 10 分钟）
3. 验证通过后创建用户记录（密码 bcrypt 加密存储）
4. NextAuth 使用 JWT Session 进行认证
5. 受保护路由未登录时重定向至 `/login`

### 工具图标
- **Google Favicons API**: `https://www.google.com/s2/favicons?domain=${domain}&sz=64` 获取网站 favicon
- **预定义图标**: 热门工具使用预定义的 favicon 地址
- **生成图标**: 无法获取时使用工具品牌色或分类渐变色背景 + 字母

### 数据初始化
部署到新环境时，使用以下命令导入初始化数据：
```bash
./scripts/import-data.sh                    # 导入到 dev.db
./scripts/import-data.sh data/test.db      # 导入到指定数据库
```
初始化数据位于 `prisma/seed.sql`，包含：
- 2 个测试用户
- 40 个 AI 工具（6 个分类，8 个精选推荐）

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
DATABASE_URL="file:./dev.db"            # 本地 SQLite（生产环境通过 docker-compose 配置）
AUTH_SECRET=<openssl rand -base64 32>   # NextAuth 必需
NEXTAUTH_URL="http://localhost:3876"    # 开发服务器端口
RESEND_API_KEY="re_xxxxxx"              # Resend API 密钥
EMAIL_FROM="AI Tool Valley <noreply@...>"
```

## Docker 部署

```bash
# 单项目部署
./deploy.sh

# 多项目隔离部署
PROJECT_NAME=project_one PORT=3877 ./deploy.sh
```

**隔离机制**：通过 `PROJECT_NAME` 环境变量隔离数据库文件、网络和容器名。

**常用命令**：
```bash
docker logs ai_tool_valley-app -f   # 查看日志
docker exec -it ai_tool_valley-app sh  # 进入容器
docker compose down                  # 停止服务
```
