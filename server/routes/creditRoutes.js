import express from 'express';
import { getPlans, purchasePlan } from '../controllers/creditController.js';
import { protect } from '../middlewares/auth.js';

const creditRouter = express.Router();


// Define routes for credits
creditRouter.get('/plan', getPlans);
creditRouter.post('/purchase', protect, purchasePlan);

export default creditRouter;