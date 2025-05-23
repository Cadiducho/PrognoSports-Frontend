import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isToday from "dayjs/plugin/isToday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/es";

export function useDayjs() {
  dayjs.locale("es");
  dayjs.extend(utc);
  dayjs.extend(relativeTime);
  dayjs.extend(customParseFormat);
  dayjs.extend(isToday);
  dayjs.extend(weekOfYear);

  const dateDiff = (date: Date): string => {
    return dayjs(date).fromNow();
  };
  const isBefore = (date: Date): boolean => {
    return dayjs().isBefore(date);
  };
  const isAfter = (date: Date): boolean => {
    return dayjs().isAfter(date);
  };
  const isThisWeek = (date: Date): boolean => {
    return dayjs().week() == dayjs(date).week();
  };
  const minusFiveMinutes = (date: Date): Dayjs => {
    return dayjs(date).subtract(5, "minute");
  };
  const humanDate = (date: Date): string => {
    if (!date) return "Fecha no disponible";
    return dayjs(date).format("D/M/YYYY");
  };
  const humanDateTime = (date: Date): string => {
    if (!date) return "Fecha no disponible";
    return dayjs(date).format("DD/MM/YY [a las] H:mm");
  };
  const humanMonth = (date: Date): string => {
    if (!date) return "Fecha no disponible";
    return dayjs(date).format("MMMM");
  };
  const humanDayMonth = (date: Date): string => {
    if (!date) return "Fecha no disponible";
    return dayjs(date).format("D [de] MMMM");
  };

  return {
    dateDiff,
    isBefore,
    isAfter,
    isThisWeek,
    minusFiveMinutes,
    humanDate,
    humanDateTime,
    humanMonth,
    humanDayMonth,
  };
}
