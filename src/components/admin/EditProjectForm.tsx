"use client";

import { useTransition } from "react";
import { updateProject } from "@/app/admin/actions";

type Project = {
  id: string;
  title: string;
  description: string;
  _count: { posts: number };
};

export function EditProjectForm({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() =>
      updateProject(project.id, {
        title: fd.get("title") as string,
        description: fd.get("description") as string,
      })
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-ink">
        <label className="block border-b-2 border-ink px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink opacity-50">
          Title
        </label>
        <input
          name="title"
          defaultValue={project.title}
          required
          className="w-full px-3 py-3 bg-canvas text-ink font-mono text-sm outline-none"
          placeholder="Project title"
        />
      </div>

      <div className="border-2 border-ink">
        <label className="block border-b-2 border-ink px-3 py-2 font-mono text-[9px] uppercase tracking-widest text-ink opacity-50">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={project.description}
          required
          rows={4}
          className="w-full px-3 py-3 bg-canvas text-ink font-mono text-sm outline-none resize-none"
          placeholder="Short description"
        />
      </div>

      <p className="font-mono text-[9px] text-ink opacity-40 uppercase tracking-widest">
        {project._count.posts} post{project._count.posts !== 1 ? "s" : ""} in this project
      </p>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="font-mono text-[10px] uppercase tracking-widest text-canvas bg-ink px-4 py-2 border-2 border-ink hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
        <a
          href="/admin"
          className="font-mono text-[10px] uppercase tracking-widest text-ink px-4 py-2 border-2 border-ink hover:bg-ink hover:text-canvas transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
