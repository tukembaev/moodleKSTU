import DOMPurify from "dompurify";
import { cn } from "shared/lib/utils";

const ALLOWED_TAGS = [
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "code",
  "pre",
];

export const richTextBodyClass = cn(
  "text-[15px] leading-7 text-foreground",
  "[&_h1]:mt-5 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:tracking-tight first:[&_h1]:mt-0",
  "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-tight first:[&_h2]:mt-0",
  "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold first:[&_h3]:mt-0",
  "[&_p]:mb-3 [&_p]:leading-7 last:[&_p]:mb-0",
  "[&_strong]:font-semibold [&_b]:font-semibold",
  "[&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through",
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6",
  "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6",
  "[&_li]:leading-7",
  "[&_blockquote]:mb-3 [&_blockquote]:border-l-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]"
);

export function isHtmlContent(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function richTextIsEmpty(html: string) {
  return !html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

export function sanitizeRichText(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

function wrapInline(doc: Document, el: Element, tag: string) {
  const onlyChild = el.childElementCount === 1 ? el.firstElementChild : null;
  if (onlyChild?.tagName.toLowerCase() === tag) return;
  const wrapper = doc.createElement(tag);
  while (el.firstChild) wrapper.appendChild(el.firstChild);
  el.appendChild(wrapper);
}

export function normalizePastedHtml(html: string) {
  if (!html || typeof DOMParser === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("style, script, meta, link, title").forEach((node) => node.remove());

  doc.querySelectorAll("[style]").forEach((el) => {
    const style = el.getAttribute("style") || "";
    if (/font-weight:\s*(bold|[6-9]00)/i.test(style)) wrapInline(doc, el, "strong");
    if (/font-style:\s*italic/i.test(style)) wrapInline(doc, el, "em");
    if (/text-decoration:[^;"]*underline/i.test(style)) wrapInline(doc, el, "u");
    const outline = style.match(/mso-outline-level:\s*(\d)/i);
    if (outline && el.tagName === "P") {
      const level = Math.min(3, Math.max(1, Number(outline[1])));
      const heading = doc.createElement(`h${level}`);
      heading.innerHTML = el.innerHTML;
      el.replaceWith(heading);
    }
  });

  doc.querySelectorAll("span").forEach((span) => {
    const style = span.getAttribute("style") || "";
    if (!/mso-list:\s*Ignore/i.test(style)) return;
    const marker = span.textContent || "";
    const parent = span.parentElement;
    if (parent) {
      parent.setAttribute("data-list", /^\s*\d+/.test(marker) ? "ol" : "ul");
    }
    span.remove();
  });

  const fragment = doc.createDocumentFragment();
  let list: HTMLUListElement | HTMLOListElement | null = null;
  let listKind: "ul" | "ol" | null = null;

  const flush = () => {
    if (list) fragment.appendChild(list);
    list = null;
    listKind = null;
  };

  for (const node of [...doc.body.childNodes]) {
    if (!(node instanceof HTMLElement)) {
      flush();
      fragment.appendChild(node);
      continue;
    }
    const style = node.getAttribute("style") || "";
    const marked = node.getAttribute("data-list");
    const isList =
      Boolean(marked) ||
      /mso-list:/i.test(style) ||
      /MsoList/i.test(node.className || "");
    if (isList && node.tagName === "P") {
      const kind = marked === "ol" || /^\s*\d+[.)]/.test(node.textContent || "") ? "ol" : "ul";
      if (!list || listKind !== kind) {
        flush();
        list = doc.createElement(kind);
        listKind = kind;
      }
      const item = doc.createElement("li");
      item.innerHTML = node.innerHTML;
      list.appendChild(item);
      continue;
    }
    flush();
    fragment.appendChild(node);
  }
  flush();
  doc.body.replaceChildren(fragment);

  doc.body.querySelectorAll("*").forEach((el) => {
    el.removeAttribute("style");
    el.removeAttribute("class");
    el.removeAttribute("lang");
    el.removeAttribute("data-list");
  });

  return doc.body.innerHTML;
}
