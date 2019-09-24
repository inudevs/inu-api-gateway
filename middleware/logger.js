import asyncHandler from 'express-async-handler';
import Log from '../models/log';

export const loggerMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.originalUrl.includes('/api'))
    return next();
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    Log.create(req.originalUrl, req.method, res.statusCode, elapsedTimeInMs);
  });
  return next();
});
