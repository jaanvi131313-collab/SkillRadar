import React, { useState, useMemo } from 'react';
import { 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateRoleFit } from '../../utils/fitEngine';
import { JobRole } from '../../types';

export const RoleMatchRoom: React.FC = () => {
  const { 
    roles, 
    profile, 
    skillEvidence, 
    setActiveRoom, 
    updateMissionStatus, 
    unlockBadge, 
    notify, 
    playBeep 
  } = useApp();

  const [selectedRoleId, setSelectedRoleId] = useState(profile.targetRoleId);

  const selectedRole = useMemo(() => {
    return roles.find(r => r.role_id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  const fitResult = useMemo(() => {
    return calculateRoleFit(selectedRole, skillEvidence);
  }, [selectedRole, skillEvidence]);

  const handleRunCalibration = () => {
    updateMissionStatus('mission-3', 'completed');
    unlockBadge('calibration-ace');
    notify('Role Fit Calibrated', `Calculated alignment for ${selectedRole.title}: ${fitResult.overallScore}%`, 'success');
    playBeep(587, 'triangle');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800">
              COMMAND CENTER • ROLE FIT MATRIX
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            "Check My Fit" Explainable Calibration
          </h1>
          <p className="text-xs text-slate-400">
            Compare your demonstrated proficiencies against modeled requirements using deterministic weighted matching.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-mono">Evaluate Role:</label>
          <select
            value={selectedRoleId}
            onChange={e => setSelectedRoleId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-space-900 border border-slate-800 text-xs text-white outline-none cursor-pointer"
          >
            {roles.map(r => (
              <option key={r.role_id} value={r.role_id} className="bg-space-950 text-white">
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Score Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-space-900 via-station-border to-space-900 border border-slate-800 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Alignment Analysis
            </span>
            <span className="text-xs text-slate-400">• {selectedRole.title}</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Skill Alignment Score: <span className="text-cyan-300 font-mono text-3xl font-extrabold">{fitResult.overallScore}%</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {fitResult.formulaExplanation}
          </p>
        </div>

        {/* Gauge / Completeness Pill */}
        <div className="flex flex-col items-center p-5 rounded-2xl bg-space-950/90 border border-slate-800/80 shadow-inner shrink-0 text-center space-y-2">
          <div className="text-[11px] font-mono text-slate-400">Profile Evidence Completeness</div>
          <div className="text-2xl font-black font-mono text-amber-400">{fitResult.dataCompleteness}%</div>
          <div className="text-[10px] text-slate-500">
            {fitResult.skillDetails.length - fitResult.unassessedSkillsCount} of {fitResult.skillDetails.length} skills verified
          </div>
        </div>
      </div>

      {/* Incomplete Evidence Alert if Completeness < 40% */}
      {fitResult.dataCompleteness < 40 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/50 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-amber-200">
              <span className="font-bold">Low Data Completeness ({fitResult.dataCompleteness}%): </span>
              To avoid false precision, complete additional quizzes in the Skill Scan Lab before relying on this match score.
            </div>
          </div>
          <button
            onClick={() => setActiveRoom('skill-scan')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-space-950 font-bold text-xs shrink-0 cursor-pointer"
          >
            Open Skill Scan
          </button>
        </div>
      )}

      {/* 4 Category Summary Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-space-900/80 border border-emerald-500/30 text-center space-y-1">
          <span className="text-[11px] font-mono text-emerald-400">Matched Skills</span>
          <div className="text-xl font-bold font-mono text-white">{fitResult.matchedSkillsCount}</div>
          <div className="text-[10px] text-slate-400">Demonstrated ≥ Target</div>
        </div>
        <div className="p-4 rounded-2xl bg-space-900/80 border border-cyan-500/30 text-center space-y-1">
          <span className="text-[11px] font-mono text-cyan-400">Partial Matches</span>
          <div className="text-xl font-bold font-mono text-white">{fitResult.partialSkillsCount}</div>
          <div className="text-[10px] text-slate-400">≥ 50% Proficiency</div>
        </div>
        <div className="p-4 rounded-2xl bg-space-900/80 border border-red-500/30 text-center space-y-1">
          <span className="text-[11px] font-mono text-red-400">Skill Gaps</span>
          <div className="text-xl font-bold font-mono text-white">{fitResult.gapSkillsCount}</div>
          <div className="text-[10px] text-slate-400">High Deficit</div>
        </div>
        <div className="p-4 rounded-2xl bg-space-900/80 border border-purple-500/30 text-center space-y-1">
          <span className="text-[11px] font-mono text-purple-400">Unassessed Skills</span>
          <div className="text-xl font-bold font-mono text-white">{fitResult.unassessedSkillsCount}</div>
          <div className="text-[10px] text-slate-400">Pending Evaluation</div>
        </div>
      </div>

      {/* Detailed Skill Alignment Breakdown Table */}
      <div className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base text-white">Itemized Skill Comparison & Weight Contribution</h3>
          <button
            onClick={() => setActiveRoom('skill-gap')}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
          >
            <span>View Full Gap Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {fitResult.skillDetails.map(detail => {
            const statusConfig = {
              matched: { text: 'Matched', bg: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
              partial: { text: 'Partial Match', bg: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
              gap: { text: 'Skill Gap', bg: 'bg-red-950 text-red-300 border-red-800' },
              unassessed: { text: 'Unassessed', bg: 'bg-purple-950 text-purple-300 border-purple-800' }
            };

            return (
              <div key={detail.skillId} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{detail.skillName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusConfig[detail.matchStatus].bg}`}>
                      {statusConfig[detail.matchStatus].text}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Weight: {detail.weight}</span>
                  </div>
                  <div className="text-slate-400 text-xs">
                    Demonstrated: <span className="font-mono text-cyan-300">Lvl {detail.demonstratedLevel}</span> / Target: <span className="font-mono text-amber-300">Lvl {detail.targetLevel}</span> • Evidence: <span className="font-mono uppercase">{detail.evidenceSource}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {detail.matchStatus === 'unassessed' && (
                    <button
                      onClick={() => setActiveRoom('skill-scan')}
                      className="px-3 py-1.5 rounded-lg bg-space-950 hover:bg-slate-800 border border-purple-500/40 text-purple-300 text-xs font-semibold cursor-pointer"
                    >
                      Scan Skill
                    </button>
                  )}
                  {detail.matchStatus === 'gap' && (
                    <button
                      onClick={() => setActiveRoom('learning-roadmap')}
                      className="px-3 py-1.5 rounded-lg bg-space-950 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-semibold cursor-pointer"
                    >
                      Add to Roadmap
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 rounded-2xl bg-space-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {fitResult.disclaimer}
        </p>
      </div>
    </div>
  );
};
