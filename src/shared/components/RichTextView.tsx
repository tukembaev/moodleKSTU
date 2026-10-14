import { MarkdownContent } from "./MarkdownContent";
import { isHtmlContent, richTextBodyClass, sanitizeRichText } from "./richText";

export function RichTextView({ content }: { content: string }) {
  if (!content.trim()) return null;
  if (!isHtmlContent(content)) {
    return <MarkdownContent content={content} />;
  }
  return (
    <div
      className={richTextBodyClass}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(content) }}
    />
  );
}
