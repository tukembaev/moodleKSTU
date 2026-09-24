import i18n from "shared/config/i18n/i18n";

export function ruPlural(
  count: number,
  forms: [string, string, string]
): string {
  const abs = Math.abs(count) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}

function localizedCount(count: number, key: string, ruForms: [string, string, string]) {
  if (i18n.language.startsWith("ru")) {
    return `${count} ${ruPlural(count, ruForms)}`;
  }
  return i18n.t(key, { count });
}

export function filesCountLabel(count: number): string {
  return localizedCount(count, "{{count}} файлов", ["файл", "файла", "файлов"]);
}

export function coursesCountLabel(count: number): string {
  return localizedCount(count, "{{count}} курсов", ["курс", "курса", "курсов"]);
}

export function teachersCountLabel(count: number): string {
  return localizedCount(count, "{{count}} преподавателей", [
    "преподаватель",
    "преподавателя",
    "преподавателей",
  ]);
}

export function personInitials(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return initials || "?";
}

export function compareRu(a: string, b: string): number {
  return a.localeCompare(b, "ru", { sensitivity: "base" });
}

export function matchesQuery(value: string | null | undefined, query: string): boolean {
  if (!query) return true;
  return (value ?? "").toLowerCase().includes(query);
}
