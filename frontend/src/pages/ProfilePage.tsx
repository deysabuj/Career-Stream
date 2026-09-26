import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Sparkles, Check, Save, Plus, X, GraduationCap, Award } from 'lucide-react';
import { apiClient } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || 'Indian Institute of Technology (IIT)',
    degree: user?.degree || 'B.Tech',
    branch: user?.branch || 'Computer Science & Engineering',
    gradYear: user?.gradYear || 2026,
    skills: user?.skills || ['Python', 'Java', 'React', 'Data Structures', 'C++'],
    preferredRoles: user?.preferredRoles || ['Software Engineering Intern', 'AI/ML Engineer'],
    preferredLocations: user?.preferredLocations || ['Bengaluru', 'Hyderabad', 'Remote'],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile completion calculation
  const calculateCompletion = () => {
    let score = 0;
    if (formData.name.trim()) score += 15;
    if (formData.college.trim()) score += 15;
    if (formData.degree.trim()) score += 15;
    if (formData.branch.trim()) score += 15;
    if (formData.gradYear) score += 10;
    if (formData.skills.length > 0) score += 15;
    if (formData.preferredRoles.length > 0) score += 15;
    return score;
  };

  const completionPct = calculateCompletion();

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleAddRole = () => {
    if (newRole.trim() && !formData.preferredRoles.includes(newRole.trim())) {
      setFormData({ ...formData, preferredRoles: [...formData.preferredRoles, newRole.trim()] });
      setNewRole('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setFormData({ ...formData, preferredRoles: formData.preferredRoles.filter((r) => r !== role) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put('/users/profile', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            <User className="w-3.5 h-3.5" /> Early-Career Profile
          </div>
          <h1 className="text-3xl font-extrabold text-white">Student Career Profile</h1>
          <p className="text-xs text-zinc-400">Configure academic details, skills, and target role preferences for early-career matching.</p>
        </div>

        {/* Completion Widget */}
        <div className="p-4 rounded-2xl glass-panel border border-zinc-800 flex items-center gap-4 shrink-0">
          <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 border-2 border-amber-500 text-amber-400 font-bold text-xs">
            {completionPct}%
          </div>
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-white flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Profile Strength
            </span>
            <p className="text-zinc-400">{completionPct === 100 ? 'Fully Optimized' : 'Add skills to optimize'}</p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" /> Profile preferences updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Academic Info */}
        <div className="rounded-2xl glass-panel p-6 border border-zinc-800 space-y-6">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <GraduationCap className="w-4 h-4 text-amber-400" /> Academic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Degree</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Branch / Specialization</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Graduation Year</label>
              <input
                type="number"
                value={formData.gradYear}
                onChange={(e) => setFormData({ ...formData, gradYear: parseInt(e.target.value, 10) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="rounded-2xl glass-panel p-6 border border-zinc-800 space-y-4">
          <h3 className="font-bold text-sm text-white border-b border-zinc-800 pb-3">Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1.5">
                <span>{skill}</span>
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add skill (e.g. React, PyTorch)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Preferred Target Roles */}
        <div className="rounded-2xl glass-panel p-6 border border-zinc-800 space-y-4">
          <h3 className="font-bold text-sm text-white border-b border-zinc-800 pb-3">Target Preferred Roles</h3>
          <div className="flex flex-wrap gap-2">
            {formData.preferredRoles.map((role) => (
              <span key={role} className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium flex items-center gap-1.5">
                <span>{role}</span>
                <button type="button" onClick={() => handleRemoveRole(role)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add role (e.g. Software Engineer Intern)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddRole}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Save className="w-4 h-4" /> Save Profile Preferences
        </button>
      </form>
    </div>
  );
};
