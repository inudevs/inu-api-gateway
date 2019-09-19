import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import Log from '../../models/log';

const router = Router();

router.get('/', asyncHandler(async (req, res, _) => {
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const logs = await Log.find({
    'timestamp': {
      "$gt": yesterday.getTime(),
      "$lt": new Date().getTime(),
    },
  });
  return res.json(logs);
}));

export default router;
