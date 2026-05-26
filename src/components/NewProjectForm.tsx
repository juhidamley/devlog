"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/app/admin/actions";

export function NewProjectForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      await createProject({ title, description });
      setTitle("");
      setDescription("");
      setOpen(false);
      router.refresh();
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-mono border border-gray-300 px-3 py-1.5 hover:bg-gray-100 transition-colors"
      >
        + New Project
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-300 p-4 bg-white space-y-3">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-500">
        New Project
      </p>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        autoFocus
        className="w-full border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:border-black"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description"
        className="w-full border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:border-black"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className="px-3 py-1.5 text-xs font-mono bg-black text-white hover:bg-gray-900 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-1.5 text-xs font-mono border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
