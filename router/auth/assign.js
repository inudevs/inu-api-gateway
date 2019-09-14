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
      message: '주어진 id를 가진 사용자가 없습니다.',
    });
  }

  if (type ===  'inu') {
    if (user.type !== 'dimigo') {
      return res.status(400).json({
        message: '디미고 학생 계정이여야만 합니다.',
      });
    }
    user.assignInu();
  } else if (type === 'admin') {
    if (!user.inu) {
      return res.status(400).json({
        message: 'INU 동아리원 계정이여야만 합니다.',
      });
    }
    user.assignAdmin();
  }
  res.sendStatus(200);
}));

export default router;
