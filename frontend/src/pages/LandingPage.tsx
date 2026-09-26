import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  TrendingUp,
  Layers,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { CompanyLogo } from '../components/CompanyLogo';
import { Job, Company } from '../types';
import { jobsApi, companiesApi } from '../services/api';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsRes, compsRes] = await Promise.all([
          jobsApi.getJobs({ limit: 6 }),
          companiesApi.getCompanies(),
        ]);
        setFeaturedJobs(jobsRes.jobs);
        setCompanies(compsRes);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) queryParams.set('search', searchTerm.trim());
    if (locationTerm.trim()) queryParams.set('location', locationTerm.trim());
    navigate(`/jobs?${queryParams.toString()}`);
  };

  const trendingTags = [
    { label: 'Software Engineer Intern', query: 'Software Engineer Intern' },
    { label: 'Data Analyst', query: 'Data Analyst' },
    { label: 'AI/ML Intern', query: 'AI/ML' },
    { label: 'UI/UX Design', query: 'UI/UX' },
    { label: 'Remote', query: 'remote' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1 & 2. HERO SECTION */}
      <section className="relative pt-12 sm:pt-16 pb-12 overflow-hidden">
        {/* Subtle background gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 text-amber-400 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Official Early-Career Stream</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Find your first opportunity. <br />
            <span className="text-zinc-400 font-normal">Without the noise.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Discover internships and 0–1 YOE opportunities from company career sources — and apply directly through the official portal.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/jobs"
              className="px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>EXPLORE JOBS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/companies"
              className="px-7 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs transition-colors"
            >
              <span>BROWSE COMPANIES</span>
            </Link>
          </div>

          {/* Integrated Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <form
              onSubmit={handleHeroSearch}
              className="bg-zinc-900/90 border border-zinc-800 p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-xl shadow-black/20"
            >
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 w-full">
                <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search roles, skills, or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 border-t sm:border-t-0 sm:border-l border-zinc-800 w-full">
                <Compass className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Trending Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px]">
              <span className="text-zinc-500 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Trending:
              </span>
              {trendingTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag.query)}`)}
                  className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-zinc-800/80 pt-16 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Your next opportunity, without the noise.</h2>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">Three simple steps to explore and apply directly at official corporate sources.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm font-mono">
                01
              </div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" /> DISCOVER
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Find internships and early-career opportunities in one aggregated stream.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm font-mono">
                02
              </div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" /> EXPLORE
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Search and filter opportunities based on your skills, location, and preferences.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm font-mono">
                03
              </div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-amber-400" /> APPLY
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Apply directly through the company's official career portal without intermediary forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OPPORTUNITIES WORTH EXPLORING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Opportunities worth exploring</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Explore verified early-career roles from company career sources.</p>
          </div>
          <Link
            to="/jobs"
            className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>VIEW ALL JOBS →</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-zinc-900/60 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* 5. EXPLORE COMPANIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Explore companies</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Monitored corporate recruitment portals.</p>
          </div>
          <Link
            to="/companies"
            className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>VIEW ALL COMPANIES →</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {companies.slice(0, 8).map((comp) => (
            <Link
              key={comp.id}
              to={`/companies/${comp.slug}`}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 flex items-center gap-3 group transition-colors"
            >
              <CompanyLogo
                slug={comp.slug}
                name={comp.name}
                logoUrl={comp.logoUrl}
                className="w-10 h-10 rounded-xl border border-zinc-700/60 bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm"
              />
              <div className="truncate">
                <h4 className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors truncate">{comp.name}</h4>
                <p className="text-[11px] text-zinc-400 truncate">{comp.activeJobsCount || 0} Open Roles</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. BUILT AROUND OFFICIAL SOURCES (Source Trust Section) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-8 sm:p-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Official Portal Verification
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Built around official sources.</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Career Stream connects job discovery with company career sources and sends candidates directly to the official application portal.
          </p>
        </div>
      </section>
    </div>
  );
};
