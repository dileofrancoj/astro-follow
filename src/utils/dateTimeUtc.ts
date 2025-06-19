import {DateTime} from 'luxon'
import { DateTimeProps } from "../interfaces/DateTimeUTC";

export const getDateTimeUTC = (userTimeZone: string): DateTimeProps => {
        const offsetHours = parseInt(userTimeZone.substring(3)); // Convierte "-3" a -3
        const nowUTC = DateTime.now().toUTC();
        const nowInUserOffsetZone = nowUTC.plus({ hours: offsetHours }); // Suma el offset (si es negativo, resta)
        const yearUTC = nowInUserOffsetZone.year.toString();
        const monthUTC = nowInUserOffsetZone.month.toString();
        const dayUTC = nowInUserOffsetZone.day.toString();
        const hourUTC = nowInUserOffsetZone.hour.toString();
        const minuteUTC = nowInUserOffsetZone.minute.toString();
        const secondUTC = nowInUserOffsetZone.second.toString();
        console.info(`Calculated UTC for Python: ${yearUTC}-${monthUTC}-${dayUTC} ${hourUTC}:${minuteUTC}:${secondUTC}`);
        return {
            yearUTC,
            monthUTC,
            dayUTC,
            hourUTC,
            minuteUTC,
            secondUTC
        }
}