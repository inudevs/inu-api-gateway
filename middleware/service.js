import { verify } from './auth';

export const serviceMiddleware = async (req, res, next) => {
  // 서비스 API 키로 인증
  const serviceKey = req.headers['key'] || req.query.key;
  const service = await Service.findById(serviceKey);
  res.service = service;

  if (service) {
    return next();
  }

  // INU 토큰으로 인증
  const token = req.headers['authorization'] || req.query.token;
  if (!token) {
    return req.status(401).json({
      message: '서비스 키 또는 토큰을 찾을 수 없습니다.',
    });
  }

  verify(token).then(decoded => {
    const identity = decoded.data;
    if (!identity.inu) {
      return res.status(401).json({
        message: 'INU 동아리원이 아닙니다.',
      });
    }
    res.identity = identity;
    return next();
  })
}
