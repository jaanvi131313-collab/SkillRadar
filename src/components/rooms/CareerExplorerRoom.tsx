import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  Scale, 
  IndianRupee, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Check, 
  X,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobRole } from '../../types';

export const CareerExplorerRoom: React.FC = () => {
  const { 
    roles, 
    profile, 
    updateProfile, 
    setActiveRoom, 
    updateMissionStatus, 
    unlockBadge, 
    notify, 
    playBeep 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<JobRole>(
    roles.find(r => r.role_id === profile.targetRoleId) || roles[0]
  );
  const [compareRoles, setCompareRoles] = useState<JobRole[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Extract unique families
  const families = useMemo(() => {
    const set = new Set<string>();
    roles.forEach(r => {
      if (r.role_family) set.add(r.role_family);
    });
    return ['All', ...Array.from(set).sort()];
  }, [roles]);

  // Filtered roles
  const filteredRoles = useMemo(() => {
    return roles.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.skills.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchFamily = selectedFamily === 'All' || r.role_family === selectedFamily;
      return matchSearch && matchFamily;
    });
  }, [roles, searchTerm, selectedFamily]);

  const toggleBookmark = (roleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isBookmarked = profile.bookmarks.includes(roleId);
    let nextBookmarks: string[];
    if (isBookmarked) {
      nextBookmarks = profile.bookmarks.filter(id => id !== roleId);
      notify('Bookmark Removed', 'Role removed from saved careers list', 'info');
    } else {
      nextBookmarks = [...profile.bookmarks, roleId];
      updateMissionStatus('mission-2', 'completed');
      unlockBadge('career-scout');
      notify('Role Bookmarked', 'Saved to your station career list', 'success');
      playBeep(587, 'sine');
    }
    updateProfile({ bookmarks: nextBookmarks });
  };

  const handleSetTargetRole = (role: JobRole) => {
    updateProfile({
      targetRoleId: role.role_id,
      title: `Student / Aspiring ${role.title}`
    });
    notify('Target Goal Updated', `${role.title} set as primary career target`, 'success');
    playBeep(640, 'triangle');
  };

  const handleToggleCompare = (role: JobRole, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareRoles.some(r => r.role_id === role.role_id)) {
      setCompareRoles(prev => prev.filter(r => r.role_id !== role.role_id));
    } else {
      if (compareRoles.length >= 2) {
        setCompareRoles([compareRoles[1], role]);
      } else {
        setCompareRoles(prev => [...prev, role]);
      }
      setShowCompareModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-950/80 text-purple-400 border border-purple-800">
              EXPLORER HUB • STATION DECK 3
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Career Explorer & Market Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            Search 66 standardized roles mapped to 16,000+ postings with verified salary benchmarks from Fliar BI.
          </p>
        </div>

        {compareRoles.length > 0 && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-glow-violet transition-all cursor-pointer"
          >
            <Scale className="w-4 h-4" />
            <span>Compare ({compareRoles.length}/2)</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search roles by title, skill (e.g. SQL, Python, Excel), or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-space-900 border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <select
            value={selectedFamily}
            onChange={e => setSelectedFamily(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-space-900 border border-slate-800 text-xs text-slate-300 outline-none cursor-pointer"
          >
            {families.map(f => (
              <option key={f} value={f} className="bg-space-950 text-white">
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Role List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Role Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[640px] overflow-y-auto pr-2">
          {filteredRoles.map(role => {
            const isSelected = selectedRoleForDetail.role_id === role.role_id;
            const isBookmarked = profile.bookmarks.includes(role.role_id);
            const isTarget = profile.targetRoleId === role.role_id;

            return (
              <div
                key={role.role_id}
                onClick={() => {
                  setSelectedRoleForDetail(role);
                  playBeep(480, 'sine');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative ${
                  isSelected
                    ? 'bg-space-900 border-cyan-500/80 shadow-glow-cyan/20'
                    : 'bg-space-950/80 hover:bg-space-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{role.title}</h4>
                      {isTarget && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          Target
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-cyan-400 font-mono">{role.role_family}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => toggleBookmark(role.role_id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Role'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {role.definition}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono mt-3 pt-2.5 border-t border-slate-800/80 text-slate-400">
                  <span>{role.postings_count} dataset postings</span>
                  {role.salary_stats && (
                    <span className="text-emerald-400 font-semibold">
                      ₹{(role.salary_stats.median / 100000).toFixed(1)}L median/yr
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Selected Role In-Depth Details (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-6 shadow-2xl backdrop-blur-md">
            {/* Top Details Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    {selectedRoleForDetail.role_family}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                    {selectedRoleForDetail.seniority}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  {selectedRoleForDetail.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetTargetRole(selectedRoleForDetail)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    profile.targetRoleId === selectedRoleForDetail.role_id
                      ? 'bg-amber-500 text-space-950 font-bold'
                      : 'bg-space-950 border border-amber-500/40 text-amber-300 hover:bg-amber-950/50'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>
                    {profile.targetRoleId === selectedRoleForDetail.role_id
                      ? 'Current Goal'
                      : 'Set as Goal'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    playBeep(520, 'triangle');
                    setActiveRoom('role-match');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer"
                >
                  <span>Check My Fit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Role Definition */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Role Purpose & Core Responsibilities
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-space-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                {selectedRoleForDetail.definition}
              </p>
            </div>

            {/* Salary Benchmarks & Corpus Stats */}
            {selectedRoleForDetail.salary_stats && (
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-space-950 border border-slate-800">
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 font-mono">25th Percentile</div>
                  <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">
                    ₹{(selectedRoleForDetail.salary_stats.p25 / 100000).toFixed(1)} Lakh
                  </div>
                </div>
                <div className="text-center border-x border-slate-800">
                  <div className="text-[10px] text-cyan-400 font-mono font-semibold">Median Annual</div>
                  <div className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
                    ₹{(selectedRoleForDetail.salary_stats.median / 100000).toFixed(1)} Lakh
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 font-mono">75th Percentile</div>
                  <div className="text-sm font-bold font-mono text-slate-200 mt-0.5">
                    ₹{(selectedRoleForDetail.salary_stats.p75 / 100000).toFixed(1)} Lakh
                  </div>
                </div>
              </div>
            )}

            {/* Top Geographic Hubs */}
            {selectedRoleForDetail.top_cities.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Top Hiring Hubs in Dataset:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedRoleForDetail.top_cities.map(c => (
                    <span key={c} className="px-2.5 py-1 rounded-lg bg-space-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Required Skill Taxonomy */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Required Skill Taxonomy & Mentions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedRoleForDetail.skills.map(skill => (
                  <div
                    key={skill.skill_id}
                    className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{skill.name}</div>
                      <div className="text-[10px] text-slate-400">{skill.category}</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        skill.importance === 'Critical'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : (skill.importance === 'Required' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300')
                      }`}>
                        {skill.importance}
                      </span>
                      <div className="text-[10px] font-mono text-cyan-400 mt-1">
                        Target Lvl {skill.target_proficiency}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations Notice */}
            <div className="p-3.5 rounded-2xl bg-space-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="text-amber-400 font-semibold">Provenance Notice: </span>
              Salaries reflect Indian technology postings from the Fliar BI benchmark (annual INR assumed). Historical frequencies do not prove current employer demand.
            </div>
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {showCompareModal && compareRoles.length >= 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl rounded-3xl bg-space-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Side-by-Side Role Comparison</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {compareRoles.map(r => (
                <div key={r.role_id} className="p-4 rounded-2xl bg-space-950 border border-slate-800 space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{r.role_family}</span>
                    <h4 className="text-lg font-bold text-white">{r.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.definition}</p>
                  </div>

                  {r.salary_stats && (
                    <div className="p-3 rounded-xl bg-space-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-mono">Median Annual Salary</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        ₹{(r.salary_stats.median / 100000).toFixed(1)} Lakh INR
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-300">Required Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {r.skills.map(s => (
                        <span key={s.skill_id} className="px-2 py-0.5 rounded bg-space-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
