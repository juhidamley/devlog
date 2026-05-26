"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { TransitionContext, type SelectedPost, type SelectedProject } from "@/context/TransitionContext";
import { CustomCursor } from "@/components/CustomCursor";

// ── Shared window overlay chrome ──────────────────────────────────────────────

function OverlayTitleBar({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div
      className="flex items-center justify-between px-4 border-b-2 border-ink bg-canvas shrink-0"
      style={{ height: 48 }}
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink opacity-40">●  ●  ●</span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink truncate max-w-[50vw]">
          {title}
        </span>
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="font-mono text-sm text-ink border-2 border-ink w-7 h-7 flex items-center justify-center hover:bg-ink hover:text-canvas transition-colors shrink-0"
        style={{ lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}

// ── Post overlay ──────────────────────────────────────────────────────────────

function PostOverlay({ selected, onClose }: { selected: SelectedPost; onClose: () => void }) {
  const { post } = selected;

  return (
    <motion.div
      layoutId={`post-block-${post.id}`}
      className="fixed inset-0 z-[200] flex flex-col bg-canvas border-2 border-ink overflow-hidden"
      transition={{ type: "spring", damping: 38, stiffness: 380 }}
    >
      <OverlayTitleBar title={post.title} onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-8 py-10 md:px-16 md:py-14">
        {/* meta */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink opacity-50 mb-4"
        >
          {post.project.title}
        </motion.p>

        {/* title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.14 } }}
          className="font-serif font-bold text-ink text-4xl md:text-6xl leading-none tracking-tight mb-10"
        >
          {post.title}
        </motion.h1>

        {/* content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="prose max-w-2xl text-ink [&_*]:text-ink [&_a]:text-ink [&_code]:bg-ink/5 [&_pre]:bg-ink/5 [&_blockquote]:border-ink"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* date */}
        <motion.time
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.28 } }}
          dateTime={post.createdAt.toISOString()}
          className="block mt-16 font-mono text-[9px] uppercase tracking-widest text-ink opacity-40"
        >
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </motion.time>
      </div>
    </motion.div>
  );
}

// ── Project overlay ───────────────────────────────────────────────────────────

function ProjectOverlay({ selected, onClose }: { selected: SelectedProject; onClose: () => void }) {
  const { project } = selected;

  return (
    <motion.div
      layoutId={`project-block-${project.id}`}
      className="fixed inset-0 z-[200] flex flex-col bg-canvas border-2 border-ink overflow-hidden"
      transition={{ type: "spring", damping: 38, stiffness: 380 }}
    >
      <OverlayTitleBar title={project.title} onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-8 py-10 md:px-16 md:py-14">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.12 } }}
          className="font-serif font-bold text-ink text-4xl md:text-7xl leading-none tracking-tight mb-4"
        >
          {project.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.18 } }}
          className="font-mono text-sm text-ink opacity-50 mb-14 max-w-lg"
        >
          {project.description}
        </motion.p>

        {/* post list */}
        <motion.ol
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.22 } }}
          className="space-y-0 max-w-2xl"
        >
          {project.posts
            .filter((p) => p.isPublished)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((post, i) => (
              <li key={post.id} className="border-t-2 border-ink/10">
                <Link
                  href={`/posts/${post.slug}`}
                  onClick={onClose}
                  className="flex gap-6 py-5 hover:bg-ink/5 transition-colors group"
                >
                  <span className="font-mono text-[9px] pt-1 text-ink opacity-40 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-ink text-lg leading-tight group-hover:underline">
                      {post.title}
                    </p>
                    <time className="font-mono text-[9px] text-ink opacity-40" dateTime={new Date(post.createdAt).toISOString()}>
                      {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </time>
                  </div>
                  <span className="font-mono text-[9px] text-ink opacity-30 ml-auto pt-1 shrink-0">→</span>
                </Link>
              </li>
            ))}
        </motion.ol>
      </div>
    </motion.div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export function AnimationShell({ children }: { children: React.ReactNode }) {
  const [selectedPost, setSelectedPost] = useState<SelectedPost | null>(null);
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setSelectedPost(null);
    setSelectedProject(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = selectedPost || selectedProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedPost, selectedProject]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPost(null);
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        selectedPost,
        selectPost: setSelectedPost,
        selectedProject,
        selectProject: setSelectedProject,
      }}
    >
      {children}

      <CustomCursor />

      <AnimatePresence>
        {selectedPost && (
          <PostOverlay key="post-overlay" selected={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
        {selectedProject && (
          <ProjectOverlay key="project-overlay" selected={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
