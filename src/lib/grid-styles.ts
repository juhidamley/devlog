// Kept for the AnimationShell overlay — single window style.
export type BlockStyle = {
  bg: string;
  text: string;
  colSpan: string;
  minH: string;
  titleSize: string;
  metaOpacity: string;
  ghost: string;
};

const WINDOW_STYLE: BlockStyle = {
  bg: "bg-canvas",
  text: "text-ink",
  colSpan: "col-span-12",
  minH: "min-h-screen",
  titleSize: "text-5xl md:text-7xl",
  metaOpacity: "opacity-50",
  ghost: "text-ink/5",
};

// Both arrays point to the same window-theme style
export const POST_BLOCK_STYLES: BlockStyle[] = [WINDOW_STYLE];
export const PROJECT_BLOCK_STYLES: BlockStyle[] = [WINDOW_STYLE];

// CSS fill patterns for window preview areas — uses --ink CSS var so dark mode works
export const PREVIEW_PATTERNS: { bg: string; size?: string }[] = [
  {
    bg: "repeating-linear-gradient(45deg,transparent 0px,transparent 8px,rgb(var(--ink) / .07) 8px,rgb(var(--ink) / .07) 9px)",
  },
  {
    bg: "repeating-linear-gradient(0deg,transparent 0px,transparent 12px,rgb(var(--ink) / .07) 12px,rgb(var(--ink) / .07) 13px)",
  },
  {
    bg: "radial-gradient(circle,rgb(var(--ink) / .2) 1.5px,transparent 1.5px)",
    size: "10px 10px",
  },
  {
    bg: "repeating-linear-gradient(90deg,transparent 0px,transparent 8px,rgb(var(--ink) / .07) 8px,rgb(var(--ink) / .07) 9px)",
  },
  {
    bg: "repeating-linear-gradient(-45deg,transparent 0px,transparent 8px,rgb(var(--ink) / .07) 8px,rgb(var(--ink) / .07) 9px)",
  },
  {
    bg: "repeating-conic-gradient(rgb(var(--ink) / .06) 0%,rgb(var(--ink) / .06) 25%,transparent 0%,transparent 50%)",
    size: "12px 12px",
  },
  {
    bg: "repeating-linear-gradient(0deg,rgb(var(--ink) / .04) 0,rgb(var(--ink) / .04) 1px,transparent 1px,transparent 8px),repeating-linear-gradient(90deg,rgb(var(--ink) / .04) 0,rgb(var(--ink) / .04) 1px,transparent 1px,transparent 8px)",
    size: "8px 8px",
  },
  {
    bg: "radial-gradient(ellipse at 50% 50%,rgb(var(--ink) / .14) 0%,transparent 70%)",
  },
];
