import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../../models/user';
import { authMiddleware } from '../../middleware/auth';
import { inuCheckMiddleware } from '../../middleware/privileges';

const router = Router();

router.use('/', [
  authMiddleware,
  inuCheckMiddleware
]);

// GET /user
router.get('/', asyncHandler(async (req, res, _) => {
  const users = await User.find({});
  return res.json(users);
}));

export default router;
