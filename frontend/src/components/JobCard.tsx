import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Bookmark, 
  ExternalLink,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { ApplyModal } from './ApplyModal';
import { CompanyLogo } from './CompanyLogo';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { savedJobIds, toggleSavedJob } = useAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const isSaved = savedJobIds.includes(job.id);
  const isExpired = job.status === 'EXPIRED' || job.status === 'REMOVED';

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diffMs / (1000 * 3600));
    if (hours < 1) return 'Posted just now';
    if (hours < 24) return `Posted ${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `Posted ${days}d ago`;
  };

  return (
    <>
      <div className={`group relative rounded-2xl glass-card p-5 sm:p-6 flex flex-col justify-between h-full ${
        isExpired ? 'opacity-75 border-red-900/30' : ''
      }`}>
        <div className="space-y-4">
          {/* Top Row: Company logo + Meta badges + Save button */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <CompanyLogo
                company={job.company || { name: (job as any).companyName || 'Company', slug: '' }}
                size="md"
              />
              <div>
                <Link
                  to={`/companies/${job.company?.slug || ''}`}
                  className="font-semibold text-zinc-300 hover:text-amber-400 text-sm flex items-center gap-1 transition-colors"
                >
                  {job.company?.name || (job as any).companyName || 'Company'}
                </Link>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" /> {job.location}
                  </span>
                  <span>•</span>
                  <span className="text-amber-400 font-medium">{job.workMode}</span>
                </div>
              </div>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => toggleSavedJob(job.id)}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          {/* Job Title */}
          <div>
            <Link to={`/jobs/${job.id}`} className="group-hover:text-amber-400 transition-colors">
              <h3 className="font-bold text-base sm:text-lg text-white leading-snug line-clamp-2">
                {job.title}
              </h3>
            </Link>
          </div>

          {/* Key Attributes Tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-medium flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-amber-400" />
              {job.employmentType.replace('_', ' ')}
            </span>

            <span className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-medium flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-orange-400" />
              0–1 YOE / Freshers
            </span>
          </div>

          {/* Verified Official Source Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Career Source</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              {formatTimeAgo(job.postedAt)}
            </span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center gap-2">
          <Link
            to={`/jobs/${job.id}`}
            className="flex-1 py-2 px-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold text-center transition-colors"
          >
            View Opportunity
          </Link>

          {isExpired ? (
            <button
              disabled
              className="py-2 px-3 rounded-xl bg-red-950/40 border border-red-800/30 text-red-400 text-xs font-medium cursor-not-allowed"
            >
              Closed
            </button>
          ) : (
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </>
  );
};
