import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controller/cart.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Retrieve cart
router.get('/', getCart);

// Add item to cart
router.post('/', addToCart);

// Update item quantity
router.put('/:id', updateCartItem);

// Remove item from cart
router.delete('/:id', removeFromCart);

export default router;
