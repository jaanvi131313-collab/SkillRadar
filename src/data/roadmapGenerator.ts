import { RoadmapTask, JobRole, SkillEvidence } from '../types';

export function generateRoadmapForRole(
  role: JobRole,
  userEvidence: SkillEvidence[],
  weeklyHours: number = 8
): RoadmapTask[] {
  const evidenceMap = new Map<string, number>();
  for (const ev of userEvidence) {
    const cur = evidenceMap.get(ev.skillId) || 0;
    if (ev.level > cur) evidenceMap.set(ev.skillId, ev.level);
  }

  const tasks: RoadmapTask[] = [];
  let currentWeek = 1;

  // Real resources mapping by skill
  const realResources: Record<string, { title: string; url: string; type: 'docs' | 'interactive' | 'practice' | 'handbook' }> = {
    'S001': {
      title: 'PostgreSQL Documentation & SQLBolt Interactive Practice',
      url: 'https://sqlbolt.com/',
      type: 'interactive'
    },
    'S002': {
      title: 'Microsoft Excel Official Formula & Data Analysis Reference',
      url: 'https://support.microsoft.com/en-us/excel',
      type: 'docs'
    },
    'S003': {
      title: 'Microsoft Learn: Power BI Guided Data Modeling Course',
      url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi',
      type: 'docs'
    },
    'S004': {
      title: 'Tableau Public Free Training & Visual Analytics Catalog',
      url: 'https://www.tableau.com/community/public',
      type: 'interactive'
    },
    'S005': {
      title: 'Python Software Foundation & Pandas Official User Guide',
      url: 'https://pandas.pydata.org/docs/user_guide/index.html',
      type: 'docs'
    },
    'S012': {
      title: 'Khan Academy: College Statistics & Probability Course',
      url: 'https://www.khanacademy.org/math/statistics-probability',
      type: 'handbook'
    },
    'S025': {
      title: 'IIBA BABOK Guide Overview & Real-World Case Studies',
      url: 'https://www.iiba.org/standards-and-resources/babok/',
      type: 'docs'
    },
    'S026': {
      title: 'Agile Alliance: Requirements Gathering & User Story Mapping',
      url: 'https://www.agilealliance.org/glossary/user-story/',
      type: 'handbook'
    },
    'S038': {
      title: 'Corporate Finance Institute (CFI): 3-Statement Modeling Guide',
      url: 'https://corporatefinanceinstitute.com/resources/accounting/three-statement-model/',
      type: 'docs'
    },
    'S039': {
      title: 'AccountingCoach: Balance Sheet & Accrual Accounting Modules',
      url: 'https://www.accountingcoach.com/',
      type: 'interactive'
    },
    'S042': {
      title: 'OpenStax Principles of Managerial Accounting & Budgeting',
      url: 'https://openstax.org/details/books/principles-managerial-accounting',
      type: 'handbook'
    },
    'S071': {
      title: 'MDN Web Docs: RESTful APIs & HTTP Methods Reference',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
      type: 'docs'
    },
    'S069': {
      title: 'Git Official Book (Pro Git) by Scott Chacon',
      url: 'https://git-scm.com/book/en/v2',
      type: 'docs'
    },
    'S103': {
      title: 'React Official Documentation & Interactive Quick Start',
      url: 'https://react.dev/learn',
      type: 'interactive'
    }
  };

  // For each skill in the role, generate sequential practical milestone tasks
  for (const req of role.skills) {
    const demonstrated = evidenceMap.get(req.skill_id) || 0;
    const target = req.target_proficiency || 4;
    const gap = target - demonstrated;

    if (gap > 0) {
      const resource = realResources[req.skill_id] || {
        title: `${req.name} Official Standard Documentation & Reference`,
        url: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(req.name),
        type: 'docs'
      };

      const estHours = Math.round(Math.max(4, gap * 3.5 * (8 / weeklyHours)));

      tasks.push({
        id: `task-${req.skill_id}-${currentWeek}`,
        week: currentWeek,
        title: `Master ${req.name} Foundations & Practical Application`,
        objective: `Elevate demonstrated proficiency from Level ${demonstrated} to Level ${target} for ${role.title} requirements.`,
        skillId: req.skill_id,
        skillName: req.name,
        targetProficiency: target,
        estimatedHours: estHours,
        resource,
        practiceTask: `Complete a reproducible project exercise: build and document a mini-case using ${req.name} with verified test data or sandbox execution.`,
        completionCriteria: `Must pass the ${req.name} Skill Scan assessment at Level ${target} or complete a simulation task verifying correct output.`,
        completed: false,
        userNotes: ''
      });

      currentWeek++;
    }
  }

  // If no gaps, create an advanced mastery milestone
  if (tasks.length === 0) {
    tasks.push({
      id: 'task-mastery-1',
      week: 1,
      title: `Advanced Portfolio Project for ${role.title}`,
      objective: 'Demonstrate end-to-end multi-skill integration on a real public dataset.',
      skillId: role.skills[0]?.skill_id || 'S001',
      skillName: role.skills[0]?.name || 'Core Domain',
      targetProficiency: 5,
      estimatedHours: 12,
      resource: {
        title: 'Kaggle Datasets & Project Portfolios',
        url: 'https://www.kaggle.com/datasets',
        type: 'practice'
      },
      practiceTask: 'Publish a clean GitHub repository or interactive report solving a business problem end-to-end.',
      completionCriteria: 'Submit peer-reviewable code, visualization artifacts, and methodology summary.',
      completed: false,
      userNotes: ''
    });
  }

  return tasks;
}
