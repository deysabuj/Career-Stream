import { z } from 'zod';

export const rawJobSchema = z.object({
  externalJobId: z.string().min(1, 'externalJobId is required'),
  title: z.string().min(1, 'title is required'),
  companyName: z.string().min(1, 'companyName is required'),
  description: z.string().min(1, 'description is required'),
  location: z.string().default('Location Unspecified'),
  workMode: z.string().default('ONSITE'),
  employmentType: z.string().default('FULL_TIME'),
  experienceText: z.string().optional(),
  skills: z.array(z.string()).default([]),
  category: z.string().default('Software Engineering'),
  postedAt: z.union([z.string(), z.date()]).optional(),
  deadline: z.union([z.string(), z.date()]).optional(),
  sourceUrl: z.string().url('sourceUrl must be a valid URL'),
});

export function validateRawJob(job: any) {
  const result = rawJobSchema.safeParse(job);
  if (!result.success) {
    console.warn(`[Validation Warning] RawJob validation failed for job '${job?.title || 'Unknown'}':`, result.error.format());
    return null;
  }
  return result.data;
}
