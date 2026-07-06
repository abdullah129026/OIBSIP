import { Router } from 'express';
import { body } from 'express-validator';

import {
  register,
  verifyEmail,
  login,
  adminLogin,
  me,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { verifyJWT } from '../middleware/auth.js';

const router = Router();

const emailRule = body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail();
const passwordRule = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters.');

router.post(
  '/register',
  [body('name').trim().notEmpty().withMessage('Name is required.'), emailRule, passwordRule],
  register
);

router.get('/verify/:token', verifyEmail);

router.post('/login', [emailRule, body('password').notEmpty().withMessage('Password is required.')], login);

router.post(
  '/admin/login',
  [emailRule, body('password').notEmpty().withMessage('Password is required.')],
  adminLogin
);

router.get('/me', verifyJWT, me);

router.post('/forgot-password', [emailRule], forgotPassword);

router.post('/reset-password/:token', [passwordRule], resetPassword);

export default router;
