import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPages: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const isSignup = location.pathname === '/signup';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (isSignup) {
        if (!name.trim()) throw new Error('Please enter your full name.');
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-sky-950/40 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500/30 to-orange-500/30 mx-auto shadow-xl shadow-amber-500/20 border border-amber-500/30 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Career Stream" 
              className="w-full h-full object-cover rounded-[14px]" 
            />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isSignup ? 'Create Student Account' : 'Welcome to Career Stream'}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignup
              ? 'Join thousands of students discovering official early-career listings.'
              : 'Sign in to access personalized job streams and saved opportunities.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignup && (
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          {isSignup ? (
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-sky-400 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-sky-400 font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
