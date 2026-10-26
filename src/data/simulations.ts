export interface SimulationDef {
  id: 'data-analyst' | 'financial-analyst' | 'business-analyst';
  title: string;
  roleId: string;
  roleName: string;
  scenario: string;
  description: string;
  timeEstimate: string;
  primarySkills: { id: string; name: string }[];
  steps: {
    id: string;
    stepNumber: number;
    title: string;
    instructions: string;
    type: 'data-audit' | 'sql-sandbox' | 'ratio-calc' | 'triage' | 'analysis' | 'recommendation';
  }[];
}

export const SIMULATION_DEFINITIONS: SimulationDef[] = [
  {
    id: 'data-analyst',
    title: 'NovaTech E-Commerce Performance Simulation',
    roleId: 'R001',
    roleName: 'Data Analyst',
    scenario: 'NovaTech Space Supplies noticed an unexpected 18% dip in reported quarterly checkout revenue. The VP of Growth suspects data pipeline corruption, negative transaction refunds, and broken checkout funnels across metro regions.',
    description: 'Diagnose raw transactional anomalies, run exploratory SQL queries on the active order table, analyze funnel visualization trends, and draft an executive data recommendation.',
    timeEstimate: '15-20 min',
    primarySkills: [
      { id: 'S001', name: 'SQL' },
      { id: 'S002', name: 'Microsoft Excel' },
      { id: 'S003', name: 'Power BI' },
      { id: 'S036', name: 'Problem Solving' }
    ],
    steps: [
      {
        id: 'step-1-dq',
        stepNumber: 1,
        title: 'Step 1: Data Quality & Anomaly Triage',
        instructions: 'Inspect the raw transaction batch below. Identify records containing critical data quality defects (e.g. duplicate transaction IDs, negative revenue totals without refund tags, corrupted customer emails).',
        type: 'data-audit'
      },
      {
        id: 'step-2-sql',
        stepNumber: 2,
        title: 'Step 2: Interactive SQL Query Sandbox',
        instructions: 'Write a SQL query to calculate Total Revenue and Order Count grouped by `city`, sorted by revenue descending. Only include completed orders (`status = \'COMPLETED\'`). Test and execute your query against the live in-memory table.',
        type: 'sql-sandbox'
      },
      {
        id: 'step-3-insight',
        stepNumber: 3,
        title: 'Step 3: Business Insight & Executive Recommendation',
        instructions: 'Review the regional conversion chart. Formulate an actionable hypothesis: why did Bangalore conversion fall 24% while Delhi rose? Select and justify the data-backed remediation plan.',
        type: 'analysis'
      }
    ]
  },
  {
    id: 'financial-analyst',
    title: 'Apex Orbital Logistics Financial Health Assessment',
    roleId: 'R005',
    roleName: 'Financial Analyst',
    scenario: 'Apex Orbital Logistics is evaluating a ₹45 Crore expansion into automated space-dock warehousing. The CFO requests a financial statement audit, working capital liquidity analysis, and an investment viability recommendation.',
    description: 'Analyze standardized Balance Sheet & Income Statement figures, calculate solvency and liquidity ratios, and submit an evidence-backed capital expenditure recommendation.',
    timeEstimate: '15-20 min',
    primarySkills: [
      { id: 'S038', name: 'Financial Statement Analysis' },
      { id: 'S039', name: 'Accounting' },
      { id: 'S042', name: 'Budgeting & Forecasting' },
      { id: 'S043', name: 'Risk Analysis' }
    ],
    steps: [
      {
        id: 'step-1-ratios',
        stepNumber: 1,
        title: 'Step 1: Liquidity & Solvency Ratio Computation',
        instructions: 'Using the provided FY26 Balance Sheet numbers (Current Assets: ₹84 Cr, Current Liabilities: ₹56 Cr, Total Debt: ₹120 Cr, Total Equity: ₹150 Cr), calculate the Current Ratio and Debt-to-Equity Ratio.',
        type: 'ratio-calc'
      },
      {
        id: 'step-2-margin',
        stepNumber: 2,
        title: 'Step 2: Margin & Profitability Trends',
        instructions: 'Analyze the 3-year P&L trends. Determine why Operating Margins compressed from 18.4% to 12.1% despite 22% top-line revenue growth.',
        type: 'analysis'
      },
      {
        id: 'step-3-rec',
        stepNumber: 3,
        title: 'Step 3: Executive Capex Recommendation',
        instructions: 'Based on the calculated ratios and debt covenants, recommend whether Apex Orbital should fund the expansion via Senior Secured Debt, Equity Rights Issue, or Delay until working capital stabilizes.',
        type: 'recommendation'
      }
    ]
  },
  {
    id: 'business-analyst',
    title: 'Starlight Station Crew Scheduling Optimization',
    roleId: 'R002',
    roleName: 'Business Analyst',
    scenario: 'Starlight Station flight operations are suffering severe crew turnaround delays due to disconnected legacy spreadsheets, shift handoff miscommunications, and untracked emergency rest periods.',
    description: 'Triage conflicting stakeholder requirements, identify process flow bottlenecks, define key measurement metrics (KPIs), and construct functional acceptance criteria.',
    timeEstimate: '15-20 min',
    primarySkills: [
      { id: 'S025', name: 'Business Analysis' },
      { id: 'S026', name: 'Requirements Gathering' },
      { id: 'S032', name: 'Stakeholder Management' },
      { id: 'S030', name: 'Jira' }
    ],
    steps: [
      {
        id: 'step-1-triage',
        stepNumber: 1,
        title: 'Step 1: Stakeholder Requirements Classification & MoSCoW Triage',
        instructions: 'Review conflicting inputs from Flight Operations, Crew Union, and IT Security. Categorize each requirement as Must Have, Should Have, Could Have, or Out of Scope.',
        type: 'triage'
      },
      {
        id: 'step-2-process',
        stepNumber: 2,
        title: 'Step 2: Workflow Bottleneck & Handoff Analysis',
        instructions: 'Map the current 6-stage crew dispatch workflow. Identify the step responsible for 62% of scheduling cycle time and recommend an automated trigger.',
        type: 'analysis'
      },
      {
        id: 'step-3-spec',
        stepNumber: 3,
        title: 'Step 3: User Story & Acceptance Criteria Definition',
        instructions: 'Draft the core Epic user story for the Automated Shift Reassignment module in standard Gherkin syntax (Given / When / Then).',
        type: 'recommendation'
      }
    ]
  }
];

// Sample dataset for Data Analyst SQL Sandbox
export const DATA_ANALYST_ORDERS = [
  { order_id: 'ORD-101', customer_id: 'CUST-089', city: 'Bangalore', amount: 4500, status: 'COMPLETED', items: 3, payment: 'UPI' },
  { order_id: 'ORD-102', customer_id: 'CUST-104', city: 'Mumbai', amount: 8200, status: 'COMPLETED', items: 5, payment: 'Credit Card' },
  { order_id: 'ORD-103', customer_id: 'CUST-042', city: 'Delhi', amount: 3100, status: 'COMPLETED', items: 2, payment: 'UPI' },
  { order_id: 'ORD-104', customer_id: 'CUST-211', city: 'Bangalore', amount: 12000, status: 'COMPLETED', items: 8, payment: 'Credit Card' },
  { order_id: 'ORD-105', customer_id: 'CUST-098', city: 'Hyderabad', amount: 6400, status: 'CANCELLED', items: 4, payment: 'Net Banking' },
  { order_id: 'ORD-106', customer_id: 'CUST-155', city: 'Pune', amount: 2900, status: 'COMPLETED', items: 1, payment: 'UPI' },
  { order_id: 'ORD-107', customer_id: 'CUST-302', city: 'Mumbai', amount: 9500, status: 'COMPLETED', items: 6, payment: 'Credit Card' },
  { order_id: 'ORD-108', customer_id: 'CUST-089', city: 'Bangalore', amount: 5300, status: 'COMPLETED', items: 3, payment: 'UPI' },
  { order_id: 'ORD-109', customer_id: 'CUST-414', city: 'Delhi', amount: 7800, status: 'COMPLETED', items: 4, payment: 'UPI' },
  { order_id: 'ORD-110', customer_id: 'CUST-208', city: 'Bangalore', amount: 3400, status: 'REFUNDED', items: 2, payment: 'UPI' }
];

export const RAW_AUDIT_BATCH = [
  { id: 'TX-901', customer_email: 'priya.s@novatech.io', amount: 5400, status: 'SUCCESS', flag: false },
  { id: 'TX-902', customer_email: 'INVALID_FORMAT_NULL', amount: 3200, status: 'SUCCESS', flag: true, issue: 'Corrupt email syntax' },
  { id: 'TX-903', customer_email: 'rohit.m@domain.com', amount: -8500, status: 'SUCCESS', flag: true, issue: 'Negative revenue without refund status' },
  { id: 'TX-901', customer_email: 'priya.s@novatech.io', amount: 5400, status: 'SUCCESS', flag: true, issue: 'Duplicate Transaction ID TX-901' },
  { id: 'TX-904', customer_email: 'karan.v@gmail.com', amount: 14200, status: 'SUCCESS', flag: false },
  { id: 'TX-905', customer_email: 'ananya.p@college.edu', amount: 6100, status: 'SUCCESS', flag: false }
];
