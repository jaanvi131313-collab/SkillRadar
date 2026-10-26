export type RoomKey = 
  | 'lobby'
  | 'skill-scan'
  | 'career-explorer'
  | 'role-match'
  | 'simulation-arena'
  | 'skill-gap'
  | 'learning-roadmap'
  | 'command-center';

export interface SkillItem {
  skill_id: string;
  name: string;
  aliases: string[];
  category: string;
  definition: string;
  fliar_rank: number | null;
}

export interface RoleSalaryStats {
  count: number;
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
  currency: string;
  period: string;
}

export interface RoleSkillRequirement {
  skill_id: string;
  name: string;
  category: string;
  importance: 'Critical' | 'Required' | 'Preferred';
  target_proficiency: number; // 1 to 5
  weight: number; // 0 to 1
  corpus_mentions: number;
}

export interface JobRole {
  role_id: string;
  title: string;
  role_family: string;
  seniority: string;
  definition: string;
  postings_count: number;
  salary_stats: RoleSalaryStats | null;
  top_cities: string[];
  sample_companies: string[];
  skills: RoleSkillRequirement[];
}

export interface JobPostingSample {
  job_id: string;
  source_id: string;
  role_id: string;
  title: string;
  company: string;
  city: string;
  state: string;
  salary_min: number | null;
  salary_max: number | null;
  seniority: string;
  posted_month: string;
}

export interface ProvenanceSource {
  source_id: string;
  source_name: string;
  source_url: string;
  license_terms: string;
  reported_volume: string;
  date_coverage: string;
  fields_and_coverage: string;
  potential_use: string;
  known_limitations: string;
  import_status: string;
  next_action: string;
}

export interface DataQualityAudit {
  check_id: string;
  check_name: string;
  method: string;
  status: string;
  acceptance_rule: string;
  action: string;
}

export interface ProvenanceData {
  dataset_file: string;
  total_sheets: number;
  sheet_names: string[];
  total_raw_jobs: number;
  total_clean_jobs: number;
  total_skills_taxonomy: number;
  total_job_roles: number;
  total_extracted_skills: number;
  sources: ProvenanceSource[];
  data_quality_audits: DataQualityAudit[];
  limitations: string[];
}

export interface SkillEvidence {
  skillId: string;
  skillName: string;
  level: number; // 1 - 5
  source: 'self-reported' | 'quiz' | 'simulation';
  timestamp: string;
  evidenceText: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  characterColor: string;
  title: string;
  educationLevel: string;
  major: string;
  targetRoleId: string;
  interests: string[];
  xp: number;
  level: number;
  badges: Badge[];
  bookmarks: string[]; // role_ids
  completedMissions: string[];
}

export interface QuizQuestion {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  question: string;
  codeSnippet?: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  levelAwarded: number;
}

export interface SimulationRubricItem {
  id: string;
  criterion: string;
  maxScore: number;
  earnedScore: number;
  feedback: string;
  passed: boolean;
}

export interface SimulationAttempt {
  id: string;
  simId: 'data-analyst' | 'financial-analyst' | 'business-analyst';
  timestamp: string;
  totalScore: number;
  maxScore: number;
  rubricFeedback: SimulationRubricItem[];
  userSubmission: Record<string, any>;
  evidenceAwarded: { skillId: string; level: number }[];
}

export interface RoadmapTask {
  id: string;
  week: number;
  title: string;
  objective: string;
  skillId: string;
  skillName: string;
  targetProficiency: number;
  estimatedHours: number;
  resource: {
    title: string;
    url: string;
    type: 'docs' | 'interactive' | 'practice' | 'handbook';
  };
  practiceTask: string;
  completionCriteria: string;
  completed: boolean;
  userNotes: string;
  completedAt?: string;
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  roomKey: RoomKey;
  description: string;
  xpReward: number;
  badgeId?: string;
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  completionCondition: string;
}

export interface FitCalculationSkillDetail {
  skillId: string;
  skillName: string;
  category: string;
  importance: 'Critical' | 'Required' | 'Preferred';
  targetLevel: number;
  demonstratedLevel: number;
  evidenceSource: 'self-reported' | 'quiz' | 'simulation' | 'none';
  evidenceDate: string | null;
  matchStatus: 'matched' | 'partial' | 'gap' | 'unassessed';
  weight: number;
  contributionScore: number;
}

export interface FitResult {
  roleId: string;
  roleTitle: string;
  overallScore: number; // 0 - 100
  dataCompleteness: number; // 0 - 100
  matchedSkillsCount: number;
  partialSkillsCount: number;
  gapSkillsCount: number;
  unassessedSkillsCount: number;
  skillDetails: FitCalculationSkillDetail[];
  strengths: string[];
  gaps: string[];
  formulaExplanation: string;
  disclaimer: string;
}
