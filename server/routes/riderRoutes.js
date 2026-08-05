import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as rider from '../controllers/riderController.js';

const router = Router();
router.use(authenticate, authorize('rider'));
router.get('/orders', asyncHandler(rider.assignedOrders));
router.patch('/orders/:orderId/accept', asyncHandler(rider.acceptDelivery));
router.patch('/orders/:orderId/pickup', asyncHandler(rider.updatePickup));
router.patch('/orders/:orderId/delivery', asyncHandler(rider.updateDelivery));
export default router;
