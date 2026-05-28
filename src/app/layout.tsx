import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono } from "next/font/google";
import { AnimationShell } from "@/components/AnimationShell";
import "./globals.css";
import "katex/dist/katex.min.css";

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "devlog.juhi.studio",
  description: "A dev journal.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmMono.variable} bg-canvas`}>
      <body className="min-h-screen text-ink antialiased bg-canvas">

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 border-b-2 border-ink bg-canvas"
          style={{ height: 48 }}
        >
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink font-bold">
            juhi.devlog
          </Link>
          <div className="flex items-center gap-0 divide-x-2 divide-ink border-l-2 border-ink">
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-widest text-ink px-4 py-3 hover:bg-ink hover:text-canvas transition-colors"
            >
              Posts
            </Link>
            <Link
              href="/projects"
              className="font-mono text-[10px] uppercase tracking-widest text-ink px-4 py-3 hover:bg-ink hover:text-canvas transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/admin"
              className="font-mono text-[10px] uppercase tracking-widest text-ink px-4 py-3 hover:bg-ink hover:text-canvas transition-colors opacity-40 hover:opacity-100"
            >
              Admin
            </Link>
          </div>
        </nav>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <AnimationShell>{children}</AnimationShell>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-5 border-t-2 border-ink bg-canvas"
          style={{ height: 36 }}
        >
          <a
            href="https://juhi.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink opacity-70 hover:opacity-100 transition-opacity"
          >
            juhi.studio
          </a>
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-ink opacity-70">
            <span>Juhi Damley</span>
            <span className="opacity-40">|</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </footer>

      </body>
    </html>
  );
}
