import { Router } from 'express';
import { createOrderController, getOrdersController, getOrderByIdController } from '../controller/order.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Create Order (Checkout)
router.post('/', createOrderController);

// Get Order History
router.get('/', getOrdersController);

// Get Single Order     
router.get('/:id', getOrderByIdController);

export default router;