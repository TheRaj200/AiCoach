import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, CheckCircle2, AlertTriangle, BookOpen, RotateCcw, Copy, Check, 
  ChevronDown, ChevronUp, Cpu, MessageSquare, Terminal, HelpCircle, ArrowRight, ArrowLeft, Zap, Target, Sparkles
} from 'lucide-react';
import { FormattedQuestion } from './FormattedQuestion';

export const ScorecardReport = ({ session, onRestart, onBack, backLabel = 'Back' }) => {
  const [copied, setCopied] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const report = session?.finalReport || {};
  const questions = session?.questions || [];
  const answeredQuestions = questions.filter(
    (q) => q.feedback && typeof q.feedback.accuracyScore === 'number'
  );

  const overallScore = report.overallScore ?? 80;
  const grade = report.grade || 'Solid Competence';
  const technicalScore = report.technicalScore ?? 82;
  const communicationScore = report.communicationScore ?? 78;
  const wasEarly = report.wasConcludedEarly || answeredQuestions.length < (session?.totalQuestions || 5);

  useEffect(() => {
    // Only celebrate if candidate achieved 70% or higher
    if (overallScore >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.55 },
        });
      } catch (e) {}
    }
  }, [overallScore]);

  const copySummary = () => {
    const text = `AiCoach Mock Interview Performance Scorecard\nRole: ${session.seniority} ${session.role}\nOverall Score: ${overallScore}%\nGrade: ${grade}\nTechnical Score: ${technicalScore}%\nCommunication: ${communicationScore}%\nQuestions Attempted: ${answeredQuestions.length}/${session.totalQuestions}\nSummary Review: ${report.summary || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAccordion = (idx) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'from-emerald-400 via-teal-300 to-cyan-400';
    if (score >= 50) return 'from-amber-400 via-yellow-300 to-orange-400';
    return 'from-rose-400 via-pink-400 to-red-400';
  };

  const getGradeBadge = (score) => {
    if (score >= 75) return 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400';
    if (score >= 50) return 'bg-amber-500/10 border-amber-500/25 text-amber-400';
    return 'bg-rose-500/10 border-rose-500/25 text-rose-400';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-semibold mb-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>{backLabel}</span>
              </button>
            )}

            {wasEarly ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Target className="w-3.5 h-3.5" />
                <span>Concluded Early ({answeredQuestions.length}/{session.totalQuestions} Attempted)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Award className="w-3.5 h-3.5" />
                <span>Full Session Completed ({session.totalQuestions} Questions)</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Performance Scorecard & AI Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {session.seniority} {session.role} • Stack: {session.techStack?.join(', ')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copySummary}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={onRestart}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:opacity-95 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Interview</span>
          </button>
        </div>
      </div>

      {/* Main Metric Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Overall Score Card (4 cols) */}
        <div className="md:col-span-4 surface-card rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 border border-white/[0.08]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hiring Readiness Index</span>
          <div className={`text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getScoreColor(overallScore)} tracking-tight`}>
            {overallScore}<span className="text-2xl font-normal opacity-80">%</span>
          </div>
          <div className={`px-3.5 py-1 rounded-full text-xs font-bold border ${getGradeBadge(overallScore)}`}>
            {grade}
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            Evaluated on {answeredQuestions.length} answered challenge(s)
          </div>
        </div>

        {/* Sub-Metric Bars & Summary Review (8 cols) */}
        <div className="md:col-span-8 surface-card rounded-2xl p-6 space-y-4 flex flex-col justify-between border border-white/[0.08]">
          
          <div className="space-y-3.5">
            {/* Technical Depth */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Technical Accuracy & Engineering Depth
                </span>
                <span className="text-cyan-400 font-bold">{technicalScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${technicalScore}%` }}
                />
              </div>
            </div>

            {/* Communication */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  Structure, Communication & Articulation
                </span>
                <span className="text-purple-400 font-bold">{communicationScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${communicationScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* AI Executive Assessment Summary */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed space-y-1">
            <div className="font-semibold text-cyan-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>AI Director's Evaluation</span>
            </div>
            <p className="text-slate-300">
              {report.summary || 'Strong baseline demonstrated with coherent logical progression across technical challenges.'}
            </p>
          </div>

        </div>

      </div>

      {/* 3 Pillars Diagnosis: Strengths, Blindspots & What to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Top Strengths */}
        <div className="surface-card rounded-2xl p-5 space-y-3 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Strengths Observed</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {(report.topStrengths || ['Solid foundational grasp of key framework mechanisms', 'Structured articulation']).map((st, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Issues & Blindspots */}
        <div className="surface-card rounded-2xl p-5 space-y-3 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Issues & Blindspots</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {(report.criticalGaps || ['Edge-case analysis and failure recovery', 'Discussing trade-offs in distributed systems']).map((gap, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Improvement Roadmap */}
        <div className="surface-card rounded-2xl p-5 space-y-3 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>What to Improve & Revise</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {(report.suggestedTopics || ['Concurrency & Async Internals', 'Database Indexing & Caching Strategies']).map((tp, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span>{tp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Transcript Accordion with Questions & Senior Engineer Model Phrasing */}
      <div className="surface-card rounded-2xl p-6 sm:p-7 space-y-5 border border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Question Transcripts & Model Answers</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any question below to inspect your answer vs the senior engineer standard</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.06]">
            {answeredQuestions.length} Questions Evaluated
          </span>
        </div>

        <div className="space-y-3">
          {answeredQuestions.map((q, idx) => {
            const isOpen = openAccordion === idx;
            const score = q.feedback?.accuracyScore ?? 7;
            const clarity = q.feedback?.clarityScore ?? 7;

            return (
              <div key={idx} className="rounded-xl bg-[#090b12] border border-white/[0.06] overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                      {q.questionText}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-cyan-400">
                      {score}/10
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 border-t border-white/[0.06] bg-[#07090f] space-y-4 text-xs">
                    
                    {/* Full Question Text */}
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                        Question Prompt:
                      </div>
                      <FormattedQuestion text={q.questionText} />
                    </div>

                    {/* Candidate's submitted response */}
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Your Submitted Response:
                      </div>
                      <div className="text-slate-200 font-mono whitespace-pre-wrap bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.05] leading-relaxed">
                        {q.userAnswer || 'No answer recorded'}
                      </div>
                    </div>

                    {/* Step Feedback Highlights */}
                    {q.feedback && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                          <span className="text-[11px] font-bold text-emerald-400 block mb-1">✓ Good Points:</span>
                          <p className="text-slate-300 text-[11px]">{q.feedback.strengths?.join(' • ') || 'Addressed core concept'}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20">
                          <span className="text-[11px] font-bold text-amber-400 block mb-1">⚠ What Was Missing:</span>
                          <p className="text-slate-300 text-[11px]">{q.feedback.improvements?.join(' • ') || 'Include edge cases'}</p>
                        </div>
                      </div>
                    )}

                    {/* Live Counter-Probe & Defense */}
                    {q.followUpProbe && (
                      <div className="p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Follow-Up Probe & Defense</span>
                        </div>
                        <p className="text-slate-300 italic text-[11px]">
                          "{q.followUpProbe}"
                        </p>
                        {q.probeAnswer ? (
                          <div className="pt-1">
                            <span className="text-[10px] text-slate-400 font-mono block">Candidate Defense:</span>
                            <div className="text-slate-200 font-mono text-[11px] bg-black/30 p-2 rounded border border-white/[0.04]">
                              {q.probeAnswer}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 block italic">Probe was skipped</span>
                        )}
                      </div>
                    )}

                    {/* Ideal Model Answer */}
                    {q.feedback?.idealAnswer && (
                      <div>
                        <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Principal Engineer Ideal Phrasing:</span>
                        </div>
                        <div className="text-slate-200 p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 italic leading-relaxed">
                          "{q.feedback.idealAnswer}"
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
