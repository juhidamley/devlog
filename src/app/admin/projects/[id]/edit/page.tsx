import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditProjectForm } from "@/components/admin/EditProjectForm";

type Params = Promise<{ id: string }>;

export default async function EditProjectPage({ params }: { params: Params }) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { _count: { select: { posts: true } } },
  });

  if (!project) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="font-mono text-sm uppercase tracking-widest text-ink mb-6">
        Edit project
      </h1>
      <EditProjectForm project={project} />
    </div>
  );
}
