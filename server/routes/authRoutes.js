import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { adminLogin, customerLogin, registerAdmin, registerCustomer, registerRestaurant, registerRider, restaurantLogin, riderLogin } from '../controllers/authController.js';

const router = Router();
router.post('/customer/register', asyncHandler(registerCustomer));
router.post('/restaurant/register', asyncHandler(registerRestaurant));
router.post('/rider/register', asyncHandler(registerRider));
router.post('/admin/register', asyncHandler(registerAdmin));
router.post('/customer/login', asyncHandler(customerLogin));
router.post('/restaurant/login', asyncHandler(restaurantLogin));
router.post('/rider/login', asyncHandler(riderLogin));
router.post('/admin/login', asyncHandler(adminLogin));
export default router;
