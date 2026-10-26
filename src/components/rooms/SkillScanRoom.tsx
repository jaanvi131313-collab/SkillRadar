import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Flame, 
  Sliders, 
  History, 
  FileCheck2, 
  ArrowRight,
  Code2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QUIZ_QUESTIONS } from '../../data/quizzes';
import { QuizQuestion, SkillEvidence } from '../../types';

export const SkillScanRoom: React.FC = () => {
  const { 
    skills, 
    skillEvidence, 
    addSkillEvidence, 
    updateMissionStatus, 
    unlockBadge, 
    notify,
    playBeep 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'quiz' | 'self' | 'evidence'>('quiz');

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Self assessment state
  const [selectedSkillId, setSelectedSkillId] = useState(skills[0]?.skill_id || 'S001');
  const [selfRating, setSelfRating] = useState<number>(3);
  const [selfNotes, setSelfNotes] = useState('');

  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[currentQuizIdx] || QUIZ_QUESTIONS[0];

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOption(optionId);
    playBeep(440, 'sine');
  };

  const handleQuizSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQuestion.correctOptionId;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      playBeep(587, 'triangle');
      // Award skill evidence
      const newEv: SkillEvidence = {
        skillId: currentQuestion.skillId,
        skillName: currentQuestion.skillName,
        level: currentQuestion.levelAwarded,
        source: 'quiz',
        timestamp: new Date().toISOString(),
        evidenceText: `Verified in Skill Scan Quiz: ${currentQuestion.question.slice(0, 50)}...`
      };
      addSkillEvidence(newEv);
      updateMissionStatus('mission-1', 'completed');
      unlockBadge('quiz-ace');
      notify('Skill Verified!', `Awarded Level ${currentQuestion.levelAwarded} in ${currentQuestion.skillName}`, 'success');
    } else {
      playBeep(260, 'sawtooth');
      notify('Incorrect Answer', 'Review the technical explanation below to learn and retry', 'warning');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setCurrentQuizIdx(0);
    }
    playBeep(500, 'sine');
  };

  const handleSelfAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSkill = skills.find(s => s.skill_id === selectedSkillId);
    if (!targetSkill) return;

    const newEv: SkillEvidence = {
      skillId: targetSkill.skill_id,
      skillName: targetSkill.name,
      level: selfRating,
      source: 'self-reported',
      timestamp: new Date().toISOString(),
      evidenceText: selfNotes || `Self-reported Level ${selfRating} in ${targetSkill.name}`
    };

    addSkillEvidence(newEv);
    updateMissionStatus('mission-1', 'completed');
    notify('Self-Assessment Recorded', `${targetSkill.name} logged as Level ${selfRating} (self-reported)`, 'info');
    setSelfNotes('');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800">
              LAB MODULE • STATION DECK 2
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Skill Scan Lab & Assessment Matrix
          </h1>
          <p className="text-xs text-slate-400">
            Establish verifiable proficiency benchmarks through technical scenario quizzes and documented self-reporting.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-space-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'quiz' ? 'bg-cyan-500 text-space-950 shadow-glow-cyan' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Scenario Quizzes</span>
          </button>
          <button
            onClick={() => setActiveTab('self')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'self' ? 'bg-cyan-500 text-space-950 shadow-glow-cyan' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Self-Assessment</span>
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'evidence' ? 'bg-cyan-500 text-space-950 shadow-glow-cyan' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Evidence Ledger ({skillEvidence.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Technical Scenario Quizzes */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-5 shadow-2xl backdrop-blur-md">
            {/* Question Info Bar */}
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 font-mono font-bold border border-cyan-800">
                  {currentQuestion.skillName}
                </span>
                <span className="text-slate-400 font-medium">{currentQuestion.category}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Diff: {currentQuestion.difficulty}
                </span>
              </div>
              <div className="text-slate-400 font-mono">
                Question {currentQuizIdx + 1} of {QUIZ_QUESTIONS.length}
              </div>
            </div>

            {/* Question Title & Code Snippet */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-white leading-relaxed">
                {currentQuestion.question}
              </h3>
              {currentQuestion.codeSnippet && (
                <div className="p-4 rounded-2xl bg-space-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map(option => {
                const isSelected = selectedOption === option.id;
                const isCorrect = option.id === currentQuestion.correctOptionId;

                let optionStyle = 'bg-space-950 hover:bg-slate-800/80 border-slate-800 text-slate-300';
                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-glow-emerald';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-red-950/80 border-red-500 text-red-200';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-glow-cyan';
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-medium transition-all text-left cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-space-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-[11px] uppercase">
                        {option.id}
                      </span>
                      <span>{option.text}</span>
                    </div>
                    {isSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Actions & Explanation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Awarded Level: <span className="font-mono font-bold text-amber-300">Level {currentQuestion.levelAwarded} Verified Evidence</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!isSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={!selectedOption}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-space-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-glow-violet transition-all cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Immediate Explanation Banner */}
            {isSubmitted && (
              <div className="p-4 rounded-2xl bg-space-950 border border-cyan-800/60 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <HelpCircle className="w-4 h-4" />
                  <span>Technical Explanation & Learning Note</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Self-Assessment */}
      {activeTab === 'self' && (
        <form onSubmit={handleSelfAssessmentSubmit} className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-6 shadow-2xl backdrop-blur-md">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">Self-Reported Skill Calibration</h3>
            <p className="text-xs text-slate-400">
              Rate your current comfort level on a standardized 1–5 scale. Self-reported items are tagged as unverified until supported by quiz or simulation evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">Select Taxonomy Skill</label>
              <select
                value={selectedSkillId}
                onChange={e => setSelectedSkillId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
              >
                {skills.map(s => (
                  <option key={s.skill_id} value={s.skill_id} className="bg-space-900 text-white">
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>

              {/* Skill Definition Tooltip */}
              {(() => {
                const s = skills.find(sk => sk.skill_id === selectedSkillId);
                return s ? (
                  <div className="p-3 rounded-xl bg-space-950 border border-slate-800 text-[11px] text-slate-400 mt-2">
                    <span className="text-cyan-400 font-semibold">Definition: </span>
                    {s.definition}
                  </div>
                ) : null;
              })()}
            </div>

            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-medium flex justify-between">
                <span>Self-Assessed Proficiency Level:</span>
                <span className="font-mono font-bold text-cyan-300">Level {selfRating} / 5</span>
              </label>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => {
                      setSelfRating(lvl);
                      playBeep(400 + lvl * 50, 'sine');
                    }}
                    className={`py-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      selfRating === lvl
                        ? 'bg-cyan-500 text-space-950 border-cyan-400 shadow-glow-cyan'
                        : 'bg-space-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    L{lvl}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>1: Novice / Theory</span>
                <span>3: Competent</span>
                <span>5: Expert / Leader</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium">Context / Learning Source (Optional)</label>
            <input
              type="text"
              value={selfNotes}
              onChange={e => setSelfNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
              placeholder="e.g. Completed college course CSE304; built personal portfolio project"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Record Self-Reported Evidence</span>
          </button>
        </form>
      )}

      {/* Tab 3: Evidence Ledger */}
      {activeTab === 'evidence' && (
        <div className="rounded-3xl bg-space-900/90 border border-slate-800 p-6 space-y-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-white">Station Skill Evidence Ledger</h3>
              <p className="text-xs text-slate-400">
                Audited record of demonstrated skills distinguishing verified quizzes, practical simulations, and self-reports.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">Quiz</span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">Simulation</span>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">Self-Reported</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {skillEvidence.map((ev, i) => {
              const badgeColors = {
                quiz: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
                simulation: 'bg-amber-950/80 text-amber-300 border-amber-800',
                'self-reported': 'bg-purple-950/80 text-purple-300 border-purple-800'
              };

              return (
                <div key={i} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{ev.skillName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border uppercase ${badgeColors[ev.source]}`}>
                        {ev.source}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">{ev.evidenceText}</p>
                  </div>

                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <div className="font-mono font-bold text-cyan-300">Level {ev.level} / 5</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(ev.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
