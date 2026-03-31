'use client';

import { Lock, ArrowRight, Star } from 'lucide-react';
import { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
  isLoggedIn: boolean;
  onEdit?: (tool: Tool) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

const categoryColors: Record<string, { bg: string; gradient: string }> = {
  chat: { bg: 'bg-blue-50', gradient: 'from-blue-500 to-indigo-600' },
  creation: { bg: 'bg-purple-50', gradient: 'from-purple-500 to-pink-600' },
  coding: { bg: 'bg-emerald-50', gradient: 'from-emerald-500 to-teal-600' },
  design: { bg: 'bg-pink-50', gradient: 'from-pink-500 to-rose-600' },
  learning: { bg: 'bg-orange-50', gradient: 'from-orange-500 to-amber-600' },
  marketing: { bg: 'bg-cyan-50', gradient: 'from-cyan-500 to-blue-600' },
  default: { bg: 'bg-gray-50', gradient: 'from-gray-500 to-gray-600' },
};

// 预定义工具图标映射表 - 直接使用网站 favicon
const toolLogoUrls: Record<string, string> = {
  // OpenAI / ChatGPT
  'chatgpt': 'https://chat.openai.com/favicon.ico',
  'openai': 'https://chat.openai.com/favicon.ico',
  // Claude
  'claude': 'https://claude.ai/favicon.ico',
  // Midjourney
  'midjourney': 'https://www.midjourney.com/favicon.ico',
  // GitHub
  'github': 'https://github.com/favicon.ico',
  'copilot': 'https://github.com/favicon.ico',
  // Gemini / Google
  'gemini': 'https://gemini.google.com/favicon.ico',
  // Notion
  'notion': 'https://www.notion.so/images/favicon.ico',
  'notebooklm': 'https://notebooklm.google.com/favicon.ico',
  // Hugging Face
  'huggingface': 'https://huggingface.co/favicon.ico',
  // Vercel
  'vercel': 'https://vercel.com/favicon.ico',
  // Supabase
  'supabase': 'https://supabase.com/favicon.ico',
  // Replit
  'replit': 'https://replit.com/favicon.ico',
  // Stable Diffusion / ComfyUI
  'stable': 'https://stability.ai/favicon.ico',
  'comfyui': 'https://comfyanonymous.github.io/ComfyUI之意/favicon.ico',
  // Figma
  'figma': 'https://figma.com/favicon.ico',
  // Canva
  'canva': 'https://www.canva.com/favicon.ico',
  // Perplexity
  'perplexity': 'https://www.perplexity.ai/favicon.ico',
  // Cloudflare
  'cloudflare': 'https://www.cloudflare.com/favicon.ico',
  // Dribble
  'dribble': 'https://dribbble.com/favicon.ico',
  // Lovart
  'lovart': 'https://www.lovart.ai/favicon.ico',
  // V0
  'v0': 'https://v0.dev/favicon.ico',
};

// 工具名称匹配模式
const toolPatterns: [string[], string][] = [
  [['chatgpt', 'openai', 'chatgpt的提示词专家'], 'chatgpt'],
  [['claude'], 'claude'],
  [['midjourney', '木兰ai'], 'midjourney'],
  [['github copilot', 'copilot'], 'copilot'],
  [['gemini', 'bard'], 'gemini'],
  [['notion', 'notebooklm', 'youmind', '语鲸', 'folo'], 'notion'],
  [['huggingface', 'hugging face', 'hf', 'ai领域的github'], 'huggingface'],
  [['vercel', 'v0网站'], 'vercel'],
  [['supabase', 'baas平台'], 'supabase'],
  [['replit'], 'replit'],
  [['stable diffusion', 'comfyui', 'ai 设计代理平台'], 'stable'],
  [['perplexity'], 'perplexity'],
  [['cloudflare'], 'cloudflare'],
  [['figma', 'dribble'], 'figma'],
  [['canva'], 'canva'],
];

// 从 URL 提取域名
function getDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '').toLowerCase();
  } catch {
    return null;
  }
}

// 匹配工具获取 logo URL
function matchToolLogo(name: string): string | null {
  const lowerName = name.toLowerCase();
  for (const [patterns, logoKey] of toolPatterns) {
    for (const pattern of patterns) {
      if (lowerName.includes(pattern)) {
        return toolLogoUrls[logoKey] || null;
      }
    }
  }
  return null;
}

// 获取网站 favicon URL
function getFaviconUrl(url: string): string {
  const domain = getDomainFromUrl(url);
  if (!domain) return '';
  // 使用 Google Favicons API（最可靠）
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

// 生成工具品牌色背景图标
function generateToolIcon(name: string, color: string): string {
  const firstLetter = name.charAt(0).toUpperCase();
  const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="${color}"/>
    <text x="50" y="62" text-anchor="middle" font-size="40" font-weight="bold" fill="white" font-family="system-ui, sans-serif">${firstLetter}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// 工具品牌色
const toolColors: Record<string, string> = {
  'chatgpt': '#10a37f',
  'claude': '#d4a574',
  'midjourney': '#5856d6',
  'github': '#24292e',
  'copilot': '#1b7f5f',
  'gemini': '#4285f4',
  'notion': '#000000',
  'huggingface': '#ffd21e',
  'vercel': '#000000',
  'supabase': '#3ecf8e',
  'replit': '#f26207',
  'stable': '#ef484b',
  'figma': '#f24e1e',
  'canva': '#00c4cc',
  'perplexity': '#1a1a1a',
  'cloudflare': '#f38020',
};

export function ToolCard({
  tool,
  isLoggedIn,
  onEdit,
  onDelete,
  showActions = false,
}: ToolCardProps) {
  const pricingConfig = {
    free: { label: '免费', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
    paid: { label: '付费', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
    freemium: { label: '免费/付费', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  };

  const config = pricingConfig[tool.pricing as keyof typeof pricingConfig] || pricingConfig.free;
  const categoryColor = categoryColors[tool.category as string] || categoryColors.default;

  // 获取图标 URL
  const getIconUrl = (): string => {
    // 1. 匹配已知工具的 favicon
    const matchedLogo = matchToolLogo(tool.name);
    if (matchedLogo) {
      return matchedLogo;
    }

    // 2. 使用 Google Favicons API 获取网站 favicon
    if (tool.url) {
      return getFaviconUrl(tool.url);
    }

    // 3. 生成默认图标
    return '';
  };

  const iconUrl = getIconUrl();
  const matchedKey = matchToolLogo(tool.name);
  const brandColor = matchedKey ? toolColors[matchedKey] : null;
  const fallbackIcon = brandColor
    ? generateToolIcon(tool.name, brandColor)
    : `data:image/svg+xml;base64,${Buffer.from(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill="${categoryColor.gradient.includes('blue') ? '#3b82f6' : categoryColor.gradient.includes('purple') ? '#8b5cf6' : categoryColor.gradient.includes('emerald') ? '#10b981' : '#6b7280'}"/><text x="50" y="62" text-anchor="middle" font-size="40" font-weight="bold" fill="white" font-family="system-ui, sans-serif">${tool.name.charAt(0).toUpperCase()}</text></svg>`).toString('base64')}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {/* 图标 */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform shadow-sm">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={tool.name}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackIcon;
              }}
            />
          ) : (
            <img
              src={fallbackIcon}
              alt={tool.name}
              className="w-10 h-10 object-contain"
            />
          )}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {tool.name}
            </h3>
            {tool.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                <Star className="w-3 h-3" />
                推荐
              </span>
            )}
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${config.bgColor} ${config.textColor}`}>
              {config.label}
            </span>
          </div>

          {tool.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
              {tool.description}
            </p>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            {isLoggedIn && tool.url ? (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors group/link"
              >
                访问工具
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                登录后访问
              </span>
            )}

            {showActions && (
              <div className="flex items-center gap-3">
                {onEdit && (
                  <button
                    onClick={() => onEdit(tool)}
                    className="text-sm text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    编辑
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(tool.id)}
                    className="text-sm text-gray-400 hover:text-red-600 transition-colors"
                  >
                    删除
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
