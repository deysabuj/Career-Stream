import { Router } from 'express';
import { RecommendationsController } from '../controllers/recommendations.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, RecommendationsController.getRecommendations);

export default router;
