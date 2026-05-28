"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { InlineMath } from "@tiptap/extension-mathematics";
import { InputRule, mergeAttributes } from "@tiptap/core";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useRef } from "react";

// $$text$$ → inline math rendered at text size  (InlineMath default rule)
// $text$   → display-mode math rendered at display size  (DisplayMath, also inline node)
//
// BlockMath (group:"block") cannot be inserted mid-paragraph; both variants must be
// inline nodes so ProseMirror accepts tr.replaceWith inside a paragraph.
const DisplayMath = InlineMath.extend({
  name: "displayMath",

  parseHTML() {
    return [{ tag: 'span[data-type="display-math"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { "data-type": "display-math" })];
  },

  addInputRules() {
    return [
      new InputRule({
        // single $…$ — negative look-around prevents matching inside $$…$$
        find: /(?<!\$)\$([^$\n]+?)\$(?!\$)/,
        handler: ({ state, range, match }) => {
          state.tr.replaceWith(
            range.from,
            range.to,
            this.type.create({ latex: match[1] }),
          );
        },
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const wrapper = document.createElement("span");
      wrapper.className = "tiptap-mathematics-render tiptap-mathematics-render--editable";
      wrapper.dataset.type = "display-math";
      wrapper.setAttribute("data-latex", node.attrs.latex as string);

      try {
        katex.render(node.attrs.latex as string, wrapper, {
          displayMode: true,
          throwOnError: false,
        });
      } catch {}

      return { dom: wrapper };
    };
  },
});

type Props = {
  content?: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

type BtnProps = {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
};

function Btn({ onClick, isActive, title, children, disabled }: BtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`px-2 py-1 font-mono text-[10px] uppercase tracking-wider border transition-colors disabled:opacity-30 ${
        isActive
          ? "bg-ink text-canvas border-ink"
          : "bg-canvas text-ink border-ink hover:bg-ink hover:text-canvas"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px bg-ink opacity-20 mx-0.5 self-stretch" />;
}

export function RichTextEditor({ content = "", onChange, placeholder }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline" } }),
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      InlineMath,
      DisplayMath,
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "min-h-[400px] px-4 py-4 font-mono text-sm focus:outline-none prose prose-sm max-w-none tiptap-editor",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) return;

    const { url } = await res.json();
    editor.chain().focus().setImage({ src: url, alt: file.name }).run();

    // reset so same file can be re-picked
    e.target.value = "";
  }

  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="border-2 border-ink">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b-2 border-ink bg-ink/5">
        {/* History */}
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()}>↩</Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()}>↪</Btn>

        <Divider />

        {/* Block type */}
        <Btn onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive("paragraph")} title="Paragraph">¶</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} title="Heading 1">H1</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="Heading 2">H2</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} title="Heading 3">H3</Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Blockquote">"</Btn>

        <Divider />

        {/* Inline marks */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold"><strong>B</strong></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic"><em>I</em></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} title="Underline"><span className="underline">U</span></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strikethrough"><s>S</s></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive("highlight")} title="Highlight">▐</Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive("code")} title="Inline code">`_`</Btn>
        <Btn
          onClick={() => {
            const selected = editor.state.doc.cut(
              editor.state.selection.from,
              editor.state.selection.to,
            ).textContent;
            const latex = window.prompt("LaTeX expression", selected || "");
            if (!latex) return;
            editor.chain().focus().insertInlineMath({ latex }).run();
          }}
          isActive={editor.isActive("inlineMath")}
          title="Inline math"
        >
          ∑
        </Btn>

        <Divider />

        {/* Alignment */}
        <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Align left">≡L</Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Align center">≡C</Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} title="Align right">≡R</Btn>

        <Divider />

        {/* Lists */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullet list">• —</Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Ordered list">1.</Btn>
        <Btn onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive("taskList")} title="Task list">☐</Btn>

        <Divider />

        {/* Code block */}
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code block">```</Btn>

        {/* HR */}
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">—</Btn>

        <Divider />

        {/* Link */}
        <Btn onClick={setLink} isActive={editor.isActive("link")} title="Link">🔗</Btn>

        {/* Image */}
        <Btn onClick={() => fileRef.current?.click()} title="Upload image">img</Btn>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
