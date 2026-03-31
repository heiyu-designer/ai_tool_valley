#!/bin/bash

# =============================================
# AI Tool Valley Docker 部署脚本
# =============================================
# 功能：
#   1. 初始化数据库（如需要）
#   2. 构建并启动 Docker 容器
#   3. 多项目隔离支持
#
# 使用方式：
#   # 部署默认项目
#   ./deploy.sh
#
#   # 部署多个项目（不同端口，不同数据库）
#   PROJECT_NAME=project_one PORT=3001 ./deploy.sh
#   PROJECT_NAME=project_two PORT=3002 ./deploy.sh
# =============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME=${PROJECT_NAME:-ai_tool_valley}
PORT=${PORT:-3876}
DATA_DIR="./data/${PROJECT_NAME}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  AI Tool Valley 部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "项目名称: ${GREEN}${PROJECT_NAME}${NC}"
echo -e "访问端口: ${GREEN}${PORT}${NC}"
echo -e "数据目录: ${GREEN}${DATA_DIR}${NC}"
echo ""

# 创建数据目录
echo -e "${YELLOW}[1/4] 初始化数据目录...${NC}"
mkdir -p "${DATA_DIR}"
echo -e "${GREEN}✓ 数据目录已创建: ${DATA_DIR}${NC}"

# 检查 .env 文件
echo -e "${YELLOW}[2/4] 检查环境配置...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}  .env 文件不存在，复制模板...${NC}"
    if [ -f ".env.docker" ]; then
        cp .env.docker .env
        echo -e "${GREEN}  ✓ 已从 .env.docker 复制${NC}"
    else
        echo -e "${RED}✗ 错误: .env.docker 模板不存在${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}  ✓ .env 文件已存在${NC}"
fi

# 生成 AUTH_SECRET（如果未设置）
if grep -q "change-this-to-a-random-secret" .env 2>/dev/null; then
    echo -e "${YELLOW}  生成 AUTH_SECRET...${NC}"
    NEW_SECRET=$(openssl rand -base64 32)
    sed -i.bak "s/AUTH_SECRET=change-this-to-a-random-secret-in-production/AUTH_SECRET=$NEW_SECRET/" .env
    rm -f .env.bak
    echo -e "${GREEN}  ✓ AUTH_SECRET 已生成${NC}"
fi

# 检查数据库文件
DB_FILE="${DATA_DIR}/${PROJECT_NAME}.db"
if [ -f "${DB_FILE}" ]; then
    echo -e "${GREEN}  ✓ 数据库文件已存在: ${DB_FILE}${NC}"
else
    echo -e "${YELLOW}  数据库文件不存在，将在首次运行时自动创建${NC}"
fi

# 清理旧容器（如有）
echo -e "${YELLOW}[3/4] 清理旧容器...${NC}"
docker-compose down --remove-orphans 2>/dev/null || true
echo -e "${GREEN}✓ 旧容器已清理${NC}"

# 构建并启动
echo -e "${YELLOW}[4/4] 构建并启动 Docker 容器...${NC}"
PROJECT_NAME=${PROJECT_NAME} PORT=${PORT} docker-compose up -d --build

# 等待服务启动
echo -e "${YELLOW}  等待服务启动...${NC}"
sleep 5

# 检查容器状态
if docker ps | grep -q "${PROJECT_NAME}-app"; then
    echo -e "${GREEN}✓ 容器启动成功${NC}"
else
    echo -e "${RED}✗ 容器启动失败，请检查日志${NC}"
    echo ""
    echo -e "查看日志: ${YELLOW}docker logs ${PROJECT_NAME}-app${NC}"
    exit 1
fi

# 显示部署信息
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "访问地址: ${BLUE}http://localhost:${PORT}${NC}"
echo -e "容器名称: ${PROJECT_NAME}-app"
echo ""
echo -e "${YELLOW}数据隔离信息:${NC}"
echo -e "  项目名称: ${PROJECT_NAME}"
echo -e "  数据库:   ${DATA_DIR}/${PROJECT_NAME}.db"
echo -e "  Docker 卷: ${PROJECT_NAME}-data"
echo -e "  网络:     ${PROJECT_NAME}-network"
echo ""
echo -e "${YELLOW}常用命令:${NC}"
echo -e "  查看日志:   ${GREEN}docker logs ${PROJECT_NAME}-app -f${NC}"
echo -e "  进入容器:  ${GREEN}docker exec -it ${PROJECT_NAME}-app sh${NC}"
echo -e "  停止:      ${GREEN}docker-compose down${NC}"
echo -e "  重启:      ${GREEN}docker-compose restart${NC}"
echo -e "  完全删除:  ${GREEN}docker-compose down -v${NC} (会删除数据库！)"
echo ""
echo -e "${YELLOW}部署多个项目示例:${NC}"
echo -e "  项目1: ${GREEN}PROJECT_NAME=project_one PORT=3001 ./deploy.sh${NC}"
echo -e "  项目2: ${GREEN}PROJECT_NAME=project_two PORT=3002 ./deploy.sh${NC}"
echo ""
