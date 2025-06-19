import { toRadians } from './toRadians'

function calculateHourAngle(lst: number, ra: number): number {
  let H = lst - ra;

  // Normalizar a rango [0, 24)
  if (H < 0) H += 24;
  if (H >= 24) H -= 24;

  return H; // en horas
}

// @ts-expect-error params
export const getVisibilityStatus = ({ lat, dec, localSiderealTime, ra }): { isVisible: boolean, altitude: number } => {
  const H = calculateHourAngle(localSiderealTime, ra); // en horas
  const H_deg = H * 15; // pasar a grados

  const sinAlt = Math.sin(toRadians(lat)) * Math.sin(toRadians(dec)) +
                 Math.cos(toRadians(lat)) * Math.cos(toRadians(dec)) * Math.cos(toRadians(H_deg));

  const altitude = Math.asin(sinAlt) * (180 / Math.PI); // en grados

  return {
    isVisible: altitude > 0,
    altitude
  }
}
