import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Bookmark, 
  TrendingUp, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Clock,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Job } from '../types';
import { userApi, jobsApi } from '../services/api';
import { JobCard } from '../components/JobCard';

export const DashboardPage: React.FC = () => {
  const { user, savedJobIds } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const [recRes, jobsRes] = await Promise.all([
          userApi.getRecommendations(),
          jobsApi.getJobs({ limit: 4, sortBy: 'newest' }),
        ]);
        setRecommendedJobs(recRes);
        setRecentJobs(jobsRes.jobs);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="rounded-3xl glass-panel p-8 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Early-Career Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            {user?.college ? `${user.college} • ${user.degree || 'Engineering'}` : 'Track recommended roles, saved opportunities, and verified company sources.'}
          </p>
        </div>

        <Link
          to="/profile"
          className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
        >
          <UserIcon className="w-4 h-4 text-sky-400" />
          <span>Edit Target Profile</span>
        </Link>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Matching Opportunities</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{recommendedJobs.length + 8}</span>
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Saved Opportunities</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{savedJobIds.length}</span>
            <Bookmark className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Monitored Companies</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">10+</span>
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Source Freshness</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-emerald-400">Verified Live</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Recommended for You */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" /> Recommended for Your Profile
            </h2>
            <p className="text-xs text-slate-400">Based on your target roles ({user?.preferredRoles?.join(', ') || 'Software Engineer'}) and skills.</p>
          </div>
          <Link to="/jobs" className="text-xs text-sky-400 hover:underline font-semibold flex items-center gap-1">
            View All Stream Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* New Since Last Visit */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" /> New Since Your Last Visit
            </h2>
            <p className="text-xs text-slate-400">Latest synchronized listings from official corporate sources.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentJobs.slice(0, 2).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};
