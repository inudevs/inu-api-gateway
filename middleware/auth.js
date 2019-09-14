import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const secret = randomBytes(10).toString('base64');

const sign = (data) => {
  return jwt.sign({ data }, secret);
}

const verify = (token) => new Promise(
  (resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  }
);

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'] || req.query.token;
  if (!token) {
    return res.status(401).json({
      message: '액세스 토큰을 찾을 수 없습니다.',
    });
  }

  try {
    verify(token).then(decoded => {
      req.decoded = decoded;
      return next();
    }).catch(error => {
      return res.status(401).json({
        message: error.message,
      }); 
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}

module.exports = {
  sign,
  authMiddleware,
};
