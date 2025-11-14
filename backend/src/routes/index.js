import { Router } from 'express';
import authRouter from './auth.js';
import restaurantsRouter from './restaurants.js';
import menuRouter from './menu.js';
import cartRouter from './cart.js';
import ordersRouter from './orders.js';
import adminRouter from './admin.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/restaurants', restaurantsRouter);
router.use('/restaurants', menuRouter);
router.use('/cart', cartRouter);
router.use('/orders', ordersRouter);
router.use('/admin', adminRouter);

export default router;