'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ToolCard } from '@/components/ToolCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { Tool, CategoryValue } from '@/types';
import { Package, Zap, TrendingUp, Star } from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryValue | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTools();
  }, [selectedCategory, search]);

  const fetchTools = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.set('category', selectedCategory);
      }
      if (search) {
        params.set('search', search);
      }

      const res = await fetch(`/api/tools?${params.toString()}`);
      const data = await res.json();
      setTools(data);
    } catch (error) {
      console.error('获取工具失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个工具吗？')) return;

    try {
      const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTools(tools.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('删除工具失败:', error);
    }
  };

  const handleEdit = (tool: Tool) => {
    window.location.href = `/manage/edit?id=${tool.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 顶部欢迎区域 */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">欢迎回来，{session?.user?.email?.split('@')[0]}</span>
          </div>
          <p className="text-white/80 text-lg">发现最新最优质的 AI 工具，提升你的工作效率</p>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Package, label: '收录工具', value: tools.length, color: 'indigo' },
            { icon: Star, label: '精选推荐', value: 3, color: 'amber' },
            { icon: TrendingUp, label: '本周新增', value: 2, color: 'green' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                stat.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                stat.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                'bg-green-100 text-green-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="搜索工具名称或描述..."
              />
            </div>
          </div>
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* 工具列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无工具</h3>
            <p className="text-gray-500 mb-6">
              {search
                ? '没有找到匹配的工具，请尝试其他关键词'
                : '还没有添加任何工具，快去添加第一个吧'}
            </p>
            <a
              href="/manage/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <Zap className="w-5 h-5" />
              添加工具
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isLoggedIn={!!session}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* 底部留白 */}
      <div className="h-20" />
    </div>
  );
}
