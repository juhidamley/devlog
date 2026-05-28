import katex from "katex";

function unescapeAttr(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Replaces Tiptap math nodes with KaTeX HTML.
 * Safe to call server-side (no DOM required).
 *
 * Handles:
 *   <span data-type="inline-math"  data-latex="..."></span>
 *   <span data-type="display-math" data-latex="..."></span>
 */
export function processLatexInHtml(html: string): string {
  return html.replace(/<span([^>]*)><\/span>/g, (match, attrs) => {
    const typeMatch = attrs.match(/data-type="(inline-math|display-math)"/);
    const latexMatch = attrs.match(/data-latex="([^"]*)"/);
    if (!typeMatch || !latexMatch) return match;

    const displayMode = typeMatch[1] === "display-math";
    const latex = unescapeAttr(latexMatch[1]);

    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode });
    } catch {
      return match;
    }
  });
}
