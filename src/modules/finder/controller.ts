import { Request, Response } from 'express';

import { getCoordinates } from './service';
import { parseCoordinates, getDateTimeUTC, getVisibilityStatus } from '../../utils';
import { UserState } from '../../interfaces/UserState';
import { SIDERAL_SPEED } from '../../constants/earth';

export const finder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {astro} = req.body
    const userTimezone = req.headers.timezone;
    // @ts-expect-error not null
    const datetime = getDateTimeUTC(userTimezone)
    if (!astro) {
     res.status(400).json({ message: `Astro is required` });
     return
    }
    // @ts-expect-error userState
    const {lat, lon, country, timezone} = req.userState as UserState

    const coordinates = await getCoordinates(astro, lat, lon, datetime)
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
    const visibilityStatus = getVisibilityStatus({lat, dec, localSiderealTime, ra})
    res.json({
              object: astro, 
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