import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- SQL (S001) ---
  {
    id: 'quiz-sql-1',
    skillId: 'S001',
    skillName: 'SQL',
    category: 'Database & Querying',
    question: 'You need to find the total revenue and order count per city, but only for cities with more than 5 completed orders. Which clause filters the grouped results?',
    codeSnippet: 'SELECT city, COUNT(order_id) AS total_orders, SUM(amount) AS revenue\nFROM orders\nWHERE status = \'Completed\'\nGROUP BY city\n/* WHICH CLAUSE GOES HERE? */ count(order_id) > 5;',
    options: [
      { id: 'a', text: 'WHERE count(order_id) > 5' },
      { id: 'b', text: 'HAVING COUNT(order_id) > 5' },
      { id: 'c', text: 'FILTER BY count(order_id) > 5' },
      { id: 'd', text: 'QUALIFY COUNT(order_id) > 5' }
    ],
    correctOptionId: 'b',
    explanation: 'The HAVING clause filters rows after aggregation (GROUP BY). WHERE filters rows before aggregation, so aggregate functions like COUNT() cannot be used directly in WHERE.',
    difficulty: 'Intermediate',
    levelAwarded: 3
  },
  {
    id: 'quiz-sql-2',
    skillId: 'S001',
    skillName: 'SQL',
    category: 'Database & Querying',
    question: 'Which SQL JOIN returns all rows from the left table and matching rows from the right table, filling with NULL when there is no match?',
    options: [
      { id: 'a', text: 'INNER JOIN' },
      { id: 'b', text: 'LEFT JOIN (or LEFT OUTER JOIN)' },
      { id: 'c', text: 'RIGHT JOIN' },
      { id: 'd', text: 'CROSS JOIN' }
    ],
    correctOptionId: 'b',
    explanation: 'LEFT JOIN preserves every record from the left table regardless of whether a matching record exists in the right table.',
    difficulty: 'Beginner',
    levelAwarded: 2
  },

  // --- Microsoft Excel (S002) ---
  {
    id: 'quiz-excel-1',
    skillId: 'S002',
    skillName: 'Microsoft Excel',
    category: 'BI & Productivity',
    question: 'Why is XLOOKUP generally preferred over traditional VLOOKUP in modern Excel analysis?',
    options: [
      { id: 'a', text: 'XLOOKUP can only search from left to right, preventing errors.' },
      { id: 'b', text: 'XLOOKUP does not require the return column to be to the right of the lookup column, defaults to exact match, and handles missing values natively.' },
      { id: 'c', text: 'XLOOKUP runs only in cloud databases without using computer memory.' },
      { id: 'd', text: 'VLOOKUP is deprecated and will not open in Excel 365.' }
    ],
    correctOptionId: 'b',
    explanation: 'XLOOKUP eliminates index counting, allows searching left or right, defaults safely to exact match without needing FALSE, and includes built-in if_not_found parameters.',
    difficulty: 'Intermediate',
    levelAwarded: 3
  },

  // --- Python (S005) ---
  {
    id: 'quiz-py-1',
    skillId: 'S005',
    skillName: 'Python',
    category: 'Data Science & ML',
    question: 'In pandas, what is the most efficient and idiomatic way to calculate average order value by customer segment without iterating rows?',
    codeSnippet: 'df.groupby("segment")["order_val"].mean()',
    options: [
      { id: 'a', text: 'Using a Python for-loop with df.iterrows() and appending to a dict' },
      { id: 'b', text: 'df.groupby("segment")["order_val"].mean()' },
      { id: 'c', text: 'df.filter("segment").sum() / len(df)' },
      { id: 'd', text: 'list(map(lambda x: x["order_val"], df))' }
    ],
    correctOptionId: 'b',
    explanation: 'Vectorized operations using df.groupby() in pandas run in optimized C-level arrays and are orders of magnitude faster and cleaner than row iteration.',
    difficulty: 'Intermediate',
    levelAwarded: 3
  },

  // --- Power BI (S003) ---
  {
    id: 'quiz-pbi-1',
    skillId: 'S003',
    skillName: 'Power BI',
    category: 'BI & Productivity',
    question: 'In Power BI DAX, what is the primary difference between a Calculated Column and a Measure?',
    options: [
      { id: 'a', text: 'Calculated columns are computed at query time on the fly; measures consume disk space in the data model.' },
      { id: 'b', text: 'Calculated columns are computed row-by-row during data refresh and stored in memory; Measures are calculated dynamically at query time based on report filter context.' },
      { id: 'c', text: 'Measures can only be used in bar charts, while calculated columns only work in tables.' },
      { id: 'd', text: 'There is no functional difference; they are alternative names for the same DAX syntax.' }
    ],
    correctOptionId: 'b',
    explanation: 'Calculated columns evaluate row context and increase model size, while DAX measures recalculate dynamically based on the current filter context of user visuals.',
    difficulty: 'Intermediate',
    levelAwarded: 3
  },

  // --- Financial Statement Analysis (S038) ---
  {
    id: 'quiz-fin-1',
    skillId: 'S038',
    skillName: 'Financial Statement Analysis',
    category: 'Finance',
    question: 'A company reports high Net Income on its Income Statement, but its Operating Cash Flow is deeply negative. What is the most plausible explanation to investigate?',
    options: [
      { id: 'a', text: 'The company has unusually high non-cash depreciation expenses.' },
      { id: 'b', text: 'Significant uncollected accounts receivable (aggressive revenue recognition) or large inventory build-up.' },
      { id: 'c', text: 'The company repurchased its own common shares.' },
      { id: 'd', text: 'Interest rates decreased across the economy.' }
    ],
    correctOptionId: 'b',
    explanation: 'Net Income includes accrued revenue that has not yet been collected in cash. If accounts receivable or inventory surge faster than sales, cash from operations falls behind reported profits.',
    difficulty: 'Advanced',
    levelAwarded: 4
  },

  // --- Business Analysis (S025) ---
  {
    id: 'quiz-ba-1',
    skillId: 'S025',
    skillName: 'Business Analysis',
    category: 'Business & Strategy',
    question: 'When creating user stories and acceptance criteria using the MoSCoW method, what does "Could Have" signify?',
    options: [
      { id: 'a', text: 'Non-negotiable features without which the release is illegal or unusable' },
      { id: 'b', text: 'Desirable features that will only be included if time and resources permit after Must and Should requirements are met' },
      { id: 'c', text: 'Features that have already been cancelled by the engineering team' },
      { id: 'd', text: 'Technical architecture specifications' }
    ],
    correctOptionId: 'b',
    explanation: 'In MoSCoW prioritization: Must Have = non-negotiable; Should Have = important but not vital; Could Have = desirable if time/capacity permits; Won\'t Have = excluded for current scope.',
    difficulty: 'Intermediate',
    levelAwarded: 3
  },

  // --- Problem Solving & Logic (S036) ---
  {
    id: 'quiz-ps-1',
    skillId: 'S036',
    skillName: 'Problem Solving',
    category: 'Foundational & Soft Skills',
    question: 'What is the purpose of conducting a "5 Whys" root cause analysis when a data pipeline or business metric anomalies occur?',
    options: [
      { id: 'a', text: 'To assign blame to five individual team members sequentially' },
      { id: 'b', text: 'To drill down past superficial symptoms by asking why an event occurred until the underlying systemic flaw is exposed' },
      { id: 'c', text: 'To verify that the code was tested in at least 5 different browsers' },
      { id: 'd', text: 'To generate 5 different budget forecasts' }
    ],
    correctOptionId: 'b',
    explanation: 'The 5 Whys iterative interrogative technique explores cause-and-effect relationships underlying a particular problem to uncover and remedy the root cause.',
    difficulty: 'Beginner',
    levelAwarded: 2
  }
];
