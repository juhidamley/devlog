"use client";

import { useRef, useState, useCallback, useEffect, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { PREVIEW_PATTERNS } from "@/lib/grid-styles";
import type { PostWithProject } from "@/types/data";

// ── Shared layout constants ───────────────────────────────────────────────────

const NAV_H    = 48;
const FOOTER_H = 36;
const CARD_W   = 264;
const CARD_H   = 252;
const PAD      = 24;
const SNAP     = 16;

// ── Mobile grid canvas (grid-snapped, scrollable, non-draggable) ──────────────

const MOBILE_SNAP = 16;
const MOBILE_PAD  = 16; // multiple of MOBILE_SNAP — cards land on grid lines

function PostMobileGrid({ posts }: { posts: PostWithProject[] }) {
  const router = useRouter();

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink opacity-30">
          No posts yet.
        </p>
      </div>
    );
  }

  // PAD and GAP are multiples of MOBILE_SNAP (16px) so cards sit on grid lines
  return (
    <div
      className="flex flex-col"
      style={{ padding: MOBILE_PAD, gap: MOBILE_SNAP * 3 /* 48px */ }}
    >
      {posts.map((post, index) => {
        const pattern = PREVIEW_PATTERNS[index % PREVIEW_PATTERNS.length];

        return (
          <motion.div
            key={post.id}
            layoutId={`post-block-${post.id}`}
            onClick={() => router.push(`/posts/${post.slug}`)}
            className="relative w-full"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.04 }}
          >
            {/* Bounding-box handles */}
            <span className="bb-handle" style={{ top: -4, left: -4 }} />
            <span className="bb-handle" style={{ top: -4, right: -4 }} />
            <span className="bb-handle" style={{ bottom: -4, left: -4 }} />
            <span className="bb-handle" style={{ bottom: -4, right: -4 }} />

            <div className="border-2 border-ink bg-canvas">
              {/* Title bar */}
              <div
                className="flex items-center gap-1.5 pl-2 pr-2 border-b-2 border-ink bg-canvas"
                style={{ height: 32 }}
              >
                <span className="font-mono text-[8px] text-ink opacity-40 shrink-0">◆</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink truncate">
                  {post.title}
                </span>
              </div>

              {/* Preview area */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: 144,
                  background: pattern.bg,
                  backgroundSize: pattern.size ?? "auto",
                }}
              >
                <span
                  className="absolute bottom-2.5 left-2.5 bg-ink text-canvas font-mono text-[8px] uppercase tracking-[0.15em] px-2.5 py-1"
                  style={{ borderRadius: 9999 }}
                >
                  {post.project.title}
                </span>
              </div>

              {/* Info area */}
              <div className="border-t-2 border-ink px-3 py-3">
                <h2 className="font-serif font-bold text-ink text-sm leading-tight mb-1.5">
                  {post.title}
                </h2>
                <time className="font-mono text-[8px] uppercase tracking-widest text-ink opacity-40">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function snapGrid(v: number) {
  return Math.round(v / SNAP) * SNAP;
}

// ── Single window card ────────────────────────────────────────────────────────

function PostWindowCard({
  post,
  index,
  zIndex,
  hidden,
  onRaise,
  onClose,
  onOpen,
}: {
  post: PostWithProject;
  index: number;
  zIndex: number;
  hidden: boolean;
  onRaise: () => void;
  onClose: () => void;
  onOpen: () => void;
}) {
  const dragControls = useDragControls();
  const dragging = useRef(false);
  // Start at 0,0 — position is set in useEffect before reveal
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [visible, setVisible] = useState(false);
  const pattern = PREVIEW_PATTERNS[index % PREVIEW_PATTERNS.length];

  // Place card at a random spot on the canvas before first paint
  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight - NAV_H - FOOTER_H;
    x.set(snapGrid(PAD + Math.random() * Math.max(50, W - CARD_W - PAD * 2)));
    y.set(snapGrid(PAD + Math.random() * Math.max(50, H - CARD_H - PAD * 2)));
    setVisible(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden) return null;

  return (
    <motion.div
      layoutId={`post-block-${post.id}`}
      data-post-block
      data-post-id={post.id}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => { dragging.current = true; }}
      onDragEnd={() => {
        x.set(snapGrid(x.get()));
        y.set(snapGrid(y.get()));
        setTimeout(() => { dragging.current = false; }, 40);
      }}
      onPointerDown={onRaise}
      onClick={() => { if (!dragging.current) onOpen(); }}
      className="absolute"
      style={{ x, y, zIndex, width: CARD_W, touchAction: "none" }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.04 }}
    >
      {/* Bounding-box handles */}
      <span className="bb-handle" style={{ top: -4, left: -4 }} />
      <span className="bb-handle" style={{ top: -4, right: -4 }} />
      <span className="bb-handle" style={{ bottom: -4, left: -4 }} />
      <span className="bb-handle" style={{ bottom: -4, right: -4 }} />

      <div className="border-2 border-ink bg-canvas" style={{ borderRadius: 0 }}>

        {/* ── Title bar ── */}
        <div
          className="flex items-center justify-between pl-2 pr-1 border-b-2 border-ink bg-canvas"
          style={{ height: 32, touchAction: "none" }}
          onPointerDown={(e) => {
            e.preventDefault();
            onRaise();
            dragControls.start(e);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono text-[8px] text-ink opacity-40 shrink-0">◆</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink truncate">
              {post.title}
            </span>
          </div>
          <button
            className="font-mono text-xs text-ink border-2 border-ink w-[22px] h-[22px] flex items-center justify-center hover:bg-ink hover:text-canvas transition-colors shrink-0 ml-1"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{ borderRadius: 0, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* ── Preview area ── */}
        <div
          className="relative overflow-hidden"
          style={{
            height: 144,
            background: pattern.bg,
            backgroundSize: pattern.size ?? "auto",
          }}
        >
          <span
            className="absolute bottom-2.5 left-2.5 bg-ink text-canvas font-mono text-[8px] uppercase tracking-[0.15em] px-2.5 py-1"
            style={{ borderRadius: 9999 }}
          >
            {post.project.title}
          </span>
        </div>

        {/* ── Info area ── */}
        <div className="border-t-2 border-ink px-3 py-3">
          <h2 className="font-serif font-bold text-ink text-sm leading-tight mb-1.5 line-clamp-2">
            {post.title}
          </h2>
          <time className="font-mono text-[8px] uppercase tracking-widest text-ink opacity-40">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            })}
          </time>
        </div>
      </div>
    </motion.div>
  );
}

const GRAPH_PAPER = {
  backgroundImage: `
    linear-gradient(rgb(var(--ink) / .12) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--ink) / .12) 1px, transparent 1px),
    linear-gradient(rgb(var(--ink) / .05) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--ink) / .05) 1px, transparent 1px)
  `,
  backgroundSize: "80px 80px, 80px 80px, 16px 16px, 16px 16px",
} satisfies CSSProperties;

// ── Canvas ────────────────────────────────────────────────────────────────────

export function PostGrid({ posts }: { posts: PostWithProject[] }) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [zMap, setZMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const raise = useCallback((id: string) => {
    setZMap((prev) => {
      const max = Math.max(...Object.values(prev), 10);
      if ((prev[id] ?? 0) === max) return prev;
      return { ...prev, [id]: max + 1 };
    });
  }, []);

  return (
    <>
      {/* ── Mobile layout — CSS hides this at md+ ──────────────────────────── */}
      <div
        className="md:hidden fixed left-0 right-0 overflow-y-auto overflow-x-hidden bg-canvas"
        style={{ top: NAV_H, bottom: FOOTER_H }}
      >
        <div className="absolute inset-0 pointer-events-none" style={GRAPH_PAPER} />
        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink opacity-30">
              No posts yet.
            </p>
          </div>
        ) : (
          <PostMobileGrid posts={posts} />
        )}
      </div>

      {/* ── Desktop layout — CSS hides this below md ──────────────────────── */}
      <div
        className="hidden md:block fixed left-0 right-0 overflow-hidden bg-canvas"
        style={{ top: NAV_H, bottom: FOOTER_H }}
      >
        <div className="absolute inset-0 pointer-events-none" style={GRAPH_PAPER} />

        {/* Decorative ghost headline */}
        <div className="absolute pointer-events-none select-none" style={{ left: 36, top: 24 }}>
          <div className="relative border border-dashed border-ink/20 px-4 py-2">
            <span className="bb-handle" style={{ top: -4, left: -4 }} />
            <span className="bb-handle" style={{ top: -4, right: -4 }} />
            <span className="bb-handle" style={{ bottom: -4, left: -4 }} />
            <span className="bb-handle" style={{ bottom: -4, right: -4 }} />
            <span
              className="font-serif font-bold text-ink leading-none"
              style={{ fontSize: "clamp(48px, 7vw, 110px)", opacity: 0.08 }}
            >
              posts.
            </span>
          </div>
        </div>

        {posts.length === 0 ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink opacity-30">
              No posts yet.
            </p>
          </div>
        ) : isDesktop && posts.map((post, index) => (
          <PostWindowCard
            key={post.id}
            post={post}
            index={index}
            zIndex={zMap[post.id] ?? 10 + index}
            hidden={hidden.has(post.id)}
            onRaise={() => raise(post.id)}
            onClose={() => setHidden((prev) => new Set(prev).add(post.id))}
            onOpen={() => router.push(`/posts/${post.slug}`)}
          />
        ))}

        {hidden.size > 0 && (
          <button
            className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-widest text-ink border-2 border-ink px-3 py-2 bg-canvas hover:bg-ink hover:text-canvas transition-colors"
            style={{ zIndex: 9000 }}
            onClick={() => setHidden(new Set())}
          >
            Restore {hidden.size} window{hidden.size > 1 ? "s" : ""}
          </button>
        )}
      </div>
    </>
  );
}
