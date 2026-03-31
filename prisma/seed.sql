-- =============================================
-- AI Tool Valley 数据库初始化数据
-- 使用方式:
--   sqlite3 your_database.db < prisma/seed.sql
-- =============================================

-- 启用外键约束
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- 创建用户表
CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建验证码表
CREATE TABLE IF NOT EXISTS "verification_codes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建工具表
CREATE TABLE IF NOT EXISTS "tools" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "pricing" TEXT NOT NULL DEFAULT 'free',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 插入测试用户数据
INSERT INTO users (email, password, createdAt) VALUES
('test@example.com', '$2b$10$uZJcNp3/68F/m6zY.jbl5e1vbS3nB4UYPQQQJ2PHefG7li7TO7uzW', '2026-03-26T08:34:11.454+00:00'),
('zhuxuejun1996@163.com', '$2b$10$fFFvKbN2PpEFmUe2wfdk2uz9/5UmssaWzWIoi5SRx8PbeaI9WG4mC', '2026-03-26T11:25:29.065+00:00');

-- 插入工具数据
INSERT INTO tools (name, url, icon, category, description, pricing, featured, createdAt) VALUES
-- AI 对话
('ChatGPT', 'https://chat.openai.com', 'https://chat.openai.com/favicon.ico', 'chat', 'OpenAI 开发的大型语言模型，支持对话交互', 'freemium', 1, '2026-03-26 08:37:47'),
('AI 设计代理平台', 'https://www.lovart.ai/zh/home', '', 'chat', 'Lovart 更像是一个全能的 AI 虚拟设计师，专注于商业设计和品牌营销', 'free', 0, '2026-03-30 07:18:50'),
('谷歌的gemini', 'https://gemini.google.com/', '', 'chat', 'Google 开发的人工智能，能够理解、总结、生成各种类型的信息', 'paid', 1, '2026-03-30 07:18:50'),
('ChatGPT的提示词专家', 'https://chatgpt.com/g/g-Apzuylaqk-langgpt-ti-shi-ci-zhuan-jia', '', 'chat', '快速生成提示词模版', 'free', 1, '2026-03-30 07:18:50'),

-- AI 创作
('Midjourney', 'https://www.midjourney.com', NULL, 'creation', 'AI 图像生成工具，通过文字描述创建精美图片', 'paid', 1, '2026-03-26 08:37:47'),
('ComfyUI AI 应用创作平台', 'https://www.runninghub.cn/', '', 'creation', '在线的高性能 AI 图像和视频生成环境', 'paid', 0, '2026-03-30 07:18:50'),
('视频解析网站', 'https://www.longcut.ai/', '', 'creation', 'LongCut 并不做总结，指引你去哪里寻找亮点', 'free', 0, '2026-03-30 07:18:50'),
('木兰AI', 'https://mulan.pro/teams/v1gxLZ', '', 'creation', 'AI生图/生视频工具，支持最新国内外AI工具', 'free', 0, '2026-03-30 07:18:50'),
('壁纸生成器', 'https://mjcn.club/app/', '', 'creation', '壁纸生成器', 'free', 0, '2026-03-30 07:18:50'),

-- 编程开发
('GitHub Copilot', 'https://github.com/features/copilot', NULL, 'coding', 'AI 代码助手，帮助开发者更高效地编写代码', 'paid', 1, '2026-03-26 08:37:47'),
('AI 领域的 GitHub', 'https://huggingface.co/', '', 'coding', 'AI 开发者托管模型、数据集和 AI 应用的地方', 'free', 0, '2026-03-30 07:18:50'),
('Baas平台', 'https://supabase.com/', '', 'coding', 'Supabase 帮你把后端开发中最脏、最累的活儿都打包处理好了', 'free', 0, '2026-03-30 07:18:50'),
('海外兼职平台', 'https://weworkremotely.com/remote-jobs/posthog-ai-product-engineer', '', 'coding', '相当于国内的猪八戒兼职网', 'free', 0, '2026-03-30 07:18:50'),
('海外兼职平台2', 'https://www.freelancer.com/', '', 'coding', '可以远程干活', 'free', 0, '2026-03-30 07:18:50'),
('创建交互式网页、文档和幻灯片的在线平台', 'https://faces.app', '', 'coding', '内容创作工具，帮助制作比传统静态页面更生动、更具互动性的内容', 'free', 0, '2026-03-30 07:18:50'),
('Vercel', 'https://vercel.com/', '', 'coding', '网站托管平台，域名管理服务', 'free', 1, '2026-03-30 07:18:50'),
('Cloudflare', 'https://dash.cloudflare.com/', '', 'coding', 'CDN加速，SSL证书，网站安全', 'free', 0, '2026-03-30 07:18:50'),
('Hostinger', 'https://auth.hostinger.com/', '', 'coding', '主机服务、域名服务', 'free', 0, '2026-03-30 07:18:50'),
('SEMrush', 'https://zh.semrush.com/seo/', '', 'coding', '网站分析、关键词研究、SEO优化', 'free', 0, '2026-03-30 07:18:50'),
('similarweb', 'https://www.similarweb.com/', '', 'coding', '流量分析、用户行为、市场洞察', 'free', 0, '2026-03-30 07:18:50'),
('replit', 'https://replit.com/', '', 'coding', '在浏览器里就能直接写代码、运行项目和开发应用', 'free', 1, '2026-03-30 07:18:50'),
('AI 全栈开发工具', 'https://lovable.dev', '', 'coding', '你只需要描述你的想法，它就会自动生成前端界面、后端逻辑', 'free', 0, '2026-03-30 07:18:50'),

-- 设计创意
('Dribble', 'https://dribbble.com/', '', 'design', '数字设计社区与灵感分享平台UI/UX', 'free', 0, '2026-03-30 07:18:50'),

-- 学习研究
('谷歌的notebooklm', 'https://notebooklm.google.com/', '', 'learning', 'Google 推出的 AI 智能笔记本和研究助手', 'paid', 0, '2026-03-30 07:18:50'),
('谷歌的AI课程学习平台', 'https://www.skills.google/catalog', '', 'learning', 'Google 官方的学习平台目录，专注于 Google Cloud 及 AI 技能', 'free', 0, '2026-03-30 07:18:50'),
('语鲸，AI 驱动的智能阅读与信息处理助手', 'https://lingowhale.com/home', '', 'learning', '帮助科研人员、学生、媒体工作者极大提升阅读和信息获取效率', 'free', 0, '2026-03-30 07:18:50'),
('youmind', 'https://youmind.com/zh-CN/overview', '', 'learning', '仿照notebooklm做的，可以平替', 'free', 0, '2026-03-30 07:18:50'),

-- 营销效率
('Notion AI', 'https://www.notion.so', NULL, 'marketing', 'Notion 的 AI 功能，帮助写作、总结和整理信息', 'freemium', 1, '2026-03-26 08:37:47'),
('Detect_AI', 'http://193.134.211.121:5173/', NULL, 'marketing', 'Detect AI-generated content instantly', 'freemium', 0, '2026-03-30T06:28:12.079+00:00'),
('AI 提示词库', 'https://aiwind.org/', '', 'marketing', '一个为 AI 创作者提供便利的工具站', 'free', 0, '2026-03-30 07:18:50'),
('Folo 是一个 AI 驱动的智能阅读器与信息聚合平台', 'https://app.folo.is/', '', 'marketing', '高效刷资讯的工具，解决信息过载问题', 'free', 0, '2026-03-30 07:18:50'),
('AI 商业研究代理平台', 'https://atypica.ai/newstudy', '', 'marketing', '利用人工智能来模拟消费者行为，快速进行市场调研', 'free', 0, '2026-03-30 07:18:50'),
('AI 资讯日报', 'https://ai.hubtoday.app/', '', 'marketing', '用来每天生成信息卡片使用', 'free', 0, '2026-03-30 07:18:50'),
('Ahrefs', 'https://ahrefs.com/', '', 'marketing', '反向链接分析、网站审核、SEO工具', 'free', 0, '2026-03-30 07:18:50'),
('md2card', 'https://md2card.cn/zh/cover', '', 'marketing', 'md转卡片', 'free', 0, '2026-03-30 07:18:50'),
('html2Web', 'https://html2web.com/', '', 'marketing', '将html代码转换为网站', 'free', 0, '2026-03-30 07:18:50'),
('飞书文档转换成公众号', 'https://www.larkmd.online/', '', 'marketing', '飞书文档转换成公众号', 'free', 0, '2026-03-30 07:18:50'),
('v0网站复刻', 'https://v0.app/', '', 'marketing', '快速复刻网站', 'free', 0, '2026-03-30 07:18:50'),
('表情包切图工具', 'https://crop.nipao.com/', '', 'marketing', '表情包切图工具', 'free', 0, '2026-03-30 07:18:50'),
('mdnice', 'https://editor.mdnice.com/', '', 'marketing', '公众号排版工具', 'free', 0, '2026-03-30 07:18:50');

-- 创建索引
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

COMMIT;
