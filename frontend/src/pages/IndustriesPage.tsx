import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Code, 
  Landmark, 
  Briefcase, 
  HeartPulse, 
  ShoppingBag, 
  Car, 
  Zap, 
  Film, 
  Truck, 
  Cpu, 
  GraduationCap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { INDUSTRIES, Industry } from '../constants/industries';
import { COMPANY_CONFIGS } from '../constants/companies';

const iconMap: Record<string, any> = {
  Code,
  Landmark,
  Briefcase,
  HeartPulse,
  ShoppingBag,
  Car,
  Zap,
  Film,
  Truck,
  Cpu,
  GraduationCap,
};

export const IndustriesPage: React.FC = () => {
  const getCompanyCountByIndustry = (industrySlug: string) => {
    return Object.values(COMPANY_CONFIGS).filter(
      (c) => c.industrySlug === industrySlug || c.industry.toLowerCase().includes(industrySlug)
    ).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" /> Multi-Domain Opportunity Ecosystem
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Explore Industries & Sectors</h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Career Stream aggregates verified early-career opportunities across technology, finance, consulting, healthcare, retail, automotive, energy, semiconductor, and media.
          </p>
        </div>
      </div>

      {/* Grid of Industry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INDUSTRIES.map((ind: Industry) => {
          const IconComponent = iconMap[ind.iconName] || Layers;
          const companyCount = getCompanyCountByIndustry(ind.slug);

          return (
            <Link
              key={ind.id}
              to={`/industries/${ind.slug}`}
              className="p-6 rounded-2xl glass-card border border-zinc-800 space-y-5 flex flex-col justify-between group hover:border-amber-500/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700">
                    {companyCount > 0 ? `${companyCount}+ Companies` : 'Monitored'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                    {ind.description}
                  </p>
                </div>

                {/* Featured Domain Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {ind.featuredDomains.slice(0, 3).map((dom) => (
                    <span
                      key={dom}
                      className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-medium"
                    >
                      {dom}
                    </span>
                  ))}
                  {ind.featuredDomains.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-500 text-[11px]">
                      +{ind.featuredDomains.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Explore Sector Opportunities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
