import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../../models/user';

const router = Router();

// POST /auth/join
router.post('/', asyncHandler(async (req, res, _) => {
  const { user } = req.body;
  
  if (user.type === 'user') { // 일반 사용자 회원가입
    // 중복 체크
    const dup = await User.findOne({ email: user.email })
    if (dup) {
      return res.status(400).json({
        message: 'User with duplicate email already exists',
      });
    }

    // 키 존재 여부 검증
    ;['type', 'name', 'email', 'password', 'photo'].map((key) => {
      if (!Object(user).hasOwnProperty(key)) {
        return res.status(400).json({
          message: `Field 'user.${key}' required`,
        });
      }
    });

    try {
      const userID = await User.createUser(user);
      return res.json({
        id: userID,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  } else if (user.type === 'dimigo') { // 디미고인 사용자 회원가입
    // 키 존재 여부 검증
    ;['type', 'id', 'password'].map((key) => {
      if (!Object(user).hasOwnProperty(key)) {
        return res.status(400).json({
          message: `Field 'user.${key}' required`,
        });
      }
    });

    try {
      const userID = await User.createDimigo(user);
      return res.json({
        id: userID,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  } else {
    return res.status(400).json({
      message: 'Invalid user type',
    });
  }
}));

export default router;
