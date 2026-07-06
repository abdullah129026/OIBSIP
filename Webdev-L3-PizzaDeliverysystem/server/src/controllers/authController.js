import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import { User } from '../models/User.js';
import { BCRYPT_ROUNDS } from '../utils/constants.js';
import { signAccessToken, createEmailToken, hashToken } from '../utils/token.js';
import { sendVerifyEmail, sendResetEmail } from '../services/emailService.js';

const VERIFY_TTL = 24 * 60 * 60 * 1000;
const RESET_TTL = 60 * 60 * 1000;

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
});

const rejectInvalid = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, error: errors.array()[0].msg });
    return true;
  }
  return false;
};

export const register = async (req, res) => {
  if (rejectInvalid(req, res)) return;
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const { raw, hashed } = createEmailToken();

    const user = await User.create({
      name,
      email,
      password: hash,
      verifyToken: hashed,
      verifyTokenExpiry: new Date(Date.now() + VERIFY_TTL),
    });

    await sendVerifyEmail(user.email, raw);

    res.status(201).json({
      success: true,
      data: { message: 'Account created. Check your email to verify your account.' },
    });
  } catch (err) {
    console.error('[auth/register]', err.message);
    res.status(500).json({ success: false, error: 'Could not create account. Please try again.' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const hashed = hashToken(req.params.token);
    const user = await User.findOne({
      verifyToken: hashed,
      verifyTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Verification link is invalid or expired.' });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, data: { message: 'Email verified. You can now log in.' } });
  } catch (err) {
    console.error('[auth/verifyEmail]', err.message);
    res.status(500).json({ success: false, error: 'Could not verify email. Please try again.' });
  }
};

export const login = async (req, res) => {
  if (rejectInvalid(req, res)) return;
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, error: 'Please verify your email before logging in.' });
    }

    const token = signAccessToken(user);
    res.json({ success: true, data: { token, user: publicUser(user) } });
  } catch (err) {
    console.error('[auth/login]', err.message);
    res.status(500).json({ success: false, error: 'Could not log in. Please try again.' });
  }
};

export const adminLogin = async (req, res) => {
  if (rejectInvalid(req, res)) return;
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin' || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
    }

    const token = signAccessToken(user);
    res.json({ success: true, data: { token, user: publicUser(user) } });
  } catch (err) {
    console.error('[auth/adminLogin]', err.message);
    res.status(500).json({ success: false, error: 'Could not log in. Please try again.' });
  }
};

export const me = async (req, res) => {
  res.json({ success: true, data: { user: publicUser(req.user) } });
};

export const forgotPassword = async (req, res) => {
  if (rejectInvalid(req, res)) return;
  const genericMessage = 'If an account exists for that email, a reset link has been sent.';
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const { raw, hashed } = createEmailToken();
      user.resetToken = hashed;
      user.resetTokenExpiry = new Date(Date.now() + RESET_TTL);
      await user.save();
      await sendResetEmail(user.email, raw);
    }

    res.json({ success: true, data: { message: genericMessage } });
  } catch (err) {
    console.error('[auth/forgotPassword]', err.message);
    res.status(500).json({ success: false, error: 'Could not process request. Please try again.' });
  }
};

export const resetPassword = async (req, res) => {
  if (rejectInvalid(req, res)) return;
  try {
    const hashed = hashToken(req.params.token);
    const user = await User.findOne({
      resetToken: hashed,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Reset link is invalid or expired.' });
    }

    user.password = await bcrypt.hash(req.body.password, BCRYPT_ROUNDS);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, data: { message: 'Password updated. You can now log in.' } });
  } catch (err) {
    console.error('[auth/resetPassword]', err.message);
    res.status(500).json({ success: false, error: 'Could not reset password. Please try again.' });
  }
};
