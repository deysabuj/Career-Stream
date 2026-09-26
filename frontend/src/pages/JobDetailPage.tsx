import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  GraduationCap,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { Job, ResumeMatch } from '../types';
import { jobsApi } from '../services/api';
import { FreshnessWidget } from '../components/FreshnessWidget';
import { ApplyModal } from '../components/ApplyModal';
import { CompanyLogo } from '../components/CompanyLogo';
import { useAuth } from '../context/AuthContext';

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { savedJobIds, toggleSavedJob } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [resumeMatch, setResumeMatch] = useState<ResumeMatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchJobDetail = async () => {
      setIsLoading(true);
      try {
        const [jobData, matchData] = await Promise.all([
          jobsApi.getJobById(id),
          jobsApi.getResumeMatch(id),
        ]);
        setJob(jobData);
        setResumeMatch(matchData);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-zinc-900 rounded-lg" />
        <div className="h-64 bg-zinc-900/60 rounded-2xl border border-zinc-800" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Opportunity Not Found</h2>
        <p className="text-xs text-zinc-400">The listing might have expired or been removed from official company portals.</p>
        <Link to="/jobs" className="inline-block px-4 py-2 bg-amber-500 text-black rounded-xl text-xs font-bold">
          Back to Jobs Stream
        </Link>
      </div>
    );
  }

  const isSaved = savedJobIds.includes(job.id);
  const isExpired = job.status === 'EXPIRED' || job.status === 'REMOVED';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link */}
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs Discovery Stream
      </Link>

      {/* Main Opportunity Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <CompanyLogo
              company={job.company}
              size="lg"
            />
            <div className="space-y-1">
              <Link to={`/companies/${job.company.slug}`} className="text-sm font-semibold text-amber-400 hover:underline">
                {job.company.name}
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 pt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-zinc-500" /> {job.location}</span>
                <span>•</span>
                <span className="font-semibold text-amber-400">{job.workMode}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-orange-400" /> {job.employmentType.replace('_', ' ')}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-amber-300" /> 0–1 YOE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => toggleSavedJob(job.id)}
              className={`p-3 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            {isExpired ? (
              <button disabled className="py-3 px-6 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400 font-semibold text-xs cursor-not-allowed">
                Opportunity Closed
              </button>
            ) : (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Source Freshness indicator */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <FreshnessWidget lastVerifiedAt={job.lastVerifiedAt} />
          <span className="text-xs text-zinc-400">
            Category: <strong className="text-zinc-200">{job.category}</strong>
          </span>
        </div>
      </div>

      {/* Main Content Grid: Description + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Summary + Description */}
        <div className="lg:col-span-8 space-y-8">
          {job.aiSummary && (
            <div className="rounded-2xl glass-panel p-6 border border-amber-500/20 bg-zinc-900/60 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Quick Summary</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">{job.aiSummary.overview}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Key Focus Areas</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {job.aiSummary.keyResponsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Eligibility Requirements</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {job.aiSummary.keyRequirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-lg text-white border-b border-zinc-800 pb-3">Role Overview & Responsibilities</h3>
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-4 whitespace-pre-line">
              {job.description}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {resumeMatch && (
            <div className="rounded-2xl glass-panel p-5 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Resume Match Preview
                </h4>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {resumeMatch.fitLevel}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-zinc-900 border-2 border-amber-500/40 font-extrabold text-white text-lg">
                  {resumeMatch.matchPercentage}%
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-zinc-300 font-medium">Profile Alignment</p>
                  <p className="text-zinc-400">Based on profile skills & preferred roles.</p>
                </div>
              </div>

              {resumeMatch.matchedSkills.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-zinc-400 font-medium">Matched Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeMatch.matchedSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium text-[11px]">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl glass-panel p-5 border border-zinc-800 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Official Source Verification
            </h4>
            <div className="text-xs text-zinc-400 space-y-2 leading-relaxed">
              <p>Applications for this opportunity are completed directly on <strong>{job.company.name}</strong>'s official careers portal.</p>
              <p className="text-zinc-500 text-[11px]">Career Stream does not hold candidate resumes or alter job application processes.</p>
            </div>

            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Apply on Official Website ↗</span>
            </button>
          </div>
        </div>
      </div>

      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
};
