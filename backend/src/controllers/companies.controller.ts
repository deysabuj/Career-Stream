import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/company.service.js';

export class CompaniesController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await CompanyService.getAllCompanies();
      res.json({
        success: true,
        data: companies,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const company = await CompanyService.getCompanyBySlug(slug);

      if (!company) {
        return res.status(404).json({
          success: false,
          error: { code: 'COMPANY_NOT_FOUND', message: 'Company profile not found.' },
        });
      }

      res.json({
        success: true,
        data: company,
      });
    } catch (err) {
      next(err);
    }
  }
}
