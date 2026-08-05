import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as admin from '../controllers/adminController.js';

const router = Router();
router.use(authenticate, authorize('admin'));
router.get('/customers', asyncHandler(admin.listCustomers));
router.get('/restaurants', asyncHandler(admin.listRestaurants));
router.get('/riders', asyncHandler(admin.listRiders));
router.get('/orders', asyncHandler(admin.listOrders));
router.patch('/customers/:userId/status', asyncHandler(admin.setCustomerStatus));
router.patch('/restaurants/:restaurantId/status', asyncHandler(admin.setRestaurantStatus));
router.patch('/riders/:userId/status', asyncHandler(admin.setRiderStatus));
router.patch('/orders/:orderId/rider', asyncHandler(admin.assignRider));
export default router;
