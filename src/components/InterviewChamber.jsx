import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Mic, MicOff, Send, Code2, Sparkles, Volume2, CornerDownLeft, 
  CheckCircle2, Shield, StopCircle, AlertTriangle, ArrowRight, X
} from 'lucide-react';
import { FormattedQuestion } from './FormattedQuestion';

export const InterviewChamber = ({ session, onSubmitAnswer, onSubmitProbe, onFinishEarly, isSubmitting, isFinishing }) => {
  const currentIdx = session.currentQuestionIndex || 0;
  const currentQ = session.questions?.[currentIdx] || session.questions?.[0] || {};
  const totalQ = session.totalQuestions || 5;

  const [userAnswer, setUserAnswer] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [showEndEarlyModal, setShowEndEarlyModal] = useState(false);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // Count how many questions have answers
  const answeredCount = (session.questions || []).filter(
    (q) => q.feedback && typeof q.feedback.accuracyScore === 'number'
  ).length;

  // Reset & start timer on question change
  useEffect(() => {
    setSecondsElapsed(0);
    setUserAnswer('');
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIdx]);

  // Web Speech API STT setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      if (currentTranscript) {
        setUserAnswer((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${currentTranscript}` : currentTranscript;
        });
      }
    };

    recognition.onerror = (err) => {
      console.warn('Speech recognition error:', err.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const [activeProbe, setActiveProbe] = useState(null); // { probeQuestion, questionIndex, pendingFeedback, isLastQuestion }
  const [probeAnswer, setProbeAnswer] = useState('');
  const [isProbeRecording, setIsProbeRecording] = useState(false);
  const [isSubmittingProbe, setIsSubmittingProbe] = useState(false);
  const probeRecognitionRef = useRef(null);

  // Keyboard shortcut Ctrl+Enter to submit
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (activeProbe) {
        handleProbeSubmit();
      } else {
        handleFormSubmit();
      }
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  // STT for probe answer
  const toggleProbeRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isProbeRecording && probeRecognitionRef.current) {
      probeRecognitionRef.current.stop();
      setIsProbeRecording(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          setProbeAnswer((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${currentTranscript}` : currentTranscript;
          });
        }
      };
      rec.onerror = () => setIsProbeRecording(false);
      rec.onend = () => setIsProbeRecording(false);
      probeRecognitionRef.current = rec;
      rec.start();
      setIsProbeRecording(true);
    } catch (e) {
      setIsProbeRecording(false);
    }
  };

  const handleFormSubmit = async () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    if (!userAnswer.trim() || isSubmitting) return;

    const res = await onSubmitAnswer({
      sessionId: session.sessionId,
      questionIndex: currentIdx,
      userAnswer: userAnswer.trim(),
      answerType: isRecording ? 'voice' : 'text',
      timeSpentSeconds: secondsElapsed,
    });

    if (res?.feedback?.followUpProbe) {
      setActiveProbe({
        probeQuestion: res.feedback.followUpProbe,
        questionIndex: currentIdx,
        pendingFeedback: res.feedback,
        isLastQuestion: res.isLastQuestion,
      });
      setProbeAnswer('');
    }
  };

  const handleProbeSubmit = async () => {
    if (isProbeRecording && probeRecognitionRef.current) {
      probeRecognitionRef.current.stop();
      setIsProbeRecording(false);
    }
    if (!probeAnswer.trim() || isSubmittingProbe) return;

    setIsSubmittingProbe(true);
    try {
      if (onSubmitProbe && activeProbe) {
        await onSubmitProbe({
          sessionId: session.sessionId,
          questionIndex: activeProbe.questionIndex,
          probeAnswer: probeAnswer.trim(),
          pendingFeedback: activeProbe.pendingFeedback,
          isLastQuestion: activeProbe.isLastQuestion,
        });
      }
      setActiveProbe(null);
      setProbeAnswer('');
    } finally {
      setIsSubmittingProbe(false);
    }
  };

  const handleSkipProbe = () => {
    if (activeProbe && onSubmitProbe) {
      onSubmitProbe({
        sessionId: session.sessionId,
        questionIndex: activeProbe.questionIndex,
        probeAnswer: '',
        pendingFeedback: activeProbe.pendingFeedback,
        isLastQuestion: activeProbe.isLastQuestion,
        skip: true,
      });
    }
    setActiveProbe(null);
    setProbeAnswer('');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;
  const probeWordCount = probeAnswer.trim() ? probeAnswer.trim().split(/\s+/).length : 0;

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Decorative Blur Accents */}
      <div className="pointer-events-none absolute -top-8 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />

      {/* Session Status & Top Action Bar */}
      <div className="relative z-10 rounded-2xl bg-[#0e111a]/90 backdrop-blur-xl p-4 flex flex-wrap items-center justify-between gap-4 border border-white/[0.08] shadow-xl">
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-bold text-cyan-300">
            <span>Question {currentIdx + 1}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{totalQ}</span>
          </div>
          <div className="w-24 sm:w-36 h-2 bg-white/[0.06] rounded-full overflow-hidden p-0.5 border border-white/[0.04]">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
            />
          </div>
        </div>

        {/* Role Pill */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.06]">
          <span className="text-white font-semibold">{session.role}</span>
          <span className="text-slate-600">•</span>
          <span className="text-blue-400 font-medium">{session.seniority}</span>
        </div>

        {/* Timer & End Early Trigger */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-amber-400 shadow-inner">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowEndEarlyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-medium text-rose-300 hover:text-rose-200 transition cursor-pointer"
            title="Conclude interview early and generate instant evaluation"
          >
            <StopCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>End Interview Early</span>
          </button>
        </div>

      </div>

      {/* Live AI Counter-Probe Card (if active) */}
      {activeProbe ? (
        <div className="relative z-10 rounded-2xl bg-gradient-to-b from-[#141829] to-[#0c0e17] border-2 border-amber-500/40 p-6 sm:p-7 space-y-5 shadow-2xl animate-fadeIn">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>⚡ Live AI Counter-Probe Round</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +1-2 Pts Bonus Potential
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Principal Interviewer Follow-Up
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/[0.07] border border-amber-500/25 space-y-1.5">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span>Interviewer's Challenge:</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              "{activeProbe.probeQuestion}"
            </p>
          </div>

          {/* Defense Workspace */}
          <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#07090f]">
            <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Your Counter-Defense:</span>
              </span>
              <div className="flex items-center gap-3">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleProbeRecording}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                      isProbeRecording
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white'
                    }`}
                  >
                    {isProbeRecording ? (
                      <>
                        <MicOff className="w-3 h-3 text-rose-400" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3 h-3 text-amber-400" />
                        <span>Voice Defense</span>
                      </>
                    )}
                  </button>
                )}
                <span className="text-[11px] text-slate-500 font-mono">{probeWordCount} words</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#05060a]">
              <textarea
                value={probeAnswer}
                onChange={(e) => setProbeAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Defend your architectural trade-off, edge case handling, or mitigation strategy..."
                rows={4}
                className="w-full bg-transparent text-slate-100 text-sm font-mono placeholder:text-slate-600 focus:outline-none resize-y leading-relaxed"
                autoFocus
              />
            </div>
          </div>

          {/* Probe Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleSkipProbe}
              className="text-xs text-slate-400 hover:text-slate-200 transition underline cursor-pointer py-1.5"
            >
              Skip Counter-Probe & View Evaluation →
            </button>

            <button
              type="button"
              onClick={handleProbeSubmit}
              disabled={!probeAnswer.trim() || isSubmittingProbe}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:opacity-95 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmittingProbe ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Recalibrating Score...</span>
                </>
              ) : (
                <>
                  <span>Submit Defense (+Bonus)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        <>
          {/* Main Question Card */}
          <div className="relative z-10 rounded-2xl bg-[#0e111a]/90 backdrop-blur-xl p-6 sm:p-7 space-y-4 border border-white/[0.08] shadow-2xl">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300">
                  {currentQ.category || 'Technical Core'}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  {currentQ.difficulty || 'Medium'}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">Live Question</span>
            </div>

            <FormattedQuestion text={currentQ.questionText} />
          </div>

          {/* Answer Console Workspace */}
          <div className="relative z-10 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0e111a]/90 backdrop-blur-xl shadow-2xl">
            
            {/* Workspace Toolbar */}
            <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Response Workspace (Code / Text)</span>
              </div>

              <div className="flex items-center gap-3">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                      isRecording
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <div className="flex items-center gap-0.5 h-3">
                          <span className="w-0.5 h-3 bg-rose-400 wave-bar"></span>
                          <span className="w-0.5 h-3 bg-rose-400 wave-bar" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-0.5 h-3 bg-rose-400 wave-bar" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                        <span>Listening... (Click to stop)</span>
                        <MicOff className="w-3 h-3 text-rose-400 ml-1" />
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Voice Answer (STT)</span>
                      </>
                    )}
                  </button>
                )}

                <div className="text-[11px] text-slate-500 font-mono">
                  {wordCount} words
                </div>
              </div>
            </div>

            {/* Text Area */}
            <div className="p-4 bg-[#08090d]/90">
              <textarea
                ref={textareaRef}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your technical response, architecture flow, code snippets, or click 'Voice Answer' to speak..."
                rows={8}
                className="w-full bg-transparent text-slate-100 text-sm font-mono placeholder:text-slate-600 focus:outline-none resize-y leading-relaxed"
              />
            </div>

            {/* Action Bar */}
            <div className="px-4 py-3.5 bg-white/[0.01] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-slate-400 text-[10px]">Ctrl + Enter</kbd>
                <span>to submit response</span>
              </div>

              <button
                type="button"
                onClick={handleFormSubmit}
                disabled={!userAnswer.trim() || isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 hover:opacity-95 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Evaluating & Probing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Get Micro-Feedback</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </div>
        </>
      )}

      {/* Confirmation Modal for Ending Interview Early */}
      {showEndEarlyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="surface-card w-full max-w-md rounded-2xl p-6 space-y-5 border border-white/[0.1] shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Conclude Interview Early?</span>
              </div>
              <button
                onClick={() => setShowEndEarlyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                You have currently answered <strong className="text-cyan-400">{answeredCount} of {totalQ} questions</strong>.
              </p>
              <p className="text-slate-400">
                If you end now, the AI will evaluate all completed questions so far and generate your comprehensive scorecard, readiness index, and personal study plan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndEarlyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition"
              >
                Continue Interview
              </button>

              <button
                type="button"
                disabled={isFinishing}
                onClick={() => {
                  setShowEndEarlyModal(false);
                  onFinishEarly();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition"
              >
                {isFinishing ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Finish & Generate Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
