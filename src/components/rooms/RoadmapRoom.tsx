import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Clock, 
  Calendar, 
  BookOpen, 
  Award, 
  RotateCcw, 
  Edit3, 
  Plus, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoadmapTask } from '../../types';

export const RoadmapRoom: React.FC = () => {
  const { 
    activeRoadmap, 
    updateRoadmapTask, 
    regenerateRoadmap, 
    profile, 
    roles, 
    updateMissionStatus, 
    unlockBadge, 
    notify, 
    playBeep 
  } = useApp();

  const [weeklyHours, setWeeklyHours] = useState(8);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  const targetRole = roles.find(r => r.role_id === profile.targetRoleId) || roles[0];

  const handleToggleTask = (task: RoadmapTask) => {
    const nextCompleted = !task.completed;
    updateRoadmapTask(task.id, { completed: nextCompleted });

    if (nextCompleted) {
      playBeep(587, 'triangle');
      updateMissionStatus('mission-6', 'completed');
      unlockBadge('roadmap-architect');
      notify('Milestone Completed!', `Finished "${task.title}". Demonstrated skill progress recorded.`, 'success');
    } else {
      playBeep(380, 'sine');
    }
  };

  const handleSaveNotes = (taskId: string) => {
    updateRoadmapTask(taskId, { userNotes: noteContent });
    setEditingNotesId(null);
    notify('Notes Saved', 'Task study notes recorded', 'info');
  };

  const completedCount = activeRoadmap.filter(t => t.completed).length;
  const progressPercent = activeRoadmap.length > 0 ? Math.round((completedCount / activeRoadmap.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              UPGRADE STATION • MODULE 6
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Skill Upgrade Station & Learning Roadmap
          </h1>
          <p className="text-xs text-slate-400">
            Tailored weekly curriculum targeting your specific deficits for <span className="text-white font-semibold">{targetRole.title}</span>.
          </p>
        </div>

        {/* Schedule Calibrator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-space-900 border border-slate-800 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pace:</span>
            <select
              value={weeklyHours}
              onChange={e => {
                const h = parseInt(e.target.value);
                setWeeklyHours(h);
                regenerateRoadmap(targetRole.role_id, h);
              }}
              className="bg-space-950 text-white rounded px-2 py-0.5 outline-none font-mono"
            >
              <option value={4}>4 hrs / wk (Part-time)</option>
              <option value={8}>8 hrs / wk (Standard)</option>
              <option value={15}>15 hrs / wk (Intensive)</option>
              <option value={20}>20 hrs / wk (Bootcamp)</option>
            </select>
          </div>

          <button
            onClick={() => regenerateRoadmap(targetRole.role_id, weeklyHours)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-space-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Recalibrate tasks from latest skill evidence"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recalibrate</span>
          </button>
        </div>
      </div>

      {/* Progress & Milestone Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-space-900 via-station-border to-space-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            Curriculum Completion Status
          </span>
          <h2 className="text-xl font-bold text-white">
            {completedCount} of {activeRoadmap.length} Milestones Achieved ({progressPercent}%)
          </h2>
          <div className="w-full md:w-96 h-2 rounded-full bg-space-950 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-glow-emerald transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 max-w-sm leading-relaxed text-right md:text-left">
          <span className="font-bold text-amber-300">Grounding Policy: </span>
          Reading documentation alone does not mark a skill mastered. Each milestone requires verified code execution, case analysis, or Skill Scan validation.
        </div>
      </div>

      {/* Roadmap Tasks List */}
      <div className="space-y-4">
        {activeRoadmap.map(task => {
          const isDone = task.completed;
          const isEditing = editingNotesId === task.id;

          return (
            <div
              key={task.id}
              className={`p-6 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-space-950/70 border-emerald-500/40 shadow-inner'
                  : 'bg-space-900/90 border-slate-800 shadow-xl'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Square className="w-6 h-6 text-slate-600 hover:text-cyan-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                        WEEK {task.week}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">
                        {task.skillName} (Target Lvl {task.targetProficiency})
                      </span>
                    </div>
                    <h3 className={`text-base font-bold text-white mt-0.5 ${isDone ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est: {task.estimatedHours} Hours</span>
                </div>
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                {/* Objective & Practice */}
                <div className="space-y-2">
                  <div className="text-slate-300">
                    <span className="text-cyan-400 font-semibold font-mono">Objective: </span>
                    {task.objective}
                  </div>
                  <div className="p-3 rounded-2xl bg-space-950 border border-slate-800/80 text-slate-300">
                    <span className="text-amber-400 font-semibold font-mono">Practical Project: </span>
                    {task.practiceTask}
                  </div>
                </div>

                {/* Resource & Completion Criteria */}
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-space-950 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Reputable Resource</div>
                      <div className="font-semibold text-white mt-0.5">{task.resource.title}</div>
                    </div>
                    <a
                      href={task.resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 hover:border-cyan-500 text-cyan-300 text-xs font-semibold transition-all shrink-0 ml-2"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="text-slate-400 text-[11px] leading-relaxed">
                    <span className="text-emerald-400 font-semibold font-mono">Completion Criteria: </span>
                    {task.completionCriteria}
                  </div>
                </div>
              </div>

              {/* User Notes Section */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                {isEditing ? (
                  <div className="w-full space-y-2">
                    <textarea
                      rows={2}
                      value={noteContent}
                      onChange={e => setNoteContent(e.target.value)}
                      placeholder="Take personal study notes, paste code links, or note breakthroughs..."
                      className="w-full p-2.5 rounded-xl bg-space-950 border border-slate-700 text-xs text-white outline-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-3 py-1 rounded-lg text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(task.id)}
                        className="px-3 py-1 rounded-lg bg-cyan-500 text-space-950 font-bold"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-slate-500 text-[11px] italic">
                      {task.userNotes ? `Notes: "${task.userNotes}"` : 'No study notes recorded yet.'}
                    </span>
                    <button
                      onClick={() => {
                        setEditingNotesId(task.id);
                        setNoteContent(task.userNotes || '');
                      }}
                      className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 text-[11px] cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{task.userNotes ? 'Edit Notes' : 'Add Note'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
