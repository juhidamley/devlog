import { prisma } from "@/lib/prisma";
import { ProjectGrid } from "@/components/ProjectGrid";
import type { ProjectWithPosts } from "@/types/data";

export default async function ProjectsPage() {
  const raw = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      posts: {
        where: { isPublished: true },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          isPublished: true,
          createdAt: true,
        },
      },
    },
  });

  const projects: ProjectWithPosts[] = raw.map((p) => ({
    ...p,
    createdAt: p.createdAt,
    posts: p.posts,
  }));

  return <ProjectGrid projects={projects} />;
}
