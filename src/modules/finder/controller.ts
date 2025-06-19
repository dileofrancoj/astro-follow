import { Request, Response } from 'express';
import { getCoordinates } from './service';
import { parseCoordinates } from '../../utils/ra-dec-converter';
import { UserState } from '../../interfaces/UserState';
import { SIDERAL_SPEED } from '../../constants/earth';
import { getVisibilityStatus } from '../../utils/isObjectVisible';

export const finder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {astro} = req.body
    if (!astro) {
     res.status(400).json({ message: `Astro is required` });
     return
    }
    // @ts-expect-error lat lon
    const coordinates = await getCoordinates(astro, req.headers.lat, req.headers.lon)
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
                timezone 
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