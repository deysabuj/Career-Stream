import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#050507] pt-12 pb-8 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Vision */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Career Stream" 
                className="w-8 h-8 rounded-lg object-cover shadow-md shadow-amber-500/20 border border-amber-500/30" 
              />
              <span className="font-extrabold text-lg text-white tracking-tight">
                Career<span className="text-amber-500">Stream</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              Career Stream aggregates publicly available early-career opportunities directly from official company career portals — helping students and freshers discover verified internships and 0–1 YOE jobs without checking hundreds of websites manually.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/25 bg-amber-500/10 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>We aggregate official links. Candidate applications take place directly on company portals.</span>
            </div>
          </div>

          {/* Discovery Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Discovery Hub</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">Explore All Opportunities</Link>
              </li>
              <li>
                <Link to="/jobs?employmentType=INTERNSHIP" className="hover:text-white transition-colors">Internship Streams</Link>
              </li>
              <li>
                <Link to="/jobs?employmentType=FULL_TIME" className="hover:text-white transition-colors">Fresher Full-Time Roles</Link>
              </li>
              <li>
                <Link to="/jobs?workMode=REMOTE" className="hover:text-white transition-colors">Remote Opportunities</Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-white transition-colors">Monitored Companies Directory</Link>
              </li>
            </ul>
          </div>

          {/* Popular Companies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Official Sources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://careers.google.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  Google Careers <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="https://careers.microsoft.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  Microsoft Careers <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="https://www.amazon.jobs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  Amazon Jobs <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="https://www.infosys.com/careers" target="_blank" rel="noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  Infosys Careers <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Career Stream. Built for students & early career seekers.</p>
          <p className="flex items-center gap-1 text-zinc-500">
            <span>Empowering the next generation of engineers</span>
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
