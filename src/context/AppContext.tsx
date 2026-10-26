import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  SkillEvidence, 
  Badge, 
  Mission, 
  JobRole, 
  JobPostingSample, 
  ProvenanceData, 
  SkillItem,
  RoomKey, 
  SimulationAttempt, 
  RoadmapTask 
} from '../types';
import rolesData from '../data/roles.json';
import skillsData from '../data/taxonomy.json';
import provenanceData from '../data/provenance.json';
import jobsSampleData from '../data/jobs_sample.json';
import { INITIAL_MISSIONS, INITIAL_BADGES } from '../data/missions';
import { generateRoadmapForRole } from '../data/roadmapGenerator';

interface AppContextType {
  // Navigation & View Mode
  viewMode: '3d' | '2d';
  setViewMode: (mode: '3d' | '2d') => void;
  activeRoom: RoomKey;
  setActiveRoom: (room: RoomKey) => void;
  isRoomOpenIn3D: boolean;
  setIsRoomOpenIn3D: (open: boolean) => void;
  openRoom: (room: RoomKey) => void;
  closeRoom: () => void;
  showControlsHelp: boolean;
  setShowControlsHelp: (show: boolean) => void;
  showProvenanceModal: boolean;
  setShowProvenanceModal: (show: boolean) => void;
  showAdvisorModal: boolean;
  setShowAdvisorModal: (show: boolean) => void;

  // Data
  roles: JobRole[];
  skills: SkillItem[];
  provenance: ProvenanceData;
  jobsSample: JobPostingSample[];

  // User State & Persistence
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  skillEvidence: SkillEvidence[];
  addSkillEvidence: (evidence: SkillEvidence) => void;
  
  // Missions & Badges
  missions: Mission[];
  updateMissionStatus: (id: string, status: Mission['status']) => void;
  unlockBadge: (badgeId: string) => void;
  addXP: (amount: number, reason?: string) => void;

  // Simulations & Roadmaps
  simulationAttempts: SimulationAttempt[];
  saveSimulationAttempt: (attempt: SimulationAttempt) => void;
  activeRoadmap: RoadmapTask[];
  updateRoadmapTask: (taskId: string, updates: Partial<RoadmapTask>) => void;
  regenerateRoadmap: (roleId: string, hours?: number) => void;
  
  // Quick Notifications / Audio feedback
  notify: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
  notification: { title: string; message: string; type: string } | null;
  clearNotification: () => void;
  playBeep: (frequency?: number, type?: OscillatorType) => void;

  // Reset / Demo
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'skillradar_hub_state_v2.6';

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-001',
  name: 'Aina Jain',
  characterColor: '#a855f7', // Purple as seen in reference screenshot
  title: 'Student / Aspiring Data Analyst',
  educationLevel: 'Undergraduate 3rd Year',
  major: 'Computer Science & Analytics',
  targetRoleId: 'R001', // Data Analyst
  interests: ['Machine Learning', 'Data Visualization', 'SQL Optimization', 'Product Analytics'],
  xp: 665, // Match screenshot: 665 XP
  level: 4, // Match screenshot: Lvl 4
  badges: INITIAL_BADGES.map(b => b.id === 'first-orbit' ? { ...b, unlockedAt: new Date().toISOString() } : b),
  bookmarks: ['R001', 'R002', 'R005'],
  completedMissions: ['mission-1', 'mission-2']
};

const DEFAULT_EVIDENCE: SkillEvidence[] = [
  {
    skillId: 'S001',
    skillName: 'SQL',
    level: 3,
    source: 'quiz',
    timestamp: '2026-10-24T14:30:00Z',
    evidenceText: 'Passed SQL Intermediate Assessment (HAVING & JOIN query logic)'
  },
  {
    skillId: 'S002',
    skillName: 'Microsoft Excel',
    level: 4,
    source: 'quiz',
    timestamp: '2026-10-25T11:15:00Z',
    evidenceText: 'Demonstrated XLOOKUP and dynamic array formulas'
  },
  {
    skillId: 'S005',
    skillName: 'Python',
    level: 3,
    source: 'self-reported',
    timestamp: '2026-10-24T09:00:00Z',
    evidenceText: 'Completed academic coursework in pandas and data manipulation'
  },
  {
    skillId: 'S033',
    skillName: 'Communication',
    level: 4,
    source: 'self-reported',
    timestamp: '2026-10-24T09:00:00Z',
    evidenceText: 'Led student club presentations and project pitches'
  },
  {
    skillId: 'S036',
    skillName: 'Problem Solving',
    level: 3,
    source: 'quiz',
    timestamp: '2026-10-25T16:00:00Z',
    evidenceText: 'Root-cause analysis test passed'
  }
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [activeRoom, setActiveRoom] = useState<RoomKey>('command-center');
  const [isRoomOpenIn3D, setIsRoomOpenIn3D] = useState<boolean>(false);
  const [showControlsHelp, setShowControlsHelp] = useState<boolean>(true);
  const [showProvenanceModal, setShowProvenanceModal] = useState<boolean>(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ title: string; message: string; type: string } | null>(null);

  const openRoom = (room: RoomKey) => {
    setActiveRoom(room);
    setIsRoomOpenIn3D(true);
    playBeep(520, 'triangle');
  };

  const closeRoom = () => {
    setIsRoomOpenIn3D(false);
    playBeep(440, 'sine');
  };

  // Load from localStorage if present
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [skillEvidence, setSkillEvidence] = useState<SkillEvidence[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_evidence`);
      return saved ? JSON.parse(saved) : DEFAULT_EVIDENCE;
    } catch {
      return DEFAULT_EVIDENCE;
    }
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_missions`);
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  const [simulationAttempts, setSimulationAttempts] = useState<SimulationAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sim_attempts`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapTask[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_roadmap`);
      if (saved) return JSON.parse(saved);
      const targetRole = (rolesData as JobRole[]).find(r => r.role_id === 'R001') || (rolesData as JobRole[])[0];
      return generateRoadmapForRole(targetRole, DEFAULT_EVIDENCE);
    } catch {
      const targetRole = (rolesData as JobRole[])[0];
      return generateRoadmapForRole(targetRole, DEFAULT_EVIDENCE);
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
    } catch (e) { console.error('Save profile error', e); }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_evidence`, JSON.stringify(skillEvidence));
    } catch (e) { console.error('Save evidence error', e); }
  }, [skillEvidence]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_missions`, JSON.stringify(missions));
    } catch (e) { console.error('Save missions error', e); }
  }, [missions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_sim_attempts`, JSON.stringify(simulationAttempts));
    } catch (e) { console.error('Save sim attempts error', e); }
  }, [simulationAttempts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_roadmap`, JSON.stringify(activeRoadmap));
    } catch (e) { console.error('Save roadmap error', e); }
  }, [activeRoadmap]);

  // Audio tone helper
  const playBeep = (freq = 440, type: OscillatorType = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio autoplay policy catch
    }
  };

  const notify = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotification({ title, message, type });
    playBeep(type === 'success' ? 587.33 : 440, 'triangle');
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const clearNotification = () => setNotification(null);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addXP = (amount: number, reason?: string) => {
    setProfile(prev => {
      const nextXP = prev.xp + amount;
      const nextLvl = Math.max(1, Math.floor(nextXP / 180) + 1);
      if (nextLvl > prev.level) {
        notify('Level Up!', `Promoted to Station Level ${nextLvl}! New clearance unlocked.`, 'success');
      } else if (reason) {
        notify(`+${amount} XP Earned`, reason, 'success');
      }
      return { ...prev, xp: nextXP, level: nextLvl };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setProfile(prev => {
      const updated = prev.badges.map(b => {
        if (b.id === badgeId && !b.unlockedAt) {
          notify(`Badge Unlocked: ${b.title}`, b.description, 'success');
          return { ...b, unlockedAt: new Date().toISOString() };
        }
        return b;
      });
      return { ...prev, badges: updated };
    });
  };

  const addSkillEvidence = (newEvidence: SkillEvidence) => {
    setSkillEvidence(prev => {
      // Filter out duplicate or lower level evidence for same skill & source
      const filtered = prev.filter(e => !(e.skillId === newEvidence.skillId && e.source === newEvidence.source));
      return [...filtered, newEvidence];
    });
    addXP(40, `Skill evidence recorded for ${newEvidence.skillName}`);
  };

  const updateMissionStatus = (id: string, status: Mission['status']) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        if (status === 'completed' && m.status !== 'completed') {
          addXP(m.xpReward, `Completed Mission: ${m.title}`);
          if (m.badgeId) unlockBadge(m.badgeId);
        }
        return { ...m, status };
      }
      return m;
    }));
  };

  const saveSimulationAttempt = (attempt: SimulationAttempt) => {
    setSimulationAttempts(prev => [attempt, ...prev]);
    // Also record simulation evidence for primary skills
    for (const ev of attempt.evidenceAwarded) {
      const skill = (skillsData as SkillItem[]).find(s => s.skill_id === ev.skillId);
      addSkillEvidence({
        skillId: ev.skillId,
        skillName: skill ? skill.name : ev.skillId,
        level: ev.level,
        source: 'simulation',
        timestamp: attempt.timestamp,
        evidenceText: `Completed ${attempt.simId} practical simulation with score ${attempt.totalScore}/${attempt.maxScore}`
      });
    }
    addXP(150, `Simulation attempt logged (${attempt.totalScore}/${attempt.maxScore})`);
  };

  const updateRoadmapTask = (taskId: string, updates: Partial<RoadmapTask>) => {
    setActiveRoadmap(prev => prev.map(t => {
      if (t.id === taskId) {
        const next = { ...t, ...updates };
        if (updates.completed && !t.completed) {
          addXP(75, `Roadmap milestone completed: ${t.title}`);
          next.completedAt = new Date().toISOString();
        }
        return next;
      }
      return t;
    }));
  };

  const regenerateRoadmap = (roleId: string, hours = 8) => {
    const role = (rolesData as JobRole[]).find(r => r.role_id === roleId);
    if (!role) return;
    const generated = generateRoadmapForRole(role, skillEvidence, hours);
    setActiveRoadmap(generated);
    notify('Roadmap Calibrated', `Customized weekly plan generated for ${role.title}`, 'info');
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setProfile(DEFAULT_PROFILE);
    setSkillEvidence(DEFAULT_EVIDENCE);
    setMissions(INITIAL_MISSIONS);
    setSimulationAttempts([]);
    const targetRole = (rolesData as JobRole[])[0];
    setActiveRoadmap(generateRoadmapForRole(targetRole, DEFAULT_EVIDENCE));
    notify('Station Reset', 'All progress and profile data restored to defaults', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        activeRoom,
        setActiveRoom,
        isRoomOpenIn3D,
        setIsRoomOpenIn3D,
        openRoom,
        closeRoom,
        showControlsHelp,
        setShowControlsHelp,
        showProvenanceModal,
        setShowProvenanceModal,
        showAdvisorModal,
        setShowAdvisorModal,
        roles: rolesData as JobRole[],
        skills: skillsData as SkillItem[],
        provenance: provenanceData as ProvenanceData,
        jobsSample: jobsSampleData as JobPostingSample[],
        profile,
        updateProfile,
        skillEvidence,
        addSkillEvidence,
        missions,
        updateMissionStatus,
        unlockBadge,
        addXP,
        simulationAttempts,
        saveSimulationAttempt,
        activeRoadmap,
        updateRoadmapTask,
        regenerateRoadmap,
        notify,
        notification,
        clearNotification,
        playBeep,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
