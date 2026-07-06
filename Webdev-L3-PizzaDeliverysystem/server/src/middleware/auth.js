import { verifyAccessToken } from '../utils/token.js';
import { User } from '../models/User.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('[middleware/auth]', err.message);
    res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });
  }
};
