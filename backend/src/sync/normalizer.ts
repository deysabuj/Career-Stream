import crypto from 'crypto';
import { RawJob, NormalizedJob, WorkMode, EmploymentType } from '../types/index.js';

export class JobNormalizer {
  public static normalize(raw: RawJob): NormalizedJob {
    const workMode = this.normalizeWorkMode(raw.workMode, raw.location, raw.title);
    const employmentType = this.normalizeEmploymentType(raw.employmentType, raw.title);
    const postedAt = raw.postedAt ? new Date(raw.postedAt) : new Date();
    const deadline = raw.deadline ? new Date(raw.deadline) : undefined;

    // Generate MD5 content hash to track content updates
    const contentPayload = `${raw.title}|${raw.description.substring(0, 300)}|${raw.location}|${raw.sourceUrl}`;
    const contentHash = crypto.createHash('md5').update(contentPayload).digest('hex');

    return {
      externalJobId: raw.externalJobId,
      title: raw.title.trim(),
      companyName: raw.companyName.trim(),
      description: raw.description.trim(),
      location: raw.location.trim(),
      workMode,
      employmentType,
      experienceMin: 0,
      experienceMax: 1,
      skills: Array.from(new Set(raw.skills)),
      category: raw.category || 'Software Engineering',
      postedAt,
      deadline,
      sourceUrl: raw.sourceUrl.trim(),
      contentHash,
    };
  }

  private static normalizeWorkMode(rawMode: string, location: string, title: string): WorkMode {
    const combined = `${rawMode} ${location} ${title}`.toLowerCase();
    if (combined.includes('remote') || combined.includes('work from home')) return 'REMOTE';
    if (combined.includes('hybrid')) return 'HYBRID';
    return 'ONSITE';
  }

  private static normalizeEmploymentType(rawType: string, title: string): EmploymentType {
    const combined = `${rawType} ${title}`.toLowerCase();
    if (combined.includes('intern')) return 'INTERNSHIP';
    if (combined.includes('trainee')) return 'TRAINEE';
    if (combined.includes('graduate') || combined.includes('new grad')) return 'GRADUATE_PROGRAM';
    return 'FULL_TIME';
  }
}
