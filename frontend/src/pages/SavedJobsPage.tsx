import React, { useState, useEffect } from 'react';
import { Bookmark, Search, Trash2 } from 'lucide-react';
import { Job } from '../types';
import { userApi } from '../services/api';
import { JobCard } from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const SavedJobsPage: React.FC = () => {
  const { savedJobIds } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      setIsLoading(true);
      try {
        const jobs = await userApi.getSavedJobs();
        setSavedJobs(jobs);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchSaved();
  }, [savedJobIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5" /> Bookmarked Stream
        </div>
        <h1 className="text-3xl font-extrabold text-white">Saved Opportunities</h1>
        <p className="text-xs text-slate-400">
          Track saved listings. Opportunities marked as <strong className="text-red-400">Opportunity Closed</strong> were detected as expired during source reconciliation.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="rounded-2xl glass-panel p-12 text-center space-y-4 border border-slate-800">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No saved opportunities yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the bookmark icon on any job card to save it for quick review and tracking.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-4 py-2 rounded-xl bg-sky-500 text-white font-semibold text-xs transition-colors"
          >
            Explore Stream Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};
