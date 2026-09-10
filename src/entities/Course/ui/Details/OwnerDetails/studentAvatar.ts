import { TablePerfomance } from "entities/Course/model/types/course";

const mockAvatarUrl = (seed: string | number) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(String(seed))}`;

export const studentAvatarSrc = (student: TablePerfomance) => {
  const avatar = student.avatar?.trim();
  return avatar || mockAvatarUrl(student.id || `${student.first_name} ${student.last_name}`);
};

export const studentInitials = (student: TablePerfomance) =>
  `${student.first_name?.[0] ?? ""}${student.last_name?.[0] ?? ""}`.toUpperCase();
