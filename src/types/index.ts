export const CATEGORIES = [
  { value: 'productivity', label: '办公提效' },
  { value: 'coding', label: '代码编程' },
  { value: 'content', label: '自媒体' },
  { value: 'chat', label: 'AI聊天' },
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
  createdAt: Date;
}

export interface CreateToolInput {
  name: string;
  url: string;
  icon?: string;
  category: CategoryValue;
  description?: string;
  pricing: PricingType;
}

export interface UpdateToolInput extends Partial<CreateToolInput> {
  id: number;
}
