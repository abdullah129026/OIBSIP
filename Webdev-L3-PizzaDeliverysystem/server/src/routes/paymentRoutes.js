import { Router } from 'express';
import { body } from 'express-validator';

import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
import { verifyJWT } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const selectionRules = [
  body('selection.base').trim().notEmpty().withMessage('Choose a base.'),
  body('selection.sauce').trim().notEmpty().withMessage('Choose a sauce.'),
  body('selection.cheese').trim().notEmpty().withMessage('Choose a cheese.'),
  body('selection.veggies').optional().isArray().withMessage('Invalid veggie selection.'),
];

router.post('/create-order', verifyJWT, selectionRules, validate, createPaymentOrder);

router.post(
  '/verify',
  verifyJWT,
  [
    body('razorpay_order_id').trim().notEmpty().withMessage('Missing order id.'),
    body('razorpay_payment_id').trim().notEmpty().withMessage('Missing payment id.'),
    body('razorpay_signature').trim().notEmpty().withMessage('Missing signature.'),
    ...selectionRules,
  ],
  validate,
  verifyPayment
);

export default router;
