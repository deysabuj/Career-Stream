import { Router } from 'express';
import { CompaniesController } from '../controllers/companies.controller.js';

const router = Router();

router.get('/', CompaniesController.getAll);
router.get('/:slug', CompaniesController.getBySlug);

export default router;
