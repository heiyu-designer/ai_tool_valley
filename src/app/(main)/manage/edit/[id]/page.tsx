import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ToolForm } from '@/components/ToolForm';

interface EditToolPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditToolPage({ params }: EditToolPageProps) {
  const { id } = await params;
  const toolId = parseInt(id);

  if (isNaN(toolId)) {
    notFound();
  }

  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
  });

  if (!tool) {
    notFound();
  }

  return <ToolForm tool={tool} />;
}
