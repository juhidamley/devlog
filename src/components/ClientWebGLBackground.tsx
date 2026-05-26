"use client";

import dynamic from "next/dynamic";

const WebGLBackground = dynamic(
  () => import("@/components/WebGLBackground").then((m) => m.WebGLBackground),
  { ssr: false }
);

export function ClientWebGLBackground() {
  return <WebGLBackground />;
}
