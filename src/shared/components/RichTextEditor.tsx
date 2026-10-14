import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Underline as UnderlineIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "shared/shadcn/ui/button";
import { cn } from "shared/lib/utils";
import { normalizePastedHtml, richTextBodyClass } from "./richText";

type RichTextEditorProps = {
  initialContent?: string;
  onChange: (html: string) => void;
};

export function RichTextEditor({ initialContent = "", onChange }: RichTextEditorProps) {
  const { t } = useTranslation();
  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Placeholder.configure({
        placeholder: t("Введите или вставьте текст"),
      }),
    ],
    content: initialContent,
    editorProps: {
      transformPastedHTML: normalizePastedHtml,
      attributes: {
        class: cn(
          richTextBodyClass,
          "min-h-full px-4 py-3 outline-none",
          "[&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-muted-foreground [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]"
        ),
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      bullet: current.isActive("bulletList"),
      ordered: current.isActive("orderedList"),
      h1: current.isActive("heading", { level: 1 }),
      h2: current.isActive("heading", { level: 2 }),
      h3: current.isActive("heading", { level: 3 }),
      paragraph: current.isActive("paragraph"),
    }),
  });

  if (!editor) return null;

  const tools = [
    {
      label: t("Обычный текст"),
      icon: Pilcrow,
      active: active.paragraph && !active.bullet && !active.ordered,
      run: () => editor.chain().focus().setParagraph().run(),
    },
    {
      label: t("Заголовок 1"),
      icon: Heading1,
      active: active.h1,
      run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: t("Заголовок 2"),
      icon: Heading2,
      active: active.h2,
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: t("Заголовок 3"),
      icon: Heading3,
      active: active.h3,
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: t("Жирный"),
      icon: Bold,
      active: active.bold,
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: t("Курсив"),
      icon: Italic,
      active: active.italic,
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: t("Подчёркнутый"),
      icon: UnderlineIcon,
      active: active.underline,
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: t("Маркированный список"),
      icon: List,
      active: active.bullet,
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: t("Нумерованный список"),
      icon: ListOrdered,
      active: active.ordered,
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-background">
      <div className="flex shrink-0 flex-wrap gap-1 border-b bg-muted/40 p-1.5">
        {tools.map((tool) => (
          <Button
            key={tool.label}
            type="button"
            size="icon-sm"
            variant={tool.active ? "secondary" : "ghost"}
            aria-label={tool.label}
            aria-pressed={tool.active}
            onClick={tool.run}
          >
            <tool.icon />
          </Button>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      />
    </div>
  );
}
