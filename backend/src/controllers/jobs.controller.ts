import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service.js';
import { AIService } from '../ai/ai.service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { UserService } from '../services/user.service.js';

export class JobsController {
  public static async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const companySlug = req.query.company as string;
      const category = req.query.category as string;
      const workMode = req.query.workMode as any;
      const employmentType = req.query.employmentType as any;
      const location = req.query.location as string;
      const postedWithinDays = req.query.postedWithinDays ? parseInt(req.query.postedWithinDays as string, 10) : undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
      const sortBy = req.query.sortBy as any;

      const result = await JobService.getJobs({
        search,
        companySlug,
        category,
        workMode,
        employmentType,
        location,
        postedWithinDays,
        page,
        limit,
        sortBy,
      });

      res.json({
        success: true,
        data: result.jobs,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const job = await JobService.getJobById(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          error: { code: 'JOB_NOT_FOUND', message: 'The requested opportunity could not be found.' },
        });
      }

      // Generate AI quick summary
      const aiSummary = await AIService.summarizeJob(job.title, job.description, []);

      res.json({
        success: true,
        data: {
          ...job,
          aiSummary,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getJobResumeMatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const job = await JobService.getJobById(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          error: { code: 'JOB_NOT_FOUND', message: 'Job not found.' },
        });
      }

      let userSkills: string[] = ['JavaScript', 'React', 'Python', 'Git', 'Problem Solving'];
      let userDegree = 'B.Tech CS';

      if (req.user) {
        const profile = await UserService.getProfile(req.user.userId);
        if (profile && profile.skills && profile.skills.length > 0) {
          userSkills = profile.skills;
        }
        if (profile && profile.degree) {
          userDegree = profile.degree;
        }
      }

      // Infer job skills from description / category
      const jobSkillsKeywords = ['Python', 'Java', 'React', 'TypeScript', 'SQL', 'C++', 'AWS', 'Node.js', 'Figma', 'Data Structures'];
      const jobSkills = jobSkillsKeywords.filter((k) => job.description.toLowerCase().includes(k.toLowerCase()) || job.title.toLowerCase().includes(k.toLowerCase()));

      const matchData = AIService.calculateResumeMatch(userSkills, jobSkills.length > 0 ? jobSkills : ['Java', 'Problem Solving', 'Data Structures'], userDegree);

      res.json({
        success: true,
        data: matchData,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await JobService.getCategories();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }
}
