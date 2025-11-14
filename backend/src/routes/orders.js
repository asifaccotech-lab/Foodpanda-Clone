import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createOrder, listOrders, getOrderById, getOrderTracking } from '../controllers/orderController.js';

const router = Router();

router.post('/', authRequired, createOrder);
router.get('/', authRequired, listOrders);
router.get('/:id', authRequired, getOrderById);
router.get('/:id/tracking', authRequired, getOrderTracking);

export default router;