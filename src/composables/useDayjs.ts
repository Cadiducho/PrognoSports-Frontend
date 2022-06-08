import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isToday from "dayjs/plugin/isToday";

export function useDayjs() {

        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.extend(relativeTime);
        dayjs.extend(customParseFormat);
        dayjs.extend(isToday);

    const dateDiff = (date: Date): string => {
        return dayjs(date).fromNow();
    }
    const isBefore = (date: Date): boolean => {
        return dayjs().isBefore(date);
    }
    const humanDate = (date: Date, timezone: string = "Europe/Madrid"): string => {
        return dayjs.tz(date, timezone).format('D/M/YYYY');
    }
    const humanDateTime = (date: Date, timezone: string = "Europe/Madrid"): string => {
        return dayjs.tz(date, timezone).format('D/M/YY [a las] H:mm');
    }
    const humanDateTimeMinusFiveMinutes = (date: Date, timezone: string = "Europe/Madrid"): string => {
        return dayjs.tz(date, timezone).subtract(5, 'minute').format('D/M/YY [a las] H:mm');
    }

    return { dateDiff, isBefore, humanDate, humanDateTime, humanDateTimeMinusFiveMinutes };
}