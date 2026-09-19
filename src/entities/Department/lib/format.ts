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

export function filesCountLabel(count: number): string {
  return `${count} ${ruPlural(count, ["файл", "файла", "файлов"])}`;
}

export function coursesCountLabel(count: number): string {
  return `${count} ${ruPlural(count, ["курс", "курса", "курсов"])}`;
}

export function teachersCountLabel(count: number): string {
  return `${count} ${ruPlural(count, ["преподаватель", "преподавателя", "преподавателей"])}`;
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
