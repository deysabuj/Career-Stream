import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Search } from 'lucide-react';
import { Company } from '../types';
import { companiesApi } from '../services/api';
import { JobCard } from '../components/JobCard';
import { CompanyLogo } from '../components/CompanyLogo';

const LIVE_SLUGS = [
  'amazon',
  'adobe',
  'tcs',
  'zscaler',
  'nvidia',
  'coursera',
  'accenture',
  'cisco',
  'pwc',
  'hul'
];

export const CompaniesPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (slug) {
          const comp = await companiesApi.getCompanyBySlug(slug);
          setSelectedCompany(comp);
        } else {
          const comps = await companiesApi.getCompanies();
          setCompanies(comps);
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [slug]);

  if (slug) {
    if (isLoading) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="h-48 rounded-3xl bg-zinc-900/60 animate-pulse border border-zinc-800" />
        </div>
      );
    }

    if (!selectedCompany) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <Link to="/companies" className="text-xs text-zinc-400 hover:text-white transition-colors">
            ← Back to All Companies
          </Link>
          <div className="p-12 rounded-3xl glass-panel border border-zinc-800 text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">Company Profile</h1>
            <p className="text-xs text-zinc-400">Loading details for {slug}...</p>
          </div>
        </div>
      );
    }

    const isLive = LIVE_SLUGS.includes(selectedCompany.slug);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link to="/companies" className="text-xs text-zinc-400 hover:text-white transition-colors">
          ← Back to All Companies
        </Link>

        {/* Company Header */}
        <div className="rounded-3xl glass-panel p-8 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <CompanyLogo
              company={selectedCompany}
              size="lg"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-white">{selectedCompany.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isLive
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {isLive ? 'LIVE INGESTION' : 'SOURCE BLOCKED'}
                </span>
              </div>
              <p className="text-xs text-amber-400 font-medium">{selectedCompany.industry}</p>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">{selectedCompany.description}</p>
            </div>
          </div>

          <a
            href={selectedCompany.careerUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-amber-400 font-semibold text-xs flex items-center gap-2 transition-colors shrink-0"
          >
            <span>Official Career Page</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Active Jobs Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Active Early-Career Roles at {selectedCompany.name}</h2>
          {selectedCompany.jobs && selectedCompany.jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCompany.jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-400">
              {isLive
                ? 'No active early-career listings currently detected.'
                : 'Live listings are temporarily unavailable from this company\'s career source.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Synchronized Sources
          </div>
          <h1 className="text-3xl font-extrabold text-white">Monitored Companies</h1>
          <p className="text-xs text-zinc-400 mt-1">Official corporate career portals monitored automatically by Career Stream.</p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search company or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-zinc-900/60 animate-pulse border border-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCompanies.map((comp) => {
            const isLive = LIVE_SLUGS.includes(comp.slug);
            return (
              <Link
                key={comp.id}
                to={`/companies/${comp.slug}`}
                className="p-5 rounded-2xl glass-card border border-zinc-800 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <CompanyLogo
                      company={comp}
                      size="md"
                    />
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      isLive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {isLive ? 'LIVE' : 'BLOCKED'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">{comp.name}</h3>
                    <p className="text-xs text-zinc-400">{comp.industry}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Official Source
                  </span>
                  <span className="text-zinc-400">{comp.activeJobsCount ?? 0} Jobs</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
