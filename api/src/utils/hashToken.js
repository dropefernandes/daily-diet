import crypto from 'crypto';

export default function hashToken(token) {
  return crypto.createHash('sha512').update(token).digest('hex');
}