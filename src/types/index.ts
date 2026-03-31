export const CATEGORIES = [
  { value: 'chat', label: 'AI 对话', color: '#3b82f6', bg: 'bg-blue-500/10' },
  { value: 'creation', label: 'AI 创作', color: '#8b5cf6', bg: 'bg-purple-500/10' },
  { value: 'coding', label: '编程开发', color: '#10b981', bg: 'bg-emerald-500/10' },
  { value: 'design', label: '设计创意', color: '#ec4899', bg: 'bg-pink-500/10' },
  { value: 'learning', label: '学习研究', color: '#f97316', bg: 'bg-orange-500/10' },
  { value: 'marketing', label: '营销效率', color: '#06b6d4', bg: 'bg-cyan-500/10' },
] as const;

export type CategoryValue = typeof CATEGORIES[number]['value'];

export type PricingType = 'free' | 'paid' | 'freemium';

export interface Tool {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  category: string;
  description: string | null;
  pricing: string;
  featured: boolean;
  createdAt: Date;
}

export interface CreateToolInput {
  name: string;
  url: string;
  icon?: string;
  category: CategoryValue;
  description?: string;
  pricing: PricingType;
  featured?: boolean;
}

export interface UpdateToolInput extends Partial<CreateToolInput> {
  id: number;
}
