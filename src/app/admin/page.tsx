import Link from "next/link";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NewProjectForm } from "@/components/NewProjectForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProject, deletePost } from "@/app/admin/actions";

export default async function AdminPage() {
  const [posts, projects] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: true },
    }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <main className="max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-ink pb-4">
        <h1 className="font-mono text-sm uppercase tracking-widest text-ink">
          Dashboard
        </h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="font-mono text-[9px] uppercase tracking-widest text-ink opacity-50 hover:opacity-100 transition-opacity"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* ── Projects ──────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[9px] uppercase tracking-widest text-ink opacity-50">
            Projects ({projects.length})
          </h2>
          <NewProjectForm />
        </div>

        {projects.length === 0 ? (
          <p className="font-mono text-[10px] text-ink opacity-30">No projects yet.</p>
        ) : (
          <table className="w-full text-left border-collapse border-2 border-ink">
            <thead>
              <tr className="border-b-2 border-ink bg-ink/5">
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink">Title</th>
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink">Slug</th>
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink">Posts</th>
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-ink/20 hover:bg-ink/5 transition-colors">
                  <td className="px-3 py-3 font-mono text-sm text-ink">{project.title}</td>
                  <td className="px-3 py-3 font-mono text-[10px] text-ink opacity-50">{project.slug}</td>
                  <td className="px-3 py-3 font-mono text-[10px] text-ink">{project._count.posts}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="font-mono text-[9px] uppercase tracking-widest text-ink border-2 border-ink px-2 py-1 hover:bg-ink hover:text-canvas transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        confirmMessage={`Delete "${project.title}" and all its posts? This cannot be undone.`}
                        action={async () => {
                          "use server";
                          await deleteProject(project.id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ── Posts ─────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[9px] uppercase tracking-widest text-ink opacity-50">
            Posts ({posts.length})
          </h2>
          <Link
            href="/admin/posts/new"
            className="font-mono text-[9px] uppercase tracking-widest text-ink border-2 border-ink px-3 py-1.5 hover:bg-ink hover:text-canvas transition-colors"
          >
            + New post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="font-mono text-[10px] text-ink opacity-30">No posts yet.</p>
        ) : (
          <table className="w-full text-left border-collapse border-2 border-ink">
            <thead>
              <tr className="border-b-2 border-ink bg-ink/5">
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink">Title</th>
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink">Project</th>
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink">Status</th>
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink">Created</th>
                <th className="px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-ink/20 hover:bg-ink/5 transition-colors">
                  <td className="px-3 py-3 font-mono text-sm text-ink">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-3 py-3 font-mono text-[10px] text-ink opacity-70">{post.project.title}</td>
                  <td className="px-3 py-3">
                    <span className={`font-mono text-[9px] uppercase tracking-widest ${post.isPublished ? "text-ink" : "text-ink opacity-30"}`}>
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-[9px] text-ink opacity-40">
                    {post.createdAt.toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="font-mono text-[9px] uppercase tracking-widest text-ink border-2 border-ink px-2 py-1 hover:bg-ink hover:text-canvas transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        confirmMessage={`Delete "${post.title}"? This cannot be undone.`}
                        action={async () => {
                          "use server";
                          await deletePost(post.id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
