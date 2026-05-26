"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Pixel-art heart — 7×6 grid at 3× (21×18 px)
// Hotspot: top-centre at grid (3.5, 0) → offset rawX by -10
function HeartSVG({ clicking }: { clicking: boolean }) {
  return (
    <svg
      width="21"
      height="18"
      viewBox="0 0 7 6"
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
        filter:
          "drop-shadow(0 1px 0px #c0006a) drop-shadow(0 0 5px rgba(255,105,180,.45))",
        transition: "transform 80ms",
        transform: clicking ? "scale(1.4)" : "scale(1)",
        transformOrigin: "50% 40%",
      }}
    >
      <g fill="#FF69B4">
        {/* Row 0 — two bumps */}
        <rect x="1" y="0" width="2" height="1" />
        <rect x="4" y="0" width="2" height="1" />
        {/* Rows 1-2 — full width */}
        <rect x="0" y="1" width="7" height="2" />
        {/* Row 3 */}
        <rect x="1" y="3" width="5" height="1" />
        {/* Row 4 */}
        <rect x="2" y="4" width="3" height="1" />
        {/* Row 5 — tip */}
        <rect x="3" y="5" width="1" height="1" />
      </g>
    </svg>
  );
}

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const x = useSpring(rawX, { damping: 28, stiffness: 400 });
  const y = useSpring(rawY, { damping: 28, stiffness: 400 });

  const isAutoPilot = useRef(false);
  const isPilotRunning = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    async function runAutoPilot() {
      if (isPilotRunning.current) return;
      isPilotRunning.current = true;

      while (isAutoPilot.current) {
        const blocks = Array.from(
          document.querySelectorAll<HTMLElement>("[data-post-block],[data-project-block]")
        ).filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
        });

        if (!blocks.length) break;

        const target = blocks[Math.floor(Math.random() * blocks.length)];
        const rect = target.getBoundingClientRect();

        rawX.set(rect.left + rect.width * 0.5 - 10);
        rawY.set(rect.top + rect.height * 0.5);

        await sleep(750);
        if (!isAutoPilot.current) break;

        setClicking(true);
        await sleep(180);
        target.click();
        setClicking(false);

        await sleep(3600);
        if (!isAutoPilot.current) break;

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await sleep(900);
        if (!isAutoPilot.current) break;
        await sleep(500);
      }

      isPilotRunning.current = false;
    }

    function resetIdle() {
      isAutoPilot.current = false;
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        isAutoPilot.current = true;
        runAutoPilot();
      }, 4000);
    }

    function onMove(e: MouseEvent) {
      rawX.set(e.clientX - 10); // centre the heart on the cursor horizontally
      rawY.set(e.clientY);
      setVisible(true);
      resetIdle();
    }
    function onDown() { setClicking(true); }
    function onUp()   { setClicking(false); }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    resetIdle();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      clearTimeout(idleTimer.current);
      isAutoPilot.current = false;
    };
  }, [rawX, rawY]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y, position: "fixed", top: 0, left: 0, zIndex: 9999, pointerEvents: "none" }}
    >
      <HeartSVG clicking={clicking} />
    </motion.div>
  );
}
