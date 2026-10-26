import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  ShieldCheck, 
  Save, 
  Compass, 
  ArrowRight,
  GraduationCap,
  Briefcase,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LobbyRoom: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    roles, 
    setActiveRoom, 
    notify, 
    playBeep,
    updateMissionStatus 
  } = useApp();

  const [name, setName] = useState(profile.name);
  const [major, setMajor] = useState(profile.major);
  const [educationLevel, setEducationLevel] = useState(profile.educationLevel);
  const [targetRoleId, setTargetRoleId] = useState(profile.targetRoleId);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests);
  const [color, setColor] = useState(profile.characterColor);

  const availableInterests = [
    'Machine Learning', 'Data Visualization', 'SQL Optimization', 
    'Product Analytics', 'Cloud Architecture', 'Financial Modeling',
    'Agile Management', 'System Design', 'Cybersecurity', 'UI/UX Design'
  ];

  const colors = [
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Blue', hex: '#3b82f6' }
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRole = roles.find(r => r.role_id === targetRoleId);
    updateProfile({
      name,
      major,
      educationLevel,
      targetRoleId,
      title: targetRole ? `Student / Aspiring ${targetRole.title}` : profile.title,
      interests: selectedInterests,
      characterColor: color
    });
    updateMissionStatus('mission-1', 'available');
    notify('Profile Synchronized', 'Crew identity, suit color, and goals saved to Station OS', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-space-900 via-station-border to-space-900 border border-station-border/80 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                HUB DOCK • AIRLOCK ALPHA
              </span>
              <span className="text-xs text-slate-400">Clearance Level {profile.level}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Station Lobby & Crew Profile
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Welcome aboard SkillRadar Station. Customize your astronaut avatar, configure your university background, and set your career trajectory.
            </p>
          </div>

          <button
            onClick={() => {
              playBeep(520, 'triangle');
              setActiveRoom('skill-scan');
            }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold text-sm shadow-glow-cyan transition-all hover:scale-105 cursor-pointer shrink-0"
          >
            <span>Proceed to Skill Scan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Crewmate Avatar Customizer */}
        <div className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center space-y-6 shadow-xl backdrop-blur-md">
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider font-mono">
            Astronaut Identity
          </h3>

          {/* 2D Preview of Crewmate */}
          <div className="relative w-36 h-44 rounded-2xl bg-space-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden shadow-inner">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

            {/* Crewmate SVG Illustration */}
            <div className="relative z-10 flex flex-col items-center transition-transform hover:scale-105">
              <div 
                className="w-20 h-28 rounded-t-full rounded-b-2xl relative shadow-2xl flex flex-col items-center justify-center"
                style={{ backgroundColor: color }}
              >
                {/* Visor */}
                <div className="w-12 h-7 rounded-full bg-cyan-400 border-2 border-cyan-200/60 shadow-inner -mt-3 ml-2 flex items-center justify-end pr-2">
                  <div className="w-2.5 h-1.5 rounded-full bg-white opacity-80" />
                </div>
                {/* Backpack */}
                <div 
                  className="absolute -left-3 top-6 w-3 h-14 rounded-l-md border-r border-black/20"
                  style={{ backgroundColor: color, filter: 'brightness(0.8)' }}
                />
              </div>
              {/* Legs */}
              <div className="flex gap-2 -mt-1">
                <div 
                  className="w-5 h-6 rounded-b-lg"
                  style={{ backgroundColor: color, filter: 'brightness(0.9)' }}
                />
                <div 
                  className="w-5 h-6 rounded-b-lg"
                  style={{ backgroundColor: color, filter: 'brightness(0.9)' }}
                />
              </div>
            </div>

            <div className="absolute bottom-2 text-[10px] font-mono text-cyan-400">
              {profile.name}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="space-y-2 w-full text-center">
            <span className="text-xs text-slate-400">Select Space Suit Color</span>
            <div className="flex justify-center gap-2">
              {colors.map(c => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => {
                    setColor(c.hex);
                    playBeep(520, 'sine');
                  }}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer hover:scale-110 ${
                    color === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-space-900 scale-110' : ''
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center & Right Card: Profile & Goal Form */}
        <div className="md:col-span-2 rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Student Profile Details</span>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-glow-violet transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none transition-colors"
                placeholder="Student Name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Education Level</label>
              <input
                type="text"
                value={educationLevel}
                onChange={e => setEducationLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none transition-colors"
                placeholder="e.g. Undergraduate 3rd Year"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Degree & Major</label>
              <input
                type="text"
                value={major}
                onChange={e => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none transition-colors"
                placeholder="e.g. Computer Science & Business Analytics"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Primary Target Career Role</label>
              <select
                value={targetRoleId}
                onChange={e => setTargetRoleId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none transition-colors cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r.role_id} value={r.role_id} className="bg-space-900 text-white">
                    {r.title} ({r.role_family})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interests Pills */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs text-slate-400 font-medium">Career & Technology Interests</label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 shadow-glow-cyan/20'
                        : 'bg-space-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
