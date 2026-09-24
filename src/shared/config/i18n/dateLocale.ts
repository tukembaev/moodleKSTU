import type { Locale } from "date-fns";
import { enUS, ru } from "date-fns/locale";
import i18n from "./i18n";

type WidthMap = Record<string, string[] | Record<string, string>>;

function buildLocalizeFn(args: {
  values: WidthMap;
  defaultWidth: string;
  formattingValues?: WidthMap;
  defaultFormattingWidth?: string;
  argumentCallback?: (value: number) => number;
}) {
  return (value: number, options?: { context?: string; width?: string }) => {
    const context = options?.context ? String(options.context) : "standalone";
    let valuesArray: string[] | Record<string, string>;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray =
        args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[args.defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index as never];
  };
}

const monthValues = {
  narrow: ["Ү", "Б", "Ж", "Ч", "Б", "К", "Т", "Б", "А", "Т", "Ж", "Б"],
  abbreviated: [
    "үчт.",
    "бирд.",
    "жал.",
    "чын.",
    "бугу",
    "кулж.",
    "теке",
    "баш о.",
    "аяк о.",
    "тог.",
    "жет.",
    "беш.",
  ],
  wide: [
    "үчтүн айы",
    "бирдин айы",
    "жалган куран",
    "чын куран",
    "бугу",
    "кулжа",
    "теке",
    "баш оона",
    "аяк оона",
    "тогуздун айы",
    "жетинин айы",
    "бештин айы",
  ],
};

const formattingMonthValues = {
  narrow: monthValues.narrow,
  abbreviated: monthValues.abbreviated,
  wide: monthValues.wide,
};

const dayValues = {
  narrow: ["Ж", "Д", "Ш", "Ш", "Б", "Ж", "И"],
  short: ["жш", "дш", "ше", "ша", "бш", "жм", "иш"],
  abbreviated: ["жек", "дүй", "шей", "шар", "бей", "жум", "ише"],
  wide: [
    "жекшемби",
    "дүйшөмбү",
    "шейшемби",
    "шаршемби",
    "бейшемби",
    "жума",
    "ишемби",
  ],
};

const dayPeriodValues = {
  narrow: {
    am: "тң",
    pm: "кч",
    midnight: "түн ортосу",
    noon: "түш",
    morning: "эртең",
    afternoon: "түштөн кийин",
    evening: "кеч",
    night: "түн",
  },
  abbreviated: {
    am: "тң",
    pm: "кч",
    midnight: "түн ортосу",
    noon: "түш",
    morning: "эртең менен",
    afternoon: "түштөн кийин",
    evening: "кечинде",
    night: "түнкүсүн",
  },
  wide: {
    am: "түнкү",
    pm: "күндүзгү",
    midnight: "түн ортосу",
    noon: "түш",
    morning: "эртең менен",
    afternoon: "түштөн кийин",
    evening: "кечинде",
    night: "түнкүсүн",
  },
};

const kyLocalize = {
  ordinalNumber: (dirtyNumber: number) => String(dirtyNumber),
  era: buildLocalizeFn({
    values: {
      narrow: ["б.з.ч.", "б.з."],
      abbreviated: ["б.з.ч.", "б.з."],
      wide: ["биздин заманга чейин", "биздин заман"],
    },
    defaultWidth: "wide",
  }),
  quarter: buildLocalizeFn({
    values: {
      narrow: ["1", "2", "3", "4"],
      abbreviated: ["1-чейр.", "2-чейр.", "3-чейр.", "4-чейр."],
      wide: ["1-чейрек", "2-чейрек", "3-чейрек", "4-чейрек"],
    },
    defaultWidth: "wide",
    argumentCallback: (quarter: number) => quarter - 1,
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide",
    formattingValues: formattingMonthValues,
    defaultFormattingWidth: "wide",
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide",
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
  }),
};

export const kyDateLocale: Locale = {
  ...ru,
  code: "ky",
  localize: kyLocalize as unknown as Locale["localize"],
};

export function getDateLocale(language = i18n.language): Locale {
  if (language.startsWith("en")) return enUS;
  if (language.startsWith("ky")) return kyDateLocale;
  return ru;
}
