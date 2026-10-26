import { JobRole, SkillEvidence, FitResult, FitCalculationSkillDetail } from '../types';

export function calculateRoleFit(role: JobRole, userEvidence: SkillEvidence[]): FitResult {
  if (!role || !role.skills || role.skills.length === 0) {
    return {
      roleId: role ? role.role_id : 'unknown',
      roleTitle: role ? role.title : 'Unknown Role',
      overallScore: 0,
      dataCompleteness: 0,
      matchedSkillsCount: 0,
      partialSkillsCount: 0,
      gapSkillsCount: 0,
      unassessedSkillsCount: 0,
      skillDetails: [],
      strengths: [],
      gaps: [],
      formulaExplanation: 'No skill requirements defined for this role in the current dataset.',
      disclaimer: 'Skill match score represents alignment with modeled historical skill requirements from posting data, NOT a probability of being hired.'
    };
  }

  // Create evidence lookup by skillId (take highest demonstrated level)
  const evidenceMap = new Map<string, SkillEvidence>();
  for (const ev of userEvidence) {
    const existing = evidenceMap.get(ev.skillId);
    if (!existing || ev.level > existing.level) {
      evidenceMap.set(ev.skillId, ev);
    }
  }

  let totalWeight = 0;
  let earnedWeightedScore = 0;
  let assessedCount = 0;

  const skillDetails: FitCalculationSkillDetail[] = [];
  const strengths: string[] = [];
  const gaps: string[] = [];

  for (const req of role.skills) {
    const ev = evidenceMap.get(req.skill_id);
    const weight = req.importance === 'Critical' ? 1.0 : (req.importance === 'Required' ? 0.8 : 0.5);
    totalWeight += weight;

    const targetLevel = req.target_proficiency || 4;
    const demonstratedLevel = ev ? ev.level : 0;
    const evidenceSource = ev ? ev.source : 'none';
    const evidenceDate = ev ? ev.timestamp : null;

    let matchStatus: 'matched' | 'partial' | 'gap' | 'unassessed' = 'unassessed';
    let ratio = 0;

    if (ev) {
      assessedCount++;
      ratio = Math.min(demonstratedLevel / targetLevel, 1.0);
      if (demonstratedLevel >= targetLevel) {
        matchStatus = 'matched';
        strengths.push(`${req.name} (Demonstrated Lvl ${demonstratedLevel} vs Target Lvl ${targetLevel})`);
      } else if (demonstratedLevel >= targetLevel * 0.5) {
        matchStatus = 'partial';
      } else {
        matchStatus = 'gap';
        gaps.push(`${req.name} (Need +${targetLevel - demonstratedLevel} levels)`);
      }
    } else {
      matchStatus = 'unassessed';
      gaps.push(`${req.name} (Unassessed - target Lvl ${targetLevel})`);
    }

    const contribution = weight * ratio;
    earnedWeightedScore += contribution;

    skillDetails.push({
      skillId: req.skill_id,
      skillName: req.name,
      category: req.category,
      importance: req.importance,
      targetLevel,
      demonstratedLevel,
      evidenceSource,
      evidenceDate,
      matchStatus,
      weight,
      contributionScore: Math.round(contribution * 100) / 100
    });
  }

  const overallScore = totalWeight > 0 ? Math.round((earnedWeightedScore / totalWeight) * 100) : 0;
  const dataCompleteness = Math.round((assessedCount / role.skills.length) * 100);

  const matchedSkillsCount = skillDetails.filter(s => s.matchStatus === 'matched').length;
  const partialSkillsCount = skillDetails.filter(s => s.matchStatus === 'partial').length;
  const gapSkillsCount = skillDetails.filter(s => s.matchStatus === 'gap').length;
  const unassessedSkillsCount = skillDetails.filter(s => s.matchStatus === 'unassessed').length;

  const formulaExplanation = `Weighted Match Score = [∑(Weight_i × min(Demonstrated_i / Target_i, 1.0)) / ∑Weight_i] × 100. Weights: Critical=1.0, Required=0.8, Preferred=0.5. Current score: ${overallScore}% across ${role.skills.length} modeled skills with ${dataCompleteness}% profile evidence completeness.`;

  return {
    roleId: role.role_id,
    roleTitle: role.title,
    overallScore,
    dataCompleteness,
    matchedSkillsCount,
    partialSkillsCount,
    gapSkillsCount,
    unassessedSkillsCount,
    skillDetails,
    strengths,
    gaps,
    formulaExplanation,
    disclaimer: 'Notice: This skill-match score measures alignment with skills extracted from job postings in the Fliar/LinkedIn dataset. It does NOT represent hiring probability, candidate ranking, or an employer evaluation.'
  };
}
