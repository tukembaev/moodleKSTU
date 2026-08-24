import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileVideoIcon,
  type LucideIcon,
} from "lucide-react";

export const IMAGE_EXT = ["svg", "png", "jpg", "jpeg", "gif", "webp", "bmp", "avif"];
export const AUDIO_EXT = ["mp3", "wav", "flac", "aac", "ogg"];
export const VIDEO_EXT = ["mp4", "mkv", "avi", "mov", "webm"];
export const ARCHIVE_EXT = ["zip", "rar", "7z", "tar", "gz"];
export const SPREADSHEET_EXT = ["xls", "xlsx", "csv"];
export const CODE_EXT = [
  "js",
  "ts",
  "tsx",
  "jsx",
  "py",
  "java",
  "cpp",
  "c",
  "html",
  "css",
  "json",
  "xml",
];

export function getExtension(fileName: string) {
  const clean = fileName.split("?")[0].split("#")[0];
  return (clean.split(".").pop() || "").toLowerCase();
}

export function isImageExt(extension: string) {
  return IMAGE_EXT.includes(extension);
}

export function isPdfExt(extension: string) {
  return extension === "pdf";
}

export function getFileKindIcon(extension: string): LucideIcon {
  if (isImageExt(extension)) return FileIcon;
  if (isPdfExt(extension) || ["doc", "docx", "ppt", "pptx", "txt"].includes(extension))
    return FileTextIcon;
  if (AUDIO_EXT.includes(extension)) return FileAudioIcon;
  if (VIDEO_EXT.includes(extension)) return FileVideoIcon;
  if (ARCHIVE_EXT.includes(extension)) return FileArchiveIcon;
  if (SPREADSHEET_EXT.includes(extension)) return FileSpreadsheetIcon;
  if (CODE_EXT.includes(extension)) return FileCodeIcon;
  return FileIcon;
}

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
