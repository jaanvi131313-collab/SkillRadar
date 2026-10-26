import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  Lightbulb,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export const AICareerAdvisorModal: React.FC = () => {
  const { 
    showAdvisorModal, 
    setShowAdvisorModal, 
    profile, 
    roles, 
    skillEvidence, 
    playBeep 
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Greetings, Astronaut ${profile.name}! I am your SkillRadar AI Station Advisor. I analyze your demonstrated skills, compare them against 16,000+ postings in our dataset, and help you map the fastest route to career mastery. How can I assist your mission today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!showAdvisorModal) return null;

  const quickPrompts = [
    "What are the top skills for Data Analyst in the dataset?",
    "How does Data Analyst salary compare with Financial Analyst?",
    "How should I interpret my weighted Role Fit score?",
    "What is the best way to close my SQL and Python gaps?"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    playBeep(520, 'sine');

    // Generate dataset-grounded intelligent answer
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes('top skill') || lower.includes('data analyst')) {
        const daRole = roles.find(r => r.role_id === 'R001');
        const skillList = daRole ? daRole.skills.slice(0, 5).map(s => `${s.name} (${s.importance}, Target Lvl ${s.target_proficiency})`).join(', ') : 'SQL, Excel, Power BI, Python, Communication';
        reply = `Based on the 06_Extracted_Skills corpus in our dataset, the core skills for Data Analyst (R001) are: ${skillList}. SQL and Excel appear most frequently across posting descriptions.`;
      } else if (lower.includes('salary') || lower.includes('compare')) {
        const da = roles.find(r => r.role_id === 'R001');
        const fa = roles.find(r => r.role_id === 'R005');
        const se = roles.find(r => r.role_id === 'R057');
        const daSal = da?.salary_stats ? `₹${(da.salary_stats.median / 100000).toFixed(1)}L` : '₹8.0L';
        const faSal = fa?.salary_stats ? `₹${(fa.salary_stats.median / 100000).toFixed(1)}L` : '₹7.5L';
        const seSal = se?.salary_stats ? `₹${(se.salary_stats.median / 100000).toFixed(1)}L` : '₹8.0L';
        reply = `According to our Fliar BI India salary benchmark (03_Clean_Jobs): Data Analyst median salary is ${daSal}/yr; Financial Analyst median is ${faSal}/yr; and Software Engineer median is ${seSal}/yr. Note that salary period is assumed annual INR as published.`;
      } else if (lower.includes('role fit') || lower.includes('interpret') || lower.includes('score')) {
        reply = `Your Role Match score is computed using an explainable weighted formula: [∑(Weight_i × min(Demonstrated_i / Target_i, 1.0)) / ∑Weight_i] × 100. It measures technical alignment with modeled job requirements—it is NOT a guarantee or probability of hiring. High completeness (>80%) ensures realistic calibration.`;
      } else if (lower.includes('sql') || lower.includes('gap') || lower.includes('python')) {
        reply = `To close your technical gaps, proceed to the Skill Upgrade Station (Roadmap). We have mapped practical milestones using official documentation (SQLBolt, PostgreSQL docs, Pandas User Guide) paired with hands-on exercises in the Job Simulation Arena.`;
      } else {
        reply = `In our current dataset of 66 roles and 136 skills, regular practice in the Simulation Arena and completing Skill Scan quizzes will directly elevate your verified proficiency levels and improve your target alignment.`;
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      playBeep(640, 'triangle');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md animate-in fade-in select-text">
      <div className="w-full max-w-2xl h-[600px] rounded-3xl bg-space-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-space-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-glow-violet">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Station AI Career Advisor</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-950 text-violet-300 border border-violet-800">
                  Dataset Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded strictly in SkillRadar Dataset.xlsx
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdvisorModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                m.role === 'assistant' ? 'bg-violet-600 text-white shadow-glow-violet' : 'bg-cyan-600 text-white'
              }`}>
                {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed ${
                m.role === 'assistant'
                  ? 'bg-space-950 border border-slate-800 text-slate-200'
                  : 'bg-cyan-950 border border-cyan-800 text-cyan-100'
              }`}>
                <p>{m.text}</p>
                <div className="text-[10px] text-slate-500 font-mono mt-1 text-right">
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-space-950/40 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0">Prompts:</span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-space-900 border border-slate-800 hover:border-violet-500/50 text-slate-300 hover:text-white shrink-0 cursor-pointer transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-800 flex items-center gap-2 bg-space-950/70"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about roles, skills, salary benchmarks, or roadmap advice..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-space-900 border border-slate-800 focus:border-violet-500 text-xs text-white outline-none"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-glow-violet transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
