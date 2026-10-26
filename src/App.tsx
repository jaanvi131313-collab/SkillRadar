import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavBar } from './components/navigation/TopNavBar';
import { SpaceshipCanvas } from './components/hub3d/SpaceshipCanvas';
import { MissionBoardSidebar } from './components/navigation/MissionBoardSidebar';
import { BottomControlsBar } from './components/navigation/BottomControlsBar';
import { Console2DView } from './components/views/Console2DView';
import { DatasetProvenanceModal } from './components/modals/DatasetProvenanceModal';
import { AICareerAdvisorModal } from './components/modals/AICareerAdvisorModal';
import { LobbyRoom } from './components/rooms/LobbyRoom';
import { SkillScanRoom } from './components/rooms/SkillScanRoom';
import { CareerExplorerRoom } from './components/rooms/CareerExplorerRoom';
import { RoleMatchRoom } from './components/rooms/RoleMatchRoom';
import { SimulationArenaRoom } from './components/rooms/SimulationArenaRoom';
import { SkillGapRoom } from './components/rooms/SkillGapRoom';
import { RoadmapRoom } from './components/rooms/RoadmapRoom';
import { CommandCenterRoom } from './components/rooms/CommandCenterRoom';
import { X, ArrowLeft, Bell } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    viewMode, 
    activeRoom, 
    isRoomOpenIn3D,
    closeRoom,
    notification, 
    clearNotification 
  } = useApp();

  // Handle ESC key to close room overlay in 3D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRoomOpenIn3D) {
        closeRoom();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRoomOpenIn3D, closeRoom]);

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
    <div className="relative w-screen h-screen overflow-hidden bg-space-950 font-sans text-slate-100 flex flex-col">
      {/* Top Bar */}
      <TopNavBar />

      {/* Main View Area */}
      {viewMode === '3d' ? (
        <div className="relative flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden">
          {/* 3D Walkable Canvas */}
          <SpaceshipCanvas />

          {/* Left Mission Board Sidebar */}
          <MissionBoardSidebar />

          {/* Bottom Movement & Action Hints Bar */}
          <BottomControlsBar />

          {/* Room Overlay Modal (When player enters a room or clicks from sidebar) */}
          {isRoomOpenIn3D && (
            <div className="absolute inset-0 z-40 bg-space-950/80 backdrop-blur-xl flex flex-col animate-in fade-in select-text">
              {/* Room Top Subheader */}
              <div className="h-14 px-6 border-b border-station-border/80 flex items-center justify-between bg-space-950/90 shrink-0">
                <button
                  onClick={closeRoom}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-space-900 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 text-xs font-semibold cursor-pointer transition-all hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to 3D Deck (Esc)</span>
                </button>

                <button
                  onClick={closeRoom}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close Room Deck"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Room Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {renderActiveRoom()}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Console2DView />
      )}

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-space-900/95 border border-cyan-500/70 text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="font-bold text-xs text-cyan-300">{notification.title}</div>
            <div className="text-[11px] text-slate-300">{notification.message}</div>
          </div>
          <button
            onClick={clearNotification}
            className="p-1 rounded text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modals */}
      <DatasetProvenanceModal />
      <AICareerAdvisorModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
