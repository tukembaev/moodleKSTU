import type { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

function collectMessages(errors: FieldErrors): string[] {
  const messages: string[] = [];

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const item = node as { message?: unknown; type?: unknown } & Record<
      string,
      unknown
    >;
    if (typeof item.message === "string" && item.message.trim()) {
      messages.push(item.message.trim());
    } else if (item.type === "required") {
      messages.push("Заполните обязательные поля");
    }
    for (const [key, value] of Object.entries(item)) {
      if (key === "ref" || key === "types" || key === "message" || key === "type") {
        continue;
      }
      visit(value);
    }
  };

  visit(errors);
  return [...new Set(messages)];
}

export function requiredField(message: string) {
  return {
    required: message,
    validate: (value: unknown) => {
      if (typeof value === "number") {
        return Number.isFinite(value) ? true : message;
      }
      if (typeof value === "string" && !value.trim()) return message;
      if (typeof FileList !== "undefined" && value instanceof FileList && value.length === 0) {
        return message;
      }
      if (Array.isArray(value) && value.length === 0) return message;
      if (value == null || value === "") return message;
      return true;
    },
  };
}

export function toastRequiredField(message: string) {
  toast.warning(message);
}

export function onFormInvalid(errors: FieldErrors) {
  const messages = collectMessages(errors);
  if (messages.length === 0) {
    toast.warning("Заполните обязательные поля");
    return;
  }
  if (messages.length === 1) {
    toast.warning(messages[0]);
    return;
  }
  toast.warning("Заполните обязательные поля", {
    description: messages.join(". "),
  });
}
