import { Router } from 'express';
import asyncHandler from 'express-async-handler';
// import User from '../../models/user';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use('/', authMiddleware);

// GET /user
router.get('/', asyncHandler(async (req, res, _) => {
  const user = req.decoded;
  return res.json(user);
}));

export default router;
