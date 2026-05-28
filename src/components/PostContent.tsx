"use client";

import { useState, useEffect } from "react";
import katex from "katex";

type Props = {
  html: string;
  className?: string;
  style?: React.CSSProperties;
};

function renderMathInHtml(html: string): string {
  const root = document.createElement("div");
  root.innerHTML = html;

  // Tiptap-serialized math nodes
  root.querySelectorAll<HTMLElement>('[data-type="inline-math"]').forEach((el) => {
    const latex = el.getAttribute("data-latex");
    if (!latex) return;
    try {
      el.innerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: false });
    } catch {}
  });

  root.querySelectorAll<HTMLElement>('[data-type="display-math"]').forEach((el) => {
    const latex = el.getAttribute("data-latex");
    if (!latex) return;
    try {
      el.innerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: true });
    } catch {}
  });

  // Raw $$...$$ / $...$ delimiters in text nodes (skip <code>/<pre>)
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      let el = node.parentElement;
      while (el) {
        if (el.tagName === "CODE" || el.tagName === "PRE") return NodeFilter.FILTER_REJECT;
        el = el.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) {
    if ((n as Text).data.includes("$")) textNodes.push(n as Text);
  }

  // $$...$$ must be matched before $...$ to avoid misparse
  const MATH_RE = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;

  for (const textNode of textNodes) {
    const text = textNode.data;
    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    MATH_RE.lastIndex = 0;
    while ((match = MATH_RE.exec(text)) !== null) {
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      const isDisplay = match[1] !== undefined;
      const latex = isDisplay ? match[1] : match[2];
      const span = document.createElement("span");
      try {
        span.innerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: isDisplay });
      } catch {
        span.textContent = match[0];
      }
      frag.appendChild(span);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex > 0) {
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      textNode.parentNode?.replaceChild(frag, textNode);
    }
  }

  return root.innerHTML;
}

export function PostContent({ html, className, style }: Props) {
  const [processedHtml, setProcessedHtml] = useState(html);

  useEffect(() => {
    setProcessedHtml(renderMathInHtml(html));
  }, [html]);

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
