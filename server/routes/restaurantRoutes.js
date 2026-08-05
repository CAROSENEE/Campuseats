import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as restaurant from '../controllers/restaurantController.js';

const router = Router();
router.use(authenticate, authorize('restaurant'));
router.get('/orders', asyncHandler(restaurant.restaurantOrders));
router.patch('/orders/:orderId/decision', asyncHandler(restaurant.decideOrder));
router.patch('/orders/:orderId/status', asyncHandler(restaurant.updateOrderStatus));
router.get('/foods', asyncHandler(restaurant.listFood));
router.post('/foods', asyncHandler(restaurant.addFood));
router.patch('/foods/:foodId', asyncHandler(restaurant.editFood));
router.patch('/foods/:foodId/availability', asyncHandler(restaurant.updateFoodAvailability));
router.delete('/foods/:foodId', asyncHandler(restaurant.deleteFood));
export default router;
