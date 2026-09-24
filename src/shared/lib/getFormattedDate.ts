import { format, isTomorrow, isThisMonth, getMonth, addWeeks, isWithinInterval, startOfWeek, endOfWeek, differenceInCalendarDays } from "date-fns";
import i18n from "shared/config/i18n/i18n";
import { getDateLocale } from "shared/config/i18n/dateLocale";

export const getFormattedDate = (date:Date) => {
  const now = new Date();
  const currentDate = new Date(date);

  // Если дата в будущем
  if (isTomorrow(currentDate)) {
    return i18n.t("Завтра");
  }
  if (currentDate.getDate() === now.getDate() + 1) {
    return i18n.t("Послезавтра");
  }

  // Если дата прошла
  const daysDifference = differenceInCalendarDays(now, currentDate);

  if (daysDifference === 1) {
    return i18n.t("Прошлый день");
  }
  if (daysDifference === 2) {
    return i18n.t("Позавчера");
  }
  if (daysDifference > 2) {
    return i18n.t("Прошло {{count}} дней", { count: daysDifference });
  }

  // Проверка на следующую неделю
  if (isWithinInterval(currentDate, { start: addWeeks(startOfWeek(now, { weekStartsOn: 1 }), 1), end: endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }) })) {
    return i18n.t("На следующей неделе");
  }
  if (isThisMonth(currentDate)) {
    return i18n.t("В этом месяце");
  }
  if (getMonth(now) + 1 === getMonth(currentDate)) {
    return i18n.t("В следующем месяце");
  }

  return format(currentDate, "PPP", { locale: getDateLocale() });
};