import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  return (
    <div className="min-h-screen bg-canvas pt-[48px] pb-[36px]">
      {/* Admin sub-nav */}
      <div className="border-b-2 border-ink flex items-center justify-between px-6 py-3 bg-canvas">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink opacity-50">
          admin / {session.user?.email}
        </span>
        <div className="flex items-center gap-0 divide-x divide-ink/30 border-l border-ink/30">
          <Link
            href="/admin"
            className="font-mono text-[9px] uppercase tracking-widest text-ink px-4 py-2 hover:bg-ink hover:text-canvas transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/posts/new"
            className="font-mono text-[9px] uppercase tracking-widest text-ink px-4 py-2 hover:bg-ink hover:text-canvas transition-colors"
          >
            + New post
          </Link>
          <Link
            href="/"
            className="font-mono text-[9px] uppercase tracking-widest text-ink px-4 py-2 hover:bg-ink hover:text-canvas transition-colors opacity-50"
          >
            ← Site
          </Link>
        </div>
      </div>

      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
