import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controller/cart.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Retrieve cart
router.get('/', ...(requireAuth as any), getCart);

// Add item to cart
router.post('/', ...(requireAuth as any), addToCart);

// Update item quantity
router.put('/:id', ...(requireAuth as any), updateCartItem);

// Remove item from cart
router.delete('/:id', ...(requireAuth as any), removeFromCart);

export default router;
