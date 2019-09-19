export const adminCheckMiddleware = (req, res, next) => {
  const { identity } = req;

  // 관리자가 아님
  if (!identity.admin) {
    return res.status(403).json({
      message: '관리자 사용자가 아닙니다.',
    });
  }
  return next();
}

export const inuCheckMiddleware = (req, res, next) => {
  const { identity } = req;

  // INU 동아리원이 아님
  if (!identity.inu) {
    return res.status(403).json({
      message: 'INU 동아리원이 아닙니다.',
    });
  }
  return next();
}
