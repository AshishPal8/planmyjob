"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Check,
  X,
  Type,
  Code,
} from "lucide-react";

// ─── Toolbar Button ───────────────────────────────────────────────────────────
const ToolbarButton = ({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`p-1.5 rounded transition-colors ${
      active
        ? "bg-primary/20 text-primary font-bold"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }`}
  >
    {children}
  </button>
);

// ─── Slash command items ──────────────────────────────────────────────────────
const SLASH_ITEMS = [
  {
    label: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 className="h-4 w-4" />,
    command: (editor: any) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 className="h-4 w-4" />,
    command: (editor: any) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Heading 3",
    description: "Small section heading",
    icon: <Heading3 className="h-4 w-4" />,
    command: (editor: any) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: "Bullet List",
    description: "Create an unordered bullet list",
    icon: <List className="h-4 w-4" />,
    command: (editor: any) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Numbered List",
    description: "Create a numbered list",
    icon: <ListOrdered className="h-4 w-4" />,
    command: (editor: any) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Bold",
    description: "Make text bold",
    icon: <Bold className="h-4 w-4" />,
    command: (editor: any) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: "Italic",
    description: "Make text italic",
    icon: <Italic className="h-4 w-4" />,
    command: (editor: any) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: "Normal text",
    description: "Clear formatting",
    icon: <Type className="h-4 w-4" />,
    command: (editor: any) =>
      editor.chain().focus().clearNodes().unsetAllMarks().run(),
  },
];

interface JobDescriptionEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function JobDescriptionEditor({
  value,
  onChange,
  placeholder = "Describe the job role, responsibilities, requirements, and benefits… (Type / for quick formatting)",
}: JobDescriptionEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  // slash menu state
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [slashPos, setSlashPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const slashMenuRef = useRef<HTMLDivElement>(null);

  const filteredItems = SLASH_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(slashQuery.toLowerCase()),
  );

  // ── Slash command tiptap extension ────────────────────────────────────────
  const SlashExtension = Extension.create({
    name: "slashCommand",
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("slashCommand"),
          props: {
            handleKeyDown() {
              return false;
            },
          },
        }),
      ];
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder,
      }),
      SlashExtension,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());

      const { state } = editor;
      const { from } = state.selection;
      const textBefore = state.doc.textBetween(
        Math.max(0, from - 50),
        from,
        "\n",
      );
      const slashMatch = textBefore.match(/\/(\w*)$/);

      if (slashMatch) {
        setSlashQuery(slashMatch[1] || "");
        setSlashIndex(0);
        setSlashOpen(true);

        const coords = editor.view.coordsAtPos(from);
        const wrapper = editorWrapperRef.current?.getBoundingClientRect();
        if (wrapper) {
          setSlashPos({
            top: coords.bottom - wrapper.top + 4,
            left: coords.left - wrapper.left,
          });
        }
      } else {
        setSlashOpen(false);
        setSlashQuery("");
      }
    },
  });

  const handleWrapperClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".toolbar") || target.closest(".slash-menu")) return;
    editor?.chain().focus().run();
  };

  useEffect(() => {
    if (showLinkInput) {
      setTimeout(() => linkInputRef.current?.focus(), 30);
      const existing = editor?.getAttributes("link").href ?? "";
      setLinkUrl(existing);
    }
  }, [showLinkInput, editor]);

  const confirmLink = useCallback(() => {
    if (!linkUrl.trim()) {
      editor?.chain().focus().unsetLink().run();
    } else {
      const href = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor?.chain().focus().setLink({ href }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const cancelLink = useCallback(() => {
    setShowLinkInput(false);
    setLinkUrl("");
    editor?.chain().focus().run();
  }, [editor]);

  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmLink();
    }
    if (e.key === "Escape") cancelLink();
  };

  useEffect(() => {
    if (!slashOpen || !editor) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashIndex((i) => (i + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashIndex(
          (i) => (i - 1 + filteredItems.length) % filteredItems.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[slashIndex]) {
          applySlashItem(filteredItems[slashIndex]);
        }
      } else if (e.key === "Escape") {
        setSlashOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [slashOpen, slashIndex, filteredItems, editor]);

  const applySlashItem = (item: (typeof SLASH_ITEMS)[0]) => {
    if (!editor) return;
    const { state } = editor;
    const { from } = state.selection;
    const textBefore = state.doc.textBetween(
      Math.max(0, from - 50),
      from,
      "\n",
    );
    const slashMatch = textBefore.match(/\/(\w*)$/);
    if (slashMatch) {
      const deleteFrom = from - slashMatch[0].length;
      editor.chain().focus().deleteRange({ from: deleteFrom, to: from }).run();
    }
    item.command(editor);
    setSlashOpen(false);
    setSlashQuery("");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        slashMenuRef.current &&
        !slashMenuRef.current.contains(e.target as Node)
      ) {
        setSlashOpen(false);
      }
    };
    if (slashOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [slashOpen]);

  if (!editor) return null;

  return (
    <div
      ref={editorWrapperRef}
      className="relative rounded-lg border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text transition-all"
      onClick={handleWrapperClick}
    >
      {/* ── Fixed Top Toolbar for Ease of Use ───────────────────────────── */}
      <div className="toolbar flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2 px-3 rounded-t-lg">
        <ToolbarButton
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton
          title="Heading 1"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 3"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton
          title="Insert Link"
          onClick={() => setShowLinkInput(true)}
          active={editor.isActive("link")}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* ── Bubble Menu for Quick Selection Formatting ───────────────────── */}
      <BubbleMenu
        editor={editor}
        options={{ placement: "top", offset: 8, flip: true }}
        shouldShow={({ state }) => {
          if (showLinkInput) return false;
          return !state.selection.empty;
        }}
      >
        <div className="flex items-center gap-0.5 bg-popover text-popover-foreground shadow-lg border border-border rounded-lg p-1">
          <ToolbarButton
            title="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            title="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>

          <ToolbarButton
            title="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="w-px h-4 bg-border mx-0.5" />

          <ToolbarButton
            title="Link"
            onClick={() => setShowLinkInput(true)}
            active={editor.isActive("link")}
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>
      </BubbleMenu>

      {/* ── Inline Link Dialog ───────────────────────────────────────────── */}
      {showLinkInput && (
        <div
          className="absolute z-50 flex items-center gap-1 bg-popover text-popover-foreground shadow-xl border border-border rounded-lg p-2"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -120%)",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={linkInputRef}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleLinkKeyDown}
            placeholder="Paste URL (e.g. https://...)"
            className="h-8 text-sm w-64 px-2"
          />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              confirmLink();
            }}
            className="p-1.5 rounded hover:bg-primary/20 text-primary transition-colors"
            title="Confirm"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              cancelLink();
            }}
            className="p-1.5 rounded hover:bg-destructive/20 text-destructive transition-colors"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Editor Prose Content ─────────────────────────────────────────── */}
      <div className="p-4 min-h-[260px] text-foreground prose dark:prose-invert max-w-none focus:outline-none [&_.ProseMirror]:min-h-[220px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0">
        <EditorContent editor={editor} />
      </div>

      {/* ── Slash Menu ───────────────────────────────────────────────────── */}
      {slashOpen && filteredItems.length > 0 && (
        <div
          ref={slashMenuRef}
          className="slash-menu absolute z-50 bg-popover text-popover-foreground border border-border rounded-lg shadow-xl py-1 w-64 max-h-72 overflow-y-auto"
          style={{ top: slashPos.top, left: slashPos.left }}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-3 pt-1.5 pb-1 font-semibold">
            Formatting Commands
          </p>
          {filteredItems.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applySlashItem(item);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer ${
                i === slashIndex
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-muted"
              }`}
            >
              <span className="shrink-0 text-primary">
                {item.icon}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium leading-tight">
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
