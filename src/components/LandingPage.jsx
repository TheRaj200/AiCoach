import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, UserPlus, LogIn, UserCheck, 
  Terminal, Code2, Cpu, Award, Mic, Play, CheckCircle2, Star, ShieldCheck, Zap
} from 'lucide-react';
import { Hero3DCanvas } from './Hero3DCanvas';

export const LandingPage = ({ onOpenAuth, onContinueGuest }) => {
  const [activeTab, setActiveTab] = useState('question'); // 'question' | 'evaluation'

  return (
    <div className="relative min-h-[calc(100vh-60px)] overflow-hidden">
      
      {/* 3D Interactive Canvas in Background */}
      <Hero3DCanvas />

      {/* Atmospheric Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-cyan-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Foreground Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 to-indigo-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-lg shadow-blue-500/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Next-Gen AI Mock Interviewer</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-400 font-mono">Gemini & Gemma 2</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Master Your Next <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Tech Interview
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Practice adaptive, real-world technical interviews with live speech-to-text voice input, instant step-by-step diagnostic scoring, and senior engineer model answers.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:opacity-95 shadow-xl shadow-cyan-500/20 active:scale-[0.98] flex items-center justify-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Create Free Account</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 backdrop-blur-md active:scale-[0.98] flex items-center justify-center gap-2 transition"
            >
              <LogIn className="w-4 h-4 text-slate-400" />
              <span>Sign In</span>
            </button>

          </div>

          {/* Sleek Interactive Guest Mode Trigger */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <button
              onClick={onContinueGuest}
              className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/[0.12] hover:border-cyan-500/50 text-xs font-medium text-slate-300 hover:text-white shadow-lg shadow-black/40 backdrop-blur-xl transition-all duration-300 active:scale-[0.98]"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition duration-300">
                <Zap className="w-3 h-3 fill-cyan-400 text-cyan-400" />
              </div>
              <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                Try Instant Guest Interview
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] text-slate-400 font-normal">
                No Signup Required
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition duration-300" />
            </button>

            {/* Micro Trust Indicators */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
                100% Free
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-cyan-400/80" />
                Voice STT Enabled
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400/80" />
                Gemini 2.5 Flash
              </span>
            </div>
          </div>

        </div>

        {/* Interactive Live Chamber Preview Showcase */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-slate-950/75 border border-white/[0.1] shadow-2xl backdrop-blur-xl overflow-hidden">
            
            {/* Window Title Bar */}
            <div className="px-4 py-3 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">AiCoach Interview Chamber • Live Session</span>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-lg border border-white/[0.06] text-[11px]">
                <button
                  onClick={() => setActiveTab('question')}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    activeTab === 'question' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Active Question
                </button>
                <button
                  onClick={() => setActiveTab('evaluation')}
                  className={`px-2.5 py-1 rounded font-medium transition ${
                    activeTab === 'evaluation' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Diagnostic Feedback
                </button>
              </div>
            </div>

            {/* Window Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {activeTab === 'question' ? (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                        System Design & Concurrency
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium">
                        Senior Level
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-amber-400 text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>Timer: 02:45</span>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="text-base sm:text-lg font-medium text-white leading-relaxed">
                    "How would you design a distributed caching layer using Redis for high-throughput read operations, and how do you handle cache invalidation during write spikes?"
                  </div>

                  {/* Simulated Response Workspace */}
                  <div className="p-4 rounded-xl bg-[#090b12] border border-white/[0.07] font-mono text-xs text-slate-300 space-y-2">
                    <div className="flex items-center justify-between text-slate-500 border-b border-white/[0.05] pb-2">
                      <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                        <Code2 className="w-3.5 h-3.5" /> Candidate Response (Voice + Code):
                      </span>
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Speech-to-Text Synced
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      "I would implement the Cache-Aside pattern combined with Write-Through caching for critical entities. For invalidation under write spikes, I would use an asynchronous message queue (e.g. Kafka/RabbitMQ) to broadcast cache eviction events, avoiding thundering herd problems with Redis Mutex/Redlock..."
                    </p>
                  </div>

                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Scores Bar */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Strong Technical Formulation</div>
                        <div className="text-[11px] text-emerald-400">Score: 9/10 Accuracy • 9/10 Articulation</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                      L5+ Bar
                    </span>
                  </div>

                  {/* Model Phrasing */}
                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs space-y-1.5">
                    <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Principal Engineer Takeaway:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">
                      "Excellent discussion of the Cache-Aside pattern. Proactively mentioning probabilistic early expiration (XFetch algorithm) further strengthens cache stampede prevention."
                    </p>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/[0.08] backdrop-blur-md space-y-3 hover:border-blue-500/50 hover:bg-slate-900/90 transition group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Adaptive Question Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically tailors difficulty based on your answers across Frontend, Backend, Fullstack, AI, and DevOps roles.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/[0.08] backdrop-blur-md space-y-3 hover:border-cyan-500/50 hover:bg-slate-900/90 transition group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Speech-to-Text Voice Input</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Speak your technical solutions verbally with real-time Speech-to-Text or write structured code snippets in a monospace console.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/[0.08] backdrop-blur-md space-y-3 hover:border-emerald-500/50 hover:bg-slate-900/90 transition group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Executive Scorecards & History</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive comprehensive hiring readiness scores, critical skill gap roadmaps, and permanently save your past session reports.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
