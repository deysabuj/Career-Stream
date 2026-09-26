import { Router } from 'express';
import { JobsController } from '../controllers/jobs.controller.js';
import { SavedJobsController } from '../controllers/savedJobs.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', JobsController.getJobs);
router.get('/categories', JobsController.getCategories);
router.get('/:id', JobsController.getJobById);
router.get('/:id/resume-match', JobsController.getJobResumeMatch);

// Saved job actions
router.post('/:id/save', authenticate, SavedJobsController.saveJob);
router.delete('/:id/save', authenticate, SavedJobsController.removeSavedJob);

export default router;
