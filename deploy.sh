#!/bin/bash

# =============================================
# AI Tool Valley 部署脚本
# =============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  AI Tool Valley Docker 部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 项目名称
PROJECT_NAME=${PROJECT_NAME:-ai_tool_valley}
DATA_DIR="./data"

# 创建数据目录
mkdir -p $DATA_DIR

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}警告: .env 文件不存在，复制模板...${NC}"
    if [ -f ".env.docker" ]; then
        cp .env.docker .env
        echo -e "${YELLOW}请编辑 .env 文件，修改 AUTH_SECRET${NC}"
    else
        echo -e "${RED}错误: .env.docker 模板不存在${NC}"
        exit 1
    fi
fi

# 生成 AUTH_SECRET（如果未设置）
if grep -q "change-this-to-a-random-secret" .env 2>/dev/null; then
    echo -e "${YELLOW}生成 AUTH_SECRET...${NC}"
    NEW_SECRET=$(openssl rand -base64 32)
    sed -i.bak "s/AUTH_SECRET=change-this-to-a-random-secret-in-production/AUTH_SECRET=$NEW_SECRET/" .env
    rm -f .env.bak
    echo -e "${GREEN}AUTH_SECRET 已生成${NC}"
fi

echo ""
echo -e "${GREEN}开始构建 Docker 镜像...${NC}"

# 构建并启动
docker-compose up -d --build

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "访问地址: http://localhost:3000"
echo -e "容器名称: ${PROJECT_NAME}-app"
echo -e "数据库:   ./data/${PROJECT_NAME}.db"
echo ""
echo -e "常用命令:"
echo -e "  查看日志: docker logs ${PROJECT_NAME}-app -f"
echo -e "  停止:     docker-compose down"
echo -e "  重启:     docker-compose restart"
echo ""
