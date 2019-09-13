export const adminCheckMiddleware = (req, res, next) => {
  const identity = req.decoded;

  // 관리자가 아님
  if (!identity.admin) {
    return res.status(403).json({
      message: 'Forbidden; Not an admin user',
    });
  }
}

export const inuCheckMiddleware = (req, res, next) => {
  const identity = req.decoded;

  // INU 동아리원이 아님
  if (!identity.inu) {
    return res.status(403).json({
      message: 'Forbidden; Not an INU member',
    });
  }
}
