import { Router } from 'express';
import authRoutes from './auth.routes.js';
import jobsRoutes from './jobs.routes.js';
import companiesRoutes from './companies.routes.js';
import usersRoutes from './users.routes.js';
import recommendationsRoutes from './recommendations.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);
router.use('/companies', companiesRoutes);
router.use('/users', usersRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/admin', adminRoutes);

export default router;
