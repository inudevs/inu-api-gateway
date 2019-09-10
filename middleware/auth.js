import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const secret = randomBytes(10).toString('base64');

const sign = (data) => {
  return jwt.sign({ data }, secret);
}

const verify = (token) => new Promise(
  (resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err)
      resolve(decoded)
    })
  }
);

const authMiddleware = (req, res, next) => {
  const token = req.headers['Authorization'] || req.query.token
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized; No token found'
    })
  }

  try {
    const { decoded } = await verify(token);
    req.decoded = decoded;
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  sign,
  authMiddleware,
};
