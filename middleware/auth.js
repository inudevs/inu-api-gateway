import { sign as signJwt, verify as verifyJwt } from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const secret = randomBytes(10).toString('base64');

export function sign(data) {
  return signJwt({ data }, secret);
}

export function verify(token) {
  return verifyJwt(token, secret, (err, result) => {
    if (err) {
      return err;
    }
    return result;
  });
}
