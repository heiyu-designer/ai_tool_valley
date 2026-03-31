#!/bin/bash
# =============================================
# AI Tool Valley 数据导入脚本
# 使用方式:
#   ./scripts/import-data.sh                  # 导入到 dev.db
#   ./scripts/import-data.sh data/test.db     # 导入到指定数据库
# =============================================

set -e

DB_FILE="${1:-./dev.db}"

echo "========================================"
echo "  AI Tool Valley 数据导入"
echo "========================================"
echo "数据库文件: $DB_FILE"
echo ""

# 检查 seed.sql 是否存在
if [ ! -f "./prisma/seed.sql" ]; then
    echo "错误: prisma/seed.sql 文件不存在"
    exit 1
fi

# 检查数据库文件是否存在
if [ ! -f "$DB_FILE" ]; then
    echo "数据库文件不存在，先创建..."
    # 运行 Prisma 迁移创建表结构
    DATABASE_URL="file:./${DB_FILE}" npx prisma migrate deploy
fi

# 导入数据
echo "正在导入数据..."
sqlite3 "$DB_FILE" < ./prisma/seed.sql

echo "✓ 数据导入成功!"
echo ""
echo "导入统计:"
echo "  - 用户数: $(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM users;")"
echo "  - 工具数: $(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM tools;")"
echo "  - 推荐工具: $(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM tools WHERE featured = 1;")"
