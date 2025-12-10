import { LuCaptionsOff } from "react-icons/lu";

export const TYPE_LABELS: Record<string, string> = {
  lb: "Лабораторная работа",
  pr: "Практическое занятие",
  lc: "Лекционное занятие",
  other: "Другое",
  srs: "СРС",
  test: "Тест",
};

export const TYPE_LESS: Record<string, string> = {
  lb: "Лб",
  pr: "Пр",
  lc: "Лк",
  other: "Другое",
  srs: "СРС",
  test: "Тест",
};

export const LOCKED_OPTIONS = [
  {
    label: "Закрытый",
    description: "Эта тема будет закрыта по умолчанию для каждого студента",
    value: "locked",
    icon: LuCaptionsOff,
  },
];

