import { Router } from 'express';
import { getMenuForRestaurant } from '../controllers/menuController.js';

const router = Router({ mergeParams: true });

router.get('/:id/menu', getMenuForRestaurant);

export default router;