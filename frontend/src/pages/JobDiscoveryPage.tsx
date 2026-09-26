import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Sparkles, 
  SlidersHorizontal,
} from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { Job } from '../types';
import { jobsApi } from '../services/api';

export const JobDiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>(searchParams.get('workMode') || '');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>(searchParams.get('employmentType') || '');
  const [selectedLocation, setSelectedLocation] = useState<string>(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [postedWithinDays, setPostedWithinDays] = useState<number | undefined>(
    searchParams.get('postedWithinDays') ? parseInt(searchParams.get('postedWithinDays')!, 10) : undefined
  );
  const [sortBy, setSortBy] = useState<'newest' | 'relevance'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchJobsData = async () => {
    setIsLoading(true);
    try {
      const res = await jobsApi.getJobs({
        search: searchQuery,
        workMode: selectedWorkMode,
        employmentType: selectedEmploymentType,
        location: selectedLocation,
        category: selectedCategory,
        postedWithinDays,
        sortBy,
        page: meta.page,
      });
      setJobs(res.jobs);
      setMeta(res.meta);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsData();
  }, [searchQuery, selectedWorkMode, selectedEmploymentType, selectedLocation, selectedCategory, postedWithinDays, sortBy, meta.page]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedWorkMode('');
    setSelectedEmploymentType('');
    setSelectedLocation('');
    setSelectedCategory('');
    setPostedWithinDays(undefined);
    setSearchParams({});
  };

  const categoriesList = [
    'Software Engineering',
    'AI / Machine Learning',
    'Data Science',
    'Data Analytics',
    'Cybersecurity',
    'Cloud & Infrastructure',
    'Product Management',
    'UI/UX Design',
    'Finance & Consulting',
  ];

  const locationsList = ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi NCR', 'Chennai', 'Remote'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Early-Career Stream
          </div>
          <h1 className="text-3xl font-extrabold text-white">Job Discovery</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Showing <strong className="text-zinc-200">{meta.total}</strong> verified opportunities for students & 0–1 YOE.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="md:hidden px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Filters & Categories</span>
        </button>
      </div>

      {/* Main Grid: Filters + Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden md:block md:col-span-1 rounded-2xl glass-panel p-5 border border-zinc-800 space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" /> Filters
            </h3>
            {(selectedWorkMode || selectedEmploymentType || selectedLocation || selectedCategory || postedWithinDays || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-xs text-amber-400 hover:underline font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Keyword Search</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Title, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Opportunity Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Opportunity Type</label>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'All Types', value: '' },
                { label: 'Internship', value: 'INTERNSHIP' },
                { label: 'Full Time', value: 'FULL_TIME' },
                { label: 'Graduate Program', value: 'GRADUATE_PROGRAM' },
                { label: 'Trainee', value: 'TRAINEE' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSelectedEmploymentType(item.value)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedEmploymentType === item.value
                      ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Work Mode */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Work Mode</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { label: 'All', value: '' },
                { label: 'Remote', value: 'REMOTE' },
                { label: 'Hybrid', value: 'HYBRID' },
                { label: 'Onsite', value: 'ONSITE' },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedWorkMode(m.value)}
                  className={`py-1.5 rounded-lg border text-center font-medium transition-colors ${
                    selectedWorkMode === m.value
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Locations</option>
              {locationsList.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Timeframe */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Posted Within</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { label: 'Anytime', value: undefined },
                { label: '24 Hours', value: 1 },
                { label: '7 Days', value: 7 },
                { label: '30 Days', value: 30 },
              ].map((tf) => (
                <button
                  key={tf.label}
                  onClick={() => setPostedWithinDays(tf.value)}
                  className={`py-1.5 rounded-lg border text-center font-medium transition-colors ${
                    postedWithinDays === tf.value
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN RESULTS CONTENT */}
        <main className="md:col-span-3 space-y-6">
          {/* Active Filter Pills Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-400">Sort by:</span>
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1 rounded-lg border text-xs font-medium ${
                  sortBy === 'newest'
                    ? 'bg-zinc-800 border-zinc-700 text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => setSortBy('relevance')}
                className={`px-3 py-1 rounded-lg border text-xs font-medium ${
                  sortBy === 'relevance'
                    ? 'bg-zinc-800 border-zinc-700 text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Most Relevant
              </button>
            </div>

            <span className="text-xs text-zinc-400">
              Showing {jobs.length} of {meta.total} results
            </span>
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-zinc-900/60 animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl glass-panel p-12 text-center space-y-4 border border-zinc-800">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No opportunities matched your exact filter</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Try widening your location or search terms to see additional verified early-career jobs.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
