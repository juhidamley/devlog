"use client";

import { useTransition } from "react";

export function DeleteButton({
  label,
  confirmMessage,
  action,
}: {
  label?: string;
  confirmMessage: string;
  action: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(confirmMessage)) return;
    startTransition(() => action());
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="font-mono text-[9px] uppercase tracking-widest text-ink border-2 border-ink px-2 py-1 hover:bg-ink hover:text-canvas transition-colors disabled:opacity-40"
      style={{ borderRadius: 0 }}
    >
      {isPending ? "…" : (label ?? "Delete")}
    </button>
  );
}
