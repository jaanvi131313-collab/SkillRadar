import React from 'react';
import { 
  Compass, 
  Code2, 
  Search, 
  Target, 
  Terminal, 
  BarChart2, 
  BookOpen, 
  LayoutDashboard,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoomKey } from '../../types';
import { LobbyRoom } from '../rooms/LobbyRoom';
import { SkillScanRoom } from '../rooms/SkillScanRoom';
import { CareerExplorerRoom } from '../rooms/CareerExplorerRoom';
import { RoleMatchRoom } from '../rooms/RoleMatchRoom';
import { SimulationArenaRoom } from '../rooms/SimulationArenaRoom';
import { SkillGapRoom } from '../rooms/SkillGapRoom';
import { RoadmapRoom } from '../rooms/RoadmapRoom';
import { CommandCenterRoom } from '../rooms/CommandCenterRoom';

export const Console2DView: React.FC = () => {
  const { activeRoom, setActiveRoom, setViewMode, playBeep } = useApp();

  const navItems: { key: RoomKey; label: string; icon: React.ReactNode }[] = [
    { key: 'command-center', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'lobby', label: 'Station Lobby', icon: <Compass className="w-4 h-4" /> },
    { key: 'skill-scan', label: 'Skill Scan Lab', icon: <Code2 className="w-4 h-4" /> },
    { key: 'career-explorer', label: 'Career Explorer', icon: <Search className="w-4 h-4" /> },
    { key: 'role-match', label: 'Role Match ("Fit")', icon: <Target className="w-4 h-4" /> },
    { key: 'simulation-arena', label: 'Simulation Arena', icon: <Terminal className="w-4 h-4" /> },
    { key: 'skill-gap', label: 'Skill Gaps', icon: <BarChart2 className="w-4 h-4" /> },
    { key: 'learning-roadmap', label: 'Learning Roadmap', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const renderActiveRoom = () => {
    switch (activeRoom) {
      case 'lobby': return <LobbyRoom />;
      case 'skill-scan': return <SkillScanRoom />;
      case 'career-explorer': return <CareerExplorerRoom />;
      case 'role-match': return <RoleMatchRoom />;
      case 'simulation-arena': return <SimulationArenaRoom />;
      case 'skill-gap': return <SkillGapRoom />;
      case 'learning-roadmap': return <RoadmapRoom />;
      case 'command-center':
      default:
        return <CommandCenterRoom />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-space-950">
      {/* 2D Sidebar Navigation */}
      <aside className="w-64 border-r border-station-border/80 bg-space-900/60 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-3 mb-2">
            STATION WORKFLOWS
          </div>

          {navItems.map(item => {
            const isActive = activeRoom === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  playBeep(480, 'sine');
                  setActiveRoom(item.key);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-space-950 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white hover:bg-space-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Return to 3D Button */}
        <button
          onClick={() => {
            playBeep(520, 'triangle');
            setViewMode('3d');
          }}
          className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-space-950 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 text-xs font-semibold cursor-pointer transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to 3D Spaceship Hub</span>
        </button>
      </aside>

      {/* Main Room Viewport */}
      <main className="flex-1 h-full overflow-y-auto p-4 select-text">
        {renderActiveRoom()}
      </main>
    </div>
  );
};
