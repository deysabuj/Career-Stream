import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Bookmark, 
  LogOut, 
  Search, 
  Building2, 
  Compass, 
  LayoutDashboard,
  Layers,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, savedJobIds } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch('');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src="/logo.png" 
              alt="Career Stream" 
              className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-amber-500/20 border border-amber-500/30 group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                Career<span className="text-amber-500">Stream</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase mt-0.5">
                Early-Career Discovery
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/jobs')
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              Discover Jobs
            </Link>

            <Link
              to="/companies"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/companies')
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Companies
            </Link>

            <Link
              to="/industries"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/industries')
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              Industry Hub
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard')
                    ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Global Quick Search */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-xs relative">
          <Search className="w-4 h-4 absolute left-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search roles, skills, or companies..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link
              to="/saved"
              className={`relative p-2 rounded-lg border transition-all ${
                isActive('/saved')
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
              title="Saved Opportunities"
            >
              <Bookmark className="w-4 h-4" />
              {savedJobIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black rounded-full text-[10px] font-extrabold flex items-center justify-center">
                  {savedJobIds.length}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black text-xs font-extrabold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-zinc-200 hidden sm:inline-block max-w-[100px] truncate">
                  {user?.name}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#09090b] px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200"
            />
          </form>
          <nav className="flex flex-col gap-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg"
            >
              Discover Jobs
            </Link>
            <Link
              to="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg"
            >
              Monitored Companies
            </Link>
            <Link
              to="/industries"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg"
            >
              Industry Hub
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
