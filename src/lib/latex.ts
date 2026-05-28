import katex from "katex";

function unescapeAttr(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const MATH_RE = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;

function renderDelimiters(text: string): string {
  return text.replace(MATH_RE, (match, display, inline) => {
    const latex = display ?? inline;
    const displayMode = display !== undefined;
    try {
      return katex.renderToString(latex, { throwOnError: false, displayMode });
    } catch {
      return match;
    }
  });
}

/**
 * Replaces math expressions with KaTeX HTML.
 * Safe to call server-side (no DOM required).
 *
 * Handles:
 *   <span data-type="inline-math"  data-latex="..."></span>  (Tiptap nodes)
 *   <span data-type="display-math" data-latex="..."></span>  (Tiptap nodes)
 *   $$...$$  and  $...$  in text content                     (raw delimiters)
 */
export function processLatexInHtml(html: string): string {
  // Pass 1: Tiptap math nodes (empty spans with data-latex attribute)
  let result = html.replace(/<span([^>]*)><\/span>/g, (match, attrs) => {
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

  // Pass 2: raw $$...$$ / $...$ delimiters in text nodes (skip inside HTML tags)
  result = result.replace(/(<[^>]*>)|([^<]+)/g, (match, tag, text) => {
    if (tag) return tag;
    if (!text?.includes("$")) return match;
    return renderDelimiters(text);
  });

  return result;
}
