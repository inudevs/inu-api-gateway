import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../../models/user';
import { authMiddleware } from '../../middleware/auth';
import { adminCheckMiddleware } from '../../middleware/privileges';

const router = Router();

// POST /auth/assign
router.use('/', authMiddleware);
router.use('/', adminCheckMiddleware);
router.post('/', asyncHandler(async (req, res, _) => {
  const { id, type } = req.body;
  const user = await User.findById(id);
  
  // 사용자 없음
  if (!user) {
    return res.status(404).json({
      message: 'No such user with given id',      
    });
  }

  if (type ===  'inu') {
    if (user.type !== 'dimigo') {
      return res.status(400).json({
        message: 'User must be a dimigo student',
      });
    }
    user.assignInu();
  } else if (type === 'admin') {
    if (!user.inu) {
      return res.status(400).json({
        message: 'User must be a INU member',
      });
    }
    user.assignAdmin();
  }
  res.sendStatus(200);
}));

export default router;
