import { Request, Response } from 'express';
import {DateTime} from 'luxon'

import { getCoordinates } from './service';
import { DateTimeProps } from '../../interfaces/DateTimeUTC';
import { parseCoordinates } from '../../utils/ra-dec-converter';
import { UserState } from '../../interfaces/UserState';
import { SIDERAL_SPEED } from '../../constants/earth';
import { getVisibilityStatus } from '../../utils/isObjectVisible';

export const finder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {astro} = req.body
    const userTimezone = req.headers.timezone;           // Ej: "America/Argentina/Buenos_Aires" o "GMT-3"
    // @ts-expect-error
    const offsetHours = parseInt(userTimezone.substring(3)); // Convierte "-3" a -3
    const nowUTC = DateTime.now().toUTC();
    const nowInUserOffsetZone = nowUTC.plus({ hours: offsetHours }); // Suma el offset (si es negativo, resta)
    const yearUTC = nowInUserOffsetZone.year.toString();
    const monthUTC = nowInUserOffsetZone.month.toString();
    const dayUTC = nowInUserOffsetZone.day.toString();
    const hourUTC = nowInUserOffsetZone.hour.toString();
    const minuteUTC = nowInUserOffsetZone.minute.toString();
    const secondUTC = nowInUserOffsetZone.second.toString();
    const datetime: DateTimeProps = {
      yearUTC,
      monthUTC,
      dayUTC,
      hourUTC,
      minuteUTC,
      secondUTC
    }
    console.info(`Calculated UTC for Python: ${yearUTC}-${monthUTC}-${dayUTC} ${hourUTC}:${minuteUTC}:${secondUTC}`);
    if (!astro) {
     res.status(400).json({ message: `Astro is required` });
     return
    }
    // @ts-expect-error lat lon
    const coordinates = await getCoordinates(astro, req.headers.lat, req.headers.lon, datetime)
    console.log('coordinates', coordinates)
    if (!coordinates) {
     res.status(400).json({ message: `${astro} was not found in database` });
     return
    }
    const objectInformation = parseCoordinates(coordinates)
    if (!objectInformation) {
      res.status(400).json({ message: 'Invalid coordinates' });
      return
    }
    const {dec, localSiderealTime, ra, gst} = objectInformation
    // @ts-expect-error userState
    const {lat, lon, country, timezone} = req.userState as UserState
    const visibilityStatus = getVisibilityStatus({lat, dec, localSiderealTime, ra})
    res.json({astro, 
              dec,
              ra,
              visibilityStatus,
              localInformation: {
                localSiderealTime,
                lat, lon,
                country,
                timezone,
                datetime
              },
              metadata: {
                sideralSpeed: SIDERAL_SPEED,
                greenwichSiderealTime: gst
              }
            });
  } catch (error) {
    res.status(500).json({ message: 'Error', error });
    return
  }
};