import { Router } from 'express';
import { authRequired, adminRequired } from '../middleware/auth.js';
import { listAllOrders, updateOrderStatus } from '../controllers/adminController.js';

const router = Router();

router.get('/orders', authRequired, adminRequired, listAllOrders);
router.put('/orders/:id/status', authRequired, adminRequired, updateOrderStatus);

export default router;