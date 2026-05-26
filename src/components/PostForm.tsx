"use client";

import { useState, useTransition } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { createPost, updatePost } from "@/app/admin/actions";

type Project = { id: string; title: string };

type InitialData = {
  id: string;
  title: string;
  projectId: string;
  content: string;
  isPublished: boolean;
};

type Props = {
  projects: Project[];
  initialData?: InitialData;
};

export function PostForm({ projects, initialData }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [projectId, setProjectId] = useState(
    initialData?.projectId ?? projects[0]?.id ?? ""
  );
  const [content, setContent] = useState(initialData?.content ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData?.id;

  const submit = (isPublished: boolean) => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!projectId) {
      setError("Select a project.");
      return;
    }

    setError(null);
    startTransition(async () => {
      if (isEditing) {
        await updatePost(initialData.id, { title, projectId, content, isPublished });
      } else {
        await createPost({ title, projectId, content, isPublished });
      }
    });
  };

  if (projects.length === 0) {
    return (
      <p className="font-mono text-[10px] text-ink opacity-50">
        No projects yet — create one from the dashboard before drafting a post.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project */}
      <div className="border-2 border-ink">
        <label className="block border-b-2 border-ink px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink opacity-50">
          Project
        </label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full px-3 py-3 bg-canvas text-ink font-mono text-sm outline-none"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="border-2 border-ink">
        <label className="block border-b-2 border-ink px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink opacity-50">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full px-3 py-3 bg-canvas text-ink font-mono text-sm outline-none"
        />
      </div>

      {/* Content */}
      <div className="space-y-0">
        <div className="border-b-0 border-2 border-ink border-b-0 px-3 py-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink opacity-50">Content</span>
        </div>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Start writing..."
        />
      </div>

      {/* Error */}
      {error && (
        <p className="font-mono text-[10px] text-red-600">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit(false)}
          className="font-mono text-[10px] uppercase tracking-widest text-ink px-4 py-2 border-2 border-ink hover:bg-ink hover:text-canvas disabled:opacity-40 transition-colors"
        >
          {isPending ? "Saving…" : "Save Draft"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit(true)}
          className="font-mono text-[10px] uppercase tracking-widest text-canvas bg-ink px-4 py-2 border-2 border-ink hover:opacity-80 disabled:opacity-40 transition-opacity"
        >
          {isPending ? "Publishing…" : isEditing ? "Update & Publish" : "Publish"}
        </button>
      </div>
    </div>
  );
}
