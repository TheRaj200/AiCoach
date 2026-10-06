import React from 'react';
import { 
  CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Award, Sparkles, TrendingUp, XCircle, ShieldCheck
} from 'lucide-react';

export const FeedbackModal = ({ feedback, isLastQuestion, onNext, isFinishing }) => {
  if (!feedback) return null;

  const { accuracyScore = 7, clarityScore = 7, strengths = [], improvements = [], idealAnswer = '' } = feedback;

  const getScoreBadge = (score, label) => {
    let colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (score >= 8) colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
    else if (score >= 4) colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
    else colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]';

    return (
      <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 backdrop-blur-md ${colorClass}`}>
        <span className="text-slate-300 font-medium">{label}:</span>
        <span className="font-extrabold font-mono text-sm">{score}/10</span>
      </div>
    );
  };

  const isVeryLow = accuracyScore <= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#08090d]/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0e111a] border border-white/[0.1] shadow-2xl backdrop-blur-2xl my-auto overflow-hidden">
        
        {/* Glow Accent */}
        <div className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl" />

        {/* Pinned Header */}
        <div className="relative shrink-0 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] p-5 sm:p-6 bg-[#0e111a]/95">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>Bar Raiser Audit</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Diagnostic Evaluation</h3>
            <p className="text-xs text-slate-400">Step-by-step real-time review of your response</p>
          </div>

          <div className="flex items-center gap-2">
            {getScoreBadge(accuracyScore, 'Accuracy')}
            {getScoreBadge(clarityScore, 'Clarity')}
          </div>
        </div>

        {/* Scrollable Body Content (Full-Width Rows) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 pr-3 sm:pr-5 custom-scrollbar">
          
          {/* Row 1: Critical Gaps & Areas for Improvement */}
          {improvements.length > 0 && (
            <div className={`p-4 rounded-xl border space-y-2.5 ${
              isVeryLow
                ? 'bg-rose-500/[0.05] border-rose-500/25'
                : 'bg-amber-500/[0.04] border-amber-500/20'
            }`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${
                isVeryLow ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {isVeryLow ? (
                  <XCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span>{isVeryLow ? 'Critical Gaps & Missing Concepts' : 'Areas for Improvement & Polish'}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed break-words">
                    <span className={`${isVeryLow ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'} shrink-0 mt-0.5`}>•</span>
                    <span className="flex-1">{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Row 2: Key Strengths */}
          {strengths.length > 0 && (
            <div className={`p-4 rounded-xl border space-y-2.5 ${
              isVeryLow
                ? 'bg-slate-900/40 border-white/[0.06]'
                : 'bg-emerald-500/[0.04] border-emerald-500/20'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Key Strengths Observed</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed break-words">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                    <span className="flex-1">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Row 3: Live Follow-up Probe & Defense Review */}
          {feedback.followUpProbe && (
            <div className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/25 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Interviewer Counter-Probe Round</span>
                </div>
                {feedback.probeAnswer && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Defense Evaluated
                  </span>
                )}
              </div>
              
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-300 font-medium italic break-words leading-relaxed">
                  "{feedback.followUpProbe}"
                </p>
                {feedback.probeAnswer ? (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Your Defense:</span>
                    <p className="text-slate-200 bg-black/40 p-3 rounded-lg border border-white/[0.05] font-mono leading-relaxed break-words text-xs">
                      {feedback.probeAnswer}
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic pt-0.5">
                    (Counter-probe was skipped)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Row 4: Exemplary Model Answer */}
          {idealAnswer && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-[#121624]/70 border border-blue-500/25 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Principal Engineer Model Phrasing</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans italic bg-black/30 p-3 rounded-lg border border-white/[0.04] break-words">
                "{idealAnswer}"
              </p>
            </div>
          )}

        </div>

        {/* Pinned Action Footer */}
        <div className="relative shrink-0 p-4 sm:px-6 bg-[#0b0e17] border-t border-white/[0.06] flex justify-end">
          <button
            onClick={onNext}
            disabled={isFinishing}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 active:scale-[0.99] shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFinishing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Compiling Comprehensive Scorecard...</span>
              </>
            ) : isLastQuestion ? (
              <>
                <span>Complete & View Full Scorecard</span>
                <Award className="w-4 h-4 text-cyan-200" />
              </>
            ) : (
              <>
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
