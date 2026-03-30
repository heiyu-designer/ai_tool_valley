# AI Tool Valley

AI 工具集合站 - 发现并管理优质 AI 工具。

## 功能特性

- 用户注册登录（邮箱 + 验证码）
- AI 工具展示（分类、搜索）
- 工具管理（增删改查）
- 响应式设计

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_xxxxxx"
EMAIL_FROM="onboarding@resend.dev"
```

生成 AUTH_SECRET：

```bash
openssl rand -base64 32
```

### 3. 初始化数据库

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## Docker 部署

### 多项目隔离

本项目支持多项目隔离部署，通过环境变量 `PROJECT_NAME` 隔离不同项目的数据：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| PROJECT_NAME | 项目名称（用于隔离数据） | ai_tool_valley |
| PORT | 容器端口 | 3000 |

### 隔离机制

```
data/
├── ai_tool_valley.db    # 项目1的数据库
├── project_two.db       # 项目2的数据库（如果部署了）
└── project_three.db     # 项目3的数据库
```

每个项目使用独立：
- 数据库文件
- Docker 网络
- 容器名称

### 部署步骤

```bash
# 1. 复制环境配置
cp .env.docker .env

# 2. 编辑 .env，修改必要的配置
vim .env

# 3. 一键部署
./deploy.sh
```

### 常用命令

```bash
# 查看日志
docker logs ai_tool_valley-app -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 完全删除（包括数据）
docker-compose down -v
```

### 部署多个项目

```bash
# 项目1
PROJECT_NAME=project_one PORT=3001 ./deploy.sh

# 项目2
PROJECT_NAME=project_two PORT=3002 ./deploy.sh
```

每个项目的数据完全隔离，互不影响。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: SQLite (Prisma ORM)
- **认证**: NextAuth.js v5
- **邮件**: Resend

## 项目结构

```
├── src/
│   ├── app/
│   │   ├── (auth)/            # 认证页面
│   │   ├── (main)/            # 需要登录的页面
│   │   └── api/               # API 路由
│   ├── components/            # UI 组件
│   ├── lib/                   # 工具函数
│   └── types/                 # 类型定义
├── prisma/                    # 数据库 Schema
├── data/                      # 数据库文件（Docker 部署）
├── Dockerfile
├── docker-compose.yml
└── deploy.sh                  # 部署脚本
```

## 分类

- 办公提效
- 代码编程
- 自媒体
- AI 聊天

## License

MIT
