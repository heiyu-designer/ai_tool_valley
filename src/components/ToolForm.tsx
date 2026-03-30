'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { CATEGORIES, Tool, CategoryValue, PricingType } from '@/types';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ToolFormProps {
  tool?: Tool;
}

// 从 URL 提取域名
function getDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '').toLowerCase();
  } catch {
    return null;
  }
}

export function ToolForm({ tool }: ToolFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingIcon, setFetchingIcon] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: tool?.name || '',
    url: tool?.url || '',
    icon: tool?.icon || '',
    category: tool?.category || ('productivity' as CategoryValue),
    description: tool?.description || '',
    pricing: tool?.pricing || ('free' as PricingType),
  });

  // 自动获取图标
  const autoFetchIcon = async () => {
    if (!form.url) {
      setError('请先输入工具链接');
      return;
    }

    const domain = getDomainFromUrl(form.url);
    if (!domain) {
      setError('链接格式不正确');
      return;
    }

    setFetchingIcon(true);
    setError('');

    try {
      // 使用 Clearbit Logo API
      const iconUrl = `https://logo.clearbit.com/${domain}`;
      const res = await fetch(iconUrl, { method: 'HEAD' });

      if (res.ok) {
        setForm({ ...form, icon: iconUrl });
      } else {
        // 如果 Clearbit 没有，使用备用方案
        setForm({ ...form, icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128` });
      }
    } catch {
      setError('获取图标失败，请手动输入图标 URL');
    } finally {
      setFetchingIcon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const method = tool ? 'PUT' : 'POST';
      const url = tool ? `/api/tools/${tool.id}` : '/api/tools';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '保存失败');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('保存失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">
          {tool ? '编辑工具' : '添加工具'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="工具名称"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="如：ChatGPT"
              required
            />

            <Input
              label="工具链接"
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://chat.openai.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              图标 URL（可选）
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="url"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="https://example.com/icon.png"
                />
              </div>
              <button
                type="button"
                onClick={autoFetchIcon}
                disabled={fetchingIcon || !form.url}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {fetchingIcon ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    获取中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    自动获取
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              输入链接后点击"自动获取"按钮，系统会从网站获取图标
            </p>

            {/* 图标预览 */}
            {form.icon && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={form.icon}
                    alt="图标预览"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI2IiBmaWxsPSIjZmZmIiBzdHJva2U9IiNjY2MiLz48dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkkoLyk8L3RleHQ+PC9zdmc+';
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">图标预览</p>
                  <p className="text-xs text-slate-500 truncate max-w-48">{form.icon}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="分类"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as CategoryValue })
              }
              options={CATEGORIES.map((c) => ({
                value: c.value,
                label: c.label,
              }))}
            />

            <Select
              label="收费模式"
              value={form.pricing}
              onChange={(e) =>
                setForm({ ...form, pricing: e.target.value as PricingType })
              }
              options={[
                { value: 'free', label: '免费' },
                { value: 'paid', label: '付费' },
                { value: 'freemium', label: '免费/付费' },
              ]}
            />
          </div>

          <Textarea
            label="工具描述（可选）"
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="简要介绍这个工具的功能和特点..."
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              {tool ? '保存修改' : '添加工具'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
