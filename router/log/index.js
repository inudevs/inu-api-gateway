import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import Log from '../../models/log';

const router = Router();

router.get('/', asyncHandler(async (req, res, _) => {
  const today = new Date().getTime();
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday = yesterday.getTime();
  const logs = await Log.find({
    'timestamp': {
      "$gt": yesterday,
      "$lt": today,
    },
  });
  return res.json({
    start: yesterday,
    end: today,
    logs,
  });
}));

export default router;
