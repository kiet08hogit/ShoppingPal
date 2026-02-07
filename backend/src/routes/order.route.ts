import { Router } from 'express';
import { createOrder, getOrders, getOrderById } from '../controller/order.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Create Order (Checkout)
router.post('/', createOrder);

// Get Order History
router.get('/', getOrders);

// Get Single Order
router.get('/:id', getOrderById);

export default router;
