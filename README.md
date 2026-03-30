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

### 单项目部署

```bash
# 1. 复制环境配置
cp .env.docker .env

# 2. 编辑 .env，修改必要的配置（特别是 AUTH_SECRET）
vim .env

# 3. 一键部署
./deploy.sh
```

### 多项目隔离部署

通过 `PROJECT_NAME` 环境变量实现完全隔离：

```bash
# 项目1
PROJECT_NAME=project_one PORT=3001 ./deploy.sh

# 项目2
PROJECT_NAME=project_two PORT=3002 ./deploy.sh
```

### 隔离机制

每个项目使用独立资源：

| 资源类型 | 隔离方式 |
|---------|---------|
| 数据库 | `data/{PROJECT_NAME}.db` |
| Docker 卷 | `{PROJECT_NAME}-data` |
| 网络 | `{PROJECT_NAME}-network` |
| 容器 | `{PROJECT_NAME}-app` |

### 目录结构

```
data/
├── project_one/           # 项目1的数据目录
│   └── project_one.db     # 项目1的数据库
├── project_two/           # 项目2的数据目录
│   └── project_two.db     # 项目2的数据库
└── ai_tool_valley/       # 默认项目的数据目录
    └── ai_tool_valley.db
```

### Docker 常用命令

```bash
# 查看日志
docker logs ${PROJECT_NAME}-app -f

# 进入容器
docker exec -it ${PROJECT_NAME}-app sh

# 查看容器状态
docker ps

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 完全删除（包括数据）
docker-compose down -v
```

### 数据库迁移（Docker 环境）

首次部署时需要执行数据库迁移：

```bash
# 进入容器执行迁移
docker exec -it ${PROJECT_NAME}-app npx prisma migrate deploy

# 或者在构建前修改 Dockerfile
```

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
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
├── data/                      # 数据库文件
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
