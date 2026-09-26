import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { SavedJobsController } from '../controllers/savedJobs.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/profile', UsersController.getProfile);
router.put('/profile', UsersController.updateProfile);
router.get('/saved-jobs', SavedJobsController.getSavedJobs);

export default router;
