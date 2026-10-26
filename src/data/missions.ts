import { Mission, Badge } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first-orbit',
    title: 'First Orbit',
    description: 'Created your station profile and boarded the hub deck.',
    icon: '🚀',
    unlockedAt: '2026-10-24T10:00:00Z'
  },
  {
    id: 'quiz-ace',
    title: 'Data Pioneer',
    description: 'Successfully completed your first verified Skill Scan assessment.',
    icon: '🔬',
    unlockedAt: null
  },
  {
    id: 'career-scout',
    title: 'Orbit Explorer',
    description: 'Bookmarked your first career path in the Career Explorer.',
    icon: '🧭',
    unlockedAt: null
  },
  {
    id: 'calibration-ace',
    title: 'Calibration Ace',
    description: 'Ran an explainable weighted skill fit analysis.',
    icon: '🎯',
    unlockedAt: null
  },
  {
    id: 'simulation-vet',
    title: 'Simulation Veteran',
    description: 'Executed an end-to-end practical job simulation with passing rubric score.',
    icon: '⚡',
    unlockedAt: null
  },
  {
    id: 'roadmap-architect',
    title: 'Master Strategist',
    description: 'Configured a personalized skill upgrade roadmap and marked your first milestone.',
    icon: '🗺️',
    unlockedAt: null
  },
  {
    id: 'station-commander',
    title: 'Station Commander',
    description: 'Achieved Level 5 and balanced your core skill radar.',
    icon: '👑',
    unlockedAt: null
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission-1',
    number: 1,
    title: '1. Skill Scan Lab',
    roomKey: 'skill-scan',
    description: 'Complete skill self-assessments or technical quizzes to establish verified proficiency baseline.',
    xpReward: 150,
    badgeId: 'quiz-ace',
    status: 'in_progress',
    completionCondition: 'Complete at least 1 Skill Scan quiz or submit self-reported proficiencies.'
  },
  {
    id: 'mission-2',
    number: 2,
    title: '2. Career Explorer',
    roomKey: 'career-explorer',
    description: 'Search 66 real career roles, inspect salary benchmarks from Fliar BI, and bookmark your primary target.',
    xpReward: 100,
    badgeId: 'career-scout',
    status: 'available',
    completionCondition: 'Bookmark at least 1 role as your target career path.'
  },
  {
    id: 'mission-3',
    number: 3,
    title: '3. Role Match Command Center',
    roomKey: 'role-match',
    description: 'Run the explainable Check My Fit calculation to view weighted skill matches and completeness.',
    xpReward: 120,
    badgeId: 'calibration-ace',
    status: 'available',
    completionCondition: 'Calculate match fit for your target role.'
  },
  {
    id: 'mission-4',
    number: 4,
    title: '4. Job Simulation Arena',
    roomKey: 'simulation-arena',
    description: 'Demonstrate real-world problem-solving in Data, Financial, or Business Analyst scenarios.',
    xpReward: 250,
    badgeId: 'simulation-vet',
    status: 'available',
    completionCondition: 'Complete any simulation module and receive graded rubric feedback.'
  },
  {
    id: 'mission-5',
    number: 5,
    title: '5. Skill Gap Analysis',
    roomKey: 'skill-gap',
    description: 'Inspect exact level deficits between demonstrated abilities and target role requirements.',
    xpReward: 100,
    badgeId: undefined,
    status: 'available',
    completionCondition: 'Review your skill gap matrix.'
  },
  {
    id: 'mission-6',
    number: 6,
    title: '6. Learning Roadmap',
    roomKey: 'learning-roadmap',
    description: 'Generate an editable weekly plan with real resources, practice tasks, and completion criteria.',
    xpReward: 150,
    badgeId: 'roadmap-architect',
    status: 'available',
    completionCondition: 'Complete at least 1 learning milestone in your roadmap.'
  },
  {
    id: 'mission-7',
    number: 7,
    title: '7. Command Center',
    roomKey: 'command-center',
    description: 'Review your XP trajectory, skill radar, simulation history, and continue your active mission.',
    xpReward: 100,
    badgeId: 'station-commander',
    status: 'available',
    completionCondition: 'Visit Command Center and reach Level 4 or above.'
  }
];
