import { prisma } from "@/lib/prisma";
import { PostGrid } from "@/components/PostGrid";
import type { PostWithProject } from "@/types/data";
import { processLatexInHtml } from "@/lib/latex";

export default async function HomePage() {
  const raw = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { id: true, title: true, slug: true } } },
  });

  // Serialize Date objects for the client component
  const posts: PostWithProject[] = raw.map((p) => ({
    ...p,
    content: processLatexInHtml(p.content),
    createdAt: p.createdAt,
    project: p.project,
  }));

  return <PostGrid posts={posts} />;
}
