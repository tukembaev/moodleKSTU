import { LuCaptionsOff } from "react-icons/lu";

export const TYPE_LABELS: Record<string, string> = {
  lb: "Лабораторная работа",
  pr: "Практическое занятие",
  lc: "Лекционное занятие",
  srs: "СРС",
  test: "Тест",
  rgz: "РГЗ",
  rgr: 'РГР',
  umk: 'УМК',
  other: "Другое",

};

export const TYPE_LESS: Record<string, string> = {
  lb: "Лб",
  pr: "Пр",
  lc: "Лк",
  srs: "СРС",
  test: "Тест",
  rgz: "РГЗ",
  rgr: 'РГР',
  umk: 'УМК',
  other: "Другое",
};

export const LOCKED_OPTIONS = [
  {
    label: "Закрытый",
    description: "Эта тема будет закрыта по умолчанию для каждого студента",
    value: "locked",
    icon: LuCaptionsOff,
  },
];

