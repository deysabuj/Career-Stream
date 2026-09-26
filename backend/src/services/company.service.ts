import { prisma, isDBConnected } from '../database/db.js';
import { connectorRegistry } from '../connectors/registry.js';

export class CompanyService {
  public static async getAllCompanies(params?: { search?: string; industry?: string; domain?: string }) {
    const search = params?.search?.toLowerCase();
    const industry = params?.industry?.toLowerCase();

    if (isDBConnected) {
      try {
        const where: any = {};
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { industry: { contains: search, mode: 'insensitive' } },
          ];
        }
        if (industry) {
          where.industry = { contains: industry, mode: 'insensitive' };
        }

        const companies = await prisma.company.findMany({
          where,
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { jobs: { where: { status: 'ACTIVE' } } },
            },
          },
        });
        if (companies && companies.length > 0) {
          return companies.map(c => ({
            ...c,
            activeJobsCount: c._count?.jobs ?? 0,
          }));
        }
      } catch (e) {}
    }

    const connectors = connectorRegistry.getAllConnectors();
    let result = connectors.map((c) => ({
      id: `comp-${c.companySlug}`,
      name: c.companyName,
      slug: c.companySlug,
      logoUrl: c.logoUrl,
      website: c.careerPageUrl,
      careerUrl: c.careerPageUrl,
      industry: c.industry,
      description: c.description,
      activeJobsCount: 0,
    }));

    if (search) {
      result = result.filter(
        (c) => c.name.toLowerCase().includes(search) || c.industry.toLowerCase().includes(search)
      );
    }
    if (industry) {
      result = result.filter((c) => c.industry.toLowerCase().includes(industry));
    }

    return result;
  }

  public static async getCompanyBySlug(slug: string) {
    if (isDBConnected) {
      try {
        const company = await prisma.company.findUnique({
          where: { slug },
          include: {
            jobs: {
              where: { status: 'ACTIVE' },
              orderBy: { postedAt: 'desc' },
              include: {
                company: {
                  select: { id: true, name: true, slug: true, logoUrl: true, industry: true },
                },
              },
            },
          },
        });
        if (company) return company;
      } catch (e) {}
    }

    const connector = connectorRegistry.getConnector(slug);
    if (!connector) return null;

    const rawJobs = await connector.fetchJobs();
    const jobs = rawJobs.map((j) => ({
      id: j.externalJobId,
      companyId: `comp-${connector.companySlug}`,
      externalJobId: j.externalJobId,
      title: j.title,
      description: j.description,
      location: j.location,
      workMode: j.workMode as any,
      employmentType: j.employmentType as any,
      experienceMin: 0,
      experienceMax: 1,
      category: j.category,
      postedAt: j.postedAt ? new Date(j.postedAt).toISOString() : new Date().toISOString(),
      sourceUrl: j.sourceUrl,
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
    }));

    return {
      id: `comp-${connector.companySlug}`,
      name: connector.companyName,
      slug: connector.companySlug,
      logoUrl: connector.logoUrl,
      website: connector.careerPageUrl,
      careerUrl: connector.careerPageUrl,
      industry: connector.industry,
      description: connector.description,
      activeJobsCount: jobs.length,
      jobs,
    };
  }
}
