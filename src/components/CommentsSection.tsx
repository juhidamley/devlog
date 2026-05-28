"use client";

import { useEffect, useRef, useState, useTransition } from "react";

type Comment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
};

export function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [postId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Name is required."); return; }
    if (!body.trim()) { setError("Comment is required."); return; }

    startTransition(async () => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, name, body }),
      });
      if (!res.ok) {
        setError("Failed to post comment.");
        return;
      }
      const created: Comment = await res.json();
      setComments((prev) => [...prev, created]);
      setName("");
      setBody("");
    });
  };

  return (
    <div className="border-t-2 border-ink mt-2">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-ink">
        <span className="font-mono text-[8px] text-ink opacity-40">◆</span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink">
          Comments ({comments.length})
        </span>
      </div>

      {/* Comment list */}
      {comments.length > 0 && (
        <div className="divide-y-2 divide-ink">
          {comments.map((c) => (
            <div key={c.id} className="px-4 py-5">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink font-bold">
                  {c.name}
                </span>
                <time
                  dateTime={c.createdAt}
                  className="font-mono text-[8px] uppercase tracking-widest text-ink opacity-30"
                >
                  {new Date(c.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className="font-mono text-xs text-ink leading-relaxed whitespace-pre-wrap">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={submit}
        className="border-t-2 border-ink px-4 py-5 flex flex-col gap-3"
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-ink opacity-50">
          Leave a comment
        </span>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="bg-canvas border-2 border-ink px-3 py-2 font-mono text-xs text-ink placeholder:text-ink placeholder:opacity-30 focus:outline-none w-full"
        />

        <textarea
          placeholder="Your comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={2000}
          className="bg-canvas border-2 border-ink px-3 py-2 font-mono text-xs text-ink placeholder:text-ink placeholder:opacity-30 focus:outline-none resize-none w-full"
        />

        {error && (
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink opacity-60">
            ⚠ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="self-start font-mono text-[9px] uppercase tracking-widest border-2 border-ink px-4 py-2 text-ink hover:bg-ink hover:text-canvas transition-colors disabled:opacity-40"
        >
          {isPending ? "Posting…" : "Post"}
        </button>
      </form>
    </div>
  );
}
