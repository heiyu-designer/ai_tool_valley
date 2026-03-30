'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/Button';
import { Tool } from '@/types';
import { Plus, Package, ArrowLeft } from 'lucide-react';

export default function ManagePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchTools();
  }, [session, router]);

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools');
      const data = await res.json();
      setTools(data);
    } catch (error) {
      console.error('获取工具失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个工具吗？')) {
      return;
    }

    setDeleting(id);

    try {
      const res = await fetch(`/api/tools/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTools(tools.filter((t) => t.id !== id));
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除工具失败:', error);
      alert('删除失败');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (tool: Tool) => {
    router.push(`/manage/edit/${tool.id}`);
  };

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
        <Link href="/manage/add">
          <Button>
            <Plus className="w-4 h-4 mr-1" />
            添加工具
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">工具管理</h1>
        <p className="text-slate-500 mt-1">管理您的 AI 工具集合</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-200" />
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">暂无工具</h3>
          <p className="text-slate-500 mb-6">点击右上角「添加工具」开始添加</p>
          <Link href="/manage/add">
            <Button>
              <Plus className="w-4 h-4 mr-1" />
              添加工具
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isLoggedIn={true}
              showActions
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
