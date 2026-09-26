import { prisma, isDBConnected } from '../database/db.js';
import { JobFilterParams } from '../types/index.js';
import { JobStatus, WorkMode, EmploymentType } from '@prisma/client';
import { connectorRegistry } from '../connectors/registry.js';
import { ExperienceFilter } from '../sync/filter.js';

export class JobService {
  public static async getJobs(params: JobFilterParams) {
    const {
      search,
      companyId,
      companySlug,
      category,
      workMode,
      employmentType,
      location,
      postedWithinDays,
      status = JobStatus.ACTIVE,
      page = 1,
      limit = 12,
      sortBy = 'newest',
    } = params;

    const skip = (page - 1) * limit;

    if (isDBConnected) {
      const where: any = { status };
      if (companyId) where.companyId = companyId;
      if (companySlug) where.company = { slug: companySlug };
      if (category) where.category = { equals: category, mode: 'insensitive' };
      if (workMode) where.workMode = workMode as WorkMode;
      if (employmentType) where.employmentType = employmentType as EmploymentType;

      if (location) {
        where.location = { contains: location, mode: 'insensitive' };
      }

      if (postedWithinDays) {
        const dateCutoff = new Date(Date.now() - postedWithinDays * 24 * 3600 * 1000);
        where.postedAt = { gte: dateCutoff };
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          { company: { name: { contains: search, mode: 'insensitive' } } },
        ];
      }

      try {
        const [jobs, total] = await Promise.all([
          prisma.job.findMany({
            where,
            include: {
              company: {
                select: { id: true, name: true, slug: true, logoUrl: true, industry: true },
              },
            },
            orderBy: { postedAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.job.count({ where }),
        ]);

        return { jobs, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
      } catch (err) {}
    }

    // Connector Registry Fallback
    const connectors = companySlug
      ? [connectorRegistry.getConnector(companySlug)].filter(Boolean)
      : connectorRegistry.getAllConnectors();

    let allJobs: any[] = [];
    for (const connector of connectors) {
      if (!connector) continue;
      const rawList = await connector.fetchJobs();
      for (const r of rawList) {
        if (!ExperienceFilter.isEligibleEarlyCareer(r)) continue;
        allJobs.push({
          id: r.externalJobId,
          companyId: `comp-${connector.companySlug}`,
          externalJobId: r.externalJobId,
          title: r.title,
          description: r.description,
          location: r.location,
          workMode: r.workMode,
          employmentType: r.employmentType,
          experienceMin: 0,
          experienceMax: 1,
          category: r.category,
          postedAt: r.postedAt ? new Date(r.postedAt).toISOString() : new Date().toISOString(),
          sourceUrl: r.sourceUrl,
          status: 'ACTIVE',
          lastVerifiedAt: new Date().toISOString(),
          company: {
            id: `comp-${connector.companySlug}`,
            name: connector.companyName,
            slug: connector.companySlug,
            logoUrl: connector.logoUrl,
            industry: connector.industry,
          },
        });
      }
    }

    if (search) {
      const q = search.toLowerCase();
      allJobs = allJobs.filter((j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.company.name.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
      );
    }
    if (workMode) allJobs = allJobs.filter((j) => j.workMode === workMode);
    if (employmentType) allJobs = allJobs.filter((j) => j.employmentType === employmentType);
    if (category) allJobs = allJobs.filter((j) => j.category.toLowerCase() === category.toLowerCase());
    if (location) allJobs = allJobs.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));

    const total = allJobs.length;
    const paginated = allJobs.slice(skip, skip + limit);

    return {
      jobs: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async getJobById(id: string) {
    if (isDBConnected) {
      try {
        const job = await prisma.job.findUnique({
          where: { id },
          include: { company: true },
        });
        if (job) return job;
      } catch (err) {}
    }

    const connectors = connectorRegistry.getAllConnectors();
    for (const connector of connectors) {
      const rawList = await connector.fetchJobs();
      const match = rawList.find((r) => r.externalJobId === id);
      if (match) {
        return {
          id: match.externalJobId,
          companyId: `comp-${connector.companySlug}`,
          externalJobId: match.externalJobId,
          title: match.title,
          description: match.description,
          location: match.location,
          workMode: match.workMode as any,
          employmentType: match.employmentType as any,
          experienceMin: 0,
          experienceMax: 1,
          category: match.category,
          postedAt: match.postedAt ? new Date(match.postedAt).toISOString() : new Date().toISOString(),
          sourceUrl: match.sourceUrl,
          status: 'ACTIVE' as const,
          lastVerifiedAt: new Date().toISOString(),
          company: {
            id: `comp-${connector.companySlug}`,
            name: connector.companyName,
            slug: connector.companySlug,
            logoUrl: connector.logoUrl,
            industry: connector.industry,
            website: connector.careerPageUrl,
            careerUrl: connector.careerPageUrl,
            description: connector.description,
          },
        };
      }
    }
    return null;
  }

  public static async getCategories() {
    return [
      'Software Engineering',
      'AI / Machine Learning',
      'Data Science',
      'Data Analytics',
      'Cybersecurity',
      'Cloud & Infrastructure',
      'Product Management',
      'UI/UX Design',
      'Finance & Consulting',
    ];
  }
}
