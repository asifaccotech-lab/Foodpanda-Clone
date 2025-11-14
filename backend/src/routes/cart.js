import { Router } from 'express';
import { getCart, addToCart, updateCartItem, deleteCartItem } from '../controllers/cartController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, getCart);
router.post('/', authRequired, addToCart);
router.put('/item/:id', authRequired, updateCartItem);
router.delete('/item/:id', authRequired, deleteCartItem);

export default router;