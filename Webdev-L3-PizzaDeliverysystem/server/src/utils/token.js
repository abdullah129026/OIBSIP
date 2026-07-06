import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const signAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

// Returns the raw token (emailed to the user) and its hash (stored in DB).
export const createEmailToken = () => {
  const raw = crypto.randomBytes(32).toString('hex');
  const hashed = hashToken(raw);
  return { raw, hashed };
};

export const hashToken = (raw) =>
  crypto.createHash('sha256').update(raw).digest('hex');
