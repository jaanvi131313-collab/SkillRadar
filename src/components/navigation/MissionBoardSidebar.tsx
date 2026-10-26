import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoomKey } from '../../types';

export const MissionBoardSidebar: React.FC = () => {
  const { 
    missions, 
    activeRoom, 
    openRoom, 
    playBeep,
    skillEvidence,
    simulationAttempts,
    activeRoadmap
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamic calculation of journey progress
  const completedCount = missions.filter(m => m.status === 'completed').length;
  // Let's compute progress percentage
  const progressPercent = Math.min(100, Math.round((completedCount / missions.length) * 100));

  const radarBlips: { room: RoomKey; label: string; x: number; y: number; color: string }[] = [
    { room: 'command-center', label: 'CC', x: 50, y: 15, color: '#38bdf8' },
    { room: 'simulation-arena', label: 'SIM', x: 80, y: 28, color: '#f59e0b' },
    { room: 'career-explorer', label: 'CAR', x: 85, y: 65, color: '#8b5cf6' },
    { room: 'skill-scan', label: 'SCAN', x: 65, y: 88, color: '#06b6d4' },
    { room: 'learning-roadmap', label: 'MAP', x: 35, y: 88, color: '#10b981' },
    { room: 'skill-gap', label: 'GAP', x: 15, y: 65, color: '#ec4899' },
    { room: 'lobby', label: 'LOB', x: 20, y: 28, color: '#6366f1' }
  ];

  if (isCollapsed) {
    return (
      <div className="absolute top-20 left-4 z-30">
        <button
          onClick={() => {
            playBeep(480, 'sine');
            setIsCollapsed(false);
          }}
          className="p-3 rounded-2xl bg-space-900/90 border border-slate-800 hover:border-cyan-500/50 text-cyan-400 shadow-glow-card backdrop-blur-md transition-all cursor-pointer hover:scale-105"
          title="Open Mission Board"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <aside className="absolute top-20 left-4 z-30 w-72 rounded-3xl bg-space-950/85 border border-station-border/80 p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-4 text-slate-200 select-none animate-in fade-in slide-in-from-left-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-sm tracking-wide text-white">Mission Board</h2>
        </div>
        <button
          onClick={() => {
            playBeep(440, 'sine');
            setIsCollapsed(true);
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Journey Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Journey Progress</span>
          <span className="text-cyan-300 font-mono font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-space-900 border border-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 transition-all duration-700 shadow-glow-cyan"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1">
        {missions.map(mission => {
          const isActive = activeRoom === mission.roomKey;
          const isDone = mission.status === 'completed';

          return (
            <button
              key={mission.id}
              onClick={() => {
                openRoom(mission.roomKey);
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer group ${
                isActive
                  ? 'bg-cyan-950/60 border border-cyan-500/60 text-cyan-200 shadow-glow-cyan/20'
                  : 'hover:bg-space-900/80 border border-transparent hover:border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                )}
                <span className={`truncate font-medium ${isDone ? 'text-slate-400 line-through' : ''}`}>
                  {mission.title}
                </span>
              </div>
              <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                isActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Hub Radar Mini-Map */}
      <div className="border-t border-slate-800/80 pt-3 flex flex-col items-center">
        <div className="relative w-36 h-36 rounded-full bg-space-900/90 border border-cyan-500/30 shadow-inner flex items-center justify-center overflow-hidden">
          {/* Radar Circles */}
          <div className="absolute inset-2 rounded-full border border-cyan-500/10 pointer-events-none" />
          <div className="absolute inset-6 rounded-full border border-cyan-500/20 pointer-events-none" />
          <div className="absolute inset-10 rounded-full border border-cyan-500/10 pointer-events-none" />
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-cyan-500/15 pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-cyan-500/15 pointer-events-none" />

          {/* Rotating radar sweep line */}
          <div className="absolute inset-0 rounded-full pointer-events-none bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(6,182,212,0.25)_360deg)] animate-spin" style={{ animationDuration: '4s' }} />

          {/* Center Player Marker */}
          <div className="absolute w-3 h-3 rounded-full bg-white shadow-glow-cyan z-20 animate-ping" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 z-20" />

          {/* Radar Room Blips */}
          {radarBlips.map(blip => {
            const isSelected = activeRoom === blip.room;
            return (
              <button
                key={blip.room}
                onClick={() => {
                  openRoom(blip.room);
                }}
                style={{
                  top: `${blip.y}%`,
                  left: `${blip.x}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: blip.color
                }}
                className={`absolute w-3.5 h-3.5 rounded-full transition-transform hover:scale-150 z-20 cursor-pointer ${
                  isSelected ? 'ring-2 ring-white scale-125 shadow-glow-cyan' : 'opacity-85'
                }`}
                title={`Fast Travel to ${blip.label}`}
              />
            );
          })}
        </div>

        <div className="mt-2 text-[10px] font-mono tracking-widest text-slate-400 uppercase">
          HUB RADAR
        </div>
      </div>
    </aside>
  );
};
