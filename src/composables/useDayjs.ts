import dayjs, {Dayjs} from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isToday from "dayjs/plugin/isToday";
import weekOfYear from "dayjs/plugin/weekOfYear"
import 'dayjs/locale/es';

export function useDayjs() {

    dayjs.locale('es');
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(relativeTime);
    dayjs.extend(customParseFormat);
    dayjs.extend(isToday);
    dayjs.extend(weekOfYear);

    const dateDiff = (date: Date): string => {
        return dayjs(date).fromNow();
    }
    const isBefore = (date: Date): boolean => {
        return dayjs().isBefore(date);
    }
    const isAfter = (date: Date): boolean => {
        return dayjs().isAfter(date);
    }
    const isThisWeek = (date: Date): boolean => {
        return dayjs().week() == dayjs(date).week();
    }
    const minusFiveMinutes = (date: Date, timezone: string = "Europe/Madrid"): Dayjs => {
        return dayjs.tz(date, timezone).subtract(5, 'minute');
    }
    const humanDate = (date: Date, timezone: string = "Europe/Madrid"): string => {
        return dayjs.tz(date, timezone).format('D/M/YYYY');
    }
    const humanDateTime = (date: Date, timezone: string = "Europe/Madrid"): string => {
        return dayjs.tz(date, timezone).format('DD/MM/YY [a las] H:mm');
    }
    const humanMonth = (date: Date, timezone: string = "Europe/Madrid"): string => {
        return dayjs.tz(date, timezone).format('MMMM');
    }
    const humanDayMonth = (date: Date, timezone: string = "Europe/Madrid"): string => {
        return dayjs.tz(date, timezone).format('D [de] MMMM');
    }

    return { dateDiff, isBefore, isAfter, isThisWeek, minusFiveMinutes, humanDate, humanDateTime, humanMonth, humanDayMonth };
}