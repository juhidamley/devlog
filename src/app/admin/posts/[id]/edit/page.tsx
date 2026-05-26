import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/PostForm";

type Params = Promise<{ id: string }>;

export default async function EditPostPage({ params }: { params: Params }) {
  const { id } = await params;

  const [post, projects] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!post) notFound();

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin"
          className="text-xs font-mono text-gray-400 hover:text-black transition-colors"
        >
          ← Dashboard
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-xs font-mono text-gray-600">Edit Post</span>
      </div>

      <h1 className="text-2xl font-mono font-bold mb-8">Edit Post</h1>

      <PostForm
        projects={projects}
        initialData={{
          id: post.id,
          title: post.title,
          projectId: post.projectId,
          content: post.content,
          isPublished: post.isPublished,
        }}
      />
    </main>
  );
}
