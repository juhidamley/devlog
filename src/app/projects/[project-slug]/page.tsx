import { notFound } from "next/navigation";
import { getProjectWithPosts } from "@/lib/mock-data";

// Swap with Prisma:
// import { prisma } from "@/lib/prisma"
// const project = await prisma.project.findUnique({
//   where: { slug },
//   include: { posts: { where: { isPublished: true }, orderBy: { createdAt: "asc" } } },
// })

type Params = Promise<{ "project-slug": string }>;

export default async function ProjectPage({ params }: { params: Params }) {
  const { "project-slug": slug } = await params;
  const project = getProjectWithPosts(slug);

  if (!project) notFound();

  return (
    <main className="px-6 py-12 max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-mono font-bold">{project.title}</h1>
        <p className="mt-2 text-gray-600">{project.description}</p>
      </header>

      <section>
        <h2 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-4">
          Posts
        </h2>
        {project.posts.length === 0 ? (
          <p className="text-gray-500 text-sm">No published posts yet.</p>
        ) : (
          <ol className="space-y-6">
            {project.posts.map((post, index) => (
              <li key={post.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-mono text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{post.content}</p>
                    <time
                      className="mt-1 block text-xs font-mono text-gray-400"
                      dateTime={post.createdAt.toISOString()}
                    >
                      {post.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
