import React from 'react';
import { ExternalLink, ShieldCheck, X } from 'lucide-react';
import { Job } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  const handleContinue = () => {
    window.open(job.sourceUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-950/20 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <CompanyLogo
            company={job.company}
            size="md"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Career Link
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">{job.title}</h3>
            <p className="text-xs text-zinc-400">{job.company.name} • {job.location}</p>
          </div>
        </div>

        {/* Informational Message */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
          <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <span>You're heading to {job.company.name}'s official portal</span>
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Career Stream discovers and aggregates verified opportunities. Your actual application, resume submission, and candidate evaluation happen entirely on <strong>{job.company.name}</strong>'s official website.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleContinue}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Continue to Official Website</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
