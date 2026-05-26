import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/PostForm";

export default async function NewPostPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true },
  });

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
        <span className="text-xs font-mono text-gray-600">New Post</span>
      </div>

      <h1 className="text-2xl font-mono font-bold mb-8">New Post</h1>

      <PostForm projects={projects} />
    </main>
  );
}
