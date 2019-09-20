import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../../models/user';
import { sign } from '../../middleware/auth';

const router = Router();

// POST /auth/login
router.post('/', asyncHandler(async (req, res, _) => {
  const { email, password } = req.body;
  let user = {};
  if (!email.includes('@')) { // 이메일이 아님
    // 디미고 아이디니까 그걸로 디비 쿼리
    user = await User.findOne({ 'student.id': email });
    if (!user) {
      return res.status(404).json({
        message: '주어진 디미고 아이디를 가진 사용자가 없습니다.',
      });
    }
  } else { // 이메일
    user = await User.findOne({ email });

    // 해당 이메일의 사용자가 존재하지 않음
    if (!user) {
      return res.status(404).json({
        message: '주어진 이메일을 가진 사용자가 없습니다.',
      });
    }
  }

  // 잘못된 패스워드
  if (!user.verifyPassword(password)) {
    return res.status(401).json({
      message: '패스워드가 잘못되었습니다.',
    });
  }

  return res.json({
    id: user.id,
    token: sign(user),
  });
}));

export default router;
