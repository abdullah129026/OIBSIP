import { Router } from 'express';

import { getPizzas } from '../controllers/pizzaController.js';

const router = Router();

router.get('/', getPizzas);

export default router;
