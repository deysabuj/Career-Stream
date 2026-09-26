import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  GraduationCap,
  Building2
} from 'lucide-react';
import { getIndustryBySlug, Industry } from '../constants/industries';
import { COMPANY_CONFIGS, CompanyConfig } from '../constants/companies';
import { CompanyLogo } from '../components/CompanyLogo';
import { JobCard } from '../components/JobCard';
import { jobsApi } from '../services/api';
import { Job } from '../types';

export const IndustryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const industry = getIndustryBySlug(slug);

  const [industryJobs, setIndustryJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter companies belonging to this industry
  const matchingCompanies: CompanyConfig[] = Object.values(COMPANY_CONFIGS).filter(
    (c) => c.industrySlug === slug || c.industry.toLowerCase().includes(slug || '')
  );

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const res = await jobsApi.getJobs();
        setIndustryJobs(res.jobs);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [slug]);

  if (!industry) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Industry Sector Not Found</h2>
        <p className="text-xs text-zinc-400">Explore all available early-career sectors in the Industry Hub.</p>
        <Link to="/industries" className="inline-block px-4 py-2 bg-amber-500 text-black rounded-xl text-xs font-bold">
          Back to Industry Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link to="/industries" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Industry Hub
      </Link>

      {/* Sector Header Banner */}
      <div className="rounded-3xl glass-panel p-8 border border-zinc-800 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" /> Sector Overview
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{industry.name}</h1>
        <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">{industry.description}</p>

        {/* Featured domains */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 font-semibold">Key Domains:</span>
          {industry.featuredDomains.map((dom) => (
            <span key={dom} className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 font-medium">
              {dom}
            </span>
          ))}
        </div>
      </div>

      {/* Top Hiring Companies in Sector */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" /> Monitored Companies in {industry.name}
          </h2>
          <span className="text-xs text-zinc-400">{matchingCompanies.length} Companies</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingCompanies.map((comp) => (
            <Link
              key={comp.id}
              to={`/companies/${comp.slug}`}
              className="p-5 rounded-2xl glass-card border border-zinc-800 flex items-center gap-4 group"
            >
              <CompanyLogo company={comp.slug} size="md" />
              <div className="truncate">
                <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors truncate">{comp.name}</h3>
                <p className="text-xs text-zinc-400 truncate">{comp.industry}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {comp.domains.slice(0, 2).map((d) => (
                    <span key={d} className="text-[10px] text-amber-400/90 font-medium">
                      #{d}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Skills & Career Paths Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl glass-panel border border-zinc-800 space-y-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> High-Demand Skills in {industry.name}
          </h3>
          <div className="flex flex-wrap gap-2 pt-2">
            {industry.popularSkills.map((sk) => (
              <span key={sk} className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-medium">
                ✓ {sk}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-zinc-800 space-y-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-orange-400" /> Early-Career Entry Roles
          </h3>
          <ul className="space-y-2 text-xs text-zinc-300">
            {industry.careerPaths.map((cp) => (
              <li key={cp} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{cp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Active Roles Stream */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Latest Verified Opportunities in {industry.name}</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-zinc-900/60 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industryJobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
