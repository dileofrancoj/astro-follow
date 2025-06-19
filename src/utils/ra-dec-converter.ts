interface ParseCoordinatesProps {
  ra: number,
  dec: number
  gst: number,
  localSiderealTime: number,
}
export const parseCoordinates = (coordinates: string): ParseCoordinatesProps | null => {
  if (!coordinates) return null;

  const parts = coordinates.split(';');
  if (parts.length !== 4) return null;

  const ra = parseFloat(parts[0]);
  const dec = parseFloat(parts[1]);
  const gst = parseFloat(parts[2]);
  const localSiderealTime = parseFloat(parts[3]);
  if (isNaN(ra) || isNaN(dec)) return null;

  return { ra, dec, gst, localSiderealTime};
}