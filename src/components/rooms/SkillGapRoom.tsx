import React, { useMemo } from 'react';
import { 
  BarChart2, 
  ArrowRight, 
  ShieldAlert, 
  TrendingUp, 
  Target, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateRoleFit } from '../../utils/fitEngine';

export const SkillGapRoom: React.FC = () => {
  const { 
    roles, 
    profile, 
    skillEvidence, 
    setActiveRoom, 
    regenerateRoadmap, 
    playBeep 
  } = useApp();

  const targetRole = useMemo(() => {
    return roles.find(r => r.role_id === profile.targetRoleId) || roles[0];
  }, [roles, profile.targetRoleId]);

  const fitResult = useMemo(() => {
    return calculateRoleFit(targetRole, skillEvidence);
  }, [targetRole, skillEvidence]);

  const handleGenerateRoadmap = () => {
    regenerateRoadmap(targetRole.role_id, 8);
    playBeep(520, 'triangle');
    setActiveRoom('learning-roadmap');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-pink-950/80 text-pink-400 border border-pink-800">
              GAP RADAR • STATION MODULE 5
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Skill Gap Analysis & Target Deficits
          </h1>
          <p className="text-xs text-slate-400">
            Compare your demonstrated baseline against target requirements for <span className="text-white font-semibold">{targetRole.title}</span>.
          </p>
        </div>

        <button
          onClick={handleGenerateRoadmap}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-extrabold text-xs shadow-glow-cyan transition-all cursor-pointer hover:scale-105"
        >
          <span>Generate Customized Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-space-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">Target Role</span>
          <h3 className="text-lg font-bold text-white">{targetRole.title}</h3>
          <p className="text-xs text-cyan-400 font-mono">{targetRole.role_family}</p>
        </div>

        <div className="p-5 rounded-3xl bg-space-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">Current Match Alignment</span>
          <div className="text-2xl font-black font-mono text-cyan-300">{fitResult.overallScore}%</div>
          <p className="text-xs text-slate-400">Weighted proficiency alignment</p>
        </div>

        <div className="p-5 rounded-3xl bg-space-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">Critical Skill Gaps</span>
          <div className="text-2xl font-black font-mono text-pink-400">{fitResult.gapSkillsCount + fitResult.unassessedSkillsCount}</div>
          <p className="text-xs text-slate-400">Skills requiring targeted practice</p>
        </div>
      </div>

      {/* Visual Gap Matrix Table */}
      <div className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
        <h3 className="font-bold text-base text-white">Demonstrated vs Target Proficiency Comparison</h3>

        <div className="space-y-4">
          {fitResult.skillDetails.map(detail => {
            const gap = Math.max(0, detail.targetLevel - detail.demonstratedLevel);
            const percentDemonstrated = (detail.demonstratedLevel / 5) * 100;
            const percentTarget = (detail.targetLevel / 5) * 100;

            return (
              <div key={detail.skillId} className="p-4 rounded-2xl bg-space-950 border border-slate-800/80 space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{detail.skillName}</span>
                      <span className="text-[10px] font-mono text-slate-400">({detail.category})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        detail.importance === 'Critical' ? 'bg-red-950 text-red-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {detail.importance}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-cyan-300">
                      Demonstrated: Lvl {detail.demonstratedLevel} ({detail.evidenceSource})
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="text-amber-300">Target: Lvl {detail.targetLevel}</span>
                    {gap > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800 font-bold">
                        +{gap} Deficit
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        Target Met
                      </span>
                    )}
                  </div>
                </div>

                {/* Dual Progress Bar: demonstrated vs target */}
                <div className="relative w-full h-3 rounded-full bg-space-900 border border-slate-800 overflow-hidden">
                  {/* Target level background marker */}
                  <div
                    className="absolute top-0 bottom-0 bg-slate-700/60"
                    style={{ width: `${percentTarget}%` }}
                  />
                  {/* Demonstrated level bar */}
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-violet-500 shadow-glow-cyan"
                    style={{ width: `${percentDemonstrated}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
