
import dayjs from "dayjs";
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(isToday);

export function loadFilters(Vue: any) {
    Vue.filter('dateDiff', function (date: Date): string {
        return dayjs(date).fromNow();
    });
    Vue.filter('humanDate', function (date: Date, timezone: string = "Europe/Madrid"): string {
        return dayjs.tz(date, timezone).format('D/M/YYYY');
    });
    Vue.filter('humanDateTime', function (date: Date, timezone: string = "Europe/Madrid"): string {
        return dayjs.tz(date, timezone).format('D/M/YY [a las] H:mm');
    });
    Vue.filter('humanDateTimeMinusFiveMinutes', function (date: Date, timezone: string = "Europe/Madrid"): string {
        return dayjs.tz(date, timezone).subtract(5, 'minute').format('D/M/YY [a las] H:mm');
    });
    Vue.filter('isBefore', function (date: Date): boolean {
        return dayjs().isBefore(date);
    });
}

export default dayjs;