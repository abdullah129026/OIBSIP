import { Router } from 'express';
import { body } from 'express-validator';

import { verifyJWT } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { validate } from '../middleware/validate.js';
import { getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();

router.get('/mine', verifyJWT, getMyOrders);

router.get('/', verifyJWT, admin, getAllOrders);

router.patch(
  '/:id/status',
  verifyJWT,
  admin,
  [
    body('status').notEmpty().withMessage('Status is required.')
  ],
  validate,
  updateOrderStatus
);

export default router;
