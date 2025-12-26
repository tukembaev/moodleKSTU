import React from "react";
import {
  LuFlaskConical,
  LuHammer,
  LuBookOpen,
  LuNotebookPen,
  LuShapes,
  LuPuzzle,
} from "react-icons/lu";

export const categories: {
  key: string;
  title: string;
  icon: React.ReactNode;
  badgeClass: string;
  iconClass: string;
}[] = [
  { 
    key: "lb", 
    title: "Лабораторные", 
    icon: <LuFlaskConical />,
    badgeClass: "bg-purple-50 text-purple-600/80 border-purple-200/50 dark:bg-purple-950/30 dark:text-purple-400/80 dark:border-purple-800/30",
    iconClass: "text-purple-600 dark:text-purple-400"
  },
  { 
    key: "pr", 
    title: "Практика", 
    icon: <LuHammer />,
    badgeClass: "bg-blue-50 text-blue-600/80 border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400/80 dark:border-blue-800/30",
    iconClass: "text-blue-600 dark:text-blue-400"
  },
  { 
    key: "lc", 
    title: "Лекции", 
    icon: <LuBookOpen />,
    badgeClass: "bg-emerald-50 text-emerald-600/80 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400/80 dark:border-emerald-800/30",
    iconClass: "text-emerald-600 dark:text-emerald-400"
  },
  { 
    key: "srs", 
    title: "СРС", 
    icon: <LuNotebookPen />,
    badgeClass: "bg-amber-50 text-amber-600/80 border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400/80 dark:border-amber-800/30",
    iconClass: "text-amber-600 dark:text-amber-400"
  },
  { 
    key: "test", 
    title: "Тесты", 
    icon: <LuShapes />,
    badgeClass: "bg-rose-50 text-rose-600/80 border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400/80 dark:border-rose-800/30",
    iconClass: "text-rose-600 dark:text-rose-400"
  },
  { 
    key: "other", 
    title: "Прочее", 
    icon: <LuPuzzle />,
    badgeClass: "bg-slate-50 text-slate-600/80 border-slate-200/50 dark:bg-slate-950/30 dark:text-slate-400/80 dark:border-slate-800/30",
    iconClass: "text-slate-600 dark:text-slate-400"
  },
];

export const mapTypeLessToCategory = (type_less: string): string => {
  const mapping: Record<string, string> = {
    "Пр": "pr",
    "Лб": "lb",
    "Лк": "lc",
    "СРС": "srs",
    "Тест": "test",
  };
  return mapping[type_less] || "other";
};
