import React, { useState } from 'react';
import { 
  Rocket, 
  Box, 
  LayoutDashboard, 
  Database, 
  Award, 
  ChevronDown, 
  User, 
  Settings, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNavBar: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    setShowProvenanceModal, 
    setShowAdvisorModal,
    profile, 
    updateProfile,
    resetToDefaults,
    openRoom,
    playBeep
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    { name: 'Purple', hex: '#a855f7' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Blue', hex: '#3b82f6' }
  ];

  return (
    <header className="relative z-40 h-16 w-full border-b border-station-border/70 bg-space-950/85 backdrop-blur-md px-4 flex items-center justify-between">
      {/* Left: Brand Logo & Station OS Version */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => {
            openRoom('lobby');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center shadow-glow-cyan/50 group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                SkillRadar
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                STATION OS V2.6
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Explore • Learn • Build Your Future
            </p>
          </div>
        </div>
      </div>

      {/* Center: View Switcher & Dataset Inspector */}
      <div className="flex items-center gap-2">
        <div className="flex items-center p-1 rounded-xl bg-space-900/90 border border-slate-800 shadow-inner">
          <button
            onClick={() => {
              playBeep(440, 'triangle');
              setViewMode('3d');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-cyan-500 text-space-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>3D Hub</span>
          </button>
          <button
            onClick={() => {
              playBeep(440, 'triangle');
              setViewMode('2d');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === '2d'
                ? 'bg-cyan-500 text-space-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>2D Console</span>
          </button>
        </div>

        <button
          onClick={() => {
            playBeep(520, 'sine');
            setShowProvenanceModal(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-space-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Dataset & Provenance</span>
        </button>

        <button
          onClick={() => {
            playBeep(620, 'sine');
            setShowAdvisorModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 hover:from-violet-600/40 hover:to-cyan-600/40 border border-violet-500/40 text-xs font-medium text-violet-300 hover:text-cyan-200 transition-all cursor-pointer shadow-glow-violet"
        >
          <Sparkles className="w-4 h-4 text-violet-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>AI Advisor</span>
        </button>
      </div>

      {/* Right: XP Counter & User Profile Pill */}
      <div className="flex items-center gap-3">
        {/* XP & Level Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shadow-glow-amber">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{profile.xp} XP</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px]">
            Lvl {profile.level}
          </span>
        </div>

        {/* User Profile Pill with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-space-900/90 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer"
          >
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white shadow"
              style={{ backgroundColor: profile.characterColor }}
            >
              {profile.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {profile.name}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[140px]">
                {profile.title}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-space-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-2 border-b border-slate-800 mb-2">
                <div className="text-sm font-semibold text-white">{profile.name}</div>
                <div className="text-xs text-slate-400">{profile.educationLevel}</div>
                <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{profile.major}</div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    openRoom('lobby');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-left"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>Edit Profile & Goals</span>
                </button>

                <button
                  onClick={() => setShowColorPicker(prev => !prev)}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-violet-400" />
                    <span>Crewmate Suit Color</span>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: profile.characterColor }}
                  />
                </button>

                {showColorPicker && (
                  <div className="grid grid-cols-6 gap-1.5 p-2 bg-space-950 rounded-xl border border-slate-800 my-1">
                    {colors.map(c => (
                      <button
                        key={c.hex}
                        onClick={() => {
                          updateProfile({ characterColor: c.hex });
                          playBeep(550, 'sine');
                        }}
                        style={{ backgroundColor: c.hex }}
                        className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 ${
                          profile.characterColor === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-space-900' : ''
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (confirm('Reset your profile, missions, and skill evidence to fresh defaults?')) {
                      resetToDefaults();
                      setShowProfileMenu(false);
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-red-400 hover:bg-red-950/30 transition-all text-left"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Station Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
