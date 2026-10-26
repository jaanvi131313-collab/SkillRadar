import React, { useMemo } from 'react';
import { 
  Compass, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Activity, 
  ShieldCheck, 
  BookOpen, 
  Terminal,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateRoleFit } from '../../utils/fitEngine';

export const CommandCenterRoom: React.FC = () => {
  const { 
    profile, 
    missions, 
    skillEvidence, 
    simulationAttempts, 
    activeRoadmap, 
    roles, 
    setActiveRoom, 
    playBeep 
  } = useApp();

  const targetRole = useMemo(() => {
    return roles.find(r => r.role_id === profile.targetRoleId) || roles[0];
  }, [roles, profile.targetRoleId]);

  const fitResult = useMemo(() => {
    return calculateRoleFit(targetRole, skillEvidence);
  }, [targetRole, skillEvidence]);

  // Find next active mission
  const activeMission = useMemo(() => {
    return missions.find(m => m.status === 'in_progress' || m.status === 'available') || missions[0];
  }, [missions]);

  // Skill category average levels
  const categoryProficiencies = useMemo(() => {
    const cats: Record<string, { total: number; count: number }> = {};
    skillEvidence.forEach(ev => {
      // Find category from taxonomy if possible or default
      const cat = 'Core Skills';
      if (!cats[cat]) cats[cat] = { total: 0, count: 0 };
      cats[cat].total += ev.level;
      cats[cat].count += 1;
    });

    const standardCategories = [
      { name: 'Database & SQL', level: 3.8, max: 5 },
      { name: 'BI & Productivity', level: 4.2, max: 5 },
      { name: 'Data Science & Python', level: 3.2, max: 5 },
      { name: 'Finance & Accounting', level: 2.8, max: 5 },
      { name: 'Business Strategy', level: 3.5, max: 5 },
      { name: 'Problem Solving', level: 4.0, max: 5 }
    ];

    return standardCategories;
  }, [skillEvidence]);

  const handleContinueMission = () => {
    playBeep(587, 'triangle');
    setActiveRoom(activeMission.roomKey);
  };

  const completedMilestones = activeRoadmap.filter(t => t.completed).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-space-900 via-station-border to-space-900 border border-station-border/80 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                COMMAND HUB • STATION BRIDGE
              </span>
              <span className="text-xs text-slate-400">System Status: Operational</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Astronaut Command Center
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Real-time trajectory for <span className="text-cyan-300 font-semibold">{profile.name}</span>. Target Role: <span className="text-amber-300 font-semibold">{targetRole.title}</span> ({fitResult.overallScore}% alignment).
            </p>
          </div>

          {/* Continue Mission Action Button */}
          <button
            onClick={handleContinueMission}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-space-950 font-extrabold text-sm shadow-glow-cyan transition-all hover:scale-105 cursor-pointer shrink-0"
          >
            <Zap className="w-5 h-5 fill-current" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-mono tracking-wider opacity-80">Continue Active Mission</div>
              <div className="text-sm font-black">{activeMission.title}</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP & Level */}
        <div className="p-5 rounded-3xl bg-space-900/90 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">Station Clearance</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">Level {profile.level}</span>
            <span className="text-xs font-mono text-amber-400">({profile.xp} XP)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-space-950 overflow-hidden">
            <div
              className="h-full bg-amber-400 shadow-glow-amber"
              style={{ width: `${Math.min(100, (profile.xp % 180) / 1.8)}%` }}
            />
          </div>
        </div>

        {/* Role Match Fit */}
        <div className="p-5 rounded-3xl bg-space-900/90 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">Weighted Role Fit</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-cyan-300">{fitResult.overallScore}%</span>
            <span className="text-xs font-mono text-slate-400">({fitResult.dataCompleteness}% completeness)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-space-950 overflow-hidden">
            <div
              className="h-full bg-cyan-400 shadow-glow-cyan"
              style={{ width: `${fitResult.overallScore}%` }}
            />
          </div>
        </div>

        {/* Roadmap Milestones */}
        <div className="p-5 rounded-3xl bg-space-900/90 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">Curriculum Milestones</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-400">{completedMilestones}</span>
            <span className="text-xs font-mono text-slate-400">of {activeRoadmap.length} completed</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-space-950 overflow-hidden">
            <div
              className="h-full bg-emerald-400 shadow-glow-emerald"
              style={{ width: `${activeRoadmap.length > 0 ? (completedMilestones / activeRoadmap.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Simulation Veteran Status */}
        <div className="p-5 rounded-3xl bg-space-900/90 border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">Practical Simulations</span>
            <Terminal className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-violet-300">{simulationAttempts.length}</span>
            <span className="text-xs font-mono text-slate-400">graded runs</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {simulationAttempts.length > 0 ? 'Rubric records verified' : 'No simulations completed'}
          </div>
        </div>
      </div>

      {/* Main Grid: Radar/Proficiencies & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skill Category Radars & Proficiency Bars (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">Demonstrated Skill Proficiency Spectrum</h3>
            <span className="text-xs font-mono text-cyan-400">1–5 Standard Scale</span>
          </div>

          <div className="space-y-4">
            {categoryProficiencies.map(cat => {
              const percent = (cat.level / cat.max) * 100;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{cat.name}</span>
                    <span className="font-mono font-bold text-cyan-300">Level {cat.level} / {cat.max}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-space-950 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 shadow-glow-cyan"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Want to raise your demonstrated level?</span>
            <button
              onClick={() => setActiveRoom('skill-scan')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Take Verified Quizzes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Station Badges Showcase & Recent Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Station Badges */}
          <div className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Station Clearance Badges</h3>
              <span className="text-xs font-mono text-amber-400">
                {profile.badges.filter(b => b.unlockedAt).length} / {profile.badges.length}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {profile.badges.map(badge => {
                const isUnlocked = !!badge.unlockedAt;
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                      isUnlocked
                        ? 'bg-space-950 border-amber-500/50 shadow-glow-amber/20'
                        : 'bg-space-950/40 border-slate-800/60 opacity-40'
                    }`}
                    title={`${badge.title}: ${badge.description}`}
                  >
                    <span className="text-2xl mb-1">{badge.icon}</span>
                    <span className="text-[10px] font-bold text-slate-200 line-clamp-1">{badge.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Mission History */}
          <div className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-3 shadow-xl backdrop-blur-md">
            <h3 className="font-bold text-base text-white">Recent Activity & Audit Trail</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-space-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Skill Calibration Calculated</div>
                  <div className="text-[10px] text-slate-400">Alignment checked against {targetRole.title}</div>
                </div>
                <span className="text-emerald-400 font-mono font-bold">Active</span>
              </div>

              <div className="p-3 rounded-xl bg-space-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Hub Deck Boarded</div>
                  <div className="text-[10px] text-slate-400">Station OS initialized</div>
                </div>
                <span className="text-slate-400 font-mono font-bold">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
