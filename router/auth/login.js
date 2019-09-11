import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../../models/user';
import { sign } from '../../middleware/auth';

const router = Router();

// POST /auth/login
router.post('/', asyncHandler(async (req, res, _) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // 해당 이메일의 사용자가 존재하지 않음
  if (!user) {
    return res.status(404).json({
      message: 'No such user with given email',
    });
  }

  // 잘못된 패스워드
  if (!user.verifyPassword(password)) {
    return res.status(401).json({
      message: 'Wrong password',
    });
  }

  return res.json({
    token: sign(user),
  });
}));

export default router;
