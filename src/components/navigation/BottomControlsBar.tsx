import React, { useEffect } from 'react';
import { Sparkles, Eye, EyeOff, Monitor } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomControlsBar: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    showControlsHelp, 
    setShowControlsHelp, 
    setShowAdvisorModal,
    playBeep 
  } = useApp();

  // Keyboard shortcuts (V for 2D/3D toggle, H for controls toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === 'v') {
        playBeep(480, 'triangle');
        setViewMode(viewMode === '3d' ? '2d' : '3d');
      } else if (e.key.toLowerCase() === 'h') {
        setShowControlsHelp(!showControlsHelp);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, showControlsHelp]);

  return (
    <footer className="absolute bottom-4 left-0 right-0 z-30 px-6 flex items-center justify-between pointer-events-none">
      {/* Left/Center: Movement & Interaction Hints */}
      <div className="flex items-center gap-4 pointer-events-auto">
        {showControlsHelp && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-space-950/85 border border-slate-800 text-xs text-slate-300 shadow-xl backdrop-blur-md">
            {/* WASD */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono text-[11px]">MOVE:</span>
              <div className="flex items-center gap-1">
                {['W', 'A', 'S', 'D'].map(k => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 rounded bg-space-900 border border-slate-700 text-cyan-300 font-mono font-bold text-[11px] shadow"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>

            <div className="h-4 w-[1px] bg-slate-800" />

            {/* Interact */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono text-[11px]">INTERACT:</span>
              <kbd className="px-2.5 py-0.5 rounded bg-space-900 border border-slate-700 text-amber-300 font-mono font-bold text-[11px] shadow">
                E / Click
              </kbd>
            </div>
          </div>
        )}

        {/* View Mode Toggle Button */}
        <button
          onClick={() => {
            playBeep(480, 'triangle');
            setViewMode(viewMode === '3d' ? '2d' : '3d');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-space-900/90 hover:bg-slate-800 border border-cyan-500/40 text-xs font-semibold text-cyan-300 shadow-glow-cyan/30 backdrop-blur-md transition-all cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{viewMode === '3d' ? 'Switch to 2D Mode (V)' : 'Return to 3D Hub (V)'}</span>
        </button>

        {/* Hide/Show Controls Toggle */}
        <button
          onClick={() => setShowControlsHelp(!showControlsHelp)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-space-900/70 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
        >
          {showControlsHelp ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showControlsHelp ? 'HIDE CONTROLS (H)' : 'SHOW CONTROLS (H)'}</span>
        </button>
      </div>

      {/* Right: AI Career Advisor Floating Button */}
      <div className="pointer-events-auto">
        <button
          onClick={() => {
            playBeep(620, 'sine');
            setShowAdvisorModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-glow-violet transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
          <span>AI Career Advisor</span>
        </button>
      </div>
    </footer>
  );
};
