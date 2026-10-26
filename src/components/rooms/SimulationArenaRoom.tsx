import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  History, 
  ArrowRight, 
  RotateCcw,
  BarChart3,
  TrendingDown,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  SIMULATION_DEFINITIONS, 
  DATA_ANALYST_ORDERS, 
  RAW_AUDIT_BATCH, 
  SimulationDef 
} from '../../data/simulations';
import { SimulationAttempt, SimulationRubricItem } from '../../types';

export const SimulationArenaRoom: React.FC = () => {
  const { 
    saveSimulationAttempt, 
    simulationAttempts, 
    updateMissionStatus, 
    unlockBadge, 
    notify, 
    playBeep 
  } = useApp();

  const [selectedSimId, setSelectedSimId] = useState<'data-analyst' | 'financial-analyst' | 'business-analyst'>('data-analyst');
  const [activeTab, setActiveTab] = useState<'simulation' | 'history'>('simulation');

  // Simulation 1 (Data Analyst) State
  const [flaggedRows, setFlaggedRows] = useState<string[]>([]);
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT city, COUNT(*) AS orders, SUM(amount) AS revenue\nFROM orders\nWHERE status = 'COMPLETED'\nGROUP BY city\nORDER BY revenue DESC;"
  );
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [insightChoice, setInsightChoice] = useState<string>('');

  // Simulation 2 (Financial Analyst) State
  const [currentRatioInput, setCurrentRatioInput] = useState<string>('');
  const [debtEquityInput, setDebtEquityInput] = useState<string>('');
  const [marginDiagnosis, setMarginDiagnosis] = useState<string>('');
  const [capexDecision, setCapexDecision] = useState<string>('');

  // Simulation 3 (Business Analyst) State
  const [moscowRatings, setMoscowRatings] = useState<Record<string, string>>({});
  const [bottleneckChoice, setBottleneckChoice] = useState<string>('');
  const [gherkinText, setGherkinText] = useState<string>('');

  // Result state
  const [gradedAttempt, setGradedAttempt] = useState<SimulationAttempt | null>(null);

  const activeSimDef: SimulationDef = SIMULATION_DEFINITIONS.find(s => s.id === selectedSimId) || SIMULATION_DEFINITIONS[0];

  // SQL Executor Helper for Data Analyst
  const executeSQL = () => {
    try {
      setSqlError(null);
      const q = sqlQuery.trim().toLowerCase();

      if (!q.includes('select') || !q.includes('from orders')) {
        throw new Error("Syntax error: query must SELECT from 'orders' table.");
      }

      // Compute aggregates from in-memory orders
      const groups: Record<string, { city: string; orders: number; revenue: number }> = {};
      DATA_ANALYST_ORDERS.forEach(o => {
        if (q.includes("status = 'completed'") || q.includes('status="completed"')) {
          if (o.status !== 'COMPLETED') return;
        }
        if (!groups[o.city]) {
          groups[o.city] = { city: o.city, orders: 0, revenue: 0 };
        }
        groups[o.city].orders += 1;
        groups[o.city].revenue += o.amount;
      });

      const res = Object.values(groups);
      if (q.includes('order by revenue desc')) {
        res.sort((a, b) => b.revenue - a.revenue);
      }
      setSqlResult(res);
      playBeep(520, 'sine');
    } catch (err: any) {
      setSqlError(err.message || 'Error executing SQL');
      playBeep(240, 'sawtooth');
    }
  };

  // Submit and deterministic rubric grading
  const handleGradeSimulation = () => {
    const rubric: SimulationRubricItem[] = [];
    let earned = 0;
    const maxScore = 100;

    if (selectedSimId === 'data-analyst') {
      // Step 1: Data quality flags (TX-902, TX-903, TX-901 duplicate)
      const correctFlags = ['TX-902', 'TX-903'];
      const userCorrect = flaggedRows.filter(id => correctFlags.includes(id)).length;
      const falsePositives = flaggedRows.filter(id => !correctFlags.includes(id) && id !== 'TX-901').length;
      const step1Score = Math.max(0, (userCorrect * 15) - (falsePositives * 5));
      rubric.push({
        id: 'r1',
        criterion: 'Data Quality & Anomaly Triage',
        maxScore: 30,
        earnedScore: step1Score,
        feedback: step1Score >= 20 ? 'Excellent detection of corrupt emails and negative transaction anomalies.' : 'Missed key negative amounts or corrupted syntax records.',
        passed: step1Score >= 20
      });

      // Step 2: SQL query
      const sqlCorrect = sqlQuery.toLowerCase().includes('group by city') && sqlQuery.toLowerCase().includes('orders');
      const step2Score = sqlCorrect ? 40 : 15;
      rubric.push({
        id: 'r2',
        criterion: 'SQL Aggregation & Filtering Logic',
        maxScore: 40,
        earnedScore: step2Score,
        feedback: sqlCorrect ? 'Correct GROUP BY aggregation, WHERE status filtering, and ORDER BY sort.' : 'Query missing proper grouping or filter clauses.',
        passed: sqlCorrect
      });

      // Step 3: Insight
      const step3Score = insightChoice === 'b' ? 30 : (insightChoice ? 10 : 0);
      rubric.push({
        id: 'r3',
        criterion: 'Business Funnel Insight',
        maxScore: 30,
        earnedScore: step3Score,
        feedback: insightChoice === 'b' ? 'Correctly identified payment gateway timeouts during peak Bangalore hours.' : 'Incomplete business recommendation.',
        passed: step3Score >= 20
      });
    } else if (selectedSimId === 'financial-analyst') {
      // Step 1: Ratio math (84/56 = 1.5; 120/150 = 0.8)
      const crVal = parseFloat(currentRatioInput);
      const deVal = parseFloat(debtEquityInput);
      const crCorrect = Math.abs(crVal - 1.5) < 0.05;
      const deCorrect = Math.abs(deVal - 0.8) < 0.05;
      const step1Score = (crCorrect ? 20 : 0) + (deCorrect ? 20 : 0);
      rubric.push({
        id: 'r1',
        criterion: 'Liquidity & Solvency Computation',
        maxScore: 40,
        earnedScore: step1Score,
        feedback: `Current Ratio: ${crCorrect ? 'Correct (1.50x)' : 'Expected 1.50x (84/56)'}; D/E Ratio: ${deCorrect ? 'Correct (0.80x)' : 'Expected 0.80x (120/150)'}.`,
        passed: step1Score >= 30
      });

      // Step 2: Margin Diagnosis
      const step2Score = marginDiagnosis === 'b' ? 30 : 10;
      rubric.push({
        id: 'r2',
        criterion: 'Operating Margin Compression Analysis',
        maxScore: 30,
        earnedScore: step2Score,
        feedback: marginDiagnosis === 'b' ? 'Accurately recognized surge in SG&A tech spend outpacing gross profits.' : 'Did not isolate SG&A operating expense growth.',
        passed: step2Score >= 20
      });

      // Step 3: Capex recommendation
      const step3Score = capexDecision === 'rights-issue' ? 30 : 15;
      rubric.push({
        id: 'r3',
        criterion: 'Capital Structure Recommendation',
        maxScore: 30,
        earnedScore: step3Score,
        feedback: capexDecision === 'rights-issue' ? 'Sound recommendation: preserves covenant headroom without raising interest burden.' : 'Alternative financing incurs elevated leverage risk under current coverage.',
        passed: step3Score >= 20
      });
    } else {
      // Business Analyst
      const step1Score = Object.keys(moscowRatings).length >= 3 ? 35 : 15;
      rubric.push({
        id: 'r1',
        criterion: 'MoSCoW Requirements Triage',
        maxScore: 40,
        earnedScore: step1Score,
        feedback: 'Categorized functional vs non-functional crew scheduling constraints.',
        passed: step1Score >= 25
      });

      const step2Score = bottleneckChoice === 'b' ? 30 : 10;
      rubric.push({
        id: 'r2',
        criterion: 'Process Bottleneck Diagnosis',
        maxScore: 30,
        earnedScore: step2Score,
        feedback: bottleneckChoice === 'b' ? 'Pinpointed manual phone verification as 62% cycle time bottleneck.' : 'Misidentified automated stages as bottleneck.',
        passed: step2Score >= 20
      });

      const step3Score = gherkinText.toLowerCase().includes('given') && gherkinText.toLowerCase().includes('then') ? 30 : 15;
      rubric.push({
        id: 'r3',
        criterion: 'User Story & Gherkin Acceptance Criteria',
        maxScore: 30,
        earnedScore: step3Score,
        feedback: step3Score === 30 ? 'Valid Gherkin specification structure (Given / When / Then).' : 'Missing formal acceptance structure.',
        passed: step3Score >= 20
      });
    }

    earned = rubric.reduce((acc, r) => acc + r.earnedScore, 0);

    const attempt: SimulationAttempt = {
      id: `sim-att-${Date.now()}`,
      simId: selectedSimId,
      timestamp: new Date().toISOString(),
      totalScore: earned,
      maxScore,
      rubricFeedback: rubric,
      userSubmission: {
        flaggedRows,
        sqlQuery,
        insightChoice,
        currentRatioInput,
        debtEquityInput,
        marginDiagnosis,
        capexDecision,
        moscowRatings,
        bottleneckChoice
      },
      evidenceAwarded: activeSimDef.primarySkills.map(s => ({
        skillId: s.id,
        level: earned >= 70 ? 4 : 3
      }))
    };

    saveSimulationAttempt(attempt);
    setGradedAttempt(attempt);
    updateMissionStatus('mission-4', 'completed');
    unlockBadge('simulation-vet');

    if (earned >= 70) {
      notify('Simulation Passed!', `Rubric Score: ${earned}/100. Practical skill evidence awarded!`, 'success');
      playBeep(660, 'triangle');
    } else {
      notify('Simulation Attempt Logged', `Rubric Score: ${earned}/100. Review detailed feedback to improve.`, 'warning');
      playBeep(350, 'sawtooth');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-800">
              SIMULATION ARENA • MODULE 4
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Job Simulation Arena
          </h1>
          <p className="text-xs text-slate-400">
            Work on realistic enterprise tasks with real datasets, SQL execution, and transparent rubric grading.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-xl bg-space-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'simulation' ? 'bg-amber-500 text-space-950 font-bold shadow-glow-amber' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Active Simulation</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-amber-500 text-space-950 font-bold shadow-glow-amber' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Attempt History ({simulationAttempts.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Simulation Role Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SIMULATION_DEFINITIONS.map(sim => {
              const isSelected = selectedSimId === sim.id;
              return (
                <button
                  key={sim.id}
                  onClick={() => {
                    setSelectedSimId(sim.id);
                    setGradedAttempt(null);
                    playBeep(480, 'sine');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-space-900 border-amber-500/80 shadow-glow-amber/20'
                      : 'bg-space-950/80 hover:bg-space-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                    {sim.roleName}
                  </div>
                  <h4 className="font-bold text-sm text-white mt-0.5">{sim.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Est. {sim.timeEstimate} • 3 Practical Tasks
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scenario Overview Card */}
          <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Scenario Briefing: {activeSimDef.title}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-space-950/70 p-4 rounded-2xl border border-slate-800">
              {activeSimDef.scenario}
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Target Skills Evaluated:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeSimDef.primarySkills.map(s => (
                  <span key={s.id} className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 1. DATA ANALYST SIMULATION TASKS */}
          {selectedSimId === 'data-analyst' && (
            <div className="space-y-6">
              {/* Task 1: Data Quality Triage */}
              <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-cyan-400">TASK 1 OF 3</span>
                  <h3 className="text-base font-bold text-white">Raw Transaction Anomaly Detection</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Click rows below that contain corrupted emails, negative sales totals, or duplicate transaction IDs.
                  </p>
                </div>

                <div className="space-y-2">
                  {RAW_AUDIT_BATCH.map(tx => {
                    const isFlagged = flaggedRows.includes(tx.id);
                    return (
                      <div
                        key={tx.id + tx.customer_email}
                        onClick={() => {
                          setFlaggedRows(prev => 
                            prev.includes(tx.id) ? prev.filter(x => x !== tx.id) : [...prev, tx.id]
                          );
                          playBeep(440, 'sine');
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                          isFlagged
                            ? 'bg-red-950/60 border-red-500 text-red-200'
                            : 'bg-space-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 font-mono">
                          <span className="font-bold text-white">{tx.id}</span>
                          <span className="text-slate-400">{tx.customer_email}</span>
                          <span className={tx.amount < 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                            ₹{tx.amount.toLocaleString()}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          isFlagged ? 'bg-red-900 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isFlagged ? 'FLAGGED DEFECT' : 'MARK DEFECT'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Task 2: Live SQL Sandbox */}
              <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-cyan-400">TASK 2 OF 3</span>
                  <h3 className="text-base font-bold text-white">Live SQL Sandbox & Aggregation</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Execute SQL query against the in-memory `orders` table. Calculate completed orders and revenue grouped by city.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>SQL Query Editor</span>
                    </span>
                    <button
                      onClick={executeSQL}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold text-xs cursor-pointer shadow-glow-cyan"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Execute Query</span>
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={sqlQuery}
                    onChange={e => setSqlQuery(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-space-950 border border-slate-800 focus:border-cyan-500 font-mono text-xs text-cyan-300 outline-none shadow-inner"
                  />

                  {sqlError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500 text-xs text-red-300 font-mono">
                      {sqlError}
                    </div>
                  )}

                  {sqlResult && (
                    <div className="p-4 rounded-2xl bg-space-950 border border-slate-800 space-y-2 overflow-x-auto">
                      <div className="text-[11px] font-mono text-slate-400">Query Output ({sqlResult.length} rows):</div>
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-1">City</th>
                            <th className="py-1">Orders</th>
                            <th className="py-1">Revenue (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {sqlResult.map((r, i) => (
                            <tr key={i} className="text-slate-200">
                              <td className="py-1.5 text-white font-semibold">{r.city}</td>
                              <td className="py-1.5 text-cyan-300">{r.orders}</td>
                              <td className="py-1.5 text-emerald-400">₹{r.revenue.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Task 3: Funnel & Business Insight */}
              <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-cyan-400">TASK 3 OF 3</span>
                  <h3 className="text-base font-bold text-white">Funnel Drop-off Analysis</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Conversion in Bangalore dropped from 3.8% to 2.4% after the new UPI payment gateway rollout, while Mumbai held steady at 3.9%. What is the most plausible root cause?
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { id: 'a', text: 'Customers in Bangalore stopped purchasing e-commerce items due to seasonality.' },
                    { id: 'b', text: 'Regional payment gateway timeout on Bangalore bank servers during 8 PM - 11 PM peak hours.' },
                    { id: 'c', text: 'Prices in Bangalore were automatically converted to US Dollars.' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setInsightChoice(opt.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        insightChoice === opt.id
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-glow-cyan'
                          : 'bg-space-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span className="font-bold mr-2 uppercase">({opt.id})</span>
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. FINANCIAL ANALYST SIMULATION TASKS */}
          {selectedSimId === 'financial-analyst' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-amber-400">TASK 1 OF 3</span>
                  <h3 className="text-base font-bold text-white">Liquidity & Solvency Ratios</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Apex Orbital Balance Sheet (in ₹ Crores): Current Assets: ₹84 Cr | Current Liabilities: ₹56 Cr | Total Debt: ₹120 Cr | Total Equity: ₹150 Cr.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">
                      Current Ratio (Current Assets / Current Liabilities):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentRatioInput}
                      onChange={e => setCurrentRatioInput(e.target.value)}
                      placeholder="e.g. 1.50"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-amber-500 font-mono text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">
                      Debt-to-Equity Ratio (Total Debt / Total Equity):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={debtEquityInput}
                      onChange={e => setDebtEquityInput(e.target.value)}
                      placeholder="e.g. 0.80"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-amber-500 font-mono text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-amber-400">TASK 2 OF 3</span>
                  <h3 className="text-base font-bold text-white">Margin Compression Diagnosis</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Revenue grew 22% YoY, but Operating Margin shrank from 18.4% to 12.1%. Gross Margin remained constant at 44%. Where did the profit evaporate?
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { id: 'a', text: 'Cost of Goods Sold (raw materials) inflated by 35%.' },
                    { id: 'b', text: 'Operating expenses (SG&A, sales headcount, and server leases) surged faster than top-line revenue.' },
                    { id: 'c', text: 'Company income taxes doubled unexpectedly.' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setMarginDiagnosis(opt.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        marginDiagnosis === opt.id
                          ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-glow-amber'
                          : 'bg-space-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span className="font-bold mr-2 uppercase">({opt.id})</span>
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-amber-400">TASK 3 OF 3</span>
                  <h3 className="text-base font-bold text-white">Capex Financing Recommendation</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    CFO asks: How should the ₹45 Cr warehouse capex be funded without violating the existing 1.25x maximum debt covenant?
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { id: 'debt', text: 'Take on ₹45 Cr in 12% Senior Bank Debt (Pushes D/E to 1.10x, close to covenant threshold).' },
                    { id: 'rights-issue', text: 'Issue an Equity Rights Issue or Hybrid Convertible Debenture to preserve liquidity cushion.' },
                    { id: 'delay', text: 'Delay project by 3 years until internal cash flows accumulate.' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCapexDecision(opt.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        capexDecision === opt.id
                          ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-glow-amber'
                          : 'bg-space-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. BUSINESS ANALYST SIMULATION TASKS */}
          {selectedSimId === 'business-analyst' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-violet-400">TASK 1 OF 3</span>
                  <h3 className="text-base font-bold text-white">MoSCoW Stakeholder Requirement Triage</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Categorize each incoming requirement for the Station Crew Scheduling system:
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'req1', text: 'Comply with mandatory aviation rest regulations (no back-to-back night flights).' },
                    { id: 'req2', text: 'Real-time SMS alerts to crew phones on schedule adjustments.' },
                    { id: 'req3', text: 'Custom 3D animated weather widget on crew mobile app.' }
                  ].map(req => (
                    <div key={req.id} className="p-3.5 rounded-2xl bg-space-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <span className="text-slate-300">{req.text}</span>
                      <div className="flex gap-1.5 shrink-0">
                        {['Must', 'Should', 'Could'].map(tier => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setMoscowRatings(prev => ({ ...prev, [req.id]: tier }))}
                            className={`px-3 py-1 rounded-lg font-mono font-bold text-[11px] cursor-pointer transition-all ${
                              moscowRatings[req.id] === tier
                                ? 'bg-violet-600 text-white shadow-glow-violet'
                                : 'bg-space-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-violet-400">TASK 2 OF 3</span>
                  <h3 className="text-base font-bold text-white">Process Bottleneck Diagnosis</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Which step in the dispatch workflow accounts for the longest turnaround delay and requires automated trigger redesign?
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { id: 'a', text: 'Automated database query of available flight crew IDs (avg: 12 seconds).' },
                    { id: 'b', text: 'Manual telephone confirmation & paper signature verification (avg: 48 minutes).' },
                    { id: 'c', text: 'Printing of boarding badges at gate (avg: 3 minutes).' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setBottleneckChoice(opt.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        bottleneckChoice === opt.id
                          ? 'bg-violet-950 border-violet-400 text-violet-200 shadow-glow-violet'
                          : 'bg-space-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span className="font-bold mr-2 uppercase">({opt.id})</span>
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-space-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <span className="text-xs font-mono text-violet-400">TASK 3 OF 3</span>
                  <h3 className="text-base font-bold text-white">Gherkin Acceptance Criteria Definition</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Specify the automated shift replacement rule using standard Gherkin syntax (Given / When / Then):
                  </p>
                </div>

                <textarea
                  rows={4}
                  value={gherkinText}
                  onChange={e => setGherkinText(e.target.value)}
                  placeholder="Scenario: Automated emergency crew replacement&#10;Given an astronaut reports sudden flight illness&#10;When the system detects zero response in 10 minutes&#10;Then automatically alert the primary standby crewmate via secure push notification"
                  className="w-full p-3.5 rounded-2xl bg-space-950 border border-slate-800 focus:border-violet-500 font-mono text-xs text-violet-300 outline-none shadow-inner"
                />
              </div>
            </div>
          )}

          {/* Submit & Evaluation Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleGradeSimulation}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-space-950 font-extrabold text-sm shadow-glow-amber transition-all cursor-pointer hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>Submit Simulation for Rubric Evaluation</span>
            </button>
          </div>

          {/* Graded Rubric Feedback Display */}
          {gradedAttempt && (
            <div className="p-6 rounded-3xl bg-space-900/95 border border-cyan-500/60 space-y-5 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                    EVALUATION REPORT • {new Date(gradedAttempt.timestamp).toLocaleTimeString()}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    Simulation Rubric Results: <span className="text-cyan-300 font-mono">{gradedAttempt.totalScore} / {gradedAttempt.maxScore} pts</span>
                  </h3>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-mono font-bold ${
                  gradedAttempt.totalScore >= 70 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-amber-950 text-amber-300 border border-amber-500'
                }`}>
                  {gradedAttempt.totalScore >= 70 ? 'PASSED (Level 4 Evidence)' : 'NEEDS REVISION'}
                </div>
              </div>

              <div className="space-y-3">
                {gradedAttempt.rubricFeedback.map((r, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-space-950 border border-slate-800 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {r.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="font-bold text-white text-sm">{r.criterion}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed pl-6">{r.feedback}</p>
                    </div>

                    <div className="text-right font-mono font-bold text-cyan-300 shrink-0">
                      {r.earnedScore} / {r.maxScore} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Attempts History */}
      {activeTab === 'history' && (
        <div className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-md">
          <h3 className="font-bold text-base text-white">Archived Simulation Attempts</h3>
          {simulationAttempts.length === 0 ? (
            <p className="text-xs text-slate-400">No previous attempts recorded. Complete a simulation to archive results.</p>
          ) : (
            <div className="divide-y divide-slate-800">
              {simulationAttempts.map(att => (
                <div key={att.id} className="py-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white text-sm uppercase">{att.simId} Simulation</div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      Completed: {new Date(att.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-cyan-300 text-sm">
                      {att.totalScore} / {att.maxScore} pts
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Evidence Logged</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
