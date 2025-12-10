import { format, isTomorrow, isThisMonth, getMonth, addWeeks, isWithinInterval, startOfWeek, endOfWeek, differenceInCalendarDays } from "date-fns";
import { ru } from "date-fns/locale"; // Импортируем локаль

export const getFormattedDate = (date:Date) => {
  const now = new Date();
  const currentDate = new Date(date);

  // Если дата в будущем
  if (isTomorrow(currentDate)) {
    return "Завтра";
  }
  if (currentDate.getDate() === now.getDate() + 1) {
    return "Послезавтра";
  }

  // Если дата прошла
  const daysDifference = differenceInCalendarDays(now, currentDate);

  if (daysDifference === 1) {
    return "Прошлый день"; // Вчера
  }
  if (daysDifference === 2) {
    return "Позавчера"; // Позавчера
  }
  if (daysDifference > 2) {
    return `Прошло ${daysDifference} дней`; // Больше двух дней
  }

  // Проверка на следующую неделю
  if (isWithinInterval(currentDate, { start: addWeeks(startOfWeek(now, { weekStartsOn: 1 }), 1), end: endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }) })) {
    return "На следующей неделе";
  }
  // Проверка, если дата в этом месяце
  if (isThisMonth(currentDate)) {
    return "В этом месяце";
  }
  // Проверка на следующий месяц
  if (getMonth(now) + 1 === getMonth(currentDate)) {
    return "В следующем месяце";
  }

  // Если дата не подходит ни под одну из категорий, выводим полную дату
  return format(currentDate, "PPP", { locale: ru });
};