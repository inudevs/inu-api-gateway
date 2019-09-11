import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../../models/user';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// POST /auth/migrate
router.use('/', authMiddleware);
router.post('/', asyncHandler(async (req, res, _) => {
}));

export default router;
