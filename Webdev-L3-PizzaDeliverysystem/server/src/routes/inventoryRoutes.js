import { Router } from 'express';
import { body } from 'express-validator';

import { getBuilderOptions, getAllInventory, updateInventoryStock } from '../controllers/inventoryController.js';
import { verifyJWT } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/options', verifyJWT, getBuilderOptions);

router.get('/', verifyJWT, admin, getAllInventory);

router.patch(
  '/:id',
  verifyJWT,
  admin,
  [
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a positive integer.'),
    body('threshold').optional().isInt({ min: 0 }).withMessage('Threshold must be a positive integer.')
  ],
  validate,
  updateInventoryStock
);

export default router;
