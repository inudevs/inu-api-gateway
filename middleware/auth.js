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
  console.log(req.headers)
  const token = req.headers['authorization'] || req.query.token;
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized; No token found',
    });
  }

  try {
    verify(token).then(decoded => {
      req.decoded = decoded;
      return next();
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
