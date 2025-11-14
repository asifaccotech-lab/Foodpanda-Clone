import { Router } from 'express';
import { listRestaurants, getRestaurantById } from '../controllers/restaurantController.js';

const router = Router();

router.get('/', listRestaurants);
router.get('/:id', getRestaurantById);

export default router;