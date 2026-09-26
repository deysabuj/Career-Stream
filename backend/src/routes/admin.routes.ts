import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';

const router = Router();

router.post('/sync/trigger', AdminController.triggerSync);
router.get('/sync-status', AdminController.getSyncStatus);

export default router;
