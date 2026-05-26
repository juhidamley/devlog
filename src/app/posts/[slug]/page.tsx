import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ slug: string }>;

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, isPublished: true },
    include: { project: { select: { id: true, title: true, slug: true } } },
  });

  if (!post) notFound();

  return (
    <div className="pt-[48px] pb-[36px] min-h-screen bg-canvas">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Window chrome */}
        <div className="border-2 border-ink">

          {/* Title bar */}
          <div
            className="flex items-center justify-between pl-3 pr-1 border-b-2 border-ink bg-canvas"
            style={{ height: 48 }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-[8px] text-ink opacity-40 shrink-0">◆</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink truncate">
                {post.title}
              </span>
            </div>
            <Link
              href="/"
              aria-label="Back to posts"
              className="font-mono text-sm text-ink border-2 border-ink w-8 h-[44px] flex items-center justify-center hover:bg-ink hover:text-canvas transition-colors shrink-0 ml-2"
              style={{ lineHeight: 1 }}
            >
              ×
            </Link>
          </div>

          {/* Content */}
          <div className="px-8 py-10 bg-canvas">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink opacity-50 mb-5">
              {post.project.title}
            </p>

            <h1 className="font-serif font-bold text-ink text-4xl md:text-5xl leading-none tracking-tight mb-10">
              {post.title}
            </h1>

            <div
              className="prose max-w-none text-ink [&_*]:text-ink [&_a]:text-ink [&_a]:underline [&_code]:bg-ink/5 [&_code]:px-1 [&_pre]:bg-ink/5 [&_pre]:p-4 [&_blockquote]:border-l-2 [&_blockquote]:border-ink [&_blockquote]:pl-4 font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <time
              dateTime={post.createdAt.toISOString()}
              className="block mt-14 font-mono text-[9px] uppercase tracking-widest text-ink opacity-30"
            >
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </time>
          </div>

          {/* Footer bar */}
          <div className="border-t-2 border-ink px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="font-mono text-[9px] uppercase tracking-widest text-ink opacity-50 hover:opacity-100 transition-opacity"
            >
              ← all posts
            </Link>
            <Link
              href={`/projects`}
              className="font-mono text-[9px] uppercase tracking-widest text-ink opacity-50 hover:opacity-100 transition-opacity"
            >
              {post.project.title} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
