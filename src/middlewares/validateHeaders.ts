import { Request, Response, NextFunction } from 'express';

export function validateRequiredHeaders(req: Request, res: Response, next: NextFunction): void {
  const requiredHeaders = ['lat', 'lon', 'country', 'timezone'];

  const missing = requiredHeaders.filter((h) => {
    const value = req.headers[h];
    return typeof value !== 'string';
  });

  if (missing.length > 0) {
    res.status(400).json({
      message: `Missing or invalid headers: ${missing.join(', ')}`,
    });
    return;
  }

  // @ts-expect-error userState req
  req.userState = {
    lat: req.headers.lat as string,
    lon: req.headers.lon as string,
    country: req.headers.country as string,
    timezone: req.headers.timezone as string,
  };

  next();
}
